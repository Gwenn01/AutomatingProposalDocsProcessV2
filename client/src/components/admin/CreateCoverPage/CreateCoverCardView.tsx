import { FilePlus, Eye, Pencil, FileText } from "lucide-react"; // Pinalitan ang Users ng Pencil at FileText
import { type ProgramProposal, type ProposalCoverPage } from "@/api/admin-api";
import { getStatusStyleAdmin, type ProposalStatus } from "@/utils/statusStyles";

interface CoverPageCardViewProps {
  data: ProgramProposal[];
  coverPages: ProposalCoverPage[];
  onOpenCreate: (doc: ProgramProposal) => void;
  onOpenView: (coverId: number) => void;
  onOpenEdit: (coverId: number, doc: ProgramProposal) => void; // Idinagdag
}

const CoverPageCardView = ({
  data,
  coverPages,
  onOpenCreate,
  onOpenView,
  onOpenEdit, // Idinagdag
}: CoverPageCardViewProps) => {

  return (
    <>
      {data.map((doc) => {
        const status = getStatusStyleAdmin(doc.status as ProposalStatus);

        // Kunin ang cover record para makuha ang ID
        const coverRecord = coverPages.find((c) => c.proposal === doc.id);
        const hasCover = !!coverRecord;

        return (
          <div
            key={doc.id}
            className="bg-white rounded-xl p-7 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border flex flex-col justify-between min-h-[280px] hover:shadow-lg transition-shadow duration-300"
          >
            {/* Top Content */}
            <div>
              <div className="flex justify-between items-start mb-5">
                <span className={`px-4 py-2.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase ${status.className}`}>
                  {status.label}
                </span>

                {hasCover ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-700 font-bold text-[10px] uppercase tracking-wider">Ready</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Pending</span>
                  </span>
                )}
              </div>

              <h3
                className="text-base font-bold text-gray-900 mb-2 leading-tight line-clamp-2 min-h-[3rem]"
                title={doc.title}
              >
                {doc.title}
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <FileText size={14} className="text-slate-400" />
                <p className="text-gray-400 text-[11px] font-bold tracking-wider">
                  REF: #{String(doc.id).padStart(4, "0")}
                </p>
              </div>
            </div>

            {/* Actions Area */}
            <div className="flex flex-col gap-2 mt-4">
              {hasCover && coverRecord ? (
                <div className="flex gap-2">
                  {/* View Button */}
                  <button
                    onClick={() => onOpenView(coverRecord.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white py-3 rounded-lg font-bold text-xs hover:bg-indigo-700 transition-all active:scale-95 shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => onOpenEdit(coverRecord.id, doc)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-white text-amber-600 border-2 border-amber-100 py-3 rounded-lg font-bold text-xs hover:bg-amber-50 hover:border-amber-200 transition-all active:scale-95"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              ) : (
                /* Create Button */
                <button
                  onClick={() => onOpenCreate(doc)}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white py-3 rounded-lg font-bold text-xs hover:bg-emerald-700 transition-all active:scale-95 shadow-md shadow-emerald-100"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Create Cover Page</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CoverPageCardView;