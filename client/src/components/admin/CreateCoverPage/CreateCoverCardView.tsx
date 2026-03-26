import { FilePlus, Eye, Users } from "lucide-react";
import { type ProgramProposal, type ProposalCoverPage } from "@/api/admin-api";
import { getStatusStyleAdmin, type ProposalStatus } from "@/utils/statusStyles";

interface CoverPageCardViewProps {
  data: ProgramProposal[];
  coverPages: ProposalCoverPage[];
  onOpenCreate: (doc: ProgramProposal) => void;
  onOpenView: (coverId: number) => void;
}

const CoverPageCardView = ({
  data,
  coverPages,
  onOpenCreate,
  onOpenView,
}: CoverPageCardViewProps) => {
  const hasCoverPage = (proposalId: number) =>
    coverPages.some((c) => c.proposal === proposalId);

  return (
    <>
      {data.map((doc) => {
        const status = getStatusStyleAdmin(doc.status as ProposalStatus);
        const hasCover = hasCoverPage(doc.id);

        return (
          <div
            key={doc.id}
            className="bg-white rounded-xl p-7 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border flex flex-col justify-between min-h-[260px]"
          >
            {/* Top Content */}
            <div>
              {/* Status + Cover Badge */}
              <div className="flex justify-between items-start mb-5">
                <span className={`px-4 py-2.5 rounded-full text-xs font-extrabold tracking-wide ${status.className}`}>
                  {status.label}
                </span>

                {hasCover ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-700 font-semibold text-xs">Cover Created</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-amber-700 font-semibold text-xs">No Cover</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                className="text-base font-bold text-gray-900 mb-3 leading-tight line-clamp-2"
                title={doc.title}
              >
                {doc.title}
              </h3>

              {/* Reference */}
              <p className="text-gray-400 text-xs font-bold mb-3">
                Ref: #{String(doc.id).padStart(4, "0")}
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              {/* View Cover — only when cover exists */}
              {hasCover && (
                <button
                  onClick={() => {
                    const cover = coverPages.find((c) => c.proposal === doc.id);
                    if (cover) onOpenView(cover.id);
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 bg-[#4F46E5] text-white py-3 rounded-md font-bold text-xs hover:bg-[#4338CA] transition-colors"
                >
                  <Eye className="w-[18px] h-[18px]" />
                  <span>View Cover</span>
                </button>
              )}

              {/* Create Cover / Cover Created */}
              <button
                onClick={() => { if (!hasCover) onOpenCreate(doc); }}
                disabled={hasCover}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-md font-bold text-xs transition-colors ${hasCover
                    ? "bg-emerald-100 text-emerald-700 cursor-default opacity-80"
                    : "bg-amber-500 text-white hover:bg-amber-600"
                  }`}
              >
                {hasCover ? (
                  <>
                    <Users className="w-[18px] h-[18px]" />
                    <span>Cover Created</span>
                  </>
                ) : (
                  <>
                    <FilePlus className="w-[18px] h-[18px]" />
                    <span>Create Cover</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CoverPageCardView;