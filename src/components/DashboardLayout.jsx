import React, { useState, useEffect } from "react";
import Home from "../pages/Home";
import AllRequests from "../pages/AllRequests";
import RequestsManagement from "../pages/RequestsManagement";
import Profile from "../pages/Profile";
import Help from "../pages/Help";
import "../dashboard.css"; // Import the CSS for the layout

const sectionTitles = {
  dashboard: { title: "الرئيسية", icon: "fas fa-home" },
  requests: { title: "طلباتي", icon: "fas fa-clipboard-list" },
  management: { title: "إدارة الطلبات", icon: "fas fa-tasks" },
  profile: { title: "الملف الشخصي", icon: "fas fa-user" },
  help: { title: "المساعدة", icon: "fas fa-question-circle" },
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showFullDayModal, setShowFullDayModal] = useState(false);
  const [showPartTimeModal, setShowPartTimeModal] = useState(false);
  const [formData, setFormData] = useState({
    fullDay: {
      startDate: "",
      endDate: "",
      requestType: "daily",
      description: ""
    },
    partTime: {
      date: "",
      startTime: "",
      endTime: "",
      reason: ""
    }
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scrolling when modals are open
  useEffect(() => {
    if (showFullDayModal || showPartTimeModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showFullDayModal, showPartTimeModal]);

  // Form validation functions
  const validateFullDayForm = () => {
    const errors = {};
    const { startDate, endDate, requestType } = formData.fullDay;

    if (!startDate) {
      errors.startDate = "الرجاء إدخال تاريخ بداية الإجازة";
    }
    if (!endDate) {
      errors.endDate = "الرجاء إدخال تاريخ نهاية الإجازة";
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.dateRange = "تاريخ النهاية يجب أن يكون بعد أو يساوي تاريخ البداية";
    }
    if (!requestType) {
      errors.requestType = "الرجاء اختيار نوع الإجازة";
    }

    return errors;
  };

  const validatePartTimeForm = () => {
    const errors = {};
    const { date, startTime, endTime } = formData.partTime;

    if (!date) {
      errors.date = "الرجاء إدخال التاريخ";
    }
    if (!startTime) {
      errors.startTime = "الرجاء إدخال وقت البدء";
    }
    if (!endTime) {
      errors.endTime = "الرجاء إدخال وقت الانتهاء";
    }
    if (startTime && endTime && startTime >= endTime) {
      errors.timeRange = "وقت الانتهاء يجب أن يكون بعد وقت البدء";
    }

    return errors;
  };

  // Date input click handler to open calendar
  const handleDateInputClick = (e) => {
    // Prevent the default behavior and manually trigger the date picker
    e.preventDefault();
    
    // Try to use the modern showPicker() method
    if (e.target.showPicker) {
      e.target.showPicker();
    } else {
      // Fallback for older browsers - focus the input to trigger the native picker
      e.target.focus();
      // Simulate a click on the calendar icon for older browsers
      setTimeout(() => {
        e.target.click();
      }, 10);
    }
  };

  // Form submission handlers
  const handleFullDaySubmit = async (e) => {
    e.preventDefault();
    const errors = validateFullDayForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitMessage("تم إرسال طلب إجازة يوم كامل بنجاح!");
      console.log('Full Day Off Request Data:', formData.fullDay);
      
      // Reset form and close modal after success
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          fullDay: { startDate: "", endDate: "", requestType: "daily", description: "" }
        }));
        setSubmitMessage("");
        setShowFullDayModal(false);
      }, 2000);
    } catch {
      setSubmitMessage("حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePartTimeSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePartTimeForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitMessage("تم إرسال طلب إجازة جزئية بنجاح!");
      console.log('Part Time Off Request Data:', formData.partTime);
      
      // Reset form and close modal after success
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          partTime: { date: "", startTime: "", endTime: "", reason: "" }
        }));
        setSubmitMessage("");
        setShowPartTimeModal(false);
      }, 2000);
    } catch {
      setSubmitMessage("حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input change handlers
  const handleFullDayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      fullDay: { ...prev.fullDay, [field]: value }
    }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePartTimeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      partTime: { ...prev.partTime, [field]: value }
    }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Pass open modal handlers to Home
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Home onOpenFullDayModal={() => setShowFullDayModal(true)} onOpenPartTimeModal={() => setShowPartTimeModal(true)} />;
      case "requests":
        return <AllRequests />;
      case "management":
        return <RequestsManagement />;
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
        
        {/* Sidebar Content Area */}
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h2>لوحة التحكم</h2>
          </div>
          <nav className="sidebar-menu">
            <ul>
              <li><a href="#" className={activeSection === "dashboard" ? "active" : ""} onClick={e => { e.preventDefault(); setActiveSection("dashboard"); setSidebarOpen(false); }}><i className="fas fa-home"></i> الرئيسية</a></li>
              <li><a href="#" className={activeSection === "requests" ? "active" : ""} onClick={e => { e.preventDefault(); setActiveSection("requests"); setSidebarOpen(false); }}><i className="fas fa-clipboard-list"></i> طلباتي</a></li>
              <li><a href="#" className={activeSection === "management" ? "active" : ""} onClick={e => { e.preventDefault(); setActiveSection("management"); setSidebarOpen(false); }}><i className="fas fa-tasks"></i> إدارة الطلبات</a></li>
              <li><a href="#" className={activeSection === "profile" ? "active" : ""} onClick={e => { e.preventDefault(); setActiveSection("profile"); setSidebarOpen(false); }}><i className="fas fa-user"></i> الملف الشخصي</a></li>
              <li><a href="#" className={activeSection === "help" ? "active" : ""} onClick={e => { e.preventDefault(); setActiveSection("help"); setSidebarOpen(false); }}><i className="fas fa-question-circle"></i> المساعدة</a></li>
            </ul>
          </nav>
        </div>
        
        {/* Sidebar Footer - Always at bottom */}
        <div className="sidebar-footer">
          <a 
            href="#" 
            className="logout-btn" 
            onClick={(e) => { e.preventDefault(); window.location.href = '/auth'; }}
          >
            <i className="fas fa-sign-out-alt"></i> تسجيل الخروج
          </a>
          <div className="developer-footer">
            <span>Developed by: <a href="#" className="developer-link">Harith Riyadh</a></span>
          </div>
        </div>
      </aside>
      {sidebarOpen && <div className="sidebar-overlay visible" style={{  zIndex: 1001 }} onClick={() => setSidebarOpen(false)}></div>}
      <main className="main-content" style={{ zIndex: 1 }}>
        <header className="main-header">
          <button className="menu-toggle-btn" aria-label="فتح القائمة" onClick={() => setSidebarOpen(true)}><i className="fas fa-bars"></i></button>
          <button 
            className="logout-btn" 
            aria-label="تسجيل الخروج" 
            onClick={() => window.location.href = '/auth'}
            style={{
              marginLeft: 'auto',
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <i className="fas fa-sign-out-alt" style={{ marginLeft: '8px' }}></i>
            تسجيل الخروج
          </button>
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
              <h3>تقديم طلب إجازة</h3>
              <button className="close-form-btn" onClick={() => setShowFullDayModal(false)}><i className="fas fa-times"></i></button>
            </div>
            
            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes("خطأ") ? "error" : "success"}`}>
                {submitMessage}
              </div>
            )}
            
            <form onSubmit={handleFullDaySubmit}>
              <div className={`form-group ${formErrors.startDate ? "error" : ""}`}>
                <label htmlFor="full-day-start-date">تاريخ بداية الإجازة:</label>
                <input 
                  type="date" 
                  id="full-day-start-date" 
                  name="startDate" 
                  value={formData.fullDay.startDate}
                  onChange={(e) => handleFullDayChange("startDate", e.target.value)}
                  onClick={handleDateInputClick}
                  required 
                />
                {formErrors.startDate && <div className="error-message">{formErrors.startDate}</div>}
              </div>
              
              <div className={`form-group ${formErrors.endDate ? "error" : ""}`}>
                <label htmlFor="full-day-end-date">تاريخ نهاية الإجازة:</label>
                <input 
                  type="date" 
                  id="full-day-end-date" 
                  name="endDate" 
                  value={formData.fullDay.endDate}
                  onChange={(e) => handleFullDayChange("endDate", e.target.value)}
                  onClick={handleDateInputClick}
                  required 
                />
                {formErrors.endDate && <div className="error-message">{formErrors.endDate}</div>}
                {formErrors.dateRange && <div className="error-message">{formErrors.dateRange}</div>}
              </div>
              
              <div className={`form-group ${formErrors.requestType ? "error" : ""}`}>
                <label>نوع الإجازة:</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="fullDayRequestType" 
                      value="daily" 
                      checked={formData.fullDay.requestType === "daily"}
                      onChange={(e) => handleFullDayChange("requestType", e.target.value)}
                    />
                    <span className="radio-text">يومية</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="fullDayRequestType" 
                      value="sick" 
                      checked={formData.fullDay.requestType === "sick"}
                      onChange={(e) => handleFullDayChange("requestType", e.target.value)}
                    />
                    <span className="radio-text">مرضية</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="fullDayRequestType" 
                      value="study" 
                      checked={formData.fullDay.requestType === "study"}
                      onChange={(e) => handleFullDayChange("requestType", e.target.value)}
                    />
                    <span className="radio-text">دراسية</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="fullDayRequestType" 
                      value="hajj" 
                      checked={formData.fullDay.requestType === "hajj"}
                      onChange={(e) => handleFullDayChange("requestType", e.target.value)}
                    />
                    <span className="radio-text">حج او عمرة</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="fullDayRequestType" 
                      value="marriage" 
                      checked={formData.fullDay.requestType === "marriage"}
                      onChange={(e) => handleFullDayChange("requestType", e.target.value)}
                    />
                    <span className="radio-text">زواج</span>
                  </label>
                </div>
                {formErrors.requestType && <div className="error-message">{formErrors.requestType}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="full-day-request-description">ملاحظات إضافية (اختياري):</label>
                <textarea 
                  id="full-day-request-description" 
                  name="requestDescription" 
                  rows={4} 
                  placeholder="اذكر أي تفاصيل أو أسباب إضافية للإجازة..."
                  value={formData.fullDay.description}
                  onChange={(e) => handleFullDayChange("description", e.target.value)}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary close-form-btn" 
                  onClick={() => setShowFullDayModal(false)}
                  disabled={isSubmitting}
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                </button>
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
            
            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes("خطأ") ? "error" : "success"}`}>
                {submitMessage}
              </div>
            )}
            
            <form onSubmit={handlePartTimeSubmit}>
              <div className={`form-group ${formErrors.date ? "error" : ""}`}>
                <label htmlFor="part-time-date">التاريخ:</label>
                <input 
                  type="date" 
                  id="part-time-date" 
                  name="requestDate" 
                  value={formData.partTime.date}
                  onChange={(e) => handlePartTimeChange("date", e.target.value)}
                  onClick={handleDateInputClick}
                  required 
                />
                {formErrors.date && <div className="error-message">{formErrors.date}</div>}
              </div>
              
              <div className={`form-group ${formErrors.startTime ? "error" : ""}`}>
                <label htmlFor="part-time-start-time">وقت البدء:</label>
                <input 
                  type="time" 
                  id="part-time-start-time" 
                  name="startTime" 
                  value={formData.partTime.startTime}
                  onChange={(e) => handlePartTimeChange("startTime", e.target.value)}
                  required 
                />
                {formErrors.startTime && <div className="error-message">{formErrors.startTime}</div>}
              </div>
              
              <div className={`form-group ${formErrors.endTime ? "error" : ""}`}>
                <label htmlFor="part-time-end-time">وقت الانتهاء:</label>
                <input 
                  type="time" 
                  id="part-time-end-time" 
                  name="endTime" 
                  value={formData.partTime.endTime}
                  onChange={(e) => handlePartTimeChange("endTime", e.target.value)}
                  required 
                />
                {formErrors.endTime && <div className="error-message">{formErrors.endTime}</div>}
                {formErrors.timeRange && <div className="error-message">{formErrors.timeRange}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="part-time-reason">السبب (اختياري):</label>
                <textarea 
                  id="part-time-reason" 
                  name="reason" 
                  rows={3} 
                  placeholder="اذكر سبب الإجازة الجزئية..."
                  value={formData.partTime.reason}
                  onChange={(e) => handlePartTimeChange("reason", e.target.value)}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary close-form-btn" 
                  onClick={() => setShowPartTimeModal(false)}
                  disabled={isSubmitting}
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
