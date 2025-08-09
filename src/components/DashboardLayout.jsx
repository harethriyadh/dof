import React, { useState, useEffect } from "react";
import Home from "../pages/Home";
import AllRequests from "../pages/AllRequests";
import Profile from "../pages/Profile";
import Help from "../pages/Help";
import "../dashboard.css"; // Import the CSS for the layout

const sectionTitles = {
  dashboard: "الرئيسية",
  requests: "طلباتي",
  profile: "الملف الشخصي",
  help: "المساعدة",
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showFullDayModal, setShowFullDayModal] = useState(false);
  const [showPartTimeModal, setShowPartTimeModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pass open modal handlers to Home
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Home onOpenFullDayModal={() => setShowFullDayModal(true)} onOpenPartTimeModal={() => setShowPartTimeModal(true)} />;
      case "requests":
        return <AllRequests />;
      case "profile":
        return <Profile />;
      case "help":
        return <Help />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`} style={{ zIndex: 1002 }}>
        <button className="close-sidebar-btn" onClick={() => setSidebarOpen(false)}><i className="fas fa-times"></i></button>
        <div className="sidebar-header">
          <h2>لوحة التحكم</h2>
        </div>
        <nav className="sidebar-menu">
          <ul>
            <li><a href="#" className={activeSection === "dashboard" ? "active" : ""} onClick={e => { e.preventDefault(); setActiveSection("dashboard"); setSidebarOpen(false); }}><i className="fas fa-home"></i> الرئيسية</a></li>
            <li><a href="#" className={activeSection === "requests" ? "active" : ""} onClick={e => { e.preventDefault(); setActiveSection("requests"); setSidebarOpen(false); }}><i className="fas fa-clipboard-list"></i> طلباتي</a></li>
            <li><a href="#" className={activeSection === "profile" ? "active" : ""} onClick={e => { e.preventDefault(); setActiveSection("profile"); setSidebarOpen(false); }}><i className="fas fa-user"></i> الملف الشخصي</a></li>
            <li><a href="#" className={activeSection === "help" ? "active" : ""} onClick={e => { e.preventDefault(); setActiveSection("help"); setSidebarOpen(false); }}><i className="fas fa-question-circle"></i> المساعدة</a></li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <a href="#" className="logout-btn"><i className="fas fa-sign-out-alt"></i> تسجيل الخروج</a>
        </div>
      </aside>
      {sidebarOpen && <div className="sidebar-overlay visible" style={{  zIndex: 1001 }} onClick={() => setSidebarOpen(false)}></div>}
      <main className="main-content" style={{ zIndex: 1 }}>
        <header className="main-header">
          <button className="menu-toggle-btn" aria-label="فتح القائمة" onClick={() => setSidebarOpen(true)}><i className="fas fa-bars"></i></button>
          <h1 className="mainTile">{sectionTitles[activeSection]}</h1>
        </header>
        <section className="content-section active">
          {renderSection()}
        </section>
      </main>
      {/* Full Day Request Modal */}
      {showFullDayModal && (
        <div className="form-overlay visible" onClick={e => { if (e.target.classList.contains('form-overlay')) setShowFullDayModal(false); }}>
          <div className="form-container">
            <div className="form-header">
              <h3>تقديم طلب إجازة يوم كامل</h3>
              <button className="close-form-btn" onClick={() => setShowFullDayModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form>
              <div className="form-group">
                <label htmlFor="full-day-start-date">تاريخ بداية الإجازة:</label>
                <input type="date" id="full-day-start-date" name="startDate" required />
                <div className="error-message">الرجاء إدخال تاريخ بداية الإجازة.</div>
              </div>
              <div className="form-group">
                <label htmlFor="full-day-end-date">تاريخ نهاية الإجازة:</label>
                <input type="date" id="full-day-end-date" name="endDate" required />
                <div className="error-message">الرجاء إدخال تاريخ نهاية الإجازة.</div>
                <div className="error-message" id="full-day-date-range-error" style={{ display: 'none' }}>تاريخ النهاية يجب أن يكون بعد أو يساوي تاريخ البداية.</div>
              </div>
              <div className="form-group">
                <label>نوع الإجازة:</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="fullDayRequestType" value="annual" defaultChecked />
                    <span className="radio-custom"></span>
                    <span className="radio-text">سنوية</span>
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="fullDayRequestType" value="sick" />
                    <span className="radio-custom"></span>
                    <span className="radio-text">مرضية</span>
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="fullDayRequestType" value="emergency" />
                    <span className="radio-custom"></span>
                    <span className="radio-text">طارئة</span>
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="fullDayRequestType" value="unpaid" />
                    <span className="radio-custom"></span>
                    <span className="radio-text">بدون راتب</span>
                  </label>
                </div>
                <div className="error-message">الرجاء اختيار نوع الإجازة.</div>
              </div>
              <div className="form-group">
                <label htmlFor="full-day-request-description">ملاحظات إضافية (اختياري):</label>
                <textarea id="full-day-request-description" name="requestDescription" rows={4} placeholder="اذكر أي تفاصيل أو أسباب إضافية للإجازة..." />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary close-form-btn" onClick={() => setShowFullDayModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary">إرسال الطلب</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Part Time Request Modal */}
      {showPartTimeModal && (
        <div className="form-overlay visible" onClick={e => { if (e.target.classList.contains('form-overlay')) setShowPartTimeModal(false); }}>
          <div className="form-container">
            <div className="form-header">
              <h3>تقديم طلب إجازة جزئية</h3>
              <button className="close-form-btn" onClick={() => setShowPartTimeModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form>
              <div className="form-group">
                <label htmlFor="part-time-date">التاريخ:</label>
                <input type="date" id="part-time-date" name="requestDate" required />
                <div className="error-message">الرجاء إدخال التاريخ.</div>
              </div>
              <div className="form-group">
                <label htmlFor="part-time-start-time">وقت البدء:</label>
                <input type="time" id="part-time-start-time" name="startTime" required />
                <div className="error-message">الرجاء إدخال وقت البدء.</div>
              </div>
              <div className="form-group">
                <label htmlFor="part-time-end-time">وقت الانتهاء:</label>
                <input type="time" id="part-time-end-time" name="endTime" required />
                <div className="error-message">الرجاء إدخال وقت الانتهاء.</div>
                <div className="error-message" id="part-time-time-range-error" style={{ display: 'none' }}>وقت الانتهاء يجب أن يكون بعد وقت البدء.</div>
              </div>
              <div className="form-group">
                <label htmlFor="part-time-reason">السبب (اختياري):</label>
                <textarea id="part-time-reason" name="reason" rows={3} placeholder="اذكر سبب الإجازة الجزئية..." />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary close-form-btn" onClick={() => setShowPartTimeModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary">إرسال الطلب</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
