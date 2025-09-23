import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import '../Profile.css';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      // Read token saved by the authentication flow (guide: authToken)
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError("Token not found. Please log in.");
        setLoading(false);
        // Redirect to login route per guide
        navigate('/login');
        return;
      }

      try {
        // Use the explicit API endpoint as requested
        const res = await fetch("http://localhost:3000/api/auth/profile", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const json = await res.json();
        
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }
          throw new Error(json.message || 'Failed to fetch profile');
        }

        // FIXED: Use the correct response structure
        const user = json?.data?.user;
        if (!user) {
          throw new Error('Invalid profile response');
        }
        setUserData(user);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const profileDetails = useMemo(() => {
    if (!userData) return [];
    
    const details = [
      { label: "الجنس", value: userData.gender === 'male' ? 'ذكر' : userData.gender === 'female' ? 'أنثى' : userData.gender, icon: "fas fa-venus-mars" },
      { label: "الهاتف", value: userData.phone || userData.phoneNumber, icon: "fas fa-phone" },
      { label: "القسم", value: userData.department || userData.departmentName, icon: "fas fa-building" },
      { label: "الاختصاص", value: userData.specialist || userData.specialization, icon: "fas fa-user-md" },
      { label: "الكلية", value: userData.college || userData.collegeName, icon: "fas fa-university" }
    ].filter(detail => detail.value != null && detail.value !== '');

    return details;
  }, [userData]);

  if (loading) {
    return (
      <div className="profile-container">
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container error-container">
        <p>حدث خطأ: {error}</p>
        <p>الرجاء المحاولة مرة أخرى.</p>
      </div>
    );
  }

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
        <h3>{userData.full_name || userData.name || userData.username}</h3>
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