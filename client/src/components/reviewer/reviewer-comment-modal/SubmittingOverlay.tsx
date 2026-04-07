import React from "react";

const SubmittingOverlay: React.FC<{ message?: string }> = ({ message = "Submitting..." }) => {
  return (
    <div className="fixed flex items-center justify-center">
      <div className="bg-white rounded-lg border border-gray-300 px-10 py-7 flex flex-col items-center gap-4">

        {/* Spinner */}
        <div className="w-10 h-10 animate-spin" style={{ animationDuration: "0.9s" }}>
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="16" stroke="#e5e7eb" strokeWidth="3" />
            <path d="M20 4 A16 16 0 0 1 36 20" stroke="#1D9E75" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Text */}
        <p className="text-[15px] font-medium text-gray-800 tracking-[0.01em]">
          {message}
        </p>

        {/* Pulse dots */}
        <div className="flex gap-1.5 items-center">
          {[0, 200, 400].map((delay) => (
            <span
              key={delay}
              className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse"
              style={{ animationDelay: `${delay}ms`, animationDuration: "1.2s" }}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default SubmittingOverlay;