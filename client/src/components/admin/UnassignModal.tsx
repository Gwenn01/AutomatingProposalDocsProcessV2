import { useState, useEffect } from "react";
import ReactDom from "react-dom";
import {
  X,
  Search,
  Loader2,
  Trash2,
  UserMinus,
  FileText,
  User,
  ChevronRight,
  Check,
} from "lucide-react";
import {
  getAssignedReviewers,
  unassignReviewer,
  type ReviewerAssignment,
} from "@/utils/admin-api";

interface UnassignModalPropos {
  isOpen: boolean;
  onClose: () => void;
  data: { id: number; title: string } | null;
  onUpdate: () => void;
}

const UnassignModal: React.FC<UnassignModalPropos> = ({
  isOpen,
  onClose,
  data,
  onUpdate,
}) => {
  const [assignedReviewers, setAssignedReviewers] = useState<
    ReviewerAssignment[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Track selected assignment for unassigning
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen || !data) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const assignments = await getAssignedReviewers(data.id);
        setAssignedReviewers(assignments);
      } catch (error) {
        console.error("Failed to load assigned reviewers", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isOpen, data]);

  useEffect(() => {
    if (!isOpen) {
      setAssignedReviewers([]);
      setSearchQuery("");
      setSelectedId(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const handleConfirmUnassign = async () => {
    if (!selectedId) return;
    setIsSubmitting(true);
    try {
      await unassignReviewer(selectedId);
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error(error.message || "Failed to unassign reviewer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAssignments = assignedReviewers.filter((a) =>
    a.reviewer?.profile?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return ReactDom.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-[520px] rounded-[45px] shadow-2xl overflow-hidden flex flex-col border border-slate-100">
        {/* 1. Header */}
        <div className="p-10 pb-6">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="w-12 h-12 rounded-[16px] bg-rose-50 flex items-center justify-center transition-transform duration-500 group-hover:rotate-[10deg]">
                  <UserMinus size={22} className="text-rose-600" />
                </div>
                <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h2 className="text-[22px] font-bold text-slate-900 tracking-tight leading-none">
                  Unassign Reviewer
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400/80">
                    Revoke Access
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group relative w-10 h-10 flex items-center justify-center rounded-full border border-slate-100 bg-white hover:bg-slate-900 transition-all duration-300"
            >
              <X
                size={16}
                className="text-slate-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300"
              />
            </button>
          </div>

          {/* 2. Doc Card */}
          <div className="mt-8 relative group">
            <div className="relative p-6 rounded-[24px] bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-rose-500/80 rounded-r-full" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-rose-50 rounded-xl">
                    <FileText size={16} className="text-rose-600" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">
                    Active Reference
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-slate-100/50 border border-slate-200/40">
                  <span className="text-[9px] font-mono font-bold text-slate-500">
                    ID:{" "}
                    {data.id
                      ? String(data.id).slice(-6).toUpperCase()
                      : "REF-001"}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                {data.title}
              </h3>
            </div>
          </div>
        </div>

        {/* 3. Search */}
        <div className="px-10 py-2">
          <div className="relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search assigned reviewers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[22px] outline-none focus:ring-2 focus:ring-rose-500/20 text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* 4. List */}
        <div className="px-10 py-4">
          <div className="max-h-[200px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 className="animate-spin text-rose-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Loading...
                </span>
              </div>
            ) : filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => {
                const isSelected = selectedId === assignment.id;
                return (
                  <button
                    key={assignment.id}
                    onClick={() =>
                      setSelectedId(isSelected ? null : assignment.id)
                    }
                    className={`w-full flex items-center justify-between p-4 rounded-[30px] border-2 transition-all duration-300 ${
                      isSelected
                        ? "bg-white border-rose-400 shadow-[0_10px_20px_-10px_rgba(244,63,94,0.3)] scale-[0.98]"
                        : "bg-white border-slate-50 hover:border-rose-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-rose-500 text-white rotate-3"
                            : "bg-slate-50 text-slate-400"
                        }`}
                      >
                        <User size={22} />
                      </div>
                      <div className="text-left">
                        <p
                          className={`font-bold text-[15px] ${isSelected ? "text-slate-900" : "text-slate-700"}`}
                        >
                          {assignment.reviewer?.profile?.name}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                          {assignment.reviewer?.profile?.department ||
                            "General"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center mr-2">
                      {isSelected ? (
                        <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md animate-in zoom-in">
                          <Check size={16} className="stroke-[4px]" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-slate-100 text-slate-200 flex items-center justify-center">
                          <Trash2
                            size={14}
                            className="group-hover:text-rose-400 transition-colors"
                          />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-300 uppercase font-black text-[10px] tracking-widest">
                No Reviewers Found
              </div>
            )}
          </div>
        </div>

        {/* 5. Footer Split Actions */}
        <div className="px-10 py-6 bg-white border-t border-slate-50 flex items-center justify-between gap-4 mt-auto">
          <button
            onClick={onClose}
            className="w-1/2 h-12 rounded-[18px] border-2 border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 transition-all active:scale-[0.97]"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmUnassign}
            disabled={isSubmitting || !selectedId}
            className="w-1/2 h-12 rounded-[18px] bg-rose-600 hover:bg-rose-700 disabled:bg-slate-100 disabled:text-slate-300 text-white font-bold text-[10px] uppercase tracking-[0.12em] flex items-center justify-center gap-2 shadow-lg shadow-rose-900/10 transition-all active:scale-[0.97] disabled:shadow-none disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <span className="truncate">Remove Access</span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${!selectedId ? "bg-slate-200" : "bg-rose-500"}`}
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

export default UnassignModal;
