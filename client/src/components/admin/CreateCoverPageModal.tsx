// components/admin/CreateCoverPageModal.tsx
import React, { useState } from "react";
import { X, FileText, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/context/toast";
import {
  createCoverPage,
  type CreateCoverPagePayload,
} from "@/utils/admin-api";

interface CreateCoverPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: number | null;
  proposalTitle?: string;
}

const CreateCoverPageModal: React.FC<CreateCoverPageModalProps> = ({
  isOpen,
  onClose,
  proposalId,
  proposalTitle,
}) => {
  const { showToast } = useToast();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !proposalId) return null;

  const handleSubmit = async () => {
    if (!body) {
      showToast("Please enter cover page content", "error");
      return;
    }

    const payload: CreateCoverPagePayload = {
      proposal: proposalId,
      cover_page_body: body,
      submission_date: new Date().toISOString().split("T")[0],
    };

    try {
      setLoading(true);
      const res = await createCoverPage(payload);
      showToast(res.message, "success");
      onClose();
    } catch (error: any) {
      showToast(error.message || "Failed to create cover page", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* 1. Header Section */}
        <div className="p-10 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Document Suite
                </span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Create Cover
              </h2>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                <FileText size={12} className="text-emerald-600" />
                <p className="text-[11px] text-slate-500 font-bold leading-none truncate max-w-[300px]">
                  {proposalTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 2. Content Area - The "Bento Canvas" */}
        <div className="px-10 pb-4">
          <div className="relative group">
            {/* Decorative Label for Textarea */}
            <div className="absolute -top-3 left-6 px-2 bg-white text-[9px] font-black uppercase tracking-widest text-emerald-600 z-10">
              Main Content Body
            </div>

            <textarea
              placeholder="Start typing the formal cover content..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-8 bg-slate-50/50 border-2 border-slate-100 rounded-[32px] text-sm text-slate-700 outline-none focus:border-emerald-500/30 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-500 placeholder:text-slate-300 leading-relaxed resize-none shadow-inner"
              rows={10}
            />

            {/* Word Count / Visual Detail */}
            <div className="absolute bottom-6 right-8 flex items-center gap-2">
              <div className="h-1 w-12 rounded-full bg-slate-100" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                Draft Mode
              </span>
            </div>
          </div>
        </div>

        {/* 3. Action Footer */}
        <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || !body}
            className={`
            relative group/btn overflow-hidden flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500
            ${
              loading || !body
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-emerald-600 shadow-xl shadow-slate-200 hover:shadow-emerald-500/20 active:scale-95"
            }
          `}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Sparkles
                size={16}
                className="text-emerald-400 group-hover/btn:text-white transition-colors"
              />
            )}
            <span>{loading ? "Generating..." : "Generate Cover"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCoverPageModal;
