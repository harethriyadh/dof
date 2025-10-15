import React, { useMemo } from "react";
import '../Help.css';

export default function Help() {
  // FAQ data - in a real app, this could come from an API
  const faqData = useMemo(() => [
    {
      question: "كيف يمكنني تقديم طلب جديد؟",
      answer: "يمكنك تقديم طلب جديد بالضغط على زر \"طلب إجازة يوم كامل\" أو \"طلب إجازة جزئية\" في لوحة التحكم الرئيسية وملء النموذج."
    },
    {
      question: "أين يمكنني متابعة حالة طلباتي؟",
      answer: "يمكنك الانتقال إلى قسم \"طلباتي\" لمشاهدة جميع طلباتك وحالتها الحالية."
    },
    {
      question: "كيف أقوم بتحديث معلومات ملفي الشخصي؟",
      answer: "توجه إلى قسم \"الملف الشخصي\" لعرض وتعديل معلوماتك الشخصية."
    }
  ], []);

  const contactInfo = useMemo(() => ({
    email: "support@example.com",
    phone: "+964 770 987 6543"
  }), []);

  return (
    <div className="help-container">
      <div className="help-page-header">
        <h2>مركز المساعدة</h2>
        <p>دليل شامل لاستخدام النظام</p>
      </div>
      <div className="help-card">
        {faqData.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
        
        <div className="contact-support">
          <h4>هل تحتاج إلى مزيد من المساعدة؟</h4>
          <p>
            <i className="fas fa-envelope" aria-hidden="true"></i> 
            البريد الإلكتروني: <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
          </p>
          <p>
            <i className="fas fa-phone" aria-hidden="true"></i> 
            الهاتف: <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
