import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import '../Profile.css';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
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

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (!isEditing) {
      // Initialize edit data with current user data
      setEditData({
        full_name: userData?.full_name || userData?.name || userData?.username || '',
        phone: userData?.phone || userData?.phoneNumber || '',
        password: '',
        confirmPassword: ''
      });
    }
    setIsEditing(!isEditing);
    setUpdateMessage('');
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage('');

    // Validation
    if (editData.password && editData.password !== editData.confirmPassword) {
      setUpdateMessage('كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
      setUpdateLoading(false);
      return;
    }

    if (editData.password && editData.password.length < 6) {
      setUpdateMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setUpdateLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setUpdateMessage('يرجى تسجيل الدخول مرة أخرى');
        setUpdateLoading(false);
        return;
      }

      // Prepare update data
      const updateData = {
        full_name: editData.full_name,
        phone: editData.phone
      };

      // Only include password if provided
      if (editData.password) {
        updateData.password = editData.password;
      }

      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const json = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }
        throw new Error(json.message || 'فشل في تحديث الملف الشخصي');
      }

      // Update local user data
      const updatedUserData = { ...userData, ...updateData };
      setUserData(updatedUserData);
      
      // Update localStorage
      localStorage.setItem('authUser', JSON.stringify(updatedUserData));

      setUpdateMessage('تم تحديث الملف الشخصي بنجاح');
      setIsEditing(false);
      
      // Clear password fields
      setEditData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));

    } catch (err) {
      console.error('Update error:', err);
      setUpdateMessage(err.message || 'حدث خطأ أثناء تحديث الملف الشخصي');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Helper function to translate role to Arabic
  const translateRole = (role) => {
    if (!role) return '';
    const roleLower = role.toLowerCase();
    switch (roleLower) {
      case 'admin':
      case 'super admin':
        return 'مدير';
      case 'manager':
        return 'مسؤول';
      case 'employee':
        return 'موظف';
      case 'head of department':
        return 'رئيس قسم';
      default:
        return role; // Return original if no translation found
    }
  };

  const profileDetails = useMemo(() => {
    if (!userData) return [];
    
    const details = [
      { label: "الدور والقسم", value: `${translateRole(userData.role)} - ${userData.department || userData.departmentName || ''}`, icon: "fas fa-user-tag" },
      { label: "الهاتف", value: userData.phone || userData.phoneNumber, icon: "fas fa-phone" },
      { label: "الاختصاص", value: userData.specialist || userData.specialization, icon: "fas fa-user-md" },
      { label: "الموقع", value: userData.college || userData.collegeName, icon: "fas fa-university" },
      { label: "الجنس", value: userData.gender === 'male' ? 'ذكر' : userData.gender === 'female' ? 'أنثى' : userData.gender, icon: "fas fa-venus-mars" }
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
        <div className="button-wrapper">
          <button 
            className={`edit-button ${isEditing ? 'cancel' : 'edit'}`}
            onClick={handleEditToggle}
            disabled={updateLoading}
            type="button"
          >
            <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'}`}></i>
            {isEditing ? 'إلغاء التعديل' : 'تعديل الملف الشخصي'}
          </button>
        </div>
      </div>

      {updateMessage && (
        <div className={`update-message ${updateMessage.includes('نجاح') ? 'success' : 'error'}`}>
          {updateMessage}
        </div>
      )}

      {isEditing ? (
        <div className="profile-edit-form">
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label htmlFor="full_name">الاسم الكامل *</label>
              <input
                type="text"
                id="full_name"
                value={editData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                required
                disabled={updateLoading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">رقم الهاتف *</label>
              <input
                type="text"
                id="phone"
                value={editData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                disabled={updateLoading}
                className="form-input"
                placeholder="مثال: 07701234567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">كلمة المرور الجديدة (اختياري)</label>
              <input
                type="password"
                id="password"
                value={editData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={updateLoading}
                className="form-input"
                placeholder="اتركها فارغة إذا كنت لا تريد تغيير كلمة المرور"
                minLength="6"
              />
            </div>

            {editData.password && (
              <div className="form-group">
                <label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={editData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  disabled={updateLoading}
                  className="form-input"
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  minLength="6"
                />
              </div>
            )}

            <div className="form-actions">
              <button 
                type="submit" 
                className="save-button"
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    حفظ التغييرات
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
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
      )}
    </div>
  );
}