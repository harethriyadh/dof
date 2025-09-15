import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from "./components/DashboardLayout.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import AuthPage from "./components/auth/AuthPage.jsx";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'Tajawal, Cairo, Arial, sans-serif'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>
            حدث خطأ غير متوقع
          </h2>
          <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
            يرجى تحديث الصفحة أو المحاولة مرة أخرى لاحقاً
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            تحديث الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'Tajawal, Cairo, Arial, sans-serif'
          }}>
            <LoadingSpinner size="large" />
          </div>
        }>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard/*" element={<DashboardLayout />} />
            <Route path="/" element={<Navigate to="/auth" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
