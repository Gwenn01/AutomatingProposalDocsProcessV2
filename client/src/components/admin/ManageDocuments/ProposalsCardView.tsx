import { Users, Eye } from "lucide-react";
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
    <>
      {data.map((doc) => {
        const status = getStatusStyleAdmin(doc.status as ProposalStatus);

        return (
          <div
            key={doc.id}
            className="bg-white rounded-xl p-7 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border flex flex-col justify-between min-h-[260px]"
          >
            {/* Top Content */}
            <div>
              {/* Status + Reviewer Button */}
              <div className="flex justify-between items-start mb-5">
                <span
                  className={`px-4 py-2.5 rounded-full text-xs font-extrabold tracking-wide ${status.className}`}
                >
                  {status.label}
                </span>

                <button
                  onClick={() => onOpenReviewerModal(doc.id, doc.title)}
                  className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition"
                >
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${doc.reviewer_count > 0 ? "bg-green-500" : "bg-gray-300"
                      }`}
                  />

                  <span className="text-green-700 font-semibold text-xs">
                    {doc.reviewer_count === 0
                      ? "No Assigned Reviewer"
                      : `${doc.reviewer_count} Reviewer${doc.reviewer_count !== 1 ? "s" : ""
                      }`}
                  </span>
                </button>
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
              <button
                onClick={() => onOpenDocViewer(doc)}
                disabled={docViewerLoading}
                className="flex-1 flex items-center justify-center space-x-2 bg-[#4F46E5] text-white py-3 rounded-md font-bold text-xs hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="w-[18px] h-[18px]" />
                <span>View Docs</span>
              </button>

              <button
                onClick={() => onOpenReviewedDoc(doc)}
                className="flex-1 flex items-center justify-center space-x-2 bg-amber-500 text-white py-3 rounded-md font-bold text-xs hover:bg-amber-600 transition-colors"
              >
                <Users className="w-[18px] h-[18px]" />
                <span>Reviews</span>
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ProposalsCardView;