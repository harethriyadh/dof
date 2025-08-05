import React from "react";

export default function Home({ onOpenFullDayModal, onOpenPartTimeModal }) {
  return (
    <div className="cards-section">
      <div className="card status-card">
        <div className="card-content">
          <h3>حالة الطلبات</h3>
          <div className="status-indicators">
            <p>
              الطلبات المعلقة:{" "}
              <span className="status-binding">5</span>
            </p>
            <p>
              الطلبات المعتمدة:{" "}
              <span className="status-approved">12</span>
            </p>
            <p>
              الطلبات المرفوضة:{" "}
              <span className="status-rejected">2</span>
            </p>
          </div>
        </div>
      </div>
      <div className="card new-request-card">
        <div className="card-content">
          <h3>إنشاء طلب جديد</h3>
          <button
            className="new-request-btn"
            id="open-full-day-request-form-btn"
            onClick={onOpenFullDayModal}
          >
            <i className="fas fa-plus-circle"></i> طلب إجازة يوم كامل
          </button>
          <button
            className="new-request-btn"
            id="open-part-time-request-form-btn"
            style={{ marginTop: "1rem" }}
            onClick={onOpenPartTimeModal}
          >
            <i className="fas fa-clock"></i> طلب إجازة جزئية
          </button>
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h3>إجمالي الطلبات</h3>
          <div className="card-value">19</div>
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h3>الأيام المتاحة</h3>
          <div className="card-value">20</div>
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h3>الساعات المتاحة</h3>
          <div className="card-value">160</div>
        </div>
      </div>
    </div>
  );
}
