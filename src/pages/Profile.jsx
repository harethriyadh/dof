import React, { useMemo } from "react";
import '../Profile.css';

export default function Profile() {
  // Mock user data - in a real app, this would come from props or context
  const userData = useMemo(() => ({
    name: "أحمد محمد",
    email: "ahmed.mohamed@example.com",
    phone: "+964 770 123 4567",
    department: "الموارد البشرية",
    joinDate: "2020-01-15"
  }), []);

  const profileDetails = useMemo(() => [
    { label: "البريد الإلكتروني", value: userData.email, icon: "fas fa-envelope" },
    { label: "الهاتف", value: userData.phone, icon: "fas fa-phone" },
    { label: "القسم", value: userData.department, icon: "fas fa-building" },
    { label: "تاريخ الانضمام", value: userData.joinDate, icon: "fas fa-calendar-alt" }
  ], [userData]);

  return (
    <div className="profile-container">
      <div className="profile-page-header">
        <h2>الملف الشخصي</h2>
        <p>معلومات المستخدم والتفاصيل الشخصية</p>
      </div>
      <div className="profile-card">
        <div className="profile-avatar" aria-hidden="true">
          <i className="fas fa-user-circle"></i>
        </div>
        <h3>اسم المستخدم: {userData.name}</h3>
        <div className="profile-details">
          {profileDetails.map((detail, index) => (
            <div 
              key={index} 
              className="detail-item"
              style={{ '--item-index': index }}
            >
              <span className="detail-label">
                <i className={detail.icon} aria-hidden="true"></i>
                {detail.label}:
              </span> 
              <span className="detail-value">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
