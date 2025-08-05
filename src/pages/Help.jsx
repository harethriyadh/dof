import React from "react";

export default function Help() {
  return (
    <div className="help-container">
      <h2>المساعدة</h2>
      <div className="help-card">
        <div className="faq-item">
          <h3>كيف يمكنني تقديم طلب جديد؟</h3>
          <p>يمكنك تقديم طلب جديد بالضغط على زر "طلب إجازة يوم كامل" أو "طلب إجازة جزئية" في لوحة التحكم الرئيسية وملء النموذج.</p>
        </div>
        <div className="faq-item">
          <h3>أين يمكنني متابعة حالة طلباتي؟</h3>
          <p>يمكنك الانتقال إلى قسم "طلباتي" لمشاهدة جميع طلباتك وحالتها الحالية.</p>
        </div>
        <div className="faq-item">
          <h3>كيف أقوم بتحديث معلومات ملفي الشخصي؟</h3>
          <p>توجه إلى قسم "الملف الشخصي" لعرض معلوماتك. (ميزة التعديل ستضاف لاحقًا)</p>
        </div>
        <div className="contact-support">
          <h4>هل تحتاج إلى مزيد من المساعدة؟</h4>
          <p><i className="fas fa-envelope"></i> البريد الإلكتروني: support@example.com</p>
          <p><i className="fas fa-phone"></i> الهاتف: +964 770 987 6543</p>
        </div>
      </div>
    </div>
  );
}
