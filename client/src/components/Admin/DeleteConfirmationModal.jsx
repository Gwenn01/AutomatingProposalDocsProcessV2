import React, { useState } from 'react';
import { AlertCircle, X, Loader2, CheckCircle2, XCircle } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, data, onSuccess }) => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'deleting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleConfirmDeletion = async () => {
    setStatus('deleting');
    try {
      const response = await fetch('http://127.0.0.1:5000/api/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: data.id }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');

        setTimeout(() => {
          onSuccess?.(data.id);
          handleClose();
        }, 1200);
      } else {
        setErrorMessage(result.message || "Failed to delete account");
        setStatus('error');
      }
    } catch {
      setErrorMessage("Network error. Please try again later.");
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status === 'deleting') return;
    onClose();

    setTimeout(() => {
      setStatus('idle');
      setErrorMessage("");
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
      <div 
        className="fixed inset-0 bg-slate-950/20 backdrop-blur-md transition-all duration-500" 
        onClick={handleClose}
      />

      <div className="relative bg-white/90 backdrop-blur-xl w-full max-w-md rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-white/40 p-8 animate-in fade-in zoom-in-95 duration-300">
        
        {status !== 'deleting' && (
          <button onClick={handleClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
            <X size={18} />
          </button>
        )}

        {/* --- VIEW: CONFIRMATION & IDLE --- */}
        {status === 'idle' && (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-100/50">
                <AlertCircle size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Delete Account</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-0.5">Final Confirmation</p>
              </div>
            </div>
            <div className="bg-slate-50/50 rounded-2xl p-5 mb-8 border border-slate-100">
               <p className="text-slate-600 text-sm leading-relaxed">
                Removing <span className="font-semibold text-slate-900">{data?.name}</span> is permanent. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleClose} className="flex-1 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button onClick={handleConfirmDeletion} className="flex-1 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all active:scale-[0.98]">
                Delete Record
              </button>
            </div>
          </div>
        )}

        {/* --- VIEW: DELETING (LOADING) --- */}
        {status === 'deleting' && (
          <div className="flex flex-col items-center py-10 animate-in fade-in zoom-in-90">
            <Loader2 size={48} className="text-rose-500 animate-spin mb-4" strokeWidth={1.5} />
            <p className="text-slate-900 font-semibold">Erasing Records...</p>
            <p className="text-slate-500 text-sm">Please do not close the window.</p>
          </div>
        )}

        {/* --- VIEW: SUCCESS --- */}
        {status === 'success' && (
          <div className="flex flex-col items-center py-6 text-center animate-in fade-in zoom-in-90 duration-500">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-sm shadow-emerald-100">
              <CheckCircle2 size={40} strokeWidth={1.5} className="animate-in zoom-in duration-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Success!</h2>
            <p className="text-slate-500 text-sm mb-2">The account has been removed.</p>
          </div>
        )}

        {/* --- VIEW: ERROR --- */}
        {status === 'error' && (
          <div className="flex flex-col items-center py-6 text-center animate-in fade-in zoom-in-90">
            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 border border-amber-100">
              <XCircle size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Deletion Failed</h2>
            <p className="text-slate-500 text-sm mb-6 px-4">{errorMessage}</p>
            <button 
              onClick={() => setStatus('idle')}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-slate-800 hover:bg-slate-900 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DeleteConfirmationModal;