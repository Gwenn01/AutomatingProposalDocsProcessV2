// components/admin/CreateCoverPageModal.tsx
import React, { useState } from "react";
import { X, FileText, Loader2 } from "lucide-react";
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      {/* Full Screen Square Modal */}
      <div className="relative w-full max-w-7xl h-screen md:h-[96vh] bg-white rounded-none shadow-2xl overflow-hidden flex flex-col">

        {/* Improved Solid Green Header */}
        <div className="bg-green-700 px-8 py-5 flex justify-between items-center flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            {/* Icon without border or background box */}
            <FileText size={28} className="text-white/90" strokeWidth={1.5} />

            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white  leading-tight">
                Create Cover Page
              </h2>
              {proposalTitle && (
                <p className="text-[10px] text-green-100/70 font-bold uppercase tracking-[0.1em] truncate max-w-[600px] mt-0.5">
                  {proposalTitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="group p-2 hover:bg-white/10 transition-all duration-200"
            title="Close Modal"
          >
            <X size={24} className="text-white opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Content Area - Full Width Editor Look */}
        <div className="flex-1 overflow-y-auto bg-white relative custom-scrollbar pb-32">
          {/* Container is now max-w-full and has no 'paper' styling */}
          <div className="w-full px-8 py-10 md:px-20 md:py-12">
            <Header />
            <div className="mt-10">
              <Letter
                date={date}
                onDateChange={setDate}
                body={body}
                onBodyChange={setBody}
              />
            </div>
            <div className="mt-16">
              <Signatory />
            </div>
          </div>
        </div>

        {/* Smaller Floating Action Button (No Icon) */}
        <div className="absolute bottom-8 right-8 z-30 pointer-events-none">
          <button
            onClick={handleSubmit}
            disabled={loading || !body.trim()}
            className={`pointer-events-auto flex items-center px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-2xl
              ${loading || !body.trim()
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 shadow-green-900/30"
              }`}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : null}
            {loading ? "Processing..." : "Create Cover Page"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCoverPageModal;