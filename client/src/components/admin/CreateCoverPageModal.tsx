// components/admin/CreateCoverPageModal.tsx
import React, { useState } from "react";
import { X, FileText, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/context/toast";
import Header from "./CoverPage/Header";
import Letter from "./CoverPage/Letter";
import Signatory from "./CoverPage/Signatory";
import { createCoverPage, type CreateCoverPagePayload } from "@/api/admin-api";

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
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
  const [body, setBody] = useState("");

  if (!isOpen || !proposalId) return null;

  const handleSubmit = async () => {
    if (!body.trim()) {
      showToast("Please enter the letter body before generating.", "error");
      return;
    }

    const payload: CreateCoverPagePayload = {
      proposal: proposalId,
      cover_page_body: body,
      submission_date: new Date().toISOString().split("T")[0],
    };

    setLoading(true);
    try {
      const res = await createCoverPage(payload);
      showToast(res.message, "success");
      onClose();
    } catch (error: any) {
      showToast(error.message || "Failed to generate cover page.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm">
      {/* Pinalaki natin ang width (max-w-6xl) at ginawang mas responsive */}
      <div className="relative w-full max-w-6xl h-[96vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">

        {/* Modal Header */}
        <div className="bg-slate-50 p-5 border-b border-slate-200 flex justify-between items-center flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-600 shadow-sm">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Create Cover Letter</h2>
              {proposalTitle && (
                <p className="text-sm text-slate-500 font-medium truncate max-w-[500px]">
                  {proposalTitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-700"
          >
            <X size={22} />
          </button>
        </div>

        {/* Full-Screen Document Area */}
        {/* Inalis ang bg-slate-200, ginawang buong canvas ang document layout */}
        <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
          <div className="w-full max-w-[900px] mx-auto px-8 py-12 md:px-12 md:py-16 min-h-full">
            <Header />
            <div className="mt-10">
              <Letter
                date={date}
                onDateChange={setDate}
                body={body}
                onBodyChange={setBody}
              />
            </div>
            <div className="mt-12">
              <Signatory />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-between items-center flex-shrink-0 z-10">
          <button
            onClick={onClose}
            className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-all text-sm tracking-wide"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !body.trim()}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-95
              ${loading || !body.trim()
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-emerald-600 shadow-lg shadow-slate-300 hover:shadow-emerald-500/30"
              }`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Sparkles size={18} className="text-emerald-400" />
            )}
            {loading ? "Generating..." : "Generate & Finalize"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCoverPageModal;