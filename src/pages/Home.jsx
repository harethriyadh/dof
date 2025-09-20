import React, { useMemo, useState, useEffect } from "react";
import "../Home.css"; // Assuming this imports dashboard.css

// --- NEW UTILITY FUNCTION: Calculate marriage leave end date (14 workdays excluding Thu/Fri)
/**
 * تحسب تاريخ نهاية إجازة الزواج لمدة 14 يوماً، بدءاً من تاريخ البداية المحدد.
 * يستثني الحساب يومي الخميس (4) والجمعة (5) من عد الأيام الـ 14.
 * * @param {string} startDateString - تاريخ البداية المحدد في صيغة "YYYY-MM-DD".
 * @returns {{endDate: string, message: string} | null} - تاريخ النهاية المحسوب والرسالة المطلوبة.
 */
export const calculateMarriageLeaveEndDate = (startDateString) => {
    if (!startDateString) return null;

    // دالة مساعدة لتنسيق التاريخ إلى YYYY-MM-DD
    const toISODate = (date) => {
        const year = date.getFullYear();
        // getMonth() هي 0-indexed (يناير=0)، لذا نضيف 1
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    // تهيئة التاريخ: نستخدم منتصف اليوم (12:00) لتجنب مشاكل المناطق الزمنية (Timezone) التي قد تغير اليوم.
    let currentDate = new Date(startDateString);
    currentDate.setHours(12, 0, 0, 0); 
    
    let workingDaysCount = 0;
    const requiredDays = 14;

    // أيام الأسبوع في JavaScript: 0=الأحد، 1=الاثنين، 2=الثلاثاء، 3=الأربعاء، 4=الخميس، 5=الجمعة، 6=السبت
    // نستثني الخميس (4) والجمعة (5)

    while (workingDaysCount < requiredDays) {
        // التحقق من اليوم الحالي
        const dayOfWeek = currentDate.getDay(); 

        // إذا لم يكن خميس (4) ولم يكن جمعة (5)، فهو يوم عمل
        if (dayOfWeek !== 4 && dayOfWeek !== 5) {
            workingDaysCount++;
        }
        
        // إذا لم نصل إلى اليوم الرابع عشر المطلوب، نتقدم إلى اليوم التالي
        if (workingDaysCount < requiredDays) {
            currentDate.setDate(currentDate.getDate() + 1);
        }
        // إذا وصلنا لليوم الرابع عشر، يتوقف التكرار ويكون التاريخ الحالي هو تاريخ النهاية.
    }

    // التاريخ الحالي هو تاريخ نهاية الإجازة (اليوم الرابع عشر المحسوب)
    const endDate = toISODate(currentDate);

    // الرسالة المطلوبة
    const message = "تم حساب تاريخ نهاية الإجازة تلقائياً بناءً على نوع الإجازة (زواج) ليكون 14 يوماً عمل (باستثناء الخميس والجمعة).";

    return { endDate, message };
};
// --- END NEW UTILITY FUNCTION

export default function Home({ onOpenFullDayModal, onOpenPartTimeModal }) {
  // State management for holiday section
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [currentYear, setCurrentYear] = useState(2025);

  // Holiday data for each month and year
  const holidays = {
    '1-2025': [
      {
        name: "رأس السنة الميلادية",
        start_date: "2025-01-01",
        end_date: "2025-01-01",
        description: "احتفال ببداية السنة الجديدة"
      },
      {
        name: "يوم الجيش العراقي",
        start_date: "2025-01-06",
        end_date: "2025-01-06",
        description: "الاحتفال بتأسيس الجيش العراقي"
      }
    ],
    '2-2025': [],
    '3-2025': [
      {
        name: "يوم نوروز",
        start_date: "2025-03-21",
        end_date: "2025-03-21",
        description: "يوم رأس السنة الكردية وعيد الربيع"
      }
    ],
    '4-2025': [
      {
        name: "عيد الفطر",
        start_date: "2025-04-01",
        end_date: "2025-04-03",
        description: "عيد الفطر المبارك بعد شهر رمضان"
      }
    ],
    '5-2025': [
      {
        name: "عيد العمال",
        start_date: "2025-05-01",
        end_date: "2025-05-01",
        description: "يوم العمال العالمي"
      }
    ],
    // ******************************************************
    // * تم تصحيح الخطأ هنا (كان '6-2) وأصبح '6-2025' بشكل صحيح *
    // ******************************************************
    '6-2025': [ 
      {
        name: "عيد الأضحى",
        start_date: "2025-06-08",
        end_date: "2025-06-11",
        description: "عيد الأضحى المبارك"
      }
    ],
    '7-2025': [
      {
        name: "رأس السنة الهجرية",
        start_date: "2025-07-01",
        end_date: "2025-07-01",
        description: "بداية السنة الهجرية الجديدة"
      },
      {
        name: "ثورة 14 تموز",
        start_date: "2025-07-14",
        end_date: "2025-07-14",
        description: "ذكرى ثورة 14 تموز وتأسيس الجمهورية العراقية"
      }
    ],
    '8-2025': [],
    '9-2025': [
      {
        name: "عيد المولد النبوي",
        start_date: "2025-09-05",
        end_date: "2025-09-05",
        description: "مولد النبي محمد صلى الله عليه وسلم"
      }
    ],
    '10-2025': [
      {
        name: "عيد وطني عراقي",
        start_date: "2025-10-03",
        end_date: "2025-10-03",
        description: "الاحتفال بيوم الاستقلال عن الانتداب البريطاني"
      }
    ],
    '11-2025': [],
    '12-2025': [
      {
        name: "عيد الميلاد المجيد",
        start_date: "2025-12-25",
        end_date: "2025-12-25",
        description: "عيد الميلاد المجيد"
      }
    ]
  };

  // Arabic month names
  const arabicMonths = {
    1: "يناير",
    2: "فبراير",
    3: "مارس",
    4: "أبريل",
    5: "مايو",
    6: "يونيو",
    7: "يوليو",
    8: "أغسطس",
    9: "سبتمبر",
    10: "أكتوبر",
    11: "نوفمبر",
    12: "ديسمبر"
  };

  // Set current month and year on component mount
  useEffect(() => {
    const now = new Date();
    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
  }, []);

  // Get current month holidays
  const currentMonthHolidays = holidays[`${currentMonth}-${currentYear}`] || [];

  // Handle holiday click
  const handleHolidayClick = (holiday) => {
    setSelectedHoliday(holiday);
    setIsModalOpen(true);
  };

  // Handle work message click
  const handleWorkMessageClick = () => {
    setSelectedHoliday(null);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHoliday(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = arabicMonths[date.getMonth() + 1];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Mock data - in a real app, this would come from props or context
  const lastRequestStatus = "approved";

  // Memoized status class calculation
  const statusClass = useMemo(() => {
    switch (lastRequestStatus) {
      case "rejected":
        return "status-rejected";
      case "pending":
      default:
        return "status-approved";
    }
  }, [lastRequestStatus]);

  // Memoized status message generation
  const statusMessage = useMemo(() => {
    const isOneDay = true; // Placeholder: true for one-day leave, false for a range.
    const startDate = "9/4";
    const endDate = "9/7";

    const messages = {
      approved: isOneDay
        ? `تم قبول اجازتك ليوم ${startDate}`
        : `تم قبول اجازتك من يوم ${startDate} إلى يوم ${endDate}`,
      rejected: isOneDay
        ? `تم رفض اجازتك ليوم ${startDate}`
        : `تم رفض اجازتك من يوم ${startDate} إلى يوم ${endDate}`,
      pending: isOneDay
        ? `اجازتك ليوم ${startDate} قيد المراجعة`
        : `اجازتك من يوم ${startDate} إلى يوم ${endDate} قيد المراجعة`
    };

    return messages[lastRequestStatus] || messages.pending;
  }, [lastRequestStatus]);

  // Memoized leave balance data
  const leaveBalance = useMemo(() => ({
    availableDays: 20,
    availableHours: 160
  }), []);

  return (
    <div>
      <div className="page-welcome">
        <h2>مرحباً بك في لوحة التحكم</h2>
        <p>إدارة طلبات الإجازة والمراقبة اليومية</p>
      </div>
      <div className="cards-section">
        {/* The Last Request Status Card: */}
        <div className={`card status-last-request card-hover ${statusClass}`}>
          <div className="card-content">
            <span className="request-status-message">
              {statusMessage}
            </span>
          </div>
        </div>

        {/* Leave Balance Card */}
        <div className="card leave-balance-card-three-col card-hover">
          <div className="summary-section">
            <div className="summary-main-value">
              الاجازات<br />المتـــاحة
            </div>
          </div>
          <div className="summary-section">
            <div className="summary-main-value summary-main-value-green">
              {leaveBalance.availableDays}
            </div>
            <div className="summary-label">أيام الإجازة</div>
          </div>
          <div className="summary-section no-border">
            <div className="summary-main-value summary-main-value-orange">
              {leaveBalance.availableHours}
            </div>
            <div className="summary-label">ساعات الإجازة</div>
          </div>
        </div>

        {/* START OF NEW WRAPPER GROUP FOR SIDE-BY-SIDE LAYOUT */}
        <div className="request-holiday-group">

          {/* The New Request Card: */}
          <div className="card new-request-card card-hover">
            <div className="card-content">
              <h3 className="card-title">إنشاء طلب جديد</h3>
              <button
                className="new-request-btn"
                id="open-full-day-request-form-btn"
                onClick={onOpenFullDayModal}
                aria-label="فتح نموذج طلب إجازة يوم كامل"
              >
                طلب إجازة
              </button>
              <button
                className="new-request-btn new-request-btn-secondary"
                id="open-part-time-request-form-btn"
                onClick={onOpenPartTimeModal}
                aria-label="فتح نموذج طلب إجازة جزئية"
              >
                <span className="icon" aria-hidden="true">🕒</span>  طلب إجازة جزئية
              </button>
            </div>
          </div>

          {/* Holiday Card */}
          <div className="card holiday-card card-hover" style={{ direction: 'rtl' }}>
            <div className="card-content">
              {/* Corrected month display using the object */}
              <h3 className="card-title"> الإجازات الرسمية لهذا الشهر - {arabicMonths[currentMonth]}/{currentYear}</h3> 
              
              <div className="holiday-grid">
                {currentMonthHolidays.length > 0 ? (
                  currentMonthHolidays.map((holiday, index) => (
                    <div
                      key={index}
                      className={`holiday-box ${index % 2 === 0 ? 'rotate-right' : 'rotate-left'}`}
                      onClick={() => handleHolidayClick(holiday)}
                    >
                      <h3 className="holiday-name">{holiday.name}</h3>
                      <p className="holiday-date">
                        {holiday.start_date === holiday.end_date
                          ? formatDate(holiday.start_date)
                          : `${formatDate(holiday.start_date)} - ${formatDate(holiday.end_date)}`
                        }
                      </p>
                      <p className="holiday-description">{holiday.description}</p>
                    </div>
                  ))
                ) : (
                  <div
                    className="no-holiday-box rotate-right"
                    onClick={handleWorkMessageClick}
                  >
                    <h3 className="no-holiday-title">لا توجد إجازات رسمية</h3>
                    <p className="no-holiday-message">هذا الشهر مليء بالعمل والإنجازات! 💪</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* END OF NEW WRAPPER GROUP */}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>

            {selectedHoliday ? (
              <div className="holiday-modal">
                <div className="holiday-slideshow">
                  {[...Array(5)].map((_, index) => (
                    <img
                      key={index}
                      src={`https://picsum.photos/400/300?random=${index + 1}`}
                      alt={`صورة ${index + 1}`}
                      className="slideshow-image"
                      style={{
                        animationDelay: `${index * 0.2}s`
                      }}
                    />
                  ))}
                </div>
                <div className="holiday-details">
                  <h2 className="modal-holiday-name">{selectedHoliday.name}</h2>
                  <p className="modal-holiday-date">
                    {selectedHoliday.start_date === selectedHoliday.end_date
                      ? formatDate(selectedHoliday.start_date)
                      : `${formatDate(selectedHoliday.start_date)} - ${formatDate(selectedHoliday.end_date)}`
                    }
                  </p>
                  <p className="modal-holiday-description">{selectedHoliday.description}</p>
                </div>
              </div>
            ) : (
              <div className="work-message-modal">
                <div className="work-message-content">
                  <p>🎯 العمل الجاد هو مفتاح النجاح!</p>
                  <p>💪 كل يوم عمل هو خطوة نحو تحقيق أهدافك</p>
                  <p>🌟 استغل هذا الشهر لتحقيق إنجازات رائعة</p>
                  <p>🚀 أنت قادر على تحقيق أهدافك!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}