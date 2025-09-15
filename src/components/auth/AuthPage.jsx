import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // Register form state
  const [registerData, setRegisterData] = useState({
    full_name: '',
    username: '',
    password: '',
    phone: '',
    college: '',
    department: '',
    role: 'employee',
    leave_balances: []
  });

  const navigate = useNavigate();

  // Fetches a list of leave types to populate the leave balances options
  // You would need to implement a separate API call here if leave types are dynamic.
  // For this example, we'll assume a hardcoded list for demonstration.
  const leaveTypes = [
    { id: 'annual', name: 'إجازة سنوية' },
    { id: 'sick', name: 'إجازة مرضية' }
  ];

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
        // Store the token in localStorage or a context for future API calls
        localStorage.setItem('dof_auth_token', data.data.token);
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

    // Frontend validation based on API spec
    const { full_name, username, password } = registerData;

    if (!full_name || full_name.length < 2 || full_name.length > 100) {
      setError('الاسم الكامل مطلوب ويجب أن يتكون من 2 إلى 100 حرف');
      setIsLoading(false);
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!username || username.length < 3 || username.length > 30 || !usernameRegex.test(username)) {
      setError('اسم المستخدم مطلوب ويجب أن يتكون من 3 إلى 30 حرفًا (أحرف إنجليزية، أرقام، أو _ فقط)');
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setError('كلمة المرور مطلوبة ويجب أن تتكون من 6 أحرف على الأقل');
      setIsLoading(false);
      return;
    }

    // Prepare data to send, including only filled optional fields
    const dataToSend = Object.fromEntries(
      Object.entries(registerData).filter(([_, value]) => value !== '' && value !== null && (Array.isArray(value) ? value.length > 0 : true))
    );

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('تم إنشاء الحساب بنجاح!');
        // Store the token and navigate
        localStorage.setItem('dof_auth_token', data.data.token);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else if (response.status === 409) {
        setError('اسم المستخدم موجود بالفعل. يرجى اختيار اسم آخر.');
      } else {
        // Handle validation errors or generic errors
        const errorMessage = data.errors && data.errors.length > 0
          ? data.errors.map(err => err.message).join('. ')
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

  const handleLeaveBalanceChange = (leaveTypeId, availableDays) => {
    setRegisterData(prev => {
      const existingLeave = prev.leave_balances.find(lb => lb.leave_type_id === leaveTypeId);
      if (availableDays <= 0) {
        // Remove from array if days is 0 or less
        return {
          ...prev,
          leave_balances: prev.leave_balances.filter(lb => lb.leave_type_id !== leaveTypeId)
        };
      }
      if (existingLeave) {
        return {
          ...prev,
          leave_balances: prev.leave_balances.map(lb =>
            lb.leave_type_id === leaveTypeId ? { ...lb, available_days: parseInt(availableDays, 10) } : lb
          )
        };
      } else {
        return {
          ...prev,
          leave_balances: [...prev.leave_balances, { leave_type_id: leaveTypeId, available_days: parseInt(availableDays, 10) }]
        };
      }
    });
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen p-4">
      <div className="flex items-center justify-center p-6 bg-teal-50 rounded-3xl shadow-2xl">
        {/* Login Form */}
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

        {/* Registration Form */}
        <div className={`w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl space-y-4 ${!isLogin ? '' : 'hidden'}`}>
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
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
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
            <div>
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
            <div>
              <label htmlFor="reg-phone" className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف (اختياري)
              </label>
              <input
                type="text"
                id="reg-phone"
                value={registerData.phone}
                onChange={(e) => handleInputChange('register', 'phone', e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="reg-college" className="block text-sm font-medium text-gray-700 mb-1">
                الكلية (اختياري)
              </label>
              <input
                type="text"
                id="reg-college"
                value={registerData.college}
                onChange={(e) => handleInputChange('register', 'college', e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="reg-department" className="block text-sm font-medium text-gray-700 mb-1">
                القسم (اختياري)
              </label>
              <input
                type="text"
                id="reg-department"
                value={registerData.department}
                onChange={(e) => handleInputChange('register', 'department', e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
              />
            </div>
            <div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                أرصدة الإجازات (اختياري)
              </label>
              {leaveTypes.map((type) => (
                <div key={type.id} className="mt-2 flex items-center gap-2">
                  <label htmlFor={`leave-${type.id}`} className="text-sm text-gray-600 w-1/2">
                    {type.name}
                  </label>
                  <input
                    type="number"
                    id={`leave-${type.id}`}
                    value={registerData.leave_balances.find(lb => lb.leave_type_id === type.id)?.available_days || ''}
                    onChange={(e) => handleLeaveBalanceChange(type.id, e.target.value)}
                    className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    min="0"
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري التسجيل...' : 'تسجيل'}
            </button>
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
    </div>
  );
}