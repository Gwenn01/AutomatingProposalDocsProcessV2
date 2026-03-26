import { UserPlus, UserMinus } from "lucide-react";
import { type ProgramProposal } from "@/api/admin-api";
import { getStatusStyle, type ProposalStatus } from "@/utils/statusStyles";

interface Props {
    data: ProgramProposal[];
    assignedMap: Record<number, number>;
    onOpenReviewerModal: (id: number, title: string) => void;
    onOpenAssign: (doc: ProgramProposal) => void;
    onOpenUnassign: (doc: ProgramProposal) => void;
}

const ProposalCardView = ({ data, assignedMap, onOpenReviewerModal, onOpenAssign, onOpenUnassign }: Props) => {
    return (
        <>
            {data.map((doc) => {
                const hasReviewer = assignedMap[doc.id] > 0;
                const status = getStatusStyle(doc.status as ProposalStatus);

                return (
                    <div
                        key={doc.id}
                        className="bg-white rounded-xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border flex flex-col justify-between min-h-[260px] hover:shadow-md transition-shadow"
                    >
                        {/* Top Section: Status + Title */}
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                {/* Status Pill */}
                                <span
                                    className={`px-4 py-2.5 rounded-full text-xs font-extrabold tracking-wide ${status.className}`}
                                >
                                    {status.label}
                                </span>

                                {/* Reviewer Status */}
                                {hasReviewer ? (
                                    <div onClick={() => onOpenReviewerModal(doc.id, doc.title)} className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg cursor-pointer">
                                        <div className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
                                        <span className="text-green-700 font-semibold text-xs">{assignedMap[doc.id]} Reviewer{assignedMap[doc.id] > 1 ? "s" : ""}</span>
                                    </div>
                                ) : (
                                    <div onClick={() => onOpenReviewerModal(doc.id, doc.title)} className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg cursor-pointer">
                                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                                        <span className="text-gray-400 font-semibold text-xs">No Assigned Reviewer</span>
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{doc.title}</h3>

                            {/* Reference */}
                            <p className="text-gray-400 text-xs font-bold">Ref: #{String(doc.id).padStart(4, "0")}</p>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex gap-2">
                            {hasReviewer ? (
                                <>
                                    <button
                                        onClick={() => onOpenAssign(doc)}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-green-100 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                    >
                                        <UserPlus size={14} /> Assign
                                    </button>
                                    <button
                                        onClick={() => onOpenUnassign(doc)}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-rose-50 text-rose-500 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                    >
                                        <UserMinus size={14} /> Unassign
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => onOpenAssign(doc)}
                                    className="w-full inline-flex items-center justify-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                >
                                    <UserPlus size={14} /> Assign Reviewer
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default ProposalCardView;