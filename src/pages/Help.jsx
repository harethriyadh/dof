import React from "react";
import '../Help.css'; // Assuming you have a CSS file for styling


export default function Help() {
  return (
    <div className="help-container" style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>
      {/* <h2>المساعدة</h2> Removed duplicate title */}
      <div className="help-card" style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>
        <div className="faq-item">
          <h3 style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>كيف يمكنني تقديم طلب جديد؟</h3>
          <p style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>يمكنك تقديم طلب جديد بالضغط على زر "طلب إجازة يوم كامل" أو "طلب إجازة جزئية" في لوحة التحكم الرئيسية وملء النموذج.</p>
        </div>
        <div className="faq-item">
          <h3 style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>أين يمكنني متابعة حالة طلباتي؟</h3>
          <p style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>يمكنك الانتقال إلى قسم "طلباتي" لمشاهدة جميع طلباتك وحالتها الحالية.</p>
        </div>
        <div className="faq-item">
          <h3 style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>كيف أقوم بتحديث معلومات ملفي الشخصي؟</h3>
          <p style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>توجه إلى قسم "الملف الشخصي" لعرض معلوماتك. (ميزة التعديل ستضاف لاحقًا)</p>
        </div>
        <div className="contact-support">
          <h4 style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>هل تحتاج إلى مزيد من المساعدة؟</h4>
          <p style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}><i className="fas fa-envelope"></i> البريد الإلكتروني: support@example.com</p>
          <p style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}><i className="fas fa-phone"></i> الهاتف: +964 770 987 6543</p>
        </div>
      </div>
    </div>
  );
}
