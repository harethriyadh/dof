import React from "react";

export default function Home({ onOpenFullDayModal, onOpenPartTimeModal }) {
  return (
    <div className="cards-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
      <div className="card status-last-request"
        style={{
          gridColumn: '1/-1',
          width: '100%',
          marginBottom: '2rem',
          background: (() => {
            const lastRequestStatus = "approved"; // "approved", "rejected", or "pending"
            if (lastRequestStatus === "rejected") return '#e03131';
            if (lastRequestStatus === "pending") return '#f59f00';
            return '#16834b';
          })(),
          minHeight: '110px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem 0',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        <div className="card-content" style={{ width: '100%' }}>
          <button
            className="new-request-btn"
            style={{
              width: '100%',
              minHeight: '60px',
              background: 'transparent',
              color: '#fff',
              boxShadow: 'none',
              fontSize: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              border: 'none',
              fontWeight: 700,
              letterSpacing: '0.01em',
              cursor: 'default',
              fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif"
            }}
            tabIndex={-1}
            disabled
          >
            <span style={{ fontSize: '1.08em', fontWeight: 700, marginBottom: 4, fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>حالة آخر طلب</span>
            <span style={{ display: 'block', fontSize: '1.08em', marginTop: 6, color: '#fff', fontWeight: 600, textAlign: 'center', lineHeight: 1.8, fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>
              {(() => {
                // Example: replace with real data as needed
                const lastRequestStatus = "approved"; // "approved", "rejected", or "pending"
                const isOneDay = true; // set to false for multi-day
                const startDate = "9/4";
                const endDate = "9/7";
                let message = "";
                if (lastRequestStatus === "approved") {
                  if (isOneDay) {
                    message = `تم قبول اجازتك ليوم ${startDate}`;
                  } else {
                    message = `تم قبول اجازتك من يوم ${startDate} إلى يوم ${endDate}`;
                  }
                } else if (lastRequestStatus === "rejected") {
                  if (isOneDay) {
                    message = `تم رفض اجازتك ليوم ${startDate}`;
                  } else {
                    message = `تم رفض اجازتك من يوم ${startDate} إلى يوم ${endDate}`;
                  }
                } else if (lastRequestStatus === "pending") {
                  if (isOneDay) {
                    message = `اجازتك ليوم ${startDate} قيد المراجعة`;
                  } else {
                    message = `اجازتك من يوم ${startDate} إلى يوم ${endDate} قيد المراجعة`;
                  }
                }
                return message;
              })()}
            </span>
          </button>
        </div>
      </div>
      {/* الاجازات المتـــاحة summary card moved from Profile.jsx, now placed directly under حالة آخر طلب, now full width */}
      <div className="card summary-card" style={{
        fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif",
        gridColumn: '1/-1',
        width: '100%',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #fffbe3 0%, #f8f9fe 100%)',
        minHeight: 120,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(32,107,196,0.08)',
        gap: 0
      }}>
        <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid #e0e0e0' }}>
          <div className="summary-main-value" style={{ color: '#206bc4', marginBottom: 8, textShadow: '0 2px 8px #b6d0f7' }}>الاجازات المتـــاحة</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid #e0e0e0' }}>
          <div className="summary-main-value" style={{ color: '#16834b', marginBottom: 8 }}>20 <span style={{ fontSize: 18, fontWeight: 600, color: '#444' }}>يوم</span></div>
          <div className="summary-label">أيام الإجازة</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="summary-main-value" style={{ color: '#f59f00', marginBottom: 8 }}>160 <span style={{ fontSize: 18, fontWeight: 600, color: '#444' }}>ساعة</span></div>
          <div className="summary-label">ساعات الإجازة</div>
        </div>
      </div>
      <div className="card status-combined-card" style={{ width: '100%', maxWidth: '100%', minWidth: 0, fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif", background: '#fff', borderRadius: 12, boxShadow: '0 8px 25px rgba(0,0,0,0.1)', overflow: 'hidden', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center' }}>
        <div className="card-header" style={{ padding: '1.5rem', textAlign: 'center', background: '#f9f9f9' }}>
          <h3 className="card-title" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#333' }}>حالة الطلبات</h3>
        </div>
        <div className="card-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="status-item approved" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: 8, transition: 'background-color 0.2s', }}>
            <div className="status-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="status-icon" style={{ fontSize: '1.5rem', width: 30, height: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>✅</span>
              <span className="status-label" style={{ fontSize: '1.1rem', color: '#495057', fontWeight: 400 }}>الطلبات المعتمدة</span>
            </div>
            <div className="status-number" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#28a745' }}>12</div>
          </div>
          <div className="status-item pending" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: 8, transition: 'background-color 0.2s', }}>
            <div className="status-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="status-icon" style={{ fontSize: '1.5rem', width: 30, height: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>⏳</span>
              <span className="status-label" style={{ fontSize: '1.1rem', color: '#495057', fontWeight: 400 }}>الطلبات المعلقة</span>
            </div>
            <div className="status-number" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ffc107' }}>5</div>
          </div>
          <div className="status-item rejected" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: 8, transition: 'background-color 0.2s', }}>
            <div className="status-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="status-icon" style={{ fontSize: '1.5rem', width: 30, height: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>❌</span>
              <span className="status-label" style={{ fontSize: '1.1rem', color: '#495057', fontWeight: 400 }}>الطلبات المرفوضة</span>
            </div>
            <div className="status-number" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#dc3545' }}>2</div>
          </div>
        </div>
      </div>
      <div className="card new-request-card" style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif", width: '100%', maxWidth: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card-content">
          <h3 style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}>إنشاء طلب جديد</h3>
          <button
            className="new-request-btn"
            id="open-full-day-request-form-btn"
            onClick={onOpenFullDayModal}
            style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}
          >
            طلب إجازة
          </button>
          <button
            className="new-request-btn"
            id="open-part-time-request-form-btn"
            style={{ marginTop: "1rem", fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif" }}
            onClick={onOpenPartTimeModal}
          >
            <i className="fas fa-clock"></i> طلب إجازة جزئية
          </button>
        </div>
      </div>
      {/* Redesigned summary cards */}
      <div className="card summary-card" style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 140, boxShadow: '0 4px 24px rgba(32,107,196,0.08)', border: 'none', margin: '0 auto', background: 'linear-gradient(135deg, #e3f0ff 0%, #f8f9fe 100%)', width: '100%', maxWidth: '100%', minWidth: 0 }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ fontSize: 54, fontWeight: 900, color: '#206bc4', lineHeight: 1, letterSpacing: '0.01em', marginBottom: 8, textShadow: '0 2px 8px #b6d0f7' }}>19</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#444', letterSpacing: '0.01em' }}>إجمالي الطلبات</div>
        </div>
      </div>
      <div className="card summary-card" style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 140, boxShadow: '0 4px 24px rgba(32,107,196,0.08)', border: 'none', margin: '0 auto', background: 'linear-gradient(135deg, #e3ffe6 0%, #f8f9fe 100%)', width: '100%', maxWidth: '100%', minWidth: 0 }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ fontSize: 54, fontWeight: 900, color: '#16834b', lineHeight: 1, letterSpacing: '0.01em', marginBottom: 8, textShadow: '0 2px 8px #b6f7d0' }}>20</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#444', letterSpacing: '0.01em' }}>الأيام المتاحة</div>
        </div>
      </div>
      <div className="card summary-card" style={{ fontFamily: "'Tajawal', 'Cairo', Arial, sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 140, boxShadow: '0 4px 24px rgba(32,107,196,0.08)', border: 'none', margin: '0 auto', background: 'linear-gradient(135deg, #fffbe3 0%, #f8f9fe 100%)', width: '100%', maxWidth: '100%', minWidth: 0 }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ fontSize: 54, fontWeight: 900, color: '#f59f00', lineHeight: 1, letterSpacing: '0.01em', marginBottom: 8, textShadow: '0 2px 8px #f7e7b6' }}>160</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#444', letterSpacing: '0.01em' }}>الساعات المتاحة</div>
        </div>
      </div>
    </div>
  );
}
