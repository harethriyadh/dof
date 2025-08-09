import React from "react";
import "../Home.css";

export default function Home({ onOpenFullDayModal, onOpenPartTimeModal }) {

  const lastRequestStatus = "approved";
  
  const getStatusClass = (status) => {
    switch (status) {
      case "rejected":
        return "status-rejected";
      case "pending":
        return "status-pending";
      default:
        return "status-approved";
    }
  };
  const statusClass = getStatusClass(lastRequestStatus);

  // Function to generate a user-friendly message based on the status and dates.
  // Placeholder data is used here.
  const getStatusMessage = (status) => {
    const isOneDay = true; // Placeholder: true for one-day leave, false for a range.
    const startDate = "9/4";
    const endDate = "9/7";
    let message = "";

    if (status === "approved") {
      message = isOneDay
        ? `تم قبول اجازتك ليوم ${startDate}`
        : `تم قبول اجازتك من يوم ${startDate} إلى يوم ${endDate}`;
    } else if (status === "rejected") {
      message = isOneDay
        ? `تم رفض اجازتك ليوم ${startDate}`
        : `تم رفض اجازتك من يوم ${startDate} إلى يوم ${endDate}`;
    } else if (status === "pending") {
      message = isOneDay
        ? `اجازتك ليوم ${startDate} قيد المراجعة`
        : `اجازتك من يوم ${startDate} إلى يوم ${endDate} قيد المراجعة`;
    }
    return message;
  };

  return (
    <div className="cards-section">
      {/* The Last Request Status Card:
        Dynamically applies a color-coded style based on the 'lastRequestStatus'.
      */}
      <div className={`card status-last-request card-hover ${statusClass}`}>
        <div className="card-content">
          <span className="request-status-message">
            {getStatusMessage(lastRequestStatus)}
          </span>
        </div>
      </div>


      <div className="card leave-balance-card-three-col card-hover">
        <div className="summary-section">
          <div className="summary-main-value">
            الاجازات<br />المتـــاحة
          </div>
        </div>
        <div className="summary-section">
          <div className="summary-main-value summary-main-value-green">
            20
          </div>
          <div className="summary-label">أيام الإجازة</div>
        </div>
        <div className="summary-section no-border">
          <div className="summary-main-value summary-main-value-orange">
            160
          </div>
          <div className="summary-label">ساعات الإجازة</div>
        </div>
      </div>

      {/* The New Request Card:
        Contains buttons to open modals for different types of leave requests.
      */}
      <div className="card new-request-card card-hover">
        <div className="card-content">
          <h3 className="card-title">إنشاء طلب جديد</h3>
          <button
            className="new-request-btn"
            id="open-full-day-request-form-btn"
            onClick={onOpenFullDayModal}
          >
            طلب إجازة
          </button>
          <button
            className="new-request-btn new-request-btn-secondary"
            id="open-part-time-request-form-btn"
            onClick={onOpenPartTimeModal}
          >
            <span className="icon">🕒</span>  طلب إجازة جزئية
          </button>
        </div>
      </div>
    </div>
  );
}
