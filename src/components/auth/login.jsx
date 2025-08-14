import React, { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (username === "testuser" && password === "123456") {
        setSuccess("تم تسجيل الدخول بنجاح!");
        // Redirect or set auth state here
        setTimeout(() => {
          // Simulate redirect
          console.log("User logged in successfully");
        }, 1500);
      } else {
        setError("بيانات الدخول غير صحيحة");
      }
    } catch {
      setError("حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: "40px auto", 
      padding: 24, 
      border: "1px solid #eee", 
      borderRadius: 8,
      backgroundColor: "#fff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px", color: "#333" }}>تسجيل الدخول</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="username" style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            اسم المستخدم
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "12px", 
              border: "1px solid #ddd", 
              borderRadius: "4px",
              fontSize: "16px",
              transition: "border-color 0.3s ease"
            }}
            placeholder="اسم المستخدم"
            disabled={isLoading}
            required
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            كلمة المرور
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "12px", 
              border: "1px solid #ddd", 
              borderRadius: "4px",
              fontSize: "16px",
              transition: "border-color 0.3s ease"
            }}
            placeholder="******"
            disabled={isLoading}
            required
          />
        </div>
        
        {error && (
          <div style={{ 
            color: "#dc3545", 
            marginBottom: 12, 
            padding: "8px 12px",
            backgroundColor: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ 
            color: "#155724", 
            marginBottom: 12, 
            padding: "8px 12px",
            backgroundColor: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: "4px",
            fontSize: "14px"
          }}>
            {success}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: "100%", 
            padding: "12px", 
            background: isLoading ? "#6c757d" : "#1976d2", 
            color: "#fff", 
            border: "none", 
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease"
          }}
        >
          {isLoading ? "جاري تسجيل الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
