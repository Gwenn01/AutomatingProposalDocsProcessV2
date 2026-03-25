import { FileText, Users, User, Eye } from "lucide-react";
import { type ProgramProposal } from "@/api/admin-api";
import { getStatusStyleAdmin, type ProposalStatus } from "@/utils/statusStyles";

interface ProposalsCardViewProps {
  data: ProgramProposal[];
  docViewerLoading: boolean;
  onOpenReviewerModal: (id: number, title: string) => void;
  onOpenDocViewer: (doc: ProgramProposal) => void;
  onOpenReviewedDoc: (doc: ProgramProposal) => void;
}

const ProposalsCardView = ({
  data,
  docViewerLoading,
  onOpenReviewerModal,
  onOpenDocViewer,
  onOpenReviewedDoc,
}: ProposalsCardViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {data.map((doc) => {
        const status = getStatusStyleAdmin(doc.status as ProposalStatus);

        return (
          <div
            key={doc.id}
            className="group relative bg-white rounded-[35px] border border-slate-100 p-2 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 hover:-translate-y-1"
          >
            {/* Main Card Content */}
            <div className="p-6">
              {/* Top Row: ID & Status */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                    <FileText
                      size={18}
                      className="text-slate-400 group-hover:text-emerald-600"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-300 leading-none mb-1">
                      Reference
                    </p>
                    <p className="text-[11px] font-mono font-bold text-slate-500">
                      #{String(doc.id).padStart(4, "0")}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest shadow-sm transition-all duration-300 ${status.className}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                    {status.label}
                  </div>
                </div>
              </div>

              {/* Proposal Title */}
              <div className="mb-8">
                <h3 className="font-bold text-[17px] text-slate-800 leading-snug tracking-tight group-hover:text-emerald-700 transition-colors line-clamp-2 min-h-[3rem]">
                  {doc.title}
                </h3>
              </div>

              {/* Stats Pod */}
              <div
                onClick={() => onOpenReviewerModal(doc.id, doc.title)}
                className="bg-slate-50/50 rounded-[24px] p-4 flex items-center justify-between border border-slate-100/50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(doc.reviewer_count, 3))].map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden"
                      >
                        <User size={12} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">
                    {doc.reviewer_count} Reviewer
                    {doc.reviewer_count !== 1 && "s"}
                  </span>
                </div>
                <div
                  className={`h-2 w-2 rounded-full ${doc.reviewer_count > 0 ? "bg-emerald-500" : "bg-slate-300"} animate-pulse`}
                />
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex gap-2 p-2 mt-2">
              {/* View Docs → DocumentViewerModal */}
              <button
                onClick={() => onOpenDocViewer(doc)}
                disabled={docViewerLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest rounded-[22px] bg-slate-50 text-slate-500 hover:bg-slate-900 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye size={14} />
                View Docs
              </button>

              {/* Reviews → ViewReviewedDocuments */}
              <button
                onClick={() => onOpenReviewedDoc(doc)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest rounded-[22px] bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200/50 transition-all duration-300"
              >
                <Users size={14} />
                Reviews
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProposalsCardView;