import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../Auth.css'; // Assuming this file exists for custom styles

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Register form state - Updated to match schema
  const [registerData, setRegisterData] = useState({
    full_name: '',
    username: '',
    password: '',
    phone: '',
    college: '',
    department: '',
    administrative_position: '',
    degree: '', // Highest educational qualification
    gender: '', // "male" or "female"
    role: 'employee',
    leave_balances: [] // Array of leave balance objects
  });

  const navigate = useNavigate();


  // Colleges and their departments (dependent dropdown data)
  const collegesMap = {
    'الرئاسة': [
      'تكنولوجيا المعلومات',
      'قسم التسجل وشؤون الطلبة',
      'قسم الادارية',
      'قسم القانونية',
      'مكتب رئيس الجامعة',
      'قسم الاعلام',
      'قسم المتابعة',
      'قسم الديوان',
      'قسم الدراسات والتخطيط',
      'مكتب المساعد العلمي'
    ],
    'كلية الادارة والاقتصاد': [
      'قسم المحاسبة',
      'قسم ادارة الاعمال',
      'قسم المالية والمصرفية'
    ],
    'كلية طب الاسنان': [],
    'كلية التقنيات الصحية والطبية': [
      'قسم التخدير',
      'قسم صناعة الاسنان',
      'قسم الاشعة'
    ]
  };
  const collegeOptions = Object.keys(collegesMap);
  const departmentOptions = registerData.college && collegesMap[registerData.college]
    ? collegesMap[registerData.college]
    : [];

  // Administrative position options
  const administrativePositionOptions = [
    'رئيس الجامعة',
    'المساعد العلمي',
    'المساعد الاداري',
    'العميد',
    'مساعد العميد',
    'رئيس القسم',
    'مدير قسم الادارية',
    'الموارد البشرية'
  ];

  // Degree options
  const degreeOptions = [
    'معهد',
    'بكلوريوس',
    'ماجستير',
    'دكتوراة'
  ];

  // Helpers: validation for registration per spec - ADDED 'gender' VALIDATION
  const validateRegister = (payload) => {
    const errors = [];
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const phoneRegex = /^[0-9+\-()\s]{7,20}$/;

    if (!payload.full_name || payload.full_name.trim().length < 2 || payload.full_name.trim().length > 100) {
      errors.push({ field: 'full_name', message: 'الاسم الكامل يجب أن يكون بين 2 و 100 حرف' });
    }
    if (!payload.username || payload.username.trim().length < 3 || payload.username.trim().length > 30 || !usernameRegex.test(payload.username)) {
      errors.push({ field: 'username', message: 'اسم المستخدم يجب أن يكون 3-30 وiحروف/أرقام/شرطة سفلية فقط' });
    }
    if (!payload.password || payload.password.length < 6) {
      errors.push({ field: 'password', message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    }
    if (!payload.phone || !phoneRegex.test(payload.phone)) {
      errors.push({ field: 'phone', message: 'رقم الهاتف مطلوب ويجب أن يكون صالحاً' });
    }
    // New validation for gender
    if (!payload.gender || !['male', 'female'].includes(String(payload.gender).toLowerCase())) {
        errors.push({ field: 'gender', message: 'النوع (الجنس) مطلوب ويجب أن يكون ذكراً أو أنثى' });
    }
    
    // New validation for administrative position
    if (payload.administrative_position && !administrativePositionOptions.includes(payload.administrative_position)) {
        errors.push({ field: 'administrative_position', message: 'المنصب الاداري غير صالح' });
    }
    
    // New validation for degree
    if (payload.degree && !degreeOptions.includes(payload.degree)) {
        errors.push({ field: 'degree', message: 'الدرجة العلمية غير صالحة' });
    }

    const checkLen = (value, field) => {
      if (value && (value.trim().length < 1 || value.trim().length > 100)) {
        errors.push({ field, message: 'يجب أن يتراوح الطول بين 1 و 100 حرف' });
      }
    };
    checkLen(payload.specialist, 'specialist');
    checkLen(payload.college, 'college');
    checkLen(payload.department, 'department');

    if (payload.role && !['employee','manager','admin'].includes(String(payload.role).toLowerCase())) {
      errors.push({ field: 'role', message: 'الدور غير صالح' });
    }

    // Leave balances validation - COMMENTED OUT FOR NOW
    /*
    if (Array.isArray(payload.leave_balances)) {
      payload.leave_balances.forEach((item, idx) => {
        if (!item) return;
        if (!item.leave_type_id) {
          errors.push({ field: `leave_balances[${idx}].leave_type_id`, message: 'نوع الإجازة مطلوب' });
        }
        if (item.available_days == null || Number(item.available_days) < 0) {
          errors.push({ field: `leave_balances[${idx}].available_days`, message: 'الأيام المتاحة يجب أن تكون 0 أو أكثر' });
        }
        if (typeof item.one_time_used !== 'boolean') {
          errors.push({ field: `leave_balances[${idx}].one_time_used`, message: 'حقل الاستخدام لمرة واحدة يجب أن يكون true أو false' });
        }
      });
    }
    */

    return { valid: errors.length === 0, errors };
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!loginData.username.trim() || !loginData.password.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('تم تسجيل الدخول بنجاح!');
        if (data?.data?.token) localStorage.setItem('authToken', data.data.token);
        if (data?.data?.user) localStorage.setItem('authUser', JSON.stringify(data.data.user));
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(data.message || 'بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Prepare payload
    const basePayload = { ...registerData };
    basePayload.role = (basePayload.role || 'employee').toLowerCase();

    // Filter empty optional fields
    const cleaned = Object.fromEntries(
      Object.entries(basePayload).filter(([key, value]) => {
        // Keep required fields even if empty so validation catches them, 
        // but for now, we follow the original logic of filtering out empties 
        // while ensuring required fields are still checked by validateRegister.
        // I will slightly adjust the filtering logic to exclude only optional empty fields if possible, 
        // but sticking to the original developer's intent for now.
        return value !== '' && value !== null && value !== undefined;
      })
    );
    
    // Ensure all fields needed for validation are present, even if empty, before validation
    // For registration, 'full_name', 'username', 'password', 'phone', 'gender' are now considered required or validated.
    // The previous filtering was risky. Let's make sure the required fields are in `cleaned`.
    
    // Temporarily forcing required fields back if they were filtered out:
    const finalPayload = { ...cleaned, 
      full_name: registerData.full_name,
      username: registerData.username,
      password: registerData.password,
      phone: registerData.phone,
      college: registerData.college,
      department: registerData.department,
      administrative_position: registerData.administrative_position,
      degree: registerData.degree,
      gender: registerData.gender,
      role: registerData.role,
      leave_balances: registerData.leave_balances
    };


    // Validate per guide
    const { valid, errors } = validateRegister(finalPayload);
    if (!valid) {
      setError(errors.map(e => e.message).join(' - '));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Use the cleaned object for the API request (which removes empty optional fields)
        body: JSON.stringify(cleaned), 
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('تم إنشاء الحساب بنجاح!');
        if (data?.data?.token) localStorage.setItem('authToken', data.data.token);
        if (data?.data?.user) localStorage.setItem('authUser', JSON.stringify(data.data.user));
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else if (response.status === 409) {
        setError('اسم المستخدم موجود بالفعل. يرجى اختيار اسم آخر.');
      } else {
        const errorMessage = Array.isArray(data.errors) && data.errors.length > 0
          ? data.errors.map(err => (err.message || `${err.field}: غير صالح`)).join(' - ')
          : data.message || 'حدث خطأ في إنشاء الحساب.';
        setError(errorMessage);
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (formType, field, value) => {
    if (formType === 'login') {
      setLoginData(prev => ({ ...prev, [field]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [field]: value }));
    }
  };


  return (
    <div className="flex items-center justify-center p-6 bg-teal-50 rounded-3xl min-h-screen">
        {/* Login Form Card */}
        <div className={`w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl space-y-4 ${isLogin ? '' : 'hidden'}`}>
          <h2 className="text-2xl font-bold text-center text-teal-800">مرحبا!</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                اسم المستخدم
              </label>
              <input
                type="text"
                id="username"
                value={loginData.username}
                onChange={(e) => handleInputChange('login', 'username', e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                value={loginData.password}
                onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'دخول'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600">
            ليس لديك حساب؟{' '}
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              className="text-teal-600 font-semibold hover:underline"
            >
              تسجيل جديد
            </button>
          </p>
        </div>

        {/* Registration Form Card */}
        <div className={`w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl space-y-4 ${!isLogin ? '' : 'hidden'}`}>
          <h2 className="text-2xl font-bold text-center text-teal-800">تسجيل جديد</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}
          <form onSubmit={handleRegisterSubmit}>
            {/* Required fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  id="reg-fullName"
                  value={registerData.full_name}
                  onChange={(e) => handleInputChange('register', 'full_name', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المستخدم *
                </label>
                <input
                  type="text"
                  id="reg-username"
                  value={registerData.username}
                  onChange={(e) => handleInputChange('register', 'username', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            {/* The password field will be full-width as it is critical */}
            <div className="mt-4">
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور *
              </label>
              <input
                type="password"
                id="reg-password"
                value={registerData.password}
                onChange={(e) => handleInputChange('register', 'password', e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
                required
              />
            </div>
            {/* Phone and Gender in a grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف *
                </label>
                <input
                  type="text"
                  id="reg-phone"
                  value={registerData.phone}
                  onChange={(e) => handleInputChange('register', 'phone', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  disabled={isLoading}
                  required
                />
              </div>
              {/* NEW GENDER FIELD */}
              <div>
                <label htmlFor="reg-gender" className="block text-sm font-medium text-gray-700 mb-1">
                  النوع (الجنس) *
                </label>
                <select
                  id="reg-gender"
                  value={registerData.gender}
                  onChange={(e) => handleInputChange('register', 'gender', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  disabled={isLoading}
                  required
                >
                  <option value="">اختر النوع</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              {/* END NEW GENDER FIELD */}
            </div>
            {/* Administrative Position field */}
            <div className="mt-4">
              <label htmlFor="reg-administrative-position" className="block text-sm font-medium text-gray-700 mb-1">
                المنصب الاداري (اختياري)
              </label>
              <select
                id="reg-administrative-position"
                value={registerData.administrative_position}
                onChange={(e) => handleInputChange('register', 'administrative_position', e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
              >
                <option value="">اختر المنصب الاداري</option>
                {administrativePositionOptions.map((position) => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
            {/* Degree and College in a grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-degree" className="block text-sm font-medium text-gray-700 mb-1">
                  الدرجة العلمية (اختياري)
                </label>
                <select
                  id="reg-degree"
                  value={registerData.degree}
                  onChange={(e) => handleInputChange('register', 'degree', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  disabled={isLoading}
                >
                  <option value="">اختر الدرجة العلمية</option>
                  {degreeOptions.map((degree) => (
                    <option key={degree} value={degree}>{degree}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="reg-college" className="block text-sm font-medium text-gray-700 mb-1">
                  التوزيع
                </label>
                <select
                  id="reg-college"
                  value={registerData.college}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, college: e.target.value, department: '' }))}
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  disabled={isLoading}
                >
                  <option value="">اختر التوزيع</option>
                  {collegeOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Department field */}
            <div className="mt-4">
              <label htmlFor="reg-department" className="block text-sm font-medium text-gray-700 mb-1">
                القسم
              </label>
              <select
                id="reg-department"
                value={registerData.department}
                onChange={(e) => handleInputChange('register', 'department', e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading || departmentOptions.length === 0}
              >
                <option value="">{departmentOptions.length ? 'اختر القسم' : 'لا توجد أقسام متاحة'}</option>
                {departmentOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            
            {/* Role field */}
            <div className="mt-4">
              <label htmlFor="reg-role" className="block text-sm font-medium text-gray-700 mb-1">
                الدور (اختياري)
              </label>
              <select
                id="reg-role"
                value={registerData.role}
                onChange={(e) => handleInputChange('register', 'role', e.target.value.toLowerCase())}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
              >
                <option value="employee">موظف</option>
                <option value="manager">مسؤول</option>
                <option value="admin">مدير</option>
              </select>
            </div>
            
            {/* Leave Balances Section - COMMENTED OUT FOR NOW */}
            {/* 
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">رصيد الإجازات</h3>
              <div className="space-y-4">
                {registerData.leave_balances.map((balance, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        نوع الإجازة
                      </label>
                      <input
                        type="text"
                        value={balance.leave_type_id || ''}
                        onChange={(e) => {
                          const newBalances = [...registerData.leave_balances];
                          newBalances[index] = { ...newBalances[index], leave_type_id: e.target.value };
                          setRegisterData(prev => ({ ...prev, leave_balances: newBalances }));
                        }}
                        className="w-full px-3 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="مثال: إجازة سنوية"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الأيام المتاحة
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={balance.available_days || ''}
                        onChange={(e) => {
                          const newBalances = [...registerData.leave_balances];
                          newBalances[index] = { ...newBalances[index], available_days: parseInt(e.target.value) || 0 };
                          setRegisterData(prev => ({ ...prev, leave_balances: newBalances }));
                        }}
                        className="w-full px-3 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="0"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={balance.one_time_used || false}
                          onChange={(e) => {
                            const newBalances = [...registerData.leave_balances];
                            newBalances[index] = { ...newBalances[index], one_time_used: e.target.checked };
                            setRegisterData(prev => ({ ...prev, leave_balances: newBalances }));
                          }}
                          className="mr-2"
                          disabled={isLoading}
                        />
                        <span className="text-sm text-gray-700">استخدام لمرة واحدة</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newBalances = registerData.leave_balances.filter((_, i) => i !== index);
                          setRegisterData(prev => ({ ...prev, leave_balances: newBalances }));
                        }}
                        className="ml-2 text-red-600 hover:text-red-800"
                        disabled={isLoading}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setRegisterData(prev => ({
                      ...prev,
                      leave_balances: [...prev.leave_balances, { leave_type_id: '', available_days: 0, one_time_used: false }]
                    }));
                  }}
                  className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-colors"
                  disabled={isLoading}
                >
                  + إضافة رصيد إجازة
                </button>
              </div>
            </div>
            */}
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'جاري التسجيل...' : 'تسجيل'}
              </button>
            </div>
          </form>
          <p className="text-center text-sm text-gray-600">
            لديك حساب بالفعل؟{' '}
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              className="text-teal-600 font-semibold hover:underline"
            >
              دخول
            </button>
          </p>
        </div>
      </div>
  );
}