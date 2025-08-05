import React from "react";

export default function Profile() {
  return (
    <div className="profile-container">
      <h2>الملف الشخصي</h2>
      <div className="profile-card">
        <div className="profile-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <h3>اسم المستخدم: أحمد محمد</h3>
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">البريد الإلكتروني:</span>{" "}
            ahmed.mohamed@example.com
          </div>
          <div className="detail-item">
            <span className="detail-label">الهاتف:</span> +964 770 123 4567
          </div>
          <div className="detail-item">
            <span className="detail-label">القسم:</span> الموارد البشرية
          </div>
          <div className="detail-item">
            <span className="detail-label">تاريخ الانضمام:</span> 2020-01-15
          </div>
        </div>
      </div>
      <div className="profile-card available-balance-card" style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>
        <div className="card-content">
          <h3 style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>الرصيد المتاح</h3>
          <div className="balance-indicators">
            <p style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>
              أيام الإجازة: <span className="balance-value">20 يوم</span>
            </p>
            <p style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>
              ساعات الإجازة: <span className="balance-value">160 ساعة</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
