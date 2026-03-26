/* components/admin/EditCoverPageModal.tsx */
import React, { useState, useEffect } from "react";
import { X, FileText, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/context/toast";
import Header from "./CoverPage/Header";
import Letter from "./CoverPage/Letter";
import Signatory from "./CoverPage/Signatory";
import { getCoverPage, updateCoverPage, type CreateCoverPagePayload } from "@/api/admin-api";

interface EditCoverPageModalProps {
    isOpen: boolean;
    onClose: () => void;
    coverPageId: number | null;
    proposalId: number | null;
    proposalTitle?: string;
}

const EditCoverPageModal: React.FC<EditCoverPageModalProps> = ({
    isOpen,
    onClose,
    coverPageId,
    proposalId,
    proposalTitle,
}) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [date, setDate] = useState("");
    const [body, setBody] = useState("");
    const [proposal, setProposal] = useState<number | null>(null);

    // Fetch existing data kapag bumukas ang modal
    useEffect(() => {
        if (isOpen && coverPageId) {
            const loadExistingCover = async () => {
                setFetching(true);
                try {
                    const data = await getCoverPage(coverPageId);
                    setBody(data.cover_page_body);
                    setDate(data.submission_date);
                    setProposal(data.proposal);
                } catch (error: any) {
                    showToast("Failed to load cover page details.", "error");
                    onClose();
                } finally {
                    setFetching(false);
                }
            };
            loadExistingCover();
        }
    }, [isOpen, coverPageId]);

    if (!isOpen || !coverPageId) return null;

    const handleUpdate = async () => {
        if (!body.trim()) {
            showToast("Letter body cannot be empty.", "error");
            return;
        }

        if (!proposal && !proposalId) {
            showToast("Missing proposal ID.", "error");
            return;
        }

        const payload: CreateCoverPagePayload = {
            proposal: proposal ?? proposalId!, // ✅ safe now
            cover_page_body: body,
            submission_date: date,
        };

        console.log("UPDATE PAYLOAD:", payload);

        setLoading(true);
        try {
            await updateCoverPage(coverPageId!, payload);
            showToast("Cover page updated successfully!", "success");
            onClose();
        } catch (error: any) {
            showToast(error.message || "Failed to update cover page.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-7xl h-screen md:h-[96vh] bg-white rounded-none shadow-2xl overflow-hidden flex flex-col">

                {/* Header - Indigo/Blue color for Edit Mode distinguish it from Create */}
                <div className="bg-green-700 px-8 py-5 flex justify-between items-center flex-shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <RefreshCw size={28} className={`text-white/90 ${fetching ? 'animate-spin' : ''}`} strokeWidth={1.5} />
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold text-white leading-tight">
                                Edit Cover Page
                            </h2>
                            {proposalTitle && (
                                <p className="text-[10px] text-indigo-100/70 font-bold uppercase tracking-[0.1em] truncate max-w-[600px] mt-0.5">
                                    {proposalTitle}
                                </p>
                            )}
                        </div>
                    </div>

                    <button onClick={onClose} className="group p-2 hover:bg-white/10 transition-all duration-200">
                        <X size={24} className="text-white opacity-70 group-hover:opacity-100" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-white relative custom-scrollbar pb-32">
                    {fetching ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                            <Loader2 className="animate-spin" size={40} />
                            <p className="text-xs font-bold uppercase tracking-widest">Loading Content...</p>
                        </div>
                    ) : (
                        <div className="w-full px-8 py-10 md:px-20 md:py-12">
                            <Header />
                            <div className="mt-10">
                                <Letter
                                    date={date}
                                    onDateChange={setDate}
                                    body={body}
                                    onBodyChange={setBody}
                                />
                            </div>
                            <div className="mt-16">
                                <Signatory />
                            </div>
                        </div>
                    )}
                </div>

                {/* Floating Action Button */}
                <div className="absolute bottom-8 right-8 z-30 pointer-events-none">
                    <button
                        onClick={handleUpdate}
                        disabled={loading || fetching || !body.trim()}
                        className={`pointer-events-auto flex items-center px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-2xl
              ${loading || fetching || !body.trim()
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700 shadow-green-900/30"
                            }`}
                    >
                        {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                        {loading ? "Saving Changes..." : "Update Cover Page"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCoverPageModal;