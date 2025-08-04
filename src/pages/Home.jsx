
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 24 }}>
      <h1>الصفحة الرئيسية</h1>
      <p>مرحبًا بك في الصفحة الرئيسية!</p>
      <button
        style={{ marginTop: 24, padding: '10px 24px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontSize: 16 }}
        onClick={() => navigate('/login')}
      >
        تسجيل الدخول
      </button>
    </div>
  );
}
