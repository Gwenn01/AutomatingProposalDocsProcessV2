import React, { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";

interface FormActionBarProps {
  isEditing: boolean;
  isSaving: boolean;
  canEdit: boolean;
  isDocumentReady: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditSaveButton: React.FC<FormActionBarProps> = ({
  isEditing,
  isSaving,
  canEdit,
  isDocumentReady,
  onEdit,
  onSave,
  onCancel,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const isDisabled = !canEdit || !isDocumentReady;
  const tooltip = !canEdit
    ? "Proposal cannot be edited"
    : !isDocumentReady
    ? "Loading data…"
    : "Edit proposal";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .fab-root {
          font-family: 'DM Sans', sans-serif;
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.4s cubic-bezier(0.16,1,0.3,1),
                      transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .fab-root.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── shared pill ── */
        .fab-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 0 22px;
          height: 46px;
          border-radius: 999px;
          border: none;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          white-space: nowrap;
          transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.2s ease,
                      background 0.2s ease,
                      opacity 0.2s ease;
          -webkit-font-smoothing: antialiased;
        }
        .fab-btn:not(:disabled):hover { transform: translateY(-2px); }
        .fab-btn:not(:disabled):active { transform: translateY(0) scale(0.97); }
        .fab-btn:disabled {
          cursor: not-allowed;
          opacity: 0.45;
          transform: none !important;
        }

        /* ── Edit ── */
        .fab-edit {
          background: #111111;
          color: #ffffff;
          box-shadow: 0 2px 16px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.06) inset;
        }
        .fab-edit:not(:disabled):hover {
          background: #2a2a2a;
          box-shadow: 0 6px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08) inset;
        }

        /* ── Save ── */
        .fab-save {
          background: linear-gradient(135deg, #00c96f 0%, #00a85a 100%);
          color: #ffffff;
          box-shadow: 0 2px 14px rgba(0,180,100,0.35);
        }
        .fab-save:not(:disabled):hover {
          box-shadow: 0 6px 22px rgba(0,180,100,0.45);
        }
        .fab-save:disabled {
          background: #9ca3af;
          box-shadow: none;
        }

        /* ── Cancel ── */
        .fab-cancel {
          background: rgba(255,255,255,0.92);
          color: #374151;
          box-shadow: 0 2px 12px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.07);
          backdrop-filter: blur(8px);
        }
        .fab-cancel:not(:disabled):hover {
          background: #fff1f2;
          color: #dc2626;
          box-shadow: 0 6px 20px rgba(220,38,38,0.15), 0 0 0 1px rgba(220,38,38,0.18);
        }

        /* ── Divider between save/cancel ── */
        .fab-divider {
          width: 1px;
          height: 24px;
          background: rgba(0,0,0,0.12);
          border-radius: 1px;
        }

        /* ── Spinner ── */
        .fab-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── slide-in for the editing group ── */
        .fab-group {
          display: flex;
          align-items: center;
          gap: 6px;
          animation: groupIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes groupIn {
          from { opacity: 0; transform: scale(0.88) translateX(12px); }
          to   { opacity: 1; transform: scale(1)   translateX(0);    }
        }

        /* ── single-btn pulse on mount ── */
        .fab-edit-wrap {
          animation: editIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes editIn {
          from { opacity: 0; transform: scale(0.82); }
          to   { opacity: 1; transform: scale(1);    }
        }

        /* tooltip */
        .fab-tooltip-wrap { position: relative; }
        .fab-tooltip-wrap .fab-tip {
          pointer-events: none;
          position: absolute;
          bottom: calc(100% + 10px);
          right: 0;
          background: #111;
          color: #fff;
          font-size: 11.5px;
          font-weight: 500;
          padding: 5px 11px;
          border-radius: 8px;
          white-space: nowrap;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.18s, transform 0.18s;
        }
        .fab-tooltip-wrap:hover .fab-tip {
          opacity: 1;
          transform: translateY(0);
        }
        .fab-tooltip-wrap .fab-tip::after {
          content: '';
          position: absolute;
          top: 100%; right: 18px;
          border: 5px solid transparent;
          border-top-color: #111;
        }
      `}</style>

      <div className={`fab-root${mounted ? " visible" : ""}`}>
        {!isEditing ? (
          <div className="fab-tooltip-wrap fab-edit-wrap">
            {isDisabled && <span className="fab-tip">{tooltip}</span>}
            <button
              className="fab-btn fab-edit"
              onClick={onEdit}
              disabled={isDisabled}
              aria-label={tooltip}
            >
              <Pencil size={14} strokeWidth={2.2} />
              Edit
            </button>
          </div>
        ) : (
          <div className="fab-group">
            <button
              className="fab-btn fab-save"
              onClick={onSave}
              disabled={isSaving}
              aria-label="Save changes"
            >
              {isSaving ? (
                <>
                  <span className="fab-spinner" />
                  Saving…
                </>
              ) : (
                <>
                  <Check size={14} strokeWidth={2.5} />
                  Save
                </>
              )}
            </button>

            <div className="fab-divider" aria-hidden />

            <button
              className="fab-btn fab-cancel"
              onClick={onCancel}
              disabled={isSaving}
              aria-label="Discard changes"
            >
              <X size={14} strokeWidth={2.5} />
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default EditSaveButton;