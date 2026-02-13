// components/ReviewerModal/components/SaveModal.jsx
import React from 'react';

const SaveModal = ({ isSaving }) => {
  if (!isSaving) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl px-8 py-6 shadow-lg flex items-center gap-4 animate-[fadeIn_0.25s_ease-out]">
        <div className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-emerald-600 animate-spin"></div>
        <div>
          <p className="text-sm font-medium text-gray-900">Saving changes</p>
          <p className="text-xs text-gray-500">Please wait…</p>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;