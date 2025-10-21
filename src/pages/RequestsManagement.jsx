import React, { useState, useMemo, useEffect } from "react";
import "../RequestsManagement.css";

// This component handles the management and approval/rejection of employee leave requests.
export default function RequestsManagement() {
  // State for rejection modal
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // State for processed request rejection modal
  const [showProcessedRejectionModal, setShowProcessedRejectionModal] = useState(false);
  const [processedRejectionReason, setProcessedRejectionReason] = useState("");
  const [selectedProcessedRequestId, setSelectedProcessedRequestId] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [adminRole, setAdminRole] = useState("");

  // State for approve (spare employee) modal
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedApproveRequestId, setSelectedApproveRequestId] = useState(null);
  const [spareEmployee, setSpareEmployee] = useState("");
  const [spareEmployeeId, setSpareEmployeeId] = useState("");
  const [departmentUsers, setDepartmentUsers] = useState([]);
  const [isLoadingDeptUsers, setIsLoadingDeptUsers] = useState(false);

  // State for user profile
  const [userProfile, setUserProfile] = useState(null);

  // State for processed requests filter and export
  const [processedStatusFilter, setProcessedStatusFilter] = useState("all");
  const [isExportingProcessed, setIsExportingProcessed] = useState(false);
  const [exportMessageProcessed, setExportMessageProcessed] = useState("");

  // State for requests
  const [pendingRequests, setPendingRequests] = useState([]);
  const [processedRequests, setProcessedRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  // ✅ FIX 1: Get JWT token from localStorage or context
  // This should come from your authentication system
  const getAuthToken = () => {
    // Option 1: From localStorage (if stored after login)
    const token = localStorage.getItem('authToken');
    
    // Option 2: From context/state management
    // const token = authContext.token;
    
    // Option 3: From session storage
    // const token = sessionStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authentication token found. Please login first.');
    }
    
    return token;
  };

  // Get current user's department info from cache or loaded profile
  const getCurrentUserDepartmentInfo = () => {
    try {
      const cached = localStorage.getItem('authUser');
      const user = cached ? JSON.parse(cached) : userProfile;
      return {
        departmentId: user?.departmentId || user?.department_id || null,
        departmentName: (user?.department || user?.departmentName || '').toString().trim(),
      };
    } catch {
      return { departmentId: null, departmentName: '' };
    }
  };

  // Fetch users in the same department using provided auth endpoints
  const fetchDepartmentUsers = async () => {
    setIsLoadingDeptUsers(true);
    try {
      const token = getAuthToken();
      const { departmentId, departmentName } = getCurrentUserDepartmentInfo();

      const normalizedDepartmentName = (departmentName || '').toString().trim();
      if (!normalizedDepartmentName) {
        setDepartmentUsers([]);
        setIsLoadingDeptUsers(false);
        return;
      }

      // 1) Optional: ensure departments are available (best-effort)
      try {
        await fetch('http://localhost:3000/api/auth/departments', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
      } catch (_) {}

      // 2) Primary: /api/auth/departments/:name/users
      let users = [];
      try {
        const depUrl = `http://localhost:3000/api/auth/departments/${encodeURIComponent(normalizedDepartmentName)}/users`;
        const res = await fetch(depUrl, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const json = await res.json();
        const list = json?.data?.users || json?.users || json?.data || [];
        if (Array.isArray(list)) {
          users = list;
        }
      } catch (_) {}

      // 3) Fallback: /api/auth/users?department=...&role=employee&page=1&limit=100
      if (!users.length) {
        try {
          const qs = new URLSearchParams({ department: normalizedDepartmentName, role: 'employee', page: '1', limit: '100' }).toString();
          const url = `http://localhost:3000/api/auth/users?${qs}`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
          });
          const json = await res.json();
          const list = json?.data?.users || json?.users || json?.data || [];
          if (Array.isArray(list)) {
            users = list;
          }
        } catch (_) {}
      }

      const normalized = (users || []).map((u) => ({
        id: u?.id || u?._id || u?.user_id || '',
        name: u?.full_name || u?.name || u?.username || '',
        department: u?.department || u?.departmentName || '',
      })).filter(u => u.id && u.name);

      setDepartmentUsers(normalized);
    } catch (e) {
      console.warn('Could not load department users:', e);
      setDepartmentUsers([]);
    } finally {
      setIsLoadingDeptUsers(false);
    }
  };

  // Function to check if a processed request can be rejected (within 5 hours)
  const canRejectProcessedRequest = (request) => {
    if (!request.processing_date) return false;
    
    const processingDate = new Date(request.processing_date);
    const currentDate = new Date();
    const timeDifference = currentDate - processingDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert to hours
    
    return hoursDifference <= 5;
  };

  // Function to get user profile data from localStorage or API
  const fetchUserProfile = async () => {
    try {
      // First try to get user data from localStorage (stored during login)
      const userDataStr = localStorage.getItem('authUser');
      
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setUserProfile(userData);
        
        // Auto-populate admin name and administrative position from cached user data
        const adminName = userData.full_name || userData.name || userData.username || '';
        const adminRole = userData.administrative_position || userData.role || '';
        
        setAdminName(adminName);
        setAdminRole(adminRole);
        
        console.log('User profile loaded from localStorage:', { adminName, adminRole });
        return;
      }
      
      // Fallback: fetch from API if localStorage is empty
      console.log('No user data in localStorage, fetching from API...');
      const userToken = getAuthToken();
      
      const response = await fetch("http://localhost:3000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
      });

      const result = await response.json();
      
      if (result.success && result.data?.user) {
        const userData = result.data.user;
        setUserProfile(userData);
        
        const adminName = userData.full_name || userData.name || userData.username || '';
        const adminRole = userData.administrative_position || userData.role || '';
        
        setAdminName(adminName);
        setAdminRole(adminRole);
        
        console.log('User profile loaded from API:', { adminName, adminRole });
      } else {
        console.warn('Could not fetch user profile from API:', result.message);
        setAdminName('');
        setAdminRole('');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setAdminName('');
      setAdminRole('');
    }
  };

  // Enhanced error handling function
  const handleApiError = (error, response = null) => {
    console.error('API Error:', error);
    
    if (response) {
      const errorData = error;
      
      // Handle specific error types
      if (errorData.type === 'Invalid Parameter') {
        setError(`Invalid parameter: ${errorData.message}. Valid values: ${errorData.validValues?.join(', ')}`);
      } else if (errorData.type === 'Validation Error') {
        setError(`Validation error: ${errorData.message}`);
      } else if (errorData.type === 'Database Connection Error') {
        setError('Database is temporarily unavailable. Please try again later.');
      } else if (errorData.type === 'Server Error') {
        setError('Server error occurred. Please try again later.');
      } else {
        setError(errorData.message || 'An unexpected error occurred.');
      }
    } else {
      // Network or parsing error
      setError('Network error. Please check your connection and try again.');
    }
  };

  // Function to fetch data from the API with enhanced error handling
  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // ✅ FIX 2: Get actual JWT token
      const userToken = getAuthToken();
      
      const response = await fetch("http://localhost:3000/api/leave-requests", {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
      });

      const result = await response.json();
      
      if (result.success) {
        // ✅ FIX 3: Use enhanced response structure
        const allRequests = result.data;
        setMeta(result.meta);
        
        console.log(`Found ${result.meta.count} leave requests`);
        console.log('Applied filter:', result.meta.filter);

        // Separate requests into pending and processed
        let pending = allRequests.filter((req) => req.status === "pending");
        let processed = allRequests.filter((req) => req.status !== "pending");

        // If current user is a manager, limit pending to their department only
        try {
          const authUserStr = localStorage.getItem('authUser');
          const authUser = authUserStr ? JSON.parse(authUserStr) : null;
          const role = authUser?.role?.toLowerCase?.();
          const userDept = (authUser?.department || authUser?.departmentName || '').toString().trim().toLowerCase();
          if (role === 'manager' && userDept) {
            pending = pending.filter((req) => {
              const reqDept = (req.department || '').toString().trim().toLowerCase();
              return reqDept === userDept;
            });
            processed = processed.filter((req) => {
              const reqDept = (req.department || '').toString().trim().toLowerCase();
              return reqDept === userDept;
            });
          }
        } catch (e) {
          console.warn('Could not apply department filter for manager:', e);
        }

        setPendingRequests(pending);
        setProcessedRequests(processed);
      } else {
        // ✅ FIX 4: Handle enhanced error responses
        handleApiError(result, response);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      
      if (err.message.includes('No authentication token')) {
        setError('Please login first to access this page.');
      } else {
        handleApiError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Translate role to Arabic label
  const translateRoleToArabic = (role) => {
    const normalizedRole = (role || "").toString().trim().toLowerCase();
    if (normalizedRole === "admin") return "مدير";
    if (normalizedRole === "manager") return "مسؤول";
    if (normalizedRole === "employee" || normalizedRole === "user") return "موظف";
    return role || "";
  };

  // Translate action to Arabic header line
  const translateActionToArabicHeader = (action) => {
    if (action === "approved") return "اعتمدت من قبل";
    if (action === "rejected") return "رفضت من قبل";
    return "";
  };

  // Build Arabic formatted processed_by value with line breaks
  const buildProcessedByArabic = (action, role, name) => {
    const header = translateActionToArabicHeader(action);
    const roleAr = translateRoleToArabic(role);
    const person = name || "";
    return `${header}\n${roleAr}\n${person}`;
  };

  // Render processed_by in Arabic, supporting legacy English format
  const renderProcessedByArabic = (processedBy) => {
    if (!processedBy) return "-";

    // If already contains line breaks, render each line separately
    if (processedBy.includes("\n")) {
      const parts = processedBy.split("\n");
      return (
        <div className="processed-by-arabic" style={{ whiteSpace: 'pre-line' }}>
          {parts.map((p, idx) => (
            <div key={idx}>{p}</div>
          ))}
        </div>
      );
    }

    // Try to parse legacy format: "approved by: ROLE: NAME" or "rejected by: ROLE: NAME"
    const legacyMatch = processedBy.match(/^(approved|rejected) by:\s*([^:]+):\s*(.+)$/i);
    if (legacyMatch) {
      const action = legacyMatch[1].toLowerCase();
      const role = legacyMatch[2];
      const name = legacyMatch[3];
      const header = translateActionToArabicHeader(action);
      const roleAr = translateRoleToArabic(role);
      return (
        <div className="processed-by-arabic" style={{ whiteSpace: 'pre-line' }}>
          <div>{header}</div>
          <div>{roleAr}</div>
          <div>{name}</div>
        </div>
      );
    }

    // Fallback: show raw
    return processedBy;
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRequests();
    fetchUserProfile();
  }, []);

  // Add horizontal scrolling with Alt + mouse wheel for processed requests table
  useEffect(() => {
    const handleWheelScroll = (e) => {
      // Check if Alt key is pressed
      if (e.altKey) {
        const scrollContainer = document.getElementById('processed-requests-scroll-container');
        if (scrollContainer) {
          e.preventDefault();
          // Scroll horizontally based on wheel direction
          scrollContainer.scrollLeft += e.deltaY;
        }
      }
    };

    // Add event listener to the document
    document.addEventListener('wheel', handleWheelScroll, { passive: false });

    // Cleanup function
    return () => {
      document.removeEventListener('wheel', handleWheelScroll);
    };
  }, []);

  // Enhanced handle approve/reject action
  const handleProcessRequest = async (requestId, action, spareEmp) => {
    try {
      // ✅ FIX 5: Get actual JWT token
      const userToken = getAuthToken();
      
      // Format processed_by field according to new Arabic requirements
      const processedBy = buildProcessedByArabic(action, adminRole || 'manager', adminName || '');
      
      const requestBody = {
        status: action,
        processed_by: processedBy,
      };

      if (action === "approved") {
        if (spareEmp && typeof spareEmp === 'object') {
          if ((spareEmp.id || '').toString().trim()) {
            requestBody.spare_employee_id = spareEmp.id;
          }
          if ((spareEmp.name || '').toString().trim()) {
            requestBody.spare_employee_name = spareEmp.name;
          }
        } else if ((spareEmp || '').toString().trim()) {
          requestBody.spare_employee = (spareEmp || '').toString().trim();
        }
      }

      if (action === "rejected") {
        requestBody.reason_for_rejection = rejectionReason || "تم الرفض من قبل المدير";
      }

      const response = await fetch(
        `http://localhost:3000/api/leave-requests/${requestId}/process`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        // Show success message
        console.log(`Request ${action} successfully:`, result.data);
        
        // After a successful update, re-fetch the data to keep the UI in sync
        await fetchRequests();
        
        // Close rejection modal if it was open
        if (action === "rejected") {
          setShowRejectionModal(false);
          setRejectionReason("");
          setSelectedRequestId(null);
        }

        // Close approve modal if it was open
        if (action === "approved") {
          setShowApproveModal(false);
          setSpareEmployee("");
          setSelectedApproveRequestId(null);
        }
      } else {
        // Handle API error response
        handleApiError(result, response);
      }
    } catch (error) {
      console.error("Error processing request:", error);
      
      if (error.message.includes('No authentication token')) {
        setError('Please login first to access this page.');
      } else {
        handleApiError(error);
      }
    }
  };

  // Open approve modal
  const handleApproveClick = (requestId) => {
    setSelectedApproveRequestId(requestId);
    setSpareEmployee("");
    setSpareEmployeeId("");
    setShowApproveModal(true);
    fetchDepartmentUsers();
  };

  // Close approve modal
  const handleApproveModalClose = () => {
    setShowApproveModal(false);
    setSpareEmployee("");
    setSpareEmployeeId("");
    setSelectedApproveRequestId(null);
  };

  // Submit approve with spare employee
  const handleApproveSubmit = (e) => {
    e.preventDefault();
    if (!(spareEmployeeId || "").trim()) {
      setError('يرجى اختيار الموظف البديل.');
      return;
    }
    const selected = departmentUsers.find(u => String(u.id) === String(spareEmployeeId));
    const spareName = selected?.name || spareEmployee;
    handleProcessRequest(selectedApproveRequestId, "approved", { id: spareEmployeeId, name: spareName });
  };

  // Handle reject button click - opens modal
  const handleRejectClick = (requestId) => {
    setSelectedRequestId(requestId);
    setRejectionReason("");
    setShowRejectionModal(true);
  };

  // Handle rejection form submission
  const handleRejectionSubmit = (e) => {
    e.preventDefault();
    if (rejectionReason.trim()) {
      handleProcessRequest(selectedRequestId, "rejected");
    } else {
      setError('Please provide a reason for rejection.');
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowRejectionModal(false);
    setRejectionReason("");
    setSelectedRequestId(null);
  };

  // Handle processed request reject button click - opens modal
  const handleProcessedRejectClick = (requestId) => {
    setSelectedProcessedRequestId(requestId);
    setProcessedRejectionReason("");
    
    // Refresh user profile data when opening modal
    fetchUserProfile();
    
    setShowProcessedRejectionModal(true);
  };

  // Handle processed request rejection form submission
  const handleProcessedRejectionSubmit = async (e) => {
    e.preventDefault();
    if (processedRejectionReason.trim()) {
      if (!adminName.trim() || !adminRole.trim()) {
        setError('لم يتم تحميل بيانات المستخدم. يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى.');
        return;
      }
      await handleProcessedRequestRejection(selectedProcessedRequestId, processedRejectionReason, adminName, adminRole);
    } else {
      setError('يرجى كتابة سبب الرفض.');
    }
  };

  // Handle processed request rejection modal close
  const handleProcessedModalClose = () => {
    setShowProcessedRejectionModal(false);
    setProcessedRejectionReason("");
    setSelectedProcessedRequestId(null);
    setAdminName("");
    setAdminRole("");
  };

  // Handle processed request rejection API call
  const handleProcessedRequestRejection = async (requestId, rejectionReason, adminName, adminRole) => {
    try {
      const userToken = getAuthToken();
      
      // Format the processed_by field as per new Arabic requirements
      const processedBy = buildProcessedByArabic('rejected', adminRole || 'manager', adminName || '');
      
      // Format the reason_for_rejection field as per requirements
      const formattedReason = `مرفوض: ${rejectionReason}`;
      
      const requestBody = {
        status: "rejected",
        processed_by: processedBy,
        reason_for_rejection: formattedReason,
      };

      const response = await fetch(
        `http://localhost:3000/api/leave-requests/${requestId}/process`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        console.log(`Processed request rejected successfully:`, result.data);
        
        // Re-fetch the data to keep the UI in sync
        await fetchRequests();
        
        // Close rejection modal
        handleProcessedModalClose();
      } else {
        handleApiError(result, response);
      }
    } catch (error) {
      console.error("Error rejecting processed request:", error);
      
      if (error.message.includes('No authentication token')) {
        setError('Please login first to access this page.');
      } else {
        handleApiError(error);
      }
    }
  };

  // Filter processed requests based on status
  const filteredProcessedRequests = useMemo(() => {
    if (processedStatusFilter === "all") {
      return processedRequests;
    }
    return processedRequests.filter(
      (request) => request.status === processedStatusFilter
    );
  }, [processedRequests, processedStatusFilter]);

  // Handle export processed requests to PDF (NO CANVAS/JSPDF)
  const handleExportProcessedPDF = () => {
    setIsExportingProcessed(true);
    setExportMessageProcessed("لا يوجد دعم لتصدير PDF حاليًا.");
    setTimeout(() => {
      setIsExportingProcessed(false);
      setExportMessageProcessed("");
    }, 3000);
  };

  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "معتمد";
      case "rejected":
        return "مرفوض";
      default:
        return "قيد الانتظار";
    }
  };

  // Check if current user is admin
  const isAdminUser = useMemo(() => {
    try {
      const authUserStr = localStorage.getItem('authUser');
      const authUser = authUserStr ? JSON.parse(authUserStr) : userProfile;
      const role = authUser?.role?.toLowerCase?.();
      const adminRole = authUser?.administrative_position?.toLowerCase?.();
      
      // Check for both role and administrative_position fields
      return role === 'admin' || role === 'مدير' || 
             adminRole === 'admin' || adminRole === 'مدير';
    } catch {
      return false;
    }
  }, [userProfile]);

  // Memoized counts
  const counts = useMemo(
    () => ({
      pending: pendingRequests.length,
      approved: processedRequests.filter((req) => req.status === "approved").length,
      rejected: processedRequests.filter((req) => req.status === "rejected").length,
    }),
    [pendingRequests, processedRequests]
  );

  // Loading component for data values
  const LoadingValue = ({ children, className = "" }) => (
    <div className={`loading-value ${className}`}>
      {isLoading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
      ) : (
        children
      )}
    </div>
  );

  // Error display component
  const ErrorDisplay = () => (
    error && (
      <div className="error-banner">
        <i className="fas fa-exclamation-triangle"></i>
        <span>{error}</span>
        <button 
          className="btn btn-sm btn-primary" 
          onClick={() => {
            setError(null);
            fetchRequests();
          }}
        >
          <i className="fas fa-redo"></i>
          إعادة المحاولة
        </button>
      </div>
    )
  );

  return (
    <div className="requests-management-container">
      {/* Error Display */}
      <ErrorDisplay />

      {/* Page Header */}
      <div className="page-header">
        <h2>إدارة الطلبات</h2>
        <p>مراجعة واتخاذ قرارات بشأن طلبات الإجازة</p>
        {/* ✅ FIX 8: Show meta information if available */}
        {meta && (
          <div className="meta-info">
            <small>إجمالي الطلبات: {meta.count} | آخر تحديث: {new Date().toLocaleString('ar-SA')}</small>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="summary-cards-grid">
        {/* Hide pending requests card for admin users */}
        {!isAdminUser && (
          <div className="card summary-card summary-card-pending">
            <div className="summary-card-content">
              <LoadingValue className="summary-main-value summary-main-value-pending">
                {counts.pending}
              </LoadingValue>
              <div className="summary-label">الطلبات المعلقة</div>
            </div>
          </div>
        )}

        <div className="card summary-card summary-card-approved">
          <div className="summary-card-content">
            <LoadingValue className="summary-main-value summary-main-value-approved">
              {counts.approved}
            </LoadingValue>
            <div className="summary-label">الطلبات المعتمدة</div>
          </div>
        </div>

        <div className="card summary-card summary-card-rejected">
          <div className="summary-card-content">
            <LoadingValue className="summary-main-value summary-main-value-rejected">
              {counts.rejected}
            </LoadingValue>
            <div className="summary-label">الطلبات المرفوضة</div>
          </div>
        </div>
      </div>

      {/* Admin Users Notice */}
      {isAdminUser && (
        <div className="admin-notice">
          <div className="notice-content">
            <i className="fas fa-info-circle"></i>
            <p>بصفتك مدير، يمكنك فقط مراجعة الطلبات المعالجة. الطلبات المعلقة متاحة للمسؤولين فقط.</p>
          </div>
        </div>
      )}

      {/* Pending Requests Section - Hidden for Admin Users */}
      {!isAdminUser && (
        <div className="requests-section">
          <div className="section-header pending-section-header">
            <h3>الطلبات المعلقة</h3>
            <p>الطلبات التي تحتاج إلى مراجعة واتخاذ قرار</p>
          </div>

          <div className="table-responsive-wrapper">
            <table className="requests-table" id="pending-requests-table">
              <thead>
                <tr>
                  <th>الإجراءات</th>
                  <th>تاريخ الطلب</th>
                  <th>اسم الموظف</th>
                  <th>القسم</th>
                  <th>نوع الإجازة</th>
                  <th>من تاريخ</th>
                  <th>إلى تاريخ</th>
                  <th>عدد الأيام</th>
                  <th>السبب</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="9" className="loading-data">
                      <div className="loading-spinner">
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>جاري تحميل الطلبات المعلقة...</span>
                      </div>
                    </td>
                  </tr>
                ) : pendingRequests.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="no-data">
                      <i className="fas fa-inbox"></i>
                      <p>لا توجد طلبات معلقة</p>
                    </td>
                  </tr>
                ) : (
                  pendingRequests.map((request) => (
                    <tr key={request.request_no} className="pending-row">
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button
                            className="btn btn-approve"
                            onClick={() => handleApproveClick(request.request_no)}
                            title="اعتماد الطلب"
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            className="btn btn-reject"
                            onClick={() => handleRejectClick(request.request_no)}
                            title="رفض الطلب"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </td>
                      <td>{request.request_date?.split('T')[0]}</td>
                      <td>{request.employee_name}</td>
                      <td>{request.department}</td>
                      <td>{request.leave_type}</td>
                      <td>{request.start_date?.split('T')[0]}</td>
                      <td>{request.end_date?.split('T')[0]}</td>
                      <td>{request.number_of_days}</td>
                      <td>{request.reason || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filters and Export for Processed Requests */}
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="processed-status-filter">حالة الطلب:</label>
          <select
            id="processed-status-filter"
            className="filter-select"
            value={processedStatusFilter}
            onChange={(e) => setProcessedStatusFilter(e.target.value)}
          >
            <option value="all">الكل</option>
            <option value="approved">معتمد</option>
            <option value="rejected">مرفوض</option>
          </select>
        </div>
        <button
          className="btn btn-secondary export-pdf-btn"
          onClick={handleExportProcessedPDF}
          disabled={isExportingProcessed}
        >
          <i
            className={`fas ${
              isExportingProcessed ? "fa-spinner fa-spin" : "fa-file-pdf"
            }`}
          ></i>
          {isExportingProcessed ? "جاري التصدير..." : "تصدير كـ PDF"}
        </button>
      </div>

      {exportMessageProcessed && (
        <div
          className={`export-message ${
            exportMessageProcessed.includes("فشل") ? "error" : "success"
          }`}
        >
          {exportMessageProcessed}
        </div>
      )}

      {/* Approve Modal - Spare Employee */}
      {showApproveModal && (
        <div className="modal-overlay" onClick={handleApproveModalClose}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>اعتماد الطلب</h3>
              <button className="modal-close-btn" onClick={handleApproveModalClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleApproveSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="spare-employee">اسم الموظف البديل:</label>
                <select
                  id="spare-employee"
                  className="filter-select"
                  value={spareEmployeeId}
                  onChange={(e) => setSpareEmployeeId(e.target.value)}
                  required
                  disabled={isLoadingDeptUsers}
                >
                  <option value="">{isLoadingDeptUsers ? 'جاري تحميل الموظفين...' : 'اختر الموظف'}</option>
                  {departmentUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                {!isLoadingDeptUsers && departmentUsers.length === 0 && (
                  <small className="loading-text">لا توجد بيانات موظفين للقسم.</small>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleApproveModalClose}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-success">
                  اعتماد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Processed Requests Section */}
      <div className="requests-section">
        <div className="section-header">
          <h3>الطلبات المعالجة</h3>
          <p>الطلبات التي تم اتخاذ قرار بشأنها</p>
          <small className="scroll-hint">💡 اضغط Alt + عجلة الماوس للتمرير أفقيًا</small>
        </div>

        <div className="table-responsive-wrapper" id="processed-requests-scroll-container">
          <table className="requests-table" id="processed-requests-table">
            <thead>
              <tr>
                <th>الإجراءات</th>
                <th>تاريخ الطلب</th>
                <th>اسم الموظف</th>
                <th>القسم</th>
                <th>نوع الإجازة</th>
                <th>من تاريخ</th>
                <th>إلى تاريخ</th>
                <th>عدد الأيام</th>
                <th>السبب</th>
                <th>الحالة</th>
                <th>تاريخ المعالجة</th>
                <th>الذي عالج الطلب</th>
                <th>سبب الرفض</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="13" className="loading-data">
                    <div className="loading-spinner">
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>جاري تحميل الطلبات المعالجة...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProcessedRequests.length === 0 ? (
                <tr>
                  <td colSpan="13" className="no-data">
                    <i className="fas fa-inbox"></i>
                    <p>لا توجد طلبات معالجة</p>
                  </td>
                </tr>
              ) : (
                filteredProcessedRequests.map((request) => (
                  <tr
                    key={request.request_no}
                    className={`processed-row ${getStatusColorClass(
                      request.status
                    )}`}
                  >
                    <td className="actions-cell">
                      <div className="action-buttons">
                        {canRejectProcessedRequest(request) && request.status === "approved" && (
                          <button
                            className="btn btn-reject"
                            onClick={() => handleProcessedRejectClick(request.request_no)}
                            title="رفض الطلب المعالج"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                        {!canRejectProcessedRequest(request) && request.status === "approved" && (
                          <span className="disabled-action" title="لا يمكن رفض الطلب بعد مرور 5 ساعات">
                            <i className="fas fa-clock"></i>
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{request.request_date?.split('T')[0]}</td>
                    <td>{request.employee_name}</td>
                    <td>{request.department}</td>
                    <td>{request.leave_type}</td>
                    <td>{request.start_date?.split('T')[0]}</td>
                    <td>{request.end_date?.split('T')[0]}</td>
                    <td>{request.number_of_days}</td>
                    <td>{request.reason || '-'}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusColorClass(
                          request.status
                        )}`}
                      >
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    <td>{request.processing_date?.split('T')[0] || '-'}</td>
                    <td dir="rtl" className="text-right">{renderProcessedByArabic(request.processed_by)}</td>
                    <td>{request.reason_for_rejection || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>سبب رفض الطلب</h3>
              <button className="modal-close-btn" onClick={handleModalClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleRejectionSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="rejection-reason">سبب الرفض:</label>
                <textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="يرجى كتابة سبب رفض الطلب..."
                  required
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleModalClose}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-danger">
                  رفض الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Processed Request Rejection Modal */}
      {showProcessedRejectionModal && (
        <div className="modal-overlay" onClick={handleProcessedModalClose}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>رفض الطلب المعالج</h3>
              <button className="modal-close-btn" onClick={handleProcessedModalClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleProcessedRejectionSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="admin-name">اسم المسؤول:</label>
                <input
                  type="text"
                  id="admin-name"
                  value={adminName || 'جاري تحميل البيانات...'}
                  readOnly
                  className="readonly-field"
                  placeholder="جاري تحميل البيانات..."
                />
                {!adminName && (
                  <small className="loading-text">جاري تحميل بيانات المستخدم...</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="admin-role">الذي عالج الطلب:</label>
                <input
                  type="text"
                  id="admin-role"
                  value={adminRole || 'جاري تحميل البيانات...'}
                  readOnly
                  className="readonly-field"
                  placeholder="جاري تحميل البيانات..."
                />
                {!adminRole && (
                  <small className="loading-text">جاري تحميل بيانات المستخدم...</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="processed-rejection-reason">سبب الرفض:</label>
                <textarea
                  id="processed-rejection-reason"
                  value={processedRejectionReason}
                  onChange={(e) => setProcessedRejectionReason(e.target.value)}
                  placeholder="يرجى كتابة سبب رفض الطلب المعالج..."
                  required
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleProcessedModalClose}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-danger">
                  رفض الطلب المعالج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}