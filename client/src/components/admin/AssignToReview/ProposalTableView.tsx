import { FileText, UserPlus, UserMinus, Users } from "lucide-react";
import { type ProgramProposal } from "@/api/admin-api";
import { getStatusStyle, type ProposalStatus } from "@/utils/statusStyles";
interface Props {
    data: ProgramProposal[];
    assignedMap: Record<number, number>;
    onOpenReviewerModal: (id: number, title: string) => void;
    onOpenAssign: (doc: ProgramProposal) => void;
    onOpenUnassign: (doc: ProgramProposal) => void;
    isRefetching?: boolean;
}

const ProposalTableView = ({ data, assignedMap, onOpenReviewerModal, onOpenAssign, onOpenUnassign, isRefetching }: Props) => {
    return (
        <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {isRefetching && (
                <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[3px] flex items-center justify-center rounded-2xl">
                    <div className="flex flex-col items-center gap-3 px-6 py-5 bg-white rounded-2xl shadow-lg border border-slate-100">

                        {/* Spinner */}
                        <div className="relative w-10 h-10">
                            <div className="absolute inset-0 rounded-full border-[3px] border-emerald-100" />
                            <div className="absolute inset-0 rounded-full border-[3px] border-emerald-500 border-t-transparent animate-spin" />
                        </div>

                        {/* Text */}
                        <div className="text-center">
                            <p className="text-sm font-bold text-slate-700 tracking-tight">Syncing changes</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Refreshing proposal data...</p>
                        </div>

                    </div>
                </div>
            )}
            <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300">
                    <tr className="text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        <th className="px-6 py-4">Proposal</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Reviewers</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((doc) => {
                        const status = getStatusStyle(doc.status as ProposalStatus);
                        const hasReviewer = assignedMap[doc.id] > 0;

                        return (
                            <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                                {/* Proposal Info */}
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

                                {/* Status */}
                                <td className="px-6 py-5 text-center align-middle">
                                    <span className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 min-w-[130px] shadow-sm ${status.className}`}>
                                        {status.label}
                                    </span>
                                </td>

                                {/* Reviewers ← add this entire td */}
                                <td className="px-6 py-5 text-center align-middle">
                                    <button
                                        onClick={() => onOpenReviewerModal(doc.id, doc.title)}
                                        className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                    >
                                        <span className="text-green-700 font-semibold text-xs">{doc.reviewer_count || 0}</span>
                                        <Users size={13} className="text-green-600" />
                                    </button>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-5 text-center align-middle">
                                    <div className="flex items-center justify-center gap-2 flex-nowrap whitespace-nowrap">
                                        {hasReviewer ? (
                                            <>
                                                <button
                                                    onClick={() => onOpenAssign(doc)}
                                                    className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-green-100 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                                >
                                                    <UserPlus size={14} /> Assign
                                                </button>
                                                <button
                                                    onClick={() => onOpenUnassign(doc)}
                                                    className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-500 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                                >
                                                    <UserMinus size={14} /> Unassign
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => onOpenAssign(doc)}
                                                className="inline-flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                            >
                                                <UserPlus size={14} /> Assign Reviewer
                                            </button>
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

export default ProposalTableView;