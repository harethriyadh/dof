import React, { useState, useEffect } from "react";
import "../AllRequests.css"; // Import the CSS file
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function MyQuests() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportMessage, setExportMessage] = useState("");
  
  // Fetch requests for the logged-in user
  const fetchMyRequests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Please login first to access this page.");
        setLoading(false);
        return;
      }

      // Get user data from localStorage to identify the current user
      const userDataStr = localStorage.getItem('authUser');
      if (!userDataStr) {
        setError("User data not found. Please login again.");
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userDataStr);
      const userId = userData.id || userData.user_id;

      const response = await fetch("http://localhost:3000/api/leave-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          setError("Session expired. Please login again.");
          return;
        }
        throw new Error('Failed to fetch leave requests');
      }

      const result = await response.json();
      
      if (result.success) {
        // Filter requests for the current user only
        const userRequests = result.data.filter(req => {
          // Check if the request belongs to the current user
          return req.user_id === userId || 
                 req.employee_id === userId ||
                 req.created_by === userId ||
                 (req.employee_name && userData.full_name && req.employee_name === userData.full_name);
        });
        setRequests(userRequests);
      } else {
        setError(result.message || "Failed to fetch requests.");
      }
    } catch (err) {
      setError("Failed to fetch requests. Please try again later.");
      console.error("Error fetching leave requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  // Filtered requests based on status
  const filteredRequests = statusFilter === 'all' ? requests : requests.filter(r => r.status === statusFilter);

  // Handle delete request - only for pending requests
  const handleDeleteRequest = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setExportMessage("يرجى تسجيل الدخول أولاً لحذف الطلبات.");
          setTimeout(() => setExportMessage(""), 3000);
          return;
        }

        const response = await fetch(`http://localhost:3000/api/leave-requests/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            setExportMessage("انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.");
            setTimeout(() => setExportMessage(""), 3000);
            return;
          }
          throw new Error('Failed to delete request');
        }

        const result = await response.json();
        
        if (result.success) {
          // Remove the deleted request from the state
          setRequests(requests.filter(req => (req.id || req.request_no) !== id));
          setExportMessage("تم حذف الطلب بنجاح.");
          setTimeout(() => setExportMessage(""), 3000);
        } else {
          setExportMessage(result.message || "فشل في حذف الطلب.");
          setTimeout(() => setExportMessage(""), 3000);
        }
      } catch (err) {
        setExportMessage("فشل في حذف الطلب.");
        setTimeout(() => setExportMessage(""), 3000);
        console.error("Error deleting request:", err);
      }
    }
  };
  
  // Function to determine badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  // Function to get Arabic status text
  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'معتمد';
      case 'pending':
        return 'قيد الانتظار';
      case 'rejected':
        return 'مرفوض';
      default:
        return '';
    }
  };

  // Calculate summary stats for the user's requests
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  const handleExportPDF = async () => {
    try {
      setExportMessage("جاري تصدير PDF...");
      
      // Get the table element and wrapper
      const table = document.getElementById('requests-table');
      const wrapper = document.querySelector('.table-responsive-wrapper');
      
      if (!table || !wrapper) {
        setExportMessage("لم يتم العثور على الجدول للتصدير.");
        setTimeout(() => setExportMessage(""), 3000);
        return;
      }

      // Temporarily apply the full-width style to the wrapper
      wrapper.classList.add('force-full-width');

      // Configure html2canvas options (captures full width due to overridden styles)
      const options = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: table.scrollWidth,
        height: table.scrollHeight
      };

      // Generate canvas from table
      const canvas = await html2canvas(table, options);
      const imgData = canvas.toDataURL('image/png');
      
      // IMMEDIATELY remove the temporary style to restore responsiveness
      wrapper.classList.remove('force-full-width');
      
      // Create PDF in Landscape Mode ('l')
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgWidth = 297; // A4 Landscape width
      const pageHeight = 210; // A4 Landscape height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Set RTL direction for Arabic text
      pdf.setR2L(true);
      
      // Save the PDF
      pdf.save('طلباتي.pdf');
      
      setExportMessage("تم تصدير PDF بنجاح!");
      setTimeout(() => setExportMessage(""), 3000);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      setExportMessage("فشل في تصدير PDF. يرجى المحاولة مرة أخرى.");
      setTimeout(() => setExportMessage(""), 3000);
      
      // Ensure cleanup even on error
      const wrapper = document.querySelector('.table-responsive-wrapper');
      if (wrapper) {
        wrapper.classList.remove('force-full-width');
      }
    }
  };

  return (
    <div className="requests-container">
      <div className="page-header">
        <h2>طلباتي</h2>
        <p>مراجعة ومتابعة جميع طلبات الإجازة التي قمت بإنشائها</p>
      </div>

      <div className="summary-cards-grid">
        {/* Approved */}
        <div className="card summary-card summary-card-approved">
          <div className="summary-card-content">
            <div className="summary-main-value summary-main-value-approved">{approvedCount}</div>
            <div className="summary-label">
              الطلبات المعتمدة
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="card summary-card summary-card-pending">
          <div className="summary-card-content">
            <div className="summary-main-value summary-main-value-pending">{pendingCount}</div>
            <div className="summary-label">
              الطلبات المعلقة
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="card summary-card summary-card-rejected">
          <div className="summary-card-content">
            <div className="summary-main-value summary-main-value-rejected">{rejectedCount}</div>
            <div className="summary-label">
              الطلبات المرفوضة
            </div>
          </div>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="status-filter">حالة الطلب:</label>
          <select 
            id="status-filter" 
            className="filter-select" 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">الكل</option>
            <option value="pending">قيد الانتظار</option>
            <option value="approved">معتمد</option>
            <option value="rejected">مرفوض</option>
          </select>
        </div>
        <button
          className="btn btn-secondary export-pdf-btn"
          id="export-requests-pdf-btn"
          onClick={handleExportPDF}
        >
          <i className="fas fa-file-pdf"></i>
          تصدير كـ PDF
        </button>
      </div>

      {exportMessage && (
        <div className={`export-message ${exportMessage.includes("فشل") || exportMessage.includes("Error") ? "error" : "success"}`}>
          {exportMessage}
        </div>
      )}

      {loading ? (
        <div className="loading-message">Loading requests...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="table-responsive-wrapper">
          <table className="requests-table" id="requests-table">
            <thead>
              <tr>
                <th style={{textAlign: 'center'}}></th>
                <th style={{textAlign: 'center'}}>الحالة</th>
                <th style={{textAlign: 'center'}}>نوع الإجازة</th>
                <th style={{textAlign: 'center'}}>الفترة الزمنية</th>
                <th style={{textAlign: 'center'}}>عدد الأيام</th>
                <th style={{textAlign: 'center'}}>السبب</th>
                <th style={{textAlign: 'center'}}>تاريخ الطلب</th>
                <th style={{textAlign: 'center'}}>تاريخ المعالجة</th>
                <th>تمت المعالجة بواسطة</th>
                <th>سبب الرفض</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((r) => (
                  <tr key={r.id || r.request_no}>
                    <td className="actions-cell" style={{textAlign: 'center'}}>
                      {r.status === 'pending' ? (
                        <button
                          className="btn-action delete-request-btn"
                          onClick={() => handleDeleteRequest(r.id || r.request_no)}
                          title="حذف الطلب"
                        >
                          <i className="fas fa-trash-alt"></i> حذف
                        </button>
                      ) : (
                        <span className="no-action-text">-</span>
                      )}
                    </td>
                    <td style={{textAlign: 'center'}}><span className={`status-badge ${getStatusBadge(r.status)}`}>{getStatusText(r.status)}</span></td>
                    <td style={{textAlign: 'center'}}>{r.leave_type || r.leave_type_name || '-'}</td>
                    <td style={{textAlign: 'center', whiteSpace: 'nowrap'}}>
                      {(() => {
                        const startDate = r.start_date?.split('T')[0] || r.from_date;
                        const endDate = r.end_date?.split('T')[0] || r.to_date;
                        if (startDate && endDate) {
                          const startYear = startDate.split('-')[0];
                          const startMonth = startDate.split('-')[1];
                          const startDay = startDate.split('-')[2];
                          const endMonth = endDate.split('-')[1];
                          const endDay = endDate.split('-')[2];
                          return `${startYear} ( ${startMonth}/${startDay} الى ${endMonth}/${endDay} )`;
                        }
                        return '-';
                      })()}
                    </td>
                    <td style={{textAlign: 'center'}}>{r.number_of_days || r.days || '-'}</td>
                    <td style={{textAlign: 'center'}}>{r.reason || r.description || '-'}</td>
                    <td style={{textAlign: 'center'}}>{r.request_date?.split('T')[0] || r.date || '-'}</td>
                    <td style={{textAlign: 'center'}}>{(r.processing_date && String(r.processing_date).includes('T')) ? r.processing_date.split('T')[0] : (r.processing_date || '-')}</td>
                    <td dir="rtl" className="text-right">{r.processed_by || '-'}</td>
                    <td>{r.reason_for_rejection || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-requests-found">لا توجد طلبات لعرضها.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}