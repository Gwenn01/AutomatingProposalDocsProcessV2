import { FileText, Users, Check, XCircle } from "lucide-react";
import { type ProgramProposal } from "@/api/admin-api";
import { getStatusStyleAdmin, type ProposalStatus } from "@/utils/statusStyles";

interface ProposalsTableViewProps {
  data: ProgramProposal[];
  docViewerLoading: boolean;
  onOpenReviewerModal: (id: number, title: string) => void;
  onOpenDocViewer: (doc: ProgramProposal) => void;
  onOpenReviewedDoc: (doc: ProgramProposal) => void;
}

const ProposalsTableView = ({
  data,
  docViewerLoading,
  onOpenReviewerModal,
  onOpenDocViewer,
  onOpenReviewedDoc,
}: ProposalsTableViewProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300">
          <tr className="text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
            <th className="px-6 py-4">Proposal</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Reviewers</th>
            <th className="px-6 py-4 text-center">Management</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((doc) => {
            const status = getStatusStyleAdmin(doc.status as ProposalStatus);

            return (
              <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">

                {/* 1. Proposal Info */}
                <td className="px-6 py-5 align-middle">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center border border-slate-200 group-hover:from-emerald-50 group-hover:to-emerald-100 group-hover:border-emerald-200 transition-all duration-300">
                      <FileText size={18} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-semibold text-sm leading-relaxed group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {doc.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/50">
                          ID-{String(doc.id).padStart(4, "0")}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[11px] text-slate-400 italic">Updated 2d ago</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Status */}
                <td className="px-6 py-5 text-center align-middle">
                  <span className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 min-w-[130px] shadow-sm ${status.className}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {status.label}
                  </span>
                </td>

                {/* 3. Reviewers */}
                <td className="px-6 py-5 text-center align-middle">
                  <button
                    onClick={() => onOpenReviewerModal(doc.id, doc.title)}
                    className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-700 font-semibold text-xs">{doc.reviewer_count || 0}</span>
                    <Users size={13} className="text-green-600" />
                  </button>
                </td>

                {/* 4. Actions */}
                <td className="px-6 py-5 text-center align-middle">
                  {/* Added flex-nowrap and whitespace-nowrap to prevent breaking */}
                  <div className="flex items-center justify-center gap-2 flex-nowrap whitespace-nowrap">

                    {/* View Docs */}
                    <button
                      onClick={() => onOpenDocViewer(doc)}
                      disabled={docViewerLoading}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-600 px-3 py-2 rounded-lg text-xs font-semibold hover:from-blue-100 hover:to-indigo-100 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Docs
                    </button>

                    {/* View Reviews */}
                    <button
                      onClick={() => onOpenReviewedDoc(doc)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 px-3 py-2 rounded-lg text-xs font-semibold hover:from-emerald-100 hover:to-teal-100 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      View Reviews
                    </button>

                    {/* Approve / Reject — rendered directly in the same flex container */}
                    {doc.status === "for_approval" && (
                      <>
                        <button className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-600 border border-emerald-100 px-3 py-2 rounded-lg text-xs font-bold uppercase hover:from-emerald-500 hover:to-green-500 hover:text-white hover:border-transparent transition-all shadow-sm">
                          <Check size={12} strokeWidth={3} />
                          Approve
                        </button>

                        <button className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-50 to-red-50 text-rose-500 border border-rose-100 px-3 py-2 rounded-lg text-xs font-bold uppercase hover:from-rose-500 hover:to-red-500 hover:text-white hover:border-transparent transition-all shadow-sm">
                          <XCircle size={12} />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProposalsTableView;