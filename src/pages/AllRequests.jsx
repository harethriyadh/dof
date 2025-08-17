import React, { useState } from "react";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
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

  // Handle export requests to PDF (EXACT SAME AS RequestsManagement.jsx)
  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportMessage("");

    try {
      // Get the table element to export
      const table = document.getElementById('requests-table');
      if (!table) {
        throw new Error('Table element not found.');
      }

      // Use html2canvas to render the table as a canvas
      const canvas = await html2canvas(table, {
        scale: 2, // Increase scale for better resolution
        logging: false, // Disable console logs
        useCORS: true // Required for some assets if they are from different origins
      });

      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4'
      });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Calculate the image dimensions to fit the page
      const imgProps = doc.getImageProperties(imgData);
      const imgWidth = pageWidth - 40; // 20px margin on each side
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // Add the table image to the PDF
      doc.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);

      // Save the PDF
      doc.save('requests.pdf');

      setExportMessage("تم تصدير الطلبات بنجاح!");
      setTimeout(() => setExportMessage(""), 3000);
      
    } catch (error) {
      console.error('PDF Export Error:', error);
      setExportMessage("فشل في تصدير الطلبات. الرجاء المحاولة مرة أخرى.");
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
              <th>الإجراءات</th>
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
