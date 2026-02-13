import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  X,
  Search,
  Check,
  User,
  FileCheck,
  RefreshCcw,
  UserPlus,
  Loader2,
  FileText,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import axios from "axios";



const AssignModal = ({ isOpen, onClose, data, onUpdate, mode }) => {
  const [assignSearch, setAssignSearch] = useState("");
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReviewers, setIsLoadingReviewers] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const isReassignMode = mode === "reassign";

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen && data) {
      const fetchReviewers = async () => {
        setIsLoadingReviewers(true)
        const docId = data?.proposal_id;
        if (!docId) return;

        try {
          const response = await axios.post(
            "http://127.0.0.1:5000/api/get-all-reviewer",
            { proposal_id: docId }
          );

          let reviewersList = Array.isArray(response.data) ? response.data : [];

          if (isReassignMode) {
            reviewersList = reviewersList.filter((r) => Number(r.is_assign) === 1);
          }

          setReviewers(reviewersList);

          const assignedIDs = reviewersList
            .filter((r) => Number(r.is_assign) === 1 && r.is_reviewed === 0)
            .map((r) => r.id);

          setSelectedReviewers(assignedIDs);
        } catch (error) {
          showToast("Failed to load reviewers.", error);
        } finally {
          setIsLoadingReviewers(false);
        }
      };
      fetchReviewers();
    }
  }, [isOpen, data, isReassignMode]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  if (!isOpen) return null;

  const toggleReviewer = (id) => {
    const reviewer = reviewers.find((r) => r.id === id);
    const isOriginal = reviewer?.is_assign === 1;
    const hasReviewed = reviewer?.is_reviewed === 1;

    // Prevent selecting already reviewed in any mode
    if (!isReassignMode && isOriginal) return;
    if (hasReviewed) return;

    setSelectedReviewers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

 const handleConfirm = async () => {
    setIsSubmitting(true);
    const proposalId = data.proposal_id || data.id;

    try {
      const originalAssignedIDs = reviewers
        .filter((r) => r.is_assign === 1 && r.is_reviewed === 0)
        .map((r) => r.id);

      const reviewersToSend = isReassignMode 
        ? selectedReviewers 
        : selectedReviewers.filter((id) => !originalAssignedIDs.includes(id));

      if (reviewersToSend.length === 0 && !isReassignMode) {
        showToast("Please select at least one new reviewer.", "error");
        setIsSubmitting(false);
        return;
      }

      const endpoint = isReassignMode ? "/api/reassign-reviewer" : "/api/assign-reviewer";
      
      await axios.post(`http://127.0.0.1:5000${endpoint}`, {
        proposal_id: proposalId,
        reviewers: reviewersToSend.map((id) => ({ reviewer_id: id })),
      });

      const selectedNames = reviewers
        .filter((r) => selectedReviewers.includes(r.id))
        .map((r) => r.name)
        .join(", ");

      onUpdate(proposalId, selectedNames || "No Reviewers", mode);
      
      setTimeout(() => {
        onClose();
      }, 800);

    } catch (error) {
      showToast(error.response?.data?.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter reviewers by search
  const filteredReviewers = (Array.isArray(reviewers) ? reviewers : []).filter((reviewer) =>
    reviewer.name.toLowerCase().includes(assignSearch.toLowerCase())
  );

  const originalAssignedIDs = reviewers
    .filter((r) => r.is_assign === 1 && r.is_reviewed === 0)
    .map((r) => r.id);
  const hasNewSelection = selectedReviewers.some((id) => !originalAssignedIDs.includes(id));
  const isButtonDisabled =
    isSubmitting || (mode === "assign" && !hasNewSelection) || (isReassignMode && selectedReviewers.length === 0);

    const sortedReviewers = [...filteredReviewers].sort((a, b) => {
    if (a.is_assign !== b.is_assign) return b.is_assign - a.is_assign;
    return a.name.localeCompare(b.name);
  });

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {toast.show && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[10000] animate-in slide-in-from-top-4 duration-300">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border ${
              toast.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-red-50 border-red-100 text-red-800"
            }`}>
              {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-bold tracking-tight">{toast.message}</span>
            </div>
          </div>
        )}
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-[480px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className={`h-1.5 w-full transition-colors duration-500 ${isReassignMode ? "bg-blue-500" : "bg-emerald-500"}`} />

        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-4">
              {/* Dynamic Icon Container with Soft Glow */}
              <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border
                ${isReassignMode 
                  ? "bg-blue-50 border-blue-100 text-blue-600 shadow-blue-100/50" 
                  : "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-100/50"
                }`}>
                {isReassignMode ? (
                  <RefreshCcw size={22} strokeWidth={2.5} className={isSubmitting ? "animate-spin" : ""} />
                ) : (
                  <UserPlus size={22} strokeWidth={2.5} />
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                  {isReassignMode ? "Reassign Reviewer" : "Assign Reviewer"}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isReassignMode ? "bg-blue-400" : "bg-emerald-400"}`} />
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.12em]">
                    {isReassignMode ? "Modification Protocol" : "Selection Process"}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="group p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-full transition-all duration-300"
            >
              <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <div className="group relative bg-slate-50/50 border border-slate-200/60 p-5 rounded-[20px] mb-8 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
            {/* Modern Left Accent Border */}
            <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full transition-colors duration-500 ${isReassignMode ? "bg-blue-500" : "bg-emerald-500"}`} />
            
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isReassignMode ? "bg-blue-100/50 text-blue-600" : "bg-emerald-100/50 text-emerald-600"}`}>
                    <FileText size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em]">
                    Reference Document
                  </span>
                </div>
                
                {/* Decorative ID or Tag */}
                <span className="text-[10px] font-mono text-slate-300">ID: {data?.id?.toString().slice(0, 8) || "REF-001"}</span>
              </div>

              <div className="pl-1">
                <p className="text-[15px] font-semibold text-slate-800 leading-snug line-clamp-2">
                  {data?.title || "Untitled Proposal"}
                </p>
              </div>
            </div>

            {/* Subtle Background Watermark */}
            <div className="absolute -right-4 -bottom-4 select-none pointer-events-none opacity-[0.03] rotate-12 transition-transform group-hover:scale-110 duration-700">
              <FileText size={100} />
            </div>
          </div>

          {/* Search Section */}
          <div className="relative mb-6 group">
            {/* Dynamic Color logic based on mode */}
            {(() => {
              const activeColor = isReassignMode ? "blue" : "emerald";
              
              return (
                <>
                  {/* Search Icon with dynamic color shift */}
                  <Search 
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10
                      ${assignSearch 
                        ? `text-${activeColor}-500` 
                        : `text-slate-400 group-focus-within:text-${activeColor}-500`}
                    `} 
                    size={18} 
                    strokeWidth={2.5}
                  />
                  
                  <input
                    type="text"
                    placeholder="Search by name or expertise..."
                    value={assignSearch}
                    onChange={(e) => setAssignSearch(e.target.value)}
                    className={`
                      w-full bg-slate-100/50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-12 
                      outline-none transition-all duration-300
                      text-slate-700 font-semibold text-[14px] placeholder:text-slate-400 placeholder:font-medium
                      hover:bg-slate-100
                      ${isReassignMode 
                        ? "focus:bg-white focus:border-blue-500/20 focus:ring-[6px] focus:ring-blue-500/5" 
                        : "focus:bg-white focus:border-emerald-500/20 focus:ring-[6px] focus:ring-emerald-500/5"}
                    `}
                  />

                  {/* Clear Button */}
                  {assignSearch && (
                    <button 
                      onClick={() => setAssignSearch('')}
                      className={`
                        absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all
                        ${isReassignMode 
                          ? "bg-blue-50 text-blue-500 hover:bg-blue-100" 
                          : "bg-emerald-50 text-emerald-500 hover:bg-emerald-100"}
                      `}
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  )}
                </> 
              );
            })()}
          </div>

          {/* Reviewers List */}
          <div className="relative">
            {/* Fade Effects for Premium Scroll Feel */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
            
            <div className="space-y-3 max-h-[190px] overflow-y-auto px-2 custom-scrollbar transition-all py-2">
              {isLoadingReviewers ? (
                // 3. Premium Loading State (Skeleton Effect)
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full h-[80px] bg-slate-50 border-2 border-slate-100 rounded-[24px] flex items-center p-4 gap-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                        <div className="h-3 bg-slate-100 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedReviewers.length > 0 ? (
              sortedReviewers.map((reviewer) => {
                const isSelected = selectedReviewers.includes(reviewer.id);
                const isOriginal = reviewer.is_assign === 1;
                const hasReviewed = reviewer.is_reviewed === 1;
                const isLocked = !isReassignMode && (isOriginal || hasReviewed);

                const theme = isReassignMode 
                  ? { base: "blue", bg: "bg-blue-50/50", border: "border-blue-500", text: "text-blue-700", icon: "bg-blue-600" }
                  : { base: "emerald", bg: "bg-emerald-50/50", border: "border-emerald-500", text: "text-emerald-700", icon: "bg-emerald-500" };

                return (
                  <button
                      key={reviewer.id}
                      disabled={isSubmitting || isLocked}
                      onClick={() => toggleReviewer(reviewer.id)}
                      className={`
                        group relative w-full flex items-center justify-between p-4 rounded-[24px] transition-all duration-300 border-2
                        ${isSelected 
                          ? `${theme.bg} ${theme.border} shadow-xl shadow-${theme.base}-500/20 scale-[1] z-10` 
                          : "border-slate-100 bg-white hover:border-slate-200 z-0"}
                        ${isLocked ? "opacity-40 cursor-not-allowed" : "active:scale-[0.98]"}
                      `}
                    >
                    <div className="flex items-center gap-4">
                      {/* Avatar Container */}
                      <div className="relative flex-shrink-0">
                        <div className={`
                          w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                          ${isSelected ? `${theme.icon} text-white shadow-md` : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"}
                        `}>
                          <User size={22} strokeWidth={isSelected ? 2.5 : 2} />
                        </div>
                        {isSelected && (
                          <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${theme.icon} flex items-center justify-center animate-in zoom-in`}>
                            <Check size={12} className="text-white" strokeWidth={4} />
                          </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="text-left flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <p className={`text-[14px] font-bold tracking-tight ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                            {reviewer.name}
                          </p>
                          {hasReviewed && (
                            <div className="flex items-center text-amber-600" title="Has Prior Review">
                              <FileCheck size={14} strokeWidth={2.5} />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] text-slate-400 font-medium">
                            {reviewer.expertise || "Expert Reviewer"}
                          </p>
                          {isOriginal && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-200" />
                              <span className={`text-[9px] font-bold uppercase tracking-wider ${theme.text}`}>
                                {isReassignMode ? "Current" : "Assigned"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Action/State */}
                    <div className="flex-shrink-0 ml-4">
                      {isSelected ? (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white border ${theme.border} shadow-sm`}>
                          <span className={`text-[10px] font-black ${theme.text} uppercase tracking-widest`}>Selected</span>
                          <Check size={12} strokeWidth={4} className={theme.text} />
                        </div>
                      ) : hasReviewed ? (
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">
                          Record Exists
                        </span>
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-300 group-hover:text-slate-500 group-hover:bg-slate-100 transition-all">
                          <ChevronRight size={18} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
              ) : (
                // Empty State
                <div className="py-8 text-center">
                  <p className="text-slate-400 text-sm font-medium">No reviewers found.</p>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
          </div>

          {/* Footer Section */}
          <div className="mt-8 pt-6 border-t border-slate-100/80 flex items-center gap-4">
            {/* Cancel Button - Subtler, Minimalist */}
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-4 text-slate-500 font-bold text-[12px] uppercase tracking-[0.15em] hover:text-slate-800 hover:bg-slate-50 rounded-[20px] transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              Discard
            </button>

            {/* Main Action Button - Premium Gradient & Glow */}
            <button
              onClick={handleConfirm}
              disabled={isButtonDisabled}
              className={`
                relative flex-[2] group overflow-hidden
                py-4 rounded-[22px] font-bold text-[11px] uppercase tracking-[0.2em] 
                text-white shadow-2xl transition-all duration-500 active:scale-[0.97]
                flex items-center justify-center gap-3
                ${isReassignMode 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-200 hover:shadow-blue-400/40" 
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-200 hover:shadow-emerald-400/40"
                }
                disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:cursor-not-allowed
              `}
            >
              {/* Animated Shine Effect on Hover */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />

              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin stroke-[3px]" />
                  <span className="animate-pulse">Synchronizing...</span>
                </div>
              ) : (
                <>
                  <span className="relative z-10">
                    {isReassignMode 
                      ? "Commit Changes" 
                      : hasNewSelection 
                        ? "Confirm New Assignments" 
                        : "Finalize Selection"
                    }
                  </span>
                  <ChevronRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AssignModal;
