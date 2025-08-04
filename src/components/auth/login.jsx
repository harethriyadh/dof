import React, { useState } from "react";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }
    // Simulate login
    if (username === "testuser" && password === "123456") {
      alert("تم تسجيل الدخول بنجاح!");
      // Redirect or set auth state here
    } else {
      setError("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2 style={{ textAlign: "center" }}>تسجيل الدخول</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>اسم المستخدم</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            placeholder="اسم المستخدم"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            placeholder="******"
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ width: "100%", padding: 10, background: "#1976d2", color: "#fff", border: "none", borderRadius: 4 }}>
          دخول
        </button>
      </form>
    </div>
  );
}
