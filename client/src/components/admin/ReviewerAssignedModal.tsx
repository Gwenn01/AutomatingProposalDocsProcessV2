import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { X, Users, Mail, FileText, Loader2, Calendar } from "lucide-react";
import {
  getAssignedReviewers,
  type ReviewerAssignment,
} from "@/utils/admin-api";

interface ReviewerAssignedModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: number | null;
  proposalTitle?: string;
}

const ReviewerAssignedModal = ({
  isOpen,
  onClose,
  proposalId,
  proposalTitle,
}: ReviewerAssignedModalProps) => {
  const [loading, setLoading] = useState(false);
  const [reviewers, setReviewers] = useState<ReviewerAssignment[]>([]);

  useEffect(() => {
    if (!isOpen || !proposalId) return;

    const fetchAssigned = async () => {
      try {
        setLoading(true);
        const data = await getAssignedReviewers(proposalId);
        setReviewers(data);
      } catch (error) {
        console.error("Failed to fetch assigned reviewers", error);
        setReviewers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssigned();
  }, [isOpen, proposalId]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* 1. Decorative Header Section */}
        <div className="p-10 pb-6 border-b border-slate-50">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Assigned Reviewers
              </h2>
              {proposalTitle && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                  <FileText size={12} className="text-emerald-600" />
                  <p className="text-[11px] text-slate-500 font-medium leading-none">
                    {proposalTitle}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 2. Content Area */}
        <div className="p-10 pt-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2
                className="animate-spin text-emerald-500 mb-4"
                size={32}
              />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Fetching Reviewers...
              </span>
            </div>
          ) : reviewers.length === 0 ? (
            <div className="text-center py-20 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
              <Users size={40} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                No Reviewers Assigned Yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {reviewers.map((assignment) => {
                const reviewer = assignment.reviewer;
                const initial = reviewer.profile.name.charAt(0).toUpperCase();

                return (
                  <div
                    key={assignment.id}
                    className="group relative flex items-center justify-between p-6 rounded-[32px] bg-white border-2 border-slate-50 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-5">
                      {/* Initial Icon Avatar */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                        {initial}
                      </div>

                      <div>
                        <h3 className="font-bold text-[17px] text-slate-800 tracking-tight leading-none mb-1.5">
                          {reviewer.profile.name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Mail size={12} className="text-emerald-500/60" />
                            <span className="text-[12px] font-medium lowercase tracking-tight">
                              {reviewer.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Tag / Date */}
                    <div className="text-right hidden sm:block">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1.5 px-1">
                        Assigned Date
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 shadow-sm group-hover:border-emerald-100 group-hover:bg-white transition-all duration-300">
                        <Calendar size={12} className="text-emerald-500" />
                        <span className="text-[11px] font-bold text-slate-600 tracking-tight">
                          {new Date(assignment.assigned_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ReviewerAssignedModal;
