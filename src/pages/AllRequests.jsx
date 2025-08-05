import React from "react";

export default function MyQuests() {
  const [statusFilter, setStatusFilter] = React.useState('all');

  // Filtered requests based on status
  const requests = [
    { id: '#001', date: '2024-05-20', desc: 'طلب إجازة سنوية (يوم كامل)', status: 'pending', statusText: 'قيد الانتظار', badge: 'status-binding' },
    { id: '#002', date: '2024-05-18', desc: 'طلب إجازة جزئية (ساعتان)', status: 'approved', statusText: 'معتمد', badge: 'status-approved' },
    { id: '#003', date: '2024-05-15', desc: 'طلب إجازة مرضية (يوم كامل)', status: 'rejected', statusText: 'مرفوض', badge: 'status-rejected' },
    { id: '#004', date: '2024-05-10', desc: 'طلب إجازة سنوية (يوم كامل)', status: 'pending', statusText: 'قيد الانتظار', badge: 'status-binding' },
  ];
  const filteredRequests = statusFilter === 'all' ? requests : requests.filter(r => r.status === statusFilter);

  // PDF export handler
  const handleExportPDF = () => {
    // Dynamically import jsPDF and html2canvas for client-side PDF export
    import('jspdf').then(jsPDFModule => {
      import('html2canvas').then(html2canvas => {
        const doc = new jsPDFModule.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
        const table = document.getElementById('requests-table');
        html2canvas.default(table, { scale: 2 }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const imgProps = doc.getImageProperties(imgData);
          const imgWidth = pageWidth - 40;
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
          doc.addImage(imgData, 'PNG', 20, 40, imgWidth, imgHeight);
          doc.save('requests.pdf');
        });
      });
    });
  };

  return (
    <div className="requests-container">
      <h2>طلباتي</h2>
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="status-filter">حالة الطلب:</label>
          <select id="status-filter" className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">الكل</option>
            <option value="pending">قيد الانتظار</option>
            <option value="approved">معتمد</option>
            <option value="rejected">مرفوض</option>
          </select>
        </div>
        <button className="btn btn-secondary export-pdf-btn" id="export-requests-pdf-btn" onClick={handleExportPDF}>
          <i className="fas fa-file-pdf"></i> تصدير كـ PDF
        </button>
      </div>
      <div className="table-responsive-wrapper">
        <table className="requests-table" id="requests-table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>تاريخ الطلب</th>
              <th>وصف الطلب</th>
              <th>الحالة</th>
              <th>خيارات</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((r, idx) => (
              <tr key={r.id} id={`request-row-${r.id.replace('#','')}`}>
                <td>{r.id}</td>
                <td>{r.date}</td>
                <td>{r.desc}</td>
                <td><span className={`status-badge ${r.badge}`}>{r.statusText}</span></td>
                <td className="actions-cell">
                  <button className="options-button" aria-label="خيارات الطلب">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                  <ul className="options-menu" data-parent-id={`request-row-${r.id.replace('#','')}`}>
                    <li><a href="#" className="edit-request-btn"><i className="fas fa-edit"></i> تعديل</a></li>
                    <li><a href="#" className="delete-request-btn"><i className="fas fa-trash-alt"></i> حذف</a></li>
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
