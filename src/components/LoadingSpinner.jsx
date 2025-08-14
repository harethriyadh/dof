import React from "react";

export default function LoadingSpinner({ size = "medium", color = "primary" }) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6", 
    large: "w-8 h-8"
  };

  const colorClasses = {
    primary: "text-blue-600",
    white: "text-white",
    gray: "text-gray-600"
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label="جاري التحميل"
      >
        <span className="sr-only">جاري التحميل...</span>
      </div>
    </div>
  );
}
