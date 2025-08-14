import React, { useState, useMemo } from "react";
import "../RequestsManagement.css";

export default function RequestsManagement() {
  // State for rejection modal
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // Mock data for pending requests
  const [pendingRequests, setPendingRequests] = useState([
    { 
      id: '#001', 
      date: '2024-05-20', 
      employeeName: 'أحمد محمد',
      department: 'الموارد البشرية',
      leaveType: 'إجازة سنوية',
      startDate: '2024-06-01',
      endDate: '2024-06-05',
      days: 5,
      reason: 'رحلة عائلية',
      status: 'pending'
    },
    { 
      id: '#002', 
      date: '2024-05-19', 
      employeeName: 'فاطمة علي',
      department: 'تقنية المعلومات',
      leaveType: 'إجازة مرضية',
      startDate: '2024-05-25',
      endDate: '2024-05-27',
      days: 3,
      reason: 'مرض عائلي',
      status: 'pending'
    },
    { 
      id: '#003', 
      date: '2024-05-18', 
      employeeName: 'محمد حسن',
      department: 'المالية',
      leaveType: 'إجازة طارئة',
      startDate: '2024-05-30',
      endDate: '2024-05-30',
      days: 1,
      reason: 'موعد طبي',
      status: 'pending'
    }
  ]);

  // Mock data for processed requests
  const [processedRequests, setProcessedRequests] = useState([
    { 
      id: '#004', 
      date: '2024-05-15', 
      employeeName: 'سارة أحمد',
      department: 'التسويق',
      leaveType: 'إجازة سنوية',
      startDate: '2024-06-10',
      endDate: '2024-06-15',
      days: 6,
      reason: 'عطلة صيفية',
      status: 'approved',
      processedDate: '2024-05-16',
      processedBy: 'مدير الموارد البشرية'
    },
    { 
      id: '#005', 
      date: '2024-05-14', 
      employeeName: 'علي محمود',
      department: 'العمليات',
      leaveType: 'إجازة مرضية',
      startDate: '2024-05-20',
      endDate: '2024-05-25',
      days: 6,
      reason: 'جراحة',
      status: 'rejected',
      processedDate: '2024-05-15',
      processedBy: 'مدير العمليات',
      rejectionReason: 'عدم تقديم تقرير طبي'
    }
  ]);

  // Handle approve action
  const handleProcessRequest = (requestId, action) => {
    const requestIndex = pendingRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return;

    const request = pendingRequests[requestIndex];
    const processedRequest = {
      ...request,
      status: action,
      processedDate: new Date().toISOString().split('T')[0],
      processedBy: 'المدير الحالي',
      ...(action === 'rejected' && { rejectionReason: rejectionReason || 'تم الرفض من قبل المدير' })
    };

    // Remove from pending and add to processed
    const newPendingRequests = pendingRequests.filter(req => req.id !== requestId);
    setPendingRequests(newPendingRequests);
    setProcessedRequests(prev => [processedRequest, ...prev]);
  };

  // Handle reject button click - opens modal
  const handleRejectClick = (requestId) => {
    setSelectedRequestId(requestId);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  // Handle rejection form submission
  const handleRejectionSubmit = (e) => {
    e.preventDefault();
    if (rejectionReason.trim()) {
      handleProcessRequest(selectedRequestId, 'rejected');
      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedRequestId(null);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowRejectionModal(false);
    setRejectionReason('');
    setSelectedRequestId(null);
  };

  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'معتمد';
      case 'rejected':
        return 'مرفوض';
      default:
        return 'قيد الانتظار';
    }
  };

  // Memoized counts
  const counts = useMemo(() => ({
    pending: pendingRequests.length,
    approved: processedRequests.filter(req => req.status === 'approved').length,
    rejected: processedRequests.filter(req => req.status === 'rejected').length
  }), [pendingRequests, processedRequests]);

  return (
    <div className="requests-management-container">
      {/* Page Header */}
      <div className="page-header">
        <h2>إدارة الطلبات</h2>
        <p>مراجعة واتخاذ قرارات بشأن طلبات الإجازة</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards-grid">
        <div className="card summary-card summary-card-pending">
          <div className="summary-card-content">
            <div className="summary-main-value summary-main-value-pending">{counts.pending}</div>
            <div className="summary-label">الطلبات المعلقة</div>
          </div>
        </div>

        <div className="card summary-card summary-card-approved">
          <div className="summary-card-content">
            <div className="summary-main-value summary-main-value-approved">{counts.approved}</div>
            <div className="summary-label">الطلبات المعتمدة</div>
          </div>
        </div>

        <div className="card summary-card summary-card-rejected">
          <div className="summary-card-content">
            <div className="summary-main-value summary-main-value-rejected">{counts.rejected}</div>
            <div className="summary-label">الطلبات المرفوضة</div>
          </div>
        </div>
      </div>

      {/* Pending Requests Section */}
      <div className="requests-section">
        <div className="section-header pending-section-header">
          <h3>الطلبات المعلقة</h3>
          <p>الطلبات التي تحتاج إلى مراجعة واتخاذ قرار</p>
        </div>
        
        <div className="table-responsive-wrapper">
          <table className="requests-table" id="pending-requests-table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>تاريخ الطلب</th>
                <th>اسم الموظف</th>
                <th>القسم</th>
                <th>نوع الإجازة</th>
                <th>من تاريخ</th>
                <th>إلى تاريخ</th>
                <th>عدد الأيام</th>
                <th>السبب</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((request) => (
                <tr key={request.id} className="pending-row">
                  <td>{request.id}</td>
                  <td>{request.date}</td>
                  <td>{request.employeeName}</td>
                  <td>{request.department}</td>
                  <td>{request.leaveType}</td>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.days}</td>
                  <td>{request.reason}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="btn btn-approve"
                        onClick={() => handleProcessRequest(request.id, 'approved')}
                        title="اعتماد الطلب"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button 
                        className="btn btn-reject"
                        onClick={() => handleRejectClick(request.id)}
                        title="رفض الطلب"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Processed Requests Section */}
      <div className="requests-section">
        <div className="section-header">
          <h3>الطلبات المعالجة</h3>
          <p>الطلبات التي تم اتخاذ قرار بشأنها</p>
        </div>
        
        <div className="table-responsive-wrapper">
          <table className="requests-table" id="processed-requests-table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
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
                <th>تمت المعالجة بواسطة</th>
                <th>سبب الرفض</th>
              </tr>
            </thead>
            <tbody>
              {processedRequests.map((request) => (
                <tr key={request.id} className={`processed-row ${getStatusColorClass(request.status)}`}>
                  <td>{request.id}</td>
                  <td>{request.date}</td>
                  <td>{request.employeeName}</td>
                  <td>{request.department}</td>
                  <td>{request.leaveType}</td>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.days}</td>
                  <td>{request.reason}</td>
                  <td>
                    <span className={`status-badge ${getStatusColorClass(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </td>
                  <td>{request.processedDate}</td>
                  <td>{request.processedBy}</td>
                  <td>{request.rejectionReason || '-'}</td>
                </tr>
              ))}
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
                <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
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
    </div>
  );
}
