// components/ReviewerModal/components/Header.jsx
import React from 'react';
import { Check, Pencil, X } from "lucide-react";

const Header = ({
  title,
  isHistorical,
  canEdit,
  isEditing,
  isDocumentReady,
  isSaving,
  onEdit,
  onSave,
  onCancel
}) => {
  return (
    <div className="flex justify-between items-center px-8 py-5 border-b bg-primaryGreen text-white">
      <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-1 items-center justify-between">
        <div className="flex flex-col justify-center items-start gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-white/80 rounded-full"></div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-emerald-100">
              {isHistorical ? "Historical Version" : "Reviewer's Evaluation on Proposal"}
            </h3>
          </div>
          <h1 className="text-xl font-bold leading-tight text-white drop-shadow-sm">
            {title}
          </h1>
        </div>

        <div className={`${isHistorical ? "hidden" : ""} relative z-10 flex items-center gap-3`}>
          {!isEditing ? (
            <button
              onClick={onEdit}
              disabled={!canEdit || !isDocumentReady}
              className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-md font-semibold transition text-sm
                        ${canEdit && isDocumentReady
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                        }`}
              title={!canEdit ? "Proposal cannot be edited" : !isDocumentReady ? "Loading data..." : "Edit proposal"}
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onSave}
                disabled={isSaving}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-md text-sm font-semibold transition
                          ${isSaving 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-500 text-white hover:bg-green-700'
                          }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Save
                  </>
                )}
              </button>

              <button
                onClick={onCancel}
                disabled={isSaving}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-md text-sm font-semibold transition
                          ${isSaving 
                            ? 'bg-gray-300 cursor-not-allowed opacity-50' 
                            : 'bg-red-600 text-white hover:bg-red-800'
                          }`}
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;