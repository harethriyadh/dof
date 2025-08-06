import React from "react";

export default function Profile() {
  return (
    <div className="profile-container">
      <h2>الملف الشخصي</h2>
      {/* User info card */}
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
    </div>
  );
}
