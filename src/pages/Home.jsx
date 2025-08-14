import React, { useMemo } from "react";
import "../Home.css";

export default function Home({ onOpenFullDayModal, onOpenPartTimeModal }) {
  // Mock data - in a real app, this would come from props or context
  const lastRequestStatus = "approved";
  
  // Memoized status class calculation
  const statusClass = useMemo(() => {
    switch (lastRequestStatus) {
      case "rejected":
        return "status-rejected";
      case "pending":
        return "status-pending";
      default:
        return "status-approved";
    }
  }, [lastRequestStatus]);

  // Memoized status message generation
  const statusMessage = useMemo(() => {
    const isOneDay = true; // Placeholder: true for one-day leave, false for a range.
    const startDate = "9/4";
    const endDate = "9/7";
    
    const messages = {
      approved: isOneDay
        ? `تم قبول اجازتك ليوم ${startDate}`
        : `تم قبول اجازتك من يوم ${startDate} إلى يوم ${endDate}`,
      rejected: isOneDay
        ? `تم رفض اجازتك ليوم ${startDate}`
        : `تم رفض اجازتك من يوم ${startDate} إلى يوم ${endDate}`,
      pending: isOneDay
        ? `اجازتك ليوم ${startDate} قيد المراجعة`
        : `اجازتك من يوم ${startDate} إلى يوم ${endDate} قيد المراجعة`
    };
    
    return messages[lastRequestStatus] || messages.pending;
  }, [lastRequestStatus]);

  // Memoized leave balance data
  const leaveBalance = useMemo(() => ({
    availableDays: 20,
    availableHours: 160
  }), []);

  return (
    <div>
      <div className="page-welcome">
        <h2>مرحباً بك في لوحة التحكم</h2>
        <p>إدارة طلبات الإجازة والمراقبة اليومية</p>
      </div>
      <div className="cards-section">
      {/* The Last Request Status Card:
        Dynamically applies a color-coded style based on the 'lastRequestStatus'.
      */}
      <div className={`card status-last-request card-hover ${statusClass}`}>
        <div className="card-content">
          <span className="request-status-message">
            {statusMessage}
          </span>
        </div>
      </div>

      {/* Leave Balance Card */}
      <div className="card leave-balance-card-three-col card-hover">
        <div className="summary-section">
          <div className="summary-main-value">
            الاجازات<br />المتـــاحة
          </div>
        </div>
        <div className="summary-section">
          <div className="summary-main-value summary-main-value-green">
            {leaveBalance.availableDays}
          </div>
          <div className="summary-label">أيام الإجازة</div>
        </div>
        <div className="summary-section no-border">
          <div className="summary-main-value summary-main-value-orange">
            {leaveBalance.availableHours}
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
            aria-label="فتح نموذج طلب إجازة يوم كامل"
          >
            طلب إجازة
          </button>
          <button
            className="new-request-btn new-request-btn-secondary"
            id="open-part-time-request-form-btn"
            onClick={onOpenPartTimeModal}
            aria-label="فتح نموذج طلب إجازة جزئية"
          >
            <span className="icon" aria-hidden="true">🕒</span>  طلب إجازة جزئية
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
