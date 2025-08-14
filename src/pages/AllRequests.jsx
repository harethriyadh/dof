import React, { useState } from "react";
import "../AllRequests.css"; // Import the CSS file

export default function MyQuests() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  // Filtered requests based on status
  const requests = [
    { id: '#001', date: '2024-05-20', desc: 'طلب إجازة سنوية (يوم كامل)', status: 'pending', statusText: 'قيد الانتظار', badge: 'status-binding' },
    { id: '#002', date: '2024-05-18', desc: 'طلب إجازة جزئية (ساعتان)', status: 'approved', statusText: 'معتمد', badge: 'status-approved' },
    { id: '#003', date: '2024-05-15', desc: 'طلب إجازة مرضية (يوم كامل)', status: 'rejected', statusText: 'مرفوض', badge: 'status-rejected' },
    { id: '#004', date: '2024-05-10', desc: 'طلب إجازة سنوية (يوم كامل)', status: 'pending', statusText: 'قيد الانتظار', badge: 'status-binding' },
  ];
  const filteredRequests = statusFilter === 'all' ? requests : requests.filter(r => r.status === statusFilter);

  // PDF export handler with better error handling
  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportMessage("");

    try {
      // Dynamically import jsPDF and html2canvas for client-side PDF export
      const jsPDFModule = await import('jspdf');
      const html2canvas = await import('html2canvas');
      
      const doc = new jsPDFModule.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const table = document.getElementById('requests-table');
      
      if (!table) {
        throw new Error('Table not found for export');
      }

      // Temporarily hide the "خيارات" column before generating PDF
      const optionsHeader = table.querySelector('th:last-child');
      const optionsCells = table.querySelectorAll('td:last-child');
      
      if (optionsHeader) optionsHeader.style.display = 'none';
      optionsCells.forEach(cell => cell.style.display = 'none');

      const canvas = await html2canvas.default(table, { 
        scale: 2,
        useCORS: true,
        foreignObjectRendering: true
      });

      // Restore the hidden columns
      if (optionsHeader) optionsHeader.style.display = '';
      optionsCells.forEach(cell => cell.style.display = '');

      const imgData = canvas.toDataURL('image/png');
      const pageWidth = doc.internal.pageSize.getWidth();
      const imgProps = doc.getImageProperties(imgData);
      const imgWidth = pageWidth - 40;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      doc.addImage(imgData, 'PNG', 20, 40, imgWidth, imgHeight);
      doc.save('requests.pdf');
      
      setExportMessage("تم تصدير الملف بنجاح!");
      setTimeout(() => setExportMessage(""), 3000);
      
    } catch (error) {
      console.error('PDF Export Error:', error);
      setExportMessage("فشل في توليد ملف PDF. الرجاء المحاولة مرة أخرى.");
      setTimeout(() => setExportMessage(""), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="requests-container">
      <div className="page-header">
        <h2>إدارة الطلبات</h2>
        <p>مراجعة ومتابعة جميع طلبات الإجازة</p>
      </div>
      {/* Summary cards from Home.jsx, above the table */}
      <div className="summary-cards-grid">
        {/* Approved */}
        <div className="card summary-card summary-card-approved">
          <div className="summary-card-content">
            <div className="summary-main-value summary-main-value-approved">19</div>
            <div className="summary-label">
              الطلبات المعتمدة
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="card summary-card summary-card-pending">
          <div className="summary-card-content">
            <div className="summary-main-value summary-main-value-pending">20</div>
            <div className="summary-label">
              الطلبات المعلقة
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="card summary-card summary-card-rejected">
          <div className="summary-card-content">
            <div className="summary-main-value summary-main-value-rejected">160</div>
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
          disabled={isExporting}
        >
          <i className={`fas ${isExporting ? 'fa-spinner fa-spin' : 'fa-file-pdf'}`}></i> 
          {isExporting ? "جاري التصدير..." : "تصدير كـ PDF"}
        </button>
      </div>

      {exportMessage && (
        <div className={`export-message ${exportMessage.includes("فشل") ? "error" : "success"}`}>
          {exportMessage}
        </div>
      )}

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
            {filteredRequests.map((r) => (
              <tr key={r.id} id={`request-row-${r.id.replace('#', '')}`}>
                <td>{r.id}</td>
                <td>{r.date}</td>
                <td>{r.desc}</td>
                <td><span className={`status-badge ${r.badge}`}>{r.statusText}</span></td>
                <td className="actions-cell">
                  <button className="options-button" aria-label="خيارات الطلب">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                  <ul className="options-menu" data-parent-id={`request-row-${r.id.replace('#', '')}`}>
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
