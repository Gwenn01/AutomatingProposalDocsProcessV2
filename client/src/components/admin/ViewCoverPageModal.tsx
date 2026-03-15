import { useEffect, useState } from "react";
import { X, Calendar, FileText, Loader2, Bookmark } from "lucide-react";
import { getCoverPage, type ProposalCoverPage } from "@/api/admin-api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  coverPageId: number | null;
}

const ViewCoverPageModal = ({ isOpen, onClose, coverPageId }: Props) => {
  const [coverPage, setCoverPage] = useState<ProposalCoverPage | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coverPageId || !isOpen) return;

    const fetchCover = async () => {
      try {
        setLoading(true);
        const data = await getCoverPage(coverPageId);
        setCoverPage(data);
      } catch (error) {
        console.error("Failed to load cover page", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCover();
  }, [coverPageId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative w-full max-w-2xl bg-white rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header Section */}
        <div className="p-10 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
                  Document Viewer
                </span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                Cover Details
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-4 rounded-full bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-300 border border-transparent hover:border-emerald-100"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-10 pb-10 flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Fetching Document...
              </p>
            </div>
          ) : coverPage ? (
            <div className="space-y-8">
              {/* Metadata Pill */}
              <div className="flex items-center gap-6">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-50/50 rounded-full border border-emerald-100/50">
                  <Calendar size={14} className="text-emerald-600" />
                  <span className="text-[12px] text-emerald-800 font-bold">
                    Submitted:{" "}
                    {new Date(coverPage.submission_date).toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" },
                    )}
                  </span>
                </div>
              </div>

              {/* Document Body */}
              <div className="relative group">
                <div className="absolute -top-3 left-8 px-3 bg-white text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 z-10 flex items-center gap-2">
                  <Bookmark size={10} fill="currentColor" />
                  Official Content
                </div>

                <div className="w-full min-h-[300px] p-10 bg-slate-50/30 border-2 border-slate-100 rounded-[40px] text-lg text-slate-700 leading-relaxed font-medium shadow-inner whitespace-pre-wrap">
                  {coverPage.cover_page_body}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
              <FileText size={40} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">
                No cover page content found.
              </p>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="px-12 py-8 bg-white border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-3 px-10 py-4 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[13px] uppercase tracking-widest border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-lg shadow-emerald-100"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCoverPageModal;
