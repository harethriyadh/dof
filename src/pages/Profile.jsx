import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import '../Profile.css';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Logic Fix: Keep editData for profile only to avoid validation conflicts
  const [editData, setEditData] = useState({
    full_name: '',
    phone: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState({ full_name: '', phone: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Password-specific states
  const [cpCurrent, setCpCurrent] = useState('');
  const [cpNew, setCpNew] = useState('');
  const [cpConfirm, setCpConfirm] = useState('');
  const [cpFieldErrors, setCpFieldErrors] = useState({ current: '', new: '', confirm: '' });
  const [cpLoading, setCpLoading] = useState(false);
  const [cpMessage, setCpMessage] = useState('');
  const [cpSuccess, setCpSuccess] = useState(false);
  
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:3000/api/auth";

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/profile`, {
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
          throw new Error(json.message || 'Failed to fetch');
        }

        const user = json?.data?.user || json?.user;
        setUserData(user);
        // Ensure local storage is in sync
        localStorage.setItem('authUser', JSON.stringify(user));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const resetChangePasswordFields = () => {
    setCpCurrent('');
    setCpNew('');
    setCpConfirm('');
    setCpMessage('');
    setCpSuccess(false);
    setCpFieldErrors({ current: '', new: '', confirm: '' });
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditData({
        full_name: userData?.full_name || userData?.name || '',
        phone: userData?.phone || userData?.phoneNumber || '',
      });
      setFieldErrors({ full_name: '', phone: '' });
      resetChangePasswordFields();
    }
    setIsEditing(!isEditing);
    setUpdateMessage('');
  };

  // LOGIC FIX: Handled separately so it doesn't trigger Profile validation
  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    setCpMessage('');
    setCpSuccess(false);

    const errors = { current: '', new: '', confirm: '' };
    if (!cpCurrent) errors.current = 'الرجاء إدخال كلمة المرور الحالية';
    if (!cpNew) errors.new = 'الرجاء إدخال كلمة المرور الجديدة';
    else if (cpNew.length < 8) errors.new = 'يجب أن تكون 8 أحرف على الأقل';
    if (cpNew !== cpConfirm) errors.confirm = 'كلمات المرور غير متطابقة';

    setCpFieldErrors(errors);
    if (errors.current || errors.new || errors.confirm) return;

    setCpLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: cpCurrent,
          new_password: cpNew
        })
      });

      const json = await res.json();
      if (!res.ok) {
        setCpMessage(json.message || 'فشل تغيير كلمة المرور');
        setCpSuccess(false);
      } else {
        setCpSuccess(true);
        setCpMessage('تم تغيير كلمة المرور بنجاح');
        resetChangePasswordFields();
        setCpSuccess(true); // Keep success state for message display
      }
    } catch (err) {
      setCpMessage('خطأ في الاتصال بالخادم');
    } finally {
      setCpLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage('');

    const errors = { full_name: '', phone: '' };
    if (!editData.full_name.trim()) errors.full_name = 'الاسم مطلوب';
    if (!editData.phone.trim()) errors.phone = 'رقم الهاتف مطلوب';

    setFieldErrors(errors);
    if (errors.full_name || errors.phone) {
      setUpdateLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.message || 'فشل التحديث');

      const updatedUser = json?.data?.user || { ...userData, ...editData };
      setUserData(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      
      setUpdateSuccess(true);
      setUpdateMessage('تم حفظ التغييرات');
      setIsEditing(false);
    } catch (err) {
      setUpdateMessage(err.message);
      setUpdateSuccess(false);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Helper for UI Roles
  const translateRole = (role) => {
    const roles = { admin: 'مدير', manager: 'مسؤول', employee: 'موظف' };
    return roles[role?.toLowerCase()] || role || '';
  };

  const profileDetails = useMemo(() => {
    if (!userData) return [];
    return [
      { label: "الدور والقسم", value: `${translateRole(userData.role)} - ${userData.department || ''}`, icon: "fas fa-user-tag" },
      { label: "الهاتف", value: userData.phone || userData.phoneNumber, icon: "fas fa-phone" },
      { label: "الاختصاص", value: userData.specialist || userData.specialization, icon: "fas fa-user-md" },
      { label: "الموقع", value: userData.college || userData.collegeName, icon: "fas fa-university" },
      { label: "الجنس", value: userData.gender === 'male' ? 'ذكر' : 'أنثى', icon: "fas fa-venus-mars" }
    ].filter(d => d.value);
  }, [userData]);

  if (loading) return <div className="profile-container"><p>جاري التحميل...</p></div>;
  if (error) return <div className="profile-container"><p>خطأ: {error}</p></div>;

  return (
    <div className="profile-container">
      <div className="profile-page-header">
        <h2>الملف الشخصي</h2>
        <div className="button-wrapper">
          <button 
            className={`edit-button ${isEditing ? 'cancel' : 'edit'}`}
            onClick={handleEditToggle}
            type="button"
          >
            <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'}`}></i>
            {isEditing ? 'إلغاء' : 'تعديل'}
          </button>
        </div>
      </div>

      {updateMessage && <div className={`update-message ${updateSuccess ? 'success' : 'error'}`}>{updateMessage}</div>}

      {isEditing ? (
        <div className="profile-edit-form">
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>الاسم الكامل *</label>
              <input value={editData.full_name} onChange={(e) => setEditData({...editData, full_name: e.target.value})} className="form-input" />
              {fieldErrors.full_name && <span style={{color: 'red'}}>{fieldErrors.full_name}</span>}
            </div>

            <div className="form-group">
              <label>رقم الهاتف *</label>
              <input value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} className="form-input" />
              {fieldErrors.phone && <span style={{color: 'red'}}>{fieldErrors.phone}</span>}
            </div>

            <div className="password-section">
              <h3>تغيير كلمة المرور</h3>
              {cpMessage && <div className={`update-message ${cpSuccess ? 'success' : 'error'}`}>{cpMessage}</div>}
              
              <div className="form-group">
                <label>كلمة المرور الحالية</label>
                <input type="password" value={cpCurrent} onChange={(e) => setCpCurrent(e.target.value)} className="form-input" />
                {cpFieldErrors.current && <span style={{color: 'red'}}>{cpFieldErrors.current}</span>}
              </div>

              <div className="form-group">
                <label>كلمة المرور الجديدة</label>
                <input type="password" value={cpNew} onChange={(e) => setCpNew(e.target.value)} className="form-input" />
                {cpFieldErrors.new && <span style={{color: 'red'}}>{cpFieldErrors.new}</span>}
              </div>

              <div className="form-group">
                <label>تأكيد كلمة المرور الجديدة</label>
                <input type="password" value={cpConfirm} onChange={(e) => setCpConfirm(e.target.value)} className="form-input" />
                {cpFieldErrors.confirm && <span style={{color: 'red'}}>{cpFieldErrors.confirm}</span>}
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={resetChangePasswordFields}>إلغاء</button>
                <button type="button" className="save-button" onClick={handleChangePassword} disabled={cpLoading}>
                  {cpLoading ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button" disabled={updateLoading}>
                {updateLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="profile-card">
          <div className="profile-avatar"><i className="fas fa-user-circle"></i></div>
          <h3>{userData?.full_name || userData?.name}</h3>
          <div className="profile-details">
            {profileDetails.map((detail, index) => (
              <div key={index} className="detail-item">
                <span className="detail-label"><i className={detail.icon}></i> {detail.label}:</span> 
                <span className="detail-value">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}