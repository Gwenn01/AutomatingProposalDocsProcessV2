import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  X,
  Search,
  Check,
  User,
  Loader2,
  ChevronRight,
  FileText,
  UserPlus,
  Plus,
  ShieldCheck,
} from "lucide-react";
import {
  getAllReviewers,
  getAssignedReviewers,
  assignReviewer,
  type ApiUser,
  type ReviewerAssignment,
} from "@/utils/admin-api";

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: { id: number; title: string } | null;
  onUpdate: (proposalId: number) => void;
}

const AssignModal: React.FC<AssignModalProps> = ({
  isOpen,
  onClose,
  data,
  onUpdate,
}) => {
  const [assignSearch, setAssignSearch] = useState("");
  const [reviewers, setReviewers] = useState<ApiUser[]>([]);
  const [assigned, setAssigned] = useState<ReviewerAssignment[]>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReviewers, setIsLoadingReviewers] = useState(false);

  useEffect(() => {
    if (!isOpen || !data) return;

    const fetchData = async () => {
      setIsLoadingReviewers(true);

      try {
        const [reviewerList, assignments] = await Promise.all([
          getAllReviewers(),
          getAssignedReviewers(data.id),
        ]);

        setReviewers(reviewerList);
        setAssigned(assignments);

        // Backend already filtered by proposal
        const alreadyAssigned = assignments.map((a) => a.reviewer.id);

        setSelectedReviewers(alreadyAssigned);
      } catch (error) {
        console.error("Failed to load reviewers:", error);
      } finally {
        setIsLoadingReviewers(false);
      }
    };

    fetchData();
  }, [isOpen, data]);

  // Optional: reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAssignSearch("");
      setSelectedReviewers([]);
      setAssigned([]);
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const toggleReviewer = (id: number) => {
    setSelectedReviewers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleConfirm = async () => {
    if (!data) return;

    setIsSubmitting(true);

    try {
      const currentAssignedIds = assigned.map((a) => a.reviewer.id);
      const newSelections = selectedReviewers.filter(
        (id) => !currentAssignedIds.includes(id),
      );

      if (newSelections.length === 0) {
        onClose();
        return;
      }

      const assignedResults = await Promise.all(
        newSelections.map((reviewerId) =>
          assignReviewer({
            proposal: data.id,
            reviewer: reviewerId,
          }),
        ),
      );
      setAssigned((prev) => [...prev, ...assignedResults]);
      onUpdate(data.id);
      onClose();
    } catch (error: any) {
      console.error("Assignment failed:", error);
      alert(error.message || "Failed to assign reviewer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviewers = reviewers.filter((reviewer) =>
    reviewer.profile.name.toLowerCase().includes(assignSearch.toLowerCase()),
  );

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-[520px] rounded-[45px] shadow-2xl overflow-hidden flex flex-col border border-slate-100">
        {/* 1. Header Section */}
        <div className="p-10 pb-6">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-5">
              {/* Minimalist Icon Block */}
              <div className="relative group">
                <div className="w-12 h-12 rounded-[16px] bg-emerald-50 flex items-center justify-center transition-transform duration-500 group-hover:rotate-[10deg]">
                  <UserPlus size={22} className="text-emerald-600" />
                </div>
                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div>
                <h2 className="text-[22px] font-bold text-slate-900 tracking-tight leading-none">
                  Assign Reviewer
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400/80">
                    Management Mode
                  </p>
                </div>
              </div>
            </div>

            {/* Refined Close Button */}
            <button
              onClick={onClose}
              className="group relative w-10 h-10 flex items-center justify-center rounded-full border border-slate-100 bg-white hover:bg-slate-900 transition-all duration-300 shadow-sm"
            >
              <X
                size={16}
                className="text-slate-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300"
              />
            </button>
          </div>

          {/* 2. Reference Document Card - Premium Minimalist */}
          <div className="mt-8 relative group">
            {/* Glassmorphism Background with Subtle Gradient */}
            <div className="relative p-6 rounded-[24px] bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] group-hover:-translate-y-1">
              {/* Animated Side Accent */}
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-emerald-500/80 rounded-r-full transition-all duration-500 group-hover:w-[6px] group-hover:bg-emerald-500" />

              {/* Header Row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-xl shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform duration-500">
                    <FileText size={16} className="text-emerald-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 leading-none">
                      Active Reference
                    </span>
                  </div>
                </div>

                {/* Premium ID Badge */}
                <div className="px-2.5 py-1 rounded-full bg-slate-100/50 border border-slate-200/40">
                  <span className="text-[9px] font-mono font-bold text-slate-500 tracking-tight">
                    ID:{" "}
                    {data.id
                      ? String(data.id).slice(-6).toUpperCase()
                      : "REF-001"}
                  </span>
                </div>
              </div>

              {/* Title Section */}
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                  {data.title || "Untitled Document"}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-[1px] w-4 bg-emerald-200" />
                  <span className="text-[10px] font-medium text-slate-400 italic">
                    Ready for Review
                  </span>
                </div>
              </div>

              {/* Subtle Vector Background Icon */}
              <FileText
                size={100}
                strokeWidth={1}
                className="absolute -right-6 -bottom-6 text-slate-100 -rotate-12 transition-all duration-700 group-hover:rotate-0 group-hover:text-emerald-50/50 pointer-events-none"
              />
            </div>

            {/* Ambient Glow behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/5 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        {/* 2. Search Bar */}
        <div className="px-10 py-2">
          <div className="relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or expertise..."
              value={assignSearch}
              onChange={(e) => setAssignSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[22px] outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* 3. Reviewer List - Fixed height for 2 items only */}
        <div className="px-10 py-4">
          <div
            className="max-h-[200px] overflow-y-auto pr-2 space-y-4 custom-scrollbar scroll-smooth"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#10b981 transparent",
            }}
          >
            {isLoadingReviewers ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 className="animate-spin text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Loading Reviewers...
                </span>
              </div>
            ) : filteredReviewers.length > 0 ? (
              filteredReviewers.map((reviewer) => {
                const isAlreadyAssigned = assigned.some(
                  (a) => a.reviewer.id === reviewer.id,
                );
                const isSelected = selectedReviewers.includes(reviewer.id);

                return (
                  <button
                    key={reviewer.id}
                    onClick={() =>
                      !isAlreadyAssigned && toggleReviewer(reviewer.id)
                    }
                    disabled={isAlreadyAssigned}
                    className={`w-full flex items-center justify-between p-4 rounded-[30px] border-2 transition-all duration-300 ${
                      isAlreadyAssigned
                        ? "bg-emerald-50/40 border-emerald-100 cursor-not-allowed" // Green style for already assigned
                        : isSelected
                          ? "bg-white border-emerald-400 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.3)] scale-[0.98]"
                          : "bg-white border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          isAlreadyAssigned
                            ? "bg-emerald-100 text-emerald-600"
                            : isSelected
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 rotate-3"
                              : "bg-slate-50 text-slate-400"
                        }`}
                      >
                        <User size={22} />
                        {(isSelected || isAlreadyAssigned) && (
                          <div
                            className={`absolute -top-1 -right-1 w-5 h-5 border-2 border-white rounded-full flex items-center justify-center animate-in zoom-in ${
                              isAlreadyAssigned
                                ? "bg-emerald-500"
                                : "bg-emerald-400"
                            }`}
                          >
                            <Check
                              size={10}
                              className="text-white stroke-[4px]"
                            />
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-bold text-[15px] ${
                              isAlreadyAssigned
                                ? "text-emerald-700"
                                : isSelected
                                  ? "text-slate-800"
                                  : "text-slate-600"
                            }`}
                          >
                            {reviewer.profile.name}
                          </p>
                          {/* Indicator after name when assigned */}
                          {isAlreadyAssigned && (
                            <div className="px-2 py-0.5 rounded-md bg-emerald-100 flex items-center gap-1">
                              <ShieldCheck
                                size={10}
                                className="text-emerald-600"
                              />
                              <span className="text-[8px] font-black uppercase text-emerald-600 tracking-tighter">
                                Assigned
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-bold ${isAlreadyAssigned ? "text-emerald-600/50" : "text-slate-400"}`}
                          >
                            Expert Reviewer
                          </span>
                          {isSelected && !isAlreadyAssigned && (
                            <span className="flex items-center gap-1">
                              <span className="text-emerald-200 text-[8px]">
                                ●
                              </span>
                              <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-500">
                                Selected
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Minimalist Icon Indicator */}
                    <div className="flex items-center justify-center mr-2">
                      {isAlreadyAssigned ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
                          <Check size={16} className="stroke-[4px]" />
                        </div>
                      ) : isSelected ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-200 animate-in zoom-in">
                          <Check size={16} className="stroke-[4px]" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-slate-100 text-slate-200 flex items-center justify-center group-hover:border-emerald-200 group-hover:text-emerald-300 transition-colors">
                          <Plus size={16} className="stroke-[3px]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-10">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-300">
                  No Experts Found
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 4. Footer - Minimal 50/50 Split */}
        <div className="px-10 py-6 bg-white border-t border-slate-50 flex items-center justify-between gap-4 mt-auto">
          <button
            onClick={onClose}
            className="w-1/2 h-12 rounded-[18px] border-2 border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-[0.97]"
          >
            Discard
          </button>

          <button
            onClick={handleConfirm}
            disabled={isSubmitting || selectedReviewers.length === 0}
            className="w-1/2 h-12 rounded-[18px] bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-300 text-white font-bold text-[10px] uppercase tracking-[0.12em] flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 transition-all active:scale-[0.97] disabled:shadow-none disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <span className="truncate">Confirm</span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${selectedReviewers.length === 0 ? "bg-slate-200" : "bg-emerald-500"}`}
                >
                  <ChevronRight size={12} className="text-white" />
                </div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AssignModal;
