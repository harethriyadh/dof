import React, { useState, useEffect, useMemo } from "react";
import AllRequests from "../pages/AllRequests";
import RequestsManagement from "../pages/RequestsManagement";
import Profile from "../pages/Profile";
import Help from "../pages/Help";
import "../dashboard.css"; // Import the CSS for the layout
import "../Home.css"; // Import Home CSS

// --- NEW UTILITY FUNCTION: Calculate motherhood leave end date (51 workdays excluding Thu/Fri)
/**
 * تحسب تاريخ نهاية إجازة الأمومة لمدة 51 يوماً، بدءاً من تاريخ البداية المحدد.
 * يستثني الحساب يومي الخميس (4) والجمعة (5) من عد الأيام الـ 51.
 * @param {string} startDateString - تاريخ البداية المحدد في صيغة "YYYY-MM-DD".
 * @returns {{endDate: string, message: string} | null} - تاريخ النهاية المحسوب والرسالة المطلوبة.
 */
export const calculateMotherhoodLeaveEndDate = (startDateString) => {
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
    const requiredDays = 51;

    // أيام الأسبوع في JavaScript: 0=الأحد، 1=الاثنين، 2=الثلاثاء، 3=الأربعاء، 4=الخميس، 5=الجمعة، 6=السبت
    // نستثني الخميس (4) والجمعة (5)

    while (workingDaysCount < requiredDays) {
        // التحقق من اليوم الحالي
        const dayOfWeek = currentDate.getDay(); 

        // إذا لم يكن خميس (4) ولم يكن جمعة (5)، فهو يوم عمل
        if (dayOfWeek !== 4 && dayOfWeek !== 5) {
            workingDaysCount++;
        }
        
        // إذا لم نصل إلى اليوم الحادي والخمسين المطلوب، نتقدم إلى اليوم التالي
        if (workingDaysCount < requiredDays) {
            currentDate.setDate(currentDate.getDate() + 1);
        }
        // إذا وصلنا لليوم الحادي والخمسين، يتوقف التكرار ويكون التاريخ الحالي هو تاريخ النهاية.
    }

    // التاريخ الحالي هو تاريخ نهاية الإجازة (اليوم الحادي والخمسين المحسوب)
    const endDate = toISODate(currentDate);

    // الرسالة المطلوبة
    const message = "تم حساب تاريخ نهاية الإجازة تلقائياً بناءً على نوع الإجازة (أمومة) ليكون 51 يوماً عمل (باستثناء الخميس والجمعة).";

    return { endDate, message };
};
// --- END NEW UTILITY FUNCTION

// --- NEW UTILITY FUNCTION: Calculate marriage leave end date (14 workdays excluding Thu/Fri)
/**
 * تحسب تاريخ نهاية إجازة الزواج لمدة 14 يوماً، بدءاً من تاريخ البداية المحدد.
 * يستثني الحساب يومي الخميس (4) والجمعة (5) من عد الأيام الـ 14.
 * @param {string} startDateString - تاريخ البداية المحدد في صيغة "YYYY-MM-DD".
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

// --- NEW UTILITY FUNCTION: Calculate birth leave end date (21 workdays excluding Thu/Fri)
/**
 * تحسب تاريخ نهاية إجازة الولادة لمدة 21 يوماً، بدءاً من تاريخ البداية المحدد.
 * يستثني الحساب يومي الخميس (4) والجمعة (5) من عد الأيام الـ 21.
 * @param {string} startDateString - تاريخ البداية المحدد في صيغة "YYYY-MM-DD".
 * @returns {{endDate: string, message: string} | null} - تاريخ النهاية المحسوب والرسالة المطلوبة.
 */
export const calculateBirthLeaveEndDate = (startDateString) => {
    if (!startDateString) return null;

    const toISODate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    let currentDate = new Date(startDateString);
    currentDate.setHours(12, 0, 0, 0); 
    
    let workingDaysCount = 0;
    const requiredDays = 21;

    while (workingDaysCount < requiredDays) {
        const dayOfWeek = currentDate.getDay(); 
        if (dayOfWeek !== 4 && dayOfWeek !== 5) {
            workingDaysCount++;
        }
        if (workingDaysCount < requiredDays) {
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    const endDate = toISODate(currentDate);
    const message = "تم حساب تاريخ نهاية الإجازة تلقائياً بناءً على نوع الإجازة (ولادة) ليكون 21 يوماً عمل (باستثناء الخميس والجمعة).";

    return { endDate, message };
};
// --- END NEW UTILITY FUNCTION

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
  // NEW STATE: To hold the calculated vacation summary message
  const [vacationSummary, setVacationSummary] = useState("");
  // NEW STATE: When study leave range > 15 working days -> show admin message and hide date fields
  const [showStudyAdminMessage, setShowStudyAdminMessage] = useState(false);
  // NEW STATE: lock the endDate when marriage-end auto-calculated
  const [marriageAutoEnd, setMarriageAutoEnd] = useState(false);
  // NEW STATE: lock the endDate when motherhood-end auto-calculated
  const [motherhoodAutoEnd, setMotherhoodAutoEnd] = useState(false);
  // NEW STATE: lock the endDate when birth-end auto-calculated
  const [birthAutoEnd, setBirthAutoEnd] = useState(false);
  // NEW STATE: To store the user's gender, full name, and department
  const [userData, setUserData] = useState(null);
  
  // NEW STATE: To store user's leave balance data
  const [userLeaveData, setUserLeaveData] = useState({
    availableDays: 0,
    availableHours: 0,
    totalDays: 0,
    totalHours: 0,
    usedDays: 0,
    usedHours: 0
  });
  const [leaveDataLoading, setLeaveDataLoading] = useState(false);

  // Helper function to check if user has management access (admin or manager)
  const hasManagementAccess = () => {
    if (!userData || !userData.role) return false;
    return userData.role.toLowerCase() === 'admin' || 
           userData.role.toLowerCase() === 'manager' ||
           userData.role.toLowerCase() === 'super admin';
  };

  // Function to fetch user-specific leave requests and calculate balance
  const fetchUserLeaveData = async () => {
    if (!userData?.id) return;
    
    setLeaveDataLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error("Auth token not found");
        return;
      }

      // Fetch user's leave requests
      const response = await fetch("http://localhost:3000/api/leave-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leave requests');
      }

      const result = await response.json();
      
      if (result.success) {
        const userRequests = result.data.filter(req => 
          req.user_id === userData.id || 
          req.employee_name === userData.full_name ||
          req.employee_name === userData.username
        );

        // Calculate leave balance
        const totalDaysPerYear = 30; // Assuming 30 days per year
        const totalHoursPerYear = 240; // Assuming 8 hours per day * 30 days

        // Calculate used days and hours from approved requests
        const usedDays = userRequests
          .filter(req => req.status === 'approved')
          .reduce((total, req) => total + (parseInt(req.number_of_days) || 0), 0);

        const usedHours = userRequests
          .filter(req => req.status === 'approved')
          .reduce((total, req) => {
            const days = parseInt(req.number_of_days) || 0;
            return total + (days * 8); // Assuming 8 hours per day
          }, 0);

        const availableDays = Math.max(0, totalDaysPerYear - usedDays);
        const availableHours = Math.max(0, totalHoursPerYear - usedHours);

        setUserLeaveData({
          availableDays,
          availableHours,
          totalDays: totalDaysPerYear,
          totalHours: totalHoursPerYear,
          usedDays,
          usedHours
        });

        console.log('User leave data calculated:', {
          totalDays: totalDaysPerYear,
          usedDays,
          availableDays,
          totalHours: totalHoursPerYear,
          usedHours,
          availableHours
        });
      }
    } catch (error) {
      console.error("Error fetching user leave data:", error);
      // Set default values on error
      setUserLeaveData({
        availableDays: 20,
        availableHours: 160,
        totalDays: 30,
        totalHours: 240,
        usedDays: 10,
        usedHours: 80
      });
    } finally {
      setLeaveDataLoading(false);
    }
  };

  // Utility to get today's date in yyyy-mm-dd format for the 'min' attribute
  const todayIso = new Date().toISOString().split('T')[0];
  
  // Home component state management for holiday section
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [currentYear, setCurrentYear] = useState(2025);
  
  // NEW useEffect hook to fetch user profile and determine gender on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error("Auth token not found in local storage.");
          return;
        }

        const response = await fetch('http://localhost:3000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUserData(data?.data?.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    fetchUserProfile();
  }, []); // Run only once on component mount

  // Fetch user leave data when userData is available
  useEffect(() => {
    if (userData?.id) {
      fetchUserLeaveData();
    }
  }, [userData?.id]); // Run when userData.id changes

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

  // Set current month and year on component mount
  useEffect(() => {
    const now = new Date();
    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
  }, []);

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

  // Memoized leave balance data - now using real user data
  const leaveBalance = useMemo(() => ({
    availableDays: userLeaveData.availableDays,
    availableHours: userLeaveData.availableHours
  }), [userLeaveData.availableDays, userLeaveData.availableHours]);

  // Utility: check if a yyyy-mm-dd string falls on Thursday (4) or Friday (5)
  const isThursdayOrFriday = (isoDateString) => {
    if (!isoDateString) return false;
    // Use replace to ensure consistent parsing across browsers
    const date = new Date(isoDateString.replace(/-/g, '/'));
    const dayIndex = date.getDay(); // 0=Sun ... 6=Sat
    // Assuming the work week is Sat-Wed (0-3), and Thu/Fri (4/5) are the weekend
    return dayIndex === 4 || dayIndex === 5; 
  };
  
  /**
   * NEW FUNCTION: Calculates the number of working days between two dates
   * excluding Thursday (4) and Friday (5).
   */
  const calculateVacationDays = (start, end) => {
    if (!start || !end) return 0;

    const startDate = new Date(start.replace(/-/g, '/'));
    const endDate = new Date(end.replace(/-/g, '/'));

    if (startDate > endDate) return 0;

    let totalDays = 0;
    let currentDate = startDate;

    while (currentDate <= endDate) {
        const dayIndex = currentDate.getDay(); // 0=Sun ... 6=Sat
        // Check if it's NOT Thursday (4) or Friday (5)
        if (dayIndex !== 4 && dayIndex !== 5) {
            totalDays++;
        }
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalDays;
  };

  /**
   * NEW FUNCTION: Calculate calendar days inclusive between two yyyy-mm-dd dates.
   * Used for the study-leave >15-days check (calendar days).
   */
  const calculateCalendarDaysInclusive = (startIso, endIso) => {
    if (!startIso || !endIso) return 0;
    const s = new Date(startIso.replace(/-/g, '/'));
    const e = new Date(endIso.replace(/-/g, '/'));
    if (s > e) return 0;
    // +1 to include both start and end as days
    const diff = Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
  };

  // Effect to update the vacation summary message whenever dates change
  useEffect(() => {
    const { startDate, endDate, requestType } = formData.fullDay;

    // If study > 15 flagged, we clear summary (we show admin message instead)
    if (showStudyAdminMessage) {
      setVacationSummary("");
      return;
    }

    if (startDate && endDate && new Date(startDate.replace(/-/g, '/')) <= new Date(endDate.replace(/-/g, '/'))) {
        const days = calculateVacationDays(startDate, endDate);
        
        // Format dates for display (e.g., 2025-07-06 to 6/7/2025)
        const formatDisplayDate = (isoDate) => {
            const [year, month, day] = isoDate.split('-');
            return `${parseInt(day)}/${parseInt(month)}/${year}`;
        };

        const formattedStart = formatDisplayDate(startDate);
        const formattedEnd = formatDisplayDate(endDate);

        if (requestType === "marriage" && startDate) {
            // For marriage leave, prefer the stable marriage message (14 workdays)
            const marriageCalculation = calculateMarriageLeaveEndDate(startDate);
            if (marriageCalculation && marriageCalculation.endDate) {
              const formattedMarriageEnd = formatDisplayDate(marriageCalculation.endDate);
              setVacationSummary(`إجازة زواج: 14 يوم عمل تبدأ من ${formattedStart} وتنتهي في ${formattedMarriageEnd}.`);
            } else {
              setVacationSummary("");
            }
        } else if (requestType === "motherhood" && startDate) {
            // For motherhood leave, prefer the stable motherhood message (51 workdays)
            const motherhoodCalculation = calculateMotherhoodLeaveEndDate(startDate);
            if (motherhoodCalculation && motherhoodCalculation.endDate) {
              const formattedMotherhoodEnd = formatDisplayDate(motherhoodCalculation.endDate);
              setVacationSummary(`إجازة أمومة: 51 يوم عمل تبدأ من ${formattedStart} وتنتهي في ${formattedMotherhoodEnd}.`);
            } else {
              setVacationSummary("");
            }
        } else if (requestType === "birth" && startDate) {
            // For birth leave, prefer the stable birth message (21 workdays)
            const birthCalculation = calculateBirthLeaveEndDate(startDate);
            if (birthCalculation && birthCalculation.endDate) {
                const formattedBirthEnd = formatDisplayDate(birthCalculation.endDate);
                setVacationSummary(`إجازة ولادة: 21 يوم عمل تبدأ من ${formattedStart} وتنتهي في ${formattedBirthEnd}.`);
            } else {
                setVacationSummary("");
            }
        } else {
            if (days > 0) {
                setVacationSummary(`سوف تكون إجازتك ${days} أيام عمل من تاريخ ${formattedStart} إلى ${formattedEnd}.`);
            } else if (days === 0 && new Date(startDate.replace(/-/g, '/')).getTime() === new Date(endDate.replace(/-/g, '/')).getTime()) {
                setVacationSummary("هذا اليوم إجازة رسمية (خميس أو جمعة) أو أن المدة المختارة لا تتضمن أيام عمل.");
            } else {
                 setVacationSummary("الرجاء اختيار نطاق تاريخ صالح.");
            }
        }
    } else {
        setVacationSummary("");
    }
  }, [formData.fullDay.startDate, formData.fullDay.endDate, formData.fullDay.requestType, showStudyAdminMessage]);

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
    if (startDate && endDate && new Date(startDate.replace(/-/g, '/')) > new Date(endDate.replace(/-/g, '/'))) {
      errors.dateRange = "تاريخ النهاية يجب أن يكون بعد أو يساوي تاريخ البداية";
    }
    if (!requestType) {
      errors.requestType = "الرجاء اختيار نوع الإجازة";
    }
    // Re-check validity against the unselectable days before submission
    if (startDate && isThursdayOrFriday(startDate)) {
        errors.startDate = "لا يمكن اختيار يومي الخميس أو الجمعة";
    }
    if (endDate && isThursdayOrFriday(endDate)) {
        errors.endDate = "لا يمكن اختيار يومي الخميس أو الجمعة";
    }

    // Crucial check: if days is 0, but dates are valid, we should not allow submission unless it's a single, valid day.
    const workingDays = calculateVacationDays(startDate, endDate);
    if (workingDays === 0 && (new Date(startDate.replace(/-/g, '/')).getTime() <= new Date(endDate.replace(/-/g, '/')).getTime())) {
        if (startDate && endDate) {
             errors.dateRange = "المدة المختارة لا تحتوي على أيام عمل (قد تكون خميس وجمعة فقط).";
        }
    }

    // NEW: If study leave AND working days > 15 -> require direct administrative request
    if (requestType === "study" && startDate && endDate) {
      const working = calculateVacationDays(startDate, endDate);
      if (working > 15) {
        errors.requestType = "عزيزي منتسب جامعة السراج, للحصول على اجزة اكثر من 15 يوما, يجب ان تقدم طلبا بشكل مباشر الى قسم الادارية";
      }
    }

    return errors;
  };

  // Guard date changes for Full Day to prevent Thu/Fri selection
  const handleFullDayDateChange = (field, value) => {
    // Clear any previous general date range error
    setFormErrors(prev => ({ ...prev, dateRange: "" }));

    if (isThursdayOrFriday(value)) {
      const fieldLabel = field === "startDate" ? "تاريخ بداية الإجازة" : "تاريخ نهاية الإجازة";
      setFormErrors(prev => ({
        ...prev,
        [field]: `${fieldLabel}: لا يمكن اختيار يومي الخميس أو الجمعة`
      }));
      setFormData(prev => ({
        ...prev,
        fullDay: { ...prev.fullDay, [field]: "" } // Clear the invalid date
      }));
      return;
    }
    
    // Special-case: if changing startDate while type=marriage => auto-calc endDate and lock it
    if (field === "startDate" && formData.fullDay.requestType === "marriage") {
      // compute marriage end date
      const marriageCalculation = calculateMarriageLeaveEndDate(value);
      setFormData(prev => ({
        ...prev,
        fullDay: { ...prev.fullDay, startDate: value, endDate: marriageCalculation ? marriageCalculation.endDate : "" }
      }));
      setFormErrors(prev => ({ ...prev, [field]: "" }));
      setMarriageAutoEnd(true); // lock the end-date input
      return;
    }
    // Special-case: if changing startDate while type=motherhood => auto-calc endDate and lock it
    if (field === "startDate" && formData.fullDay.requestType === "motherhood") {
      // compute motherhood end date
      const motherhoodCalculation = calculateMotherhoodLeaveEndDate(value);
      setFormData(prev => ({
        ...prev,
        fullDay: { ...prev.fullDay, startDate: value, endDate: motherhoodCalculation ? motherhoodCalculation.endDate : "" }
      }));
      setFormErrors(prev => ({ ...prev, [field]: "" }));
      setMotherhoodAutoEnd(true); // lock the end-date input
      return;
    }
    // Special-case: if changing startDate while type=birth => auto-calc endDate and lock it
    if (field === "startDate" && formData.fullDay.requestType === "birth") {
        const birthCalculation = calculateBirthLeaveEndDate(value);
        setFormData(prev => ({
            ...prev,
            fullDay: { ...prev.fullDay, startDate: value, endDate: birthCalculation ? birthCalculation.endDate : "" }
        }));
        setFormErrors(prev => ({ ...prev, [field]: "" }));
        setBirthAutoEnd(true);
        return;
    }

    // valid day; apply and clear any previous error on this field
    setFormData(prev => {
      const newFormData = {
        ...prev,
        fullDay: { ...prev.fullDay, [field]: value }
      };
      
      // Auto-calculate end date for marriage leave when start date changes (fallback if previous logic didn't run)
      if (field === "startDate" && prev.fullDay.requestType === "marriage" && value) {
        const marriageCalculation = calculateMarriageLeaveEndDate(value);
        if (marriageCalculation) {
          newFormData.fullDay.endDate = marriageCalculation.endDate;
          setMarriageAutoEnd(true);
        }
      } else if (field === "startDate" && prev.fullDay.requestType === "motherhood" && value) {
        const motherhoodCalculation = calculateMotherhoodLeaveEndDate(value);
        if (motherhoodCalculation) {
          newFormData.fullDay.endDate = motherhoodCalculation.endDate;
          setMotherhoodAutoEnd(true);
        }
      } else if (field === "startDate" && prev.fullDay.requestType === "birth" && value) {
        const birthCalculation = calculateBirthLeaveEndDate(value);
        if (birthCalculation) {
          newFormData.fullDay.endDate = birthCalculation.endDate;
          setBirthAutoEnd(true);
        }
      } else {
        // if other fields are changed and requestType is not marriage, motherhood, or birth, make sure the endDate lock is off
        if (prev.fullDay.requestType !== "marriage" && prev.fullDay.requestType !== "motherhood" && prev.fullDay.requestType !== "birth") {
          setMarriageAutoEnd(false);
          setMotherhoodAutoEnd(false);
          setBirthAutoEnd(false);
        }
      }
      
      // NEW: Study leave >15 working days check (exclude Thu/Fri)
      const requestTypeNow = prev.fullDay.requestType; // requestType before change
      const actualRequestType = requestTypeNow;

      if (actualRequestType === "study") {
        const startVal = field === "startDate" ? value : prev.fullDay.startDate;
        const endVal = field === "endDate" ? value : prev.fullDay.endDate;

        if (startVal && endVal) {
          const workingDays = calculateVacationDays(startVal, endVal);
          setShowStudyAdminMessage(workingDays > 15);
        } else {
          setShowStudyAdminMessage(false);
        }
      } else {
        // If request type is not study, ensure admin message is off
        setShowStudyAdminMessage(false);
      }

      return newFormData;
    });
    setFormErrors(prev => ({ ...prev, [field]: "" }));
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
      const token = localStorage.getItem('authToken');
      if (!token) {
          throw new Error("Auth token is missing.");
      }
      
      const { startDate, endDate, requestType, description } = formData.fullDay;

      // Map leave types to the required backend schema
      const leaveTypeMapping = {
          "daily": "اعتيادية",
          "sick": "مرضية",
          "hajj": "حج او عمرة",
          "marriage": "زواج",
          "study": "دراسية",
          "motherhood": "أمومة",
          "birth": "ولادة"
      };

      const leaveData = {
          user_id: userData?.id,
          employee_name: userData?.full_name || userData?.username,
          department: userData?.department || userData?.departmentName,
          leave_type: leaveTypeMapping[requestType],
          start_date: startDate,
          end_date: endDate,
          reason: description || ""
      };

      const response = await fetch('http://localhost:3000/api/leave-requests', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(leaveData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
          throw new Error(result.message || 'Failed to submit request.');
      }
      
      setSubmitMessage("تم إرسال طلب إجازة يوم كامل بنجاح!");
      console.log('Full Day Off Request Data:', leaveData);
      
      // Reset form and close modal after success
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          fullDay: { startDate: "", endDate: "", requestType: "daily", description: "" }
        }));
        setVacationSummary(""); // Reset summary
        setShowStudyAdminMessage(false);
        setMarriageAutoEnd(false);
        setMotherhoodAutoEnd(false);
        setBirthAutoEnd(false);
        setSubmitMessage("");
        setShowFullDayModal(false);
      }, 2000);
    } catch (error) {
      setSubmitMessage(`حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى: ${error.message}`);
      console.error("Submission error:", error);
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

  const validatePartTimeForm = () => {
    const errors = {};
    const { date, startTime, endTime } = formData.partTime;

    if (!date) {
      errors.date = "الرجاء إدخال التاريخ";
    }
    if (date && isThursdayOrFriday(date)) {
        errors.date = "لا يمكن اختيار يومي الخميس أو الجمعة";
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

  // Input change handlers
  const handleFullDayChange = (field, value) => {
    setFormData(prev => {
      const newFormData = {
        ...prev,
        fullDay: { ...prev.fullDay, [field]: value }
      };
      
      // Auto-calculate end date for marriage leave
      if (field === "requestType" && value === "marriage" && prev.fullDay.startDate) {
        const marriageCalculation = calculateMarriageLeaveEndDate(prev.fullDay.startDate);
        if (marriageCalculation) {
          newFormData.fullDay.endDate = marriageCalculation.endDate;
          setMarriageAutoEnd(true);
        }
      } else if (field === "startDate" && prev.fullDay.requestType === "marriage" && value) {
        const marriageCalculation = calculateMarriageLeaveEndDate(value);
        if (marriageCalculation) {
          newFormData.fullDay.endDate = marriageCalculation.endDate;
          setMarriageAutoEnd(true);
        }
      }
      
      // Auto-calculate end date for motherhood leave
      if (field === "requestType" && value === "motherhood" && prev.fullDay.startDate) {
        const motherhoodCalculation = calculateMotherhoodLeaveEndDate(prev.fullDay.startDate);
        if (motherhoodCalculation) {
          newFormData.fullDay.endDate = motherhoodCalculation.endDate;
          setMotherhoodAutoEnd(true);
        }
      } else if (field === "startDate" && prev.fullDay.requestType === "motherhood" && value) {
        const motherhoodCalculation = calculateMotherhoodLeaveEndDate(value);
        if (motherhoodCalculation) {
          newFormData.fullDay.endDate = motherhoodCalculation.endDate;
          setMotherhoodAutoEnd(true);
        }
      }
      
      // Auto-calculate end date for birth leave
      if (field === "requestType" && value === "birth" && prev.fullDay.startDate) {
          const birthCalculation = calculateBirthLeaveEndDate(prev.fullDay.startDate);
          if (birthCalculation) {
              newFormData.fullDay.endDate = birthCalculation.endDate;
              setBirthAutoEnd(true);
          }
      } else if (field === "startDate" && prev.fullDay.requestType === "birth" && value) {
          const birthCalculation = calculateBirthLeaveEndDate(value);
          if (birthCalculation) {
              newFormData.fullDay.endDate = birthCalculation.endDate;
              setBirthAutoEnd(true);
          }
      } else if (field === "requestType" && value !== "marriage" && value !== "motherhood" && value !== "birth") {
        // if switching away from marriage or motherhood, unlock end date
        setMarriageAutoEnd(false);
        setMotherhoodAutoEnd(false);
        setBirthAutoEnd(false);
      }
      
      // NEW: When user selects requestType = 'study', check working-days span > 15
      const actualRequestType = field === "requestType" ? value : prev.fullDay.requestType;
      if (actualRequestType === "study") {
        const start = field === "startDate" ? value : prev.fullDay.startDate;
        const end = field === "endDate" ? value : prev.fullDay.endDate;
        if (start && end) {
          const working = calculateVacationDays(start, end);
          setShowStudyAdminMessage(working > 15);
        } else {
          setShowStudyAdminMessage(false);
        }
      } else {
        setShowStudyAdminMessage(false);
      }

      return newFormData;
    });
    
    // Clear error when user starts typing/selecting a valid option
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

  // Guard date change for Part Time to prevent Thu/Fri selection
  const handlePartTimeDateChange = (value) => {
    if (isThursdayOrFriday(value)) {
      setFormErrors(prev => ({
        ...prev,
        date: "التاريخ: لا يمكن اختيار يومي الخميس أو الجمعة"
      }));
      setFormData(prev => ({
        ...prev,
        partTime: { ...prev.partTime, date: "" }
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      partTime: { ...prev.partTime, date: value }
    }));
    setFormErrors(prev => ({ ...prev, date: "" }));
  };

  // Pass open modal handlers to Home
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
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
                    {leaveDataLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      leaveBalance.availableDays
                    )}
                  </div>
                  <div className="summary-label">أيام الإجازة</div>
                </div>
                <div className="summary-section no-border">
                  <div className="summary-main-value summary-main-value-orange">
                    {leaveDataLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      leaveBalance.availableHours
                    )}
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
                      onClick={() => setShowFullDayModal(true)}
                      aria-label="فتح نموذج طلب إجازة يوم كامل"
                    >
                      طلب إجازة
                    </button>
                    <button
                      className="new-request-btn new-request-btn-secondary"
                      id="open-part-time-request-form-btn"
                      onClick={() => setShowPartTimeModal(true)}
                      aria-label="فتح نموذج طلب إجازة جزئية"
                    >
                      <span className="icon" aria-hidden="true">🕒</span>  طلب إجازة جزئية
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
      case "requests":
        return <AllRequests />;
      case "management":
        // Check if user has management access
        if (!hasManagementAccess()) {
          return (
            <div className="unauthorized-access">
              <div className="unauthorized-content">
                <i className="fas fa-lock"></i>
                <h2>غير مسموح بالوصول</h2>
                <p>عذراً، ليس لديك صلاحية للوصول إلى صفحة إدارة الطلبات.</p>
                <p>هذه الصفحة متاحة فقط للمديرين والمسؤولين.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setActiveSection("dashboard")}
                >
                  <i className="fas fa-home"></i>
                  العودة إلى الرئيسية
                </button>
              </div>
            </div>
          );
        }
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
              {/* Only show management menu item for admin and manager roles */}
              {hasManagementAccess() && (
                <li><a href="#" className={activeSection === "management" ? "active" : ""} onClick={e => { e.preventDefault(); setActiveSection("management"); setSidebarOpen(false); }}><i className="fas fa-tasks"></i> إدارة الطلبات</a></li>
              )}
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
      {sidebarOpen && <div className="sidebar-overlay visible" style={{ 	zIndex: 1001 }} onClick={() => setSidebarOpen(false)}></div>}
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
                  {userData?.gender === "female" && (
                      <label className="radio-label">
                          <input 
                              type="radio" 
                              name="fullDayRequestType" 
                              value="motherhood" 
                              checked={formData.fullDay.requestType === "motherhood"}
                              onChange={(e) => handleFullDayChange("requestType", e.target.value)}
                          />
                          <span className="radio-text">إجازة أمومة</span>
                      </label>
                  )}
                  {userData?.gender === "female" && (
                      <label className="radio-label">
                          <input 
                              type="radio" 
                              name="fullDayRequestType" 
                              value="birth" 
                              checked={formData.fullDay.requestType === "birth"}
                              onChange={(e) => handleFullDayChange("requestType", e.target.value)}
                          />
                          <span className="radio-text">ولادة</span>
                      </label>
                  )}
                </div>
                {formErrors.requestType && <div className="error-message">{formErrors.requestType}</div>}
                {formData.fullDay.requestType === "sick" && (
                  <div style={{ 
                    color: '#000000', 
                    fontSize: '14px', 
                    marginTop: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#d4edda',
                    border: '1px solid #c3e6cb',
                    borderRadius: '4px'
                  }}>
                    عزيزي منتسب جامعة السراج، يرجى تزويد قسم الادارية بوثيقة تثبت حالتك المرضية في اقرب فرصة ممكنه لتجنب اعتبار الاجازة ملغية
                  </div>
                )}
              </div>
              
              {/* START: show study-admin message if flagged (hide date fields) */}
              {showStudyAdminMessage && (
                <div className="form-group">
                    <p style={{ 
                        padding: '10px 15px', 
                        backgroundColor: '#fff3cd', 
                        border: '1px solid #ffeeba',
                        borderRadius: '5px', 
                        fontSize: '14px',
                        textAlign: 'center',
                        color: '#856404'
                    }}>
                        <i className="fas fa-exclamation-triangle" style={{ marginLeft: '8px' }}></i>
                        عزيزي منتسب جامعة السراج, للحصول على اجزة اكثر من 15 يوما, يجب ان تقدم طلبا بشكل مباشر الى قسم الادارية
                    </p>
                </div>
              )}
              {/* END: study-admin message */}

              {/* Render date inputs only when study-admin message is not shown */}
              {!showStudyAdminMessage && (
                <>
                  <div className={`form-group ${formErrors.startDate ? "error" : ""}`}>
                    <label htmlFor="full-day-start-date">تاريخ بداية الإجازة:</label>
                    <input 
                      type="date" 
                      id="full-day-start-date" 
                      name="startDate" 
                      value={formData.fullDay.startDate}
                      onChange={(e) => handleFullDayDateChange("startDate", e.target.value)}
                      onClick={handleDateInputClick}
                      min={todayIso}
                      required 
                    />
                    {formErrors.startDate && <div className="error-message">{formErrors.startDate}</div>}
                  </div>
                  {/* Marriage Leave Auto-Calculation Message */}
                  {formData.fullDay.requestType === "marriage" && formData.fullDay.startDate && formData.fullDay.endDate && (
                    <div className="form-group">
                        <p style={{ 
                            padding: '10px 15px', 
                            backgroundColor: '#d4edda', 
                            border: '1px solid #c3e6cb',
                            borderRadius: '5px', 
                            fontSize: '14px',
                            textAlign: 'center',
                            color: 'black'
                        }}>
                            <i className="fas fa-heart" style={{ marginLeft: '8px' }}></i>
                            تم حساب تاريخ نهاية الإجازة تلقائياً بناءً على نوع الإجازة (زواج) ليكون 14 يوم عمل (باستثناء الخميس والجمعة).
                        </p>
                    </div>
                  )}
                  {/* Motherhood Leave Auto-Calculation Message */}
                  {formData.fullDay.requestType === "motherhood" && formData.fullDay.startDate && formData.fullDay.endDate && (
                    <div className="form-group">
                        <p style={{ 
                            padding: '10px 15px', 
                            backgroundColor: '#d4edda', 
                            border: '1px solid #c3e6cb',
                            borderRadius: '5px', 
                            fontSize: '14px',
                            textAlign: 'center',
                            color: 'black'
                        }}>
                            <i className="fas fa-baby" style={{ marginLeft: '8px' }}></i>
                            تم حساب تاريخ نهاية الإجازة تلقائياً بناءً على نوع الإجازة (أمومة) ليكون 51 يوم عمل (باستثناء الخميس والجمعة).
                        </p>
                    </div>
                  )}
                  {/* Birth Leave Auto-Calculation Message */}
                  {formData.fullDay.requestType === "birth" && formData.fullDay.startDate && formData.fullDay.endDate && (
                    <div className="form-group">
                        <p style={{ 
                            padding: '10px 15px', 
                            backgroundColor: '#d4edda', 
                            border: '1px solid #c3e6cb',
                            borderRadius: '5px', 
                            fontSize: '14px',
                            textAlign: 'center',
                            color: 'black'
                        }}>
                            <i className="fas fa-baby-carriage" style={{ marginLeft: '8px' }}></i>
                            تم حساب تاريخ نهاية الإجازة تلقائياً بناءً على نوع الإجازة (ولادة) ليكون 21 يوم عمل (باستثناء الخميس والجمعة).
                        </p>
                    </div>
                  )}

                  <div className={`form-group ${formErrors.endDate ? "error" : ""}`}>
                    <label htmlFor="full-day-end-date">تاريخ نهاية الإجازة:</label>
                    <input 
                      type="date" 
                      id="full-day-end-date" 
                      name="endDate" 
                      value={formData.fullDay.endDate}
                      onChange={(e) => handleFullDayDateChange("endDate", e.target.value)}
                      onClick={handleDateInputClick}
                      min={formData.fullDay.startDate || todayIso}
                      required 
                      disabled={marriageAutoEnd || motherhoodAutoEnd || birthAutoEnd}  // <-- locked when auto-calculated for marriage, motherhood, or birth
                    />
                    {formErrors.endDate && <div className="error-message">{formErrors.endDate}</div>}
                    {formErrors.dateRange && <div className="error-message">{formErrors.dateRange}</div>}
                  </div>
                </>
              )}
              
              {/* NEW: Vacation Summary Message */}
              {vacationSummary && !showStudyAdminMessage && (
                <div className="form-group">
                    <p style={{ 
                        padding: '10px 15px', 
                        backgroundColor: '#e9ecef', 
                        borderRadius: '5px', 
                        fontSize: '14px',
                        textAlign: 'center',
                        color: vacationSummary.includes("لا تحتوي") || vacationSummary.includes("إجازة رسمية") ? '#dc3545' : '#007bff'
                    }}>
                        <i className="fas fa-info-circle" style={{ marginLeft: '8px' }}></i>
                        {vacationSummary}
                    </p>
                </div>
              )}
              
              
              
              
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
                  onChange={(e) => handlePartTimeDateChange(e.target.value)}
                  onClick={handleDateInputClick}
                  min={todayIso}
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