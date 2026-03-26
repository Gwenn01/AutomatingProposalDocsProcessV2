import { useEffect, useState } from "react";
import { X, FileText, Loader2 } from "lucide-react";
import { getCoverPage, type ProposalCoverPage } from "@/api/admin-api";
import Header from "./CoverPage/Header";
import Letter from "./CoverPage/Letter";
import Signatory from "./CoverPage/Signatory";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  coverPageId: number | null;
  proposalId: number | null;
  proposalTitle?: string; // Added proposalTitle to props
}

const ViewCoverPageModal = ({ isOpen, onClose, coverPageId, proposalTitle }: Props) => {
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

  const formattedDate = coverPage?.submission_date
    ? new Date(coverPage.submission_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      {/* Full Screen Square Modal */}
      <div className="relative w-full max-w-7xl h-screen md:h-[96vh] bg-white rounded-none shadow-2xl overflow-hidden flex flex-col">

        {/* Improved Solid Green Header */}
        <div className="bg-green-700 px-8 py-5 flex justify-between items-center flex-shrink-0 z-10 border-b border-green-800">
          <div className="flex items-center gap-4">
            <FileText size={28} className="text-white/90" strokeWidth={1.5} />

            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white leading-tight">
                View Cover Page
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
          >
            <X size={24} className="text-white opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-white relative custom-scrollbar pb-32">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="animate-spin text-green-600" size={40} />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Loading Document...
              </p>
            </div>
          ) : coverPage ? (
            <div className="w-full px-8 py-10 md:px-20 md:py-12">
              <Header />
              <div className="mt-10 pointer-events-none opacity-90 select-none">
                <Letter
                  date={formattedDate}
                  body={coverPage.cover_page_body}
                />
              </div>
              <div className="mt-16">
                <Signatory />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="font-medium tracking-widest uppercase text-xs">Document not found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCoverPageModal;