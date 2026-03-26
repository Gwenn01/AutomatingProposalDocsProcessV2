import { FileText, Eye, FilePlus, Users, CheckCircle2, FileX } from "lucide-react";
import { type ProgramProposal, type ProposalCoverPage } from "@/api/admin-api";
import { getStatusStyleAdmin, type ProposalStatus } from "@/utils/statusStyles";

interface CoverPageTableViewProps {
    data: ProgramProposal[];
    coverPages: ProposalCoverPage[];
    onOpenCreate: (doc: ProgramProposal) => void;
    onOpenView: (coverId: number) => void;
}

const CoverPageTableView = ({
    data,
    coverPages,
    onOpenCreate,
    onOpenView,
}: CoverPageTableViewProps) => {
    const hasCoverPage = (proposalId: number) =>
        coverPages.some((c) => c.proposal === proposalId);

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
                        const status = getStatusStyleAdmin(doc.status as ProposalStatus);
                        const isApproved = doc.status === "approved";
                        const hasCover = hasCoverPage(doc.id);

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

                                {/* 2. Cover Page Status */}
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

                                {/* 3. Proposal Status */}
                                <td className="px-6 py-5 text-center align-middle">
                                    <span className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 min-w-[130px] shadow-sm ${status.className}`}>
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-40" />
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
                                        </span>
                                        {status.label}
                                    </span>
                                </td>

                                {/* 4. Actions */}
                                <td className="px-6 py-5 text-center align-middle">
                                    <div className="flex items-center justify-center gap-2 flex-nowrap whitespace-nowrap">

                                        {/* View Cover — only when cover exists */}
                                        {hasCover && (
                                            <button
                                                onClick={() => {
                                                    const cover = coverPages.find((c) => c.proposal === doc.id);
                                                    if (cover) onOpenView(cover.id);
                                                }}
                                                title="View Cover Page"
                                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-600 px-3 py-2 rounded-lg text-xs font-semibold hover:from-blue-100 hover:to-indigo-100 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View Cover
                                            </button>
                                        )}

                                        {/* Create Cover / Cover Created */}
                                        <button
                                            disabled={hasCover}
                                            onClick={() => { if (!hasCover) onOpenCreate(doc); }}
                                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm ${hasCover
                                                ? "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 cursor-default opacity-80"
                                                : "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 hover:from-emerald-500 hover:to-green-500 hover:text-white hover:shadow-md transform hover:-translate-y-0.5"
                                                }`}
                                        >
                                            {hasCover ? (
                                                <>
                                                    <Users className="w-3.5 h-3.5" />
                                                    Cover Created
                                                </>
                                            ) : (
                                                <>
                                                    <FilePlus className="w-3.5 h-3.5" />
                                                    Create Cover
                                                </>
                                            )}
                                        </button>

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