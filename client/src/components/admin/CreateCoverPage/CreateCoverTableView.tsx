import { FileText, Eye, FilePlus, CheckCircle2, FileX, Pencil, Trash2 } from "lucide-react";
import { type ProgramProposal, type ProposalCoverPage } from "@/api/admin-api";
import { getStatusStyle, type ProposalStatus } from "@/utils/statusStyles";

interface CoverPageTableViewProps {
    data: ProgramProposal[];
    coverPages: ProposalCoverPage[];
    onOpenCreate: (doc: ProgramProposal) => void;
    onOpenView: (coverId: number) => void;
    onOpenEdit: (coverId: number, doc: ProgramProposal) => void;
    onOpenDelete: (coverId: number) => void;
}

const CoverPageTableView = ({
    data,
    coverPages,
    onOpenCreate,
    onOpenView,
    onOpenEdit,
    onOpenDelete
}: CoverPageTableViewProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300">
                    <tr className="text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        <th className="px-6 py-4">Proposal Details</th>
                        <th className="px-6 py-4 text-center">Cover Page</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Quick Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((doc) => {
                        const status = getStatusStyle(doc.status as ProposalStatus);
                        const isApproved = doc.status === "approved";

                        // Hanapin ang specific cover page record para sa proposal na ito
                        const coverRecord = coverPages.find((c) => c.proposal === doc.id);
                        const hasCover = !!coverRecord;

                        return (
                            <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                                {/* 1. Proposal Info */}
                                <td className="px-6 py-5 align-middle">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${isApproved
                                            ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 group-hover:border-emerald-300"
                                            : "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-200 group-hover:from-emerald-50 group-hover:to-emerald-100 group-hover:border-emerald-200"
                                            }`}>
                                            <FileText
                                                size={18}
                                                className={`transition-colors ${isApproved
                                                    ? "text-emerald-500"
                                                    : "text-slate-400 group-hover:text-emerald-600"
                                                    }`}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-900 font-semibold text-sm leading-relaxed group-hover:text-emerald-700 transition-colors line-clamp-2">
                                                {doc.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/50">
                                                    ID-{String(doc.id).padStart(4, "0")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* 2. Cover Page Status Icon */}
                                <td className="px-6 py-5 text-center align-middle">
                                    <div className="flex justify-center group/status">
                                        {hasCover ? (
                                            <div
                                                title="Cover Page Created"
                                                className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm transition-all group-hover/status:scale-110 group-hover/status:bg-emerald-100"
                                            >
                                                <CheckCircle2 size={18} strokeWidth={2.5} />
                                            </div>
                                        ) : (
                                            <div
                                                title="No Cover Page"
                                                className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 text-slate-300 border border-slate-100 transition-all group-hover/status:text-amber-400 group-hover/status:bg-amber-50 group-hover/status:border-amber-100"
                                            >
                                                <FileX size={18} strokeWidth={2} />
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* 3. Proposal Status Badge */}
                                <td className="px-6 py-5 text-center align-middle">
                                    <span className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 min-w-[130px] shadow-sm ${status.className}`}>
                                        {status.label}
                                    </span>
                                </td>

                                {/* 4. Actions */}
                                <td className="px-6 py-5 text-center align-middle">
                                    <div className="flex items-center justify-center gap-2 flex-nowrap">
                                        {hasCover ? (
                                            <>
                                                {/* View */}
                                                <button
                                                    title="View"
                                                    onClick={() => onOpenView(coverRecord.id)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-all shadow-sm hover:scale-105 active:scale-95"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                {/* Edit */}
                                                <button
                                                    title="Edit"
                                                    onClick={() => onOpenEdit(coverRecord.id, doc)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-sm hover:scale-105 active:scale-95"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    title="Delete"
                                                    onClick={() => onOpenDelete(coverRecord.id)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm hover:scale-105 active:scale-95"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            /* Create Button */
                                            <button
                                                onClick={() => onOpenCreate(doc)}
                                                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all hover:bg-emerald-600 hover:scale-105 active:scale-95"
                                            >
                                                <FilePlus className="w-4 h-4" />
                                                Create Cover
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

export default CoverPageTableView;