import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Grid,
  Table,
  UserPlus,
  UserMinus,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  getProposals,
  getAllReviewerAssignments,
  type ProgramProposal,
} from "@/utils/admin-api";
import { getStatusStyleAdmin, type ProposalStatus } from "@/utils/statusStyles";
import AssignModal from "@/components/admin/AssignModal";
import UnassignModal from "@/components/admin/UnassignModal";
import Loading from "@/components/Loading";
import { useToast } from "@/context/toast";

const AssignToReview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allDocs, setAllDocs] = useState<ProgramProposal[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [progress, setProgress] = useState(0);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "table" ? 10 : 12;
  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);
  const [selectedForUnassign, setSelectedForUnassign] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const [assignedMap, setAssignedMap] = useState<Record<number, number>>({});

  // Loading progress animation
  useEffect(() => {
    if (!loading) return;
    setProgress(0);
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 10;
      setProgress(Math.min(value, 95));
    }, 300);
    return () => clearInterval(interval);
  }, [loading]);

  // Fetch proposals
  useEffect(() => {
    const fetchProposalsAndAssignments = async () => {
      try {
        setLoading(true);

        // Fetch all proposals
        const proposals = await getProposals();
        setAllDocs(proposals);

        // Fetch all reviewer assignments
        const assignments = await getAllReviewerAssignments();

        // Map proposal ID → number of assigned reviewers
        const counts: Record<number, number> = {};
        assignments.forEach((a) => {
          counts[a.proposal] = (counts[a.proposal] || 0) + 1;
        });

        setAssignedMap(counts);
      } catch (error) {
        console.error("Failed to fetch proposals or assignments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposalsAndAssignments();
  }, []);

  // Open Assign Modal
  const openAssignModal = (doc: ProgramProposal) => {
    setSelectedProposal({ id: doc.id, title: doc.title });
    setIsModalOpen(true);
  };

  // Update assigned reviewers map after assign/unassign
  const handleUpdateAssignments = async (message?: string) => {
    if (message) showToast(message, "success");
    try {
      const proposals = await getProposals();
      setAllDocs(proposals);

      const assignments = await getAllReviewerAssignments();
      const counts: Record<number, number> = {};
      assignments.forEach((a) => {
        counts[a.proposal] = (counts[a.proposal] || 0) + 1;
      });
      setAssignedMap(counts);
    } catch (error) {
      console.error("Failed to update assignments", error);
      showToast("Failed to update assignments", "error");
    }
  };

  // Filter proposals by search
  const filteredDocs = allDocs.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredDocs.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, viewMode]);

  if (loading) {
    return (
      <Loading
        title="Synchronizing Proposal Data"
        subtitle="Loading proposals and related statistics for you."
        progress={progress}
      />
    );
  }

  return (
    <>
      <div className="p-8 lg:p-10 space-y-10 bg-[#fbfcfb] h-auto animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2 mb-10">
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Assign to Review
            </h1>
            <p className="text-slate-500 text-sm">
              Select a proposal from the registry.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search
                  className="text-slate-400 group-focus-within:text-[#1cb35a] transition-all duration-300"
                  size={16}
                />
              </div>
              <input
                type="text"
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-[#1cb35a]/10 focus:border-[#1cb35a]/30 transition-all outline-none text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* View Switch */}
            <div className="flex items-center bg-slate-100 p-1 rounded-[16px] border border-slate-200/50 shadow-inner w-full md:w-auto justify-center">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-[12px] transition-all duration-300 flex-1 md:flex-none flex items-center justify-center ${
                  viewMode === "table"
                    ? "bg-white text-[#1cb35a] shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Table size={16} />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-[12px] transition-all duration-300 flex-1 md:flex-none flex items-center justify-center ${
                  viewMode === "card"
                    ? "bg-white text-[#1cb35a] shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden relative">
          {currentData.length === 0 ? (
            <div className="py-24 text-center bg-slate-50/50 rounded-[24px] border-2 border-dashed border-slate-100 mt-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                <FileText size={28} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                No matches found in the archive
              </p>
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200/60 bg-slate-50/30 p-2">
              <table className="w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] font-bold tracking-[0.15em]">
                    <th className="pb-3 px-6 text-left">Proposal Details</th>
                    <th className="pb-3 px-6 text-center">Current Status</th>
                    <th className="pb-3 px-6 text-right">Management</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {currentData.map((doc) => {
                    const status = getStatusStyleAdmin(
                      doc.status as ProposalStatus,
                    );
                    const hasReviewer = assignedMap[doc.id] > 0;

                    return (
                      <tr
                        key={doc.id}
                        className="group transition-all duration-200"
                      >
                        {/* Title Cell */}
                        <td className="py-5 px-6 bg-white border-y border-l border-slate-200/60 rounded-l-[20px] group-hover:bg-slate-50/80 transition-all duration-300 ease-out">
                          <div className="flex items-center gap-4">
                            {/* Icon Container with Glassmorphism and Soft Shadow */}
                            <div
                              className="relative flex items-center justify-center w-12 h-12 rounded-[14px] bg-slate-50 text-slate-400 
      group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm group-hover:shadow-indigo-100/50 
      transition-all duration-300 border border-slate-100 group-hover:border-indigo-100/50"
                            >
                              {/* Subtle Background Glow on Hover */}
                              <div className="absolute inset-0 rounded-[14px] bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors duration-300" />

                              <FileText
                                size={20}
                                strokeWidth={2}
                                className="relative z-10 group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>

                            {/* Text Content */}
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-slate-800 text-[14px] tracking-tight group-hover:text-indigo-900 transition-colors">
                                {doc.title}
                              </span>

                              {/* Monospace Reference ID with Badge Style */}
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors duration-300">
                                  ID
                                </span>
                                <span className="text-[11px] font-mono text-slate-400 font-medium tracking-tighter">
                                  {String(doc.id).slice(-6).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status Cell */}
                        <td className="py-4 px-6 bg-white border-y border-slate-200/50 text-center group-hover:bg-slate-50/50 transition-colors">
                          <div className="inline-flex items-center transition-all duration-300 group-hover:scale-[1.02]">
                            {/* The Badge Container */}
                            <div
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${status.className}`}
                            >
                              {/* Animated Status Indicator */}
                              <span className="relative flex h-1.5 w-1.5">
                                {/* Ping effect inherits the text color via bg-current */}
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 bg-current"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
                              </span>

                              {/* Status Label */}
                              <span className="text-[10px] font-bold uppercase tracking-[0.15em] leading-none">
                                {status.label}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Actions Cell */}
                        <td className="py-4 px-6 bg-white border-y border-r border-slate-200/50 rounded-r-xl text-right group-hover:bg-slate-50/50 transition-colors">
                          <div className="flex justify-end items-center gap-2">
                            {hasReviewer ? (
                              <>
                                {/* Modern Green Assign Button */}
                                <button
                                  onClick={() => openAssignModal(doc)}
                                  className="inline-flex items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-tight rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200"
                                >
                                  <UserPlus size={15} strokeWidth={2.5} />
                                  <span>Assign</span>
                                </button>

                                {/* Modern Red Unassign Button */}
                                <button
                                  onClick={() => {
                                    setSelectedForUnassign({
                                      id: doc.id,
                                      title: doc.title,
                                    });
                                    setIsUnassignModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-tight rounded-lg bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-200"
                                >
                                  <UserMinus size={15} strokeWidth={2.5} />
                                  <span>Unassign</span>
                                </button>
                              </>
                            ) : (
                              /* Primary Assign Action (When empty) */
                              <button
                                onClick={() => openAssignModal(doc)}
                                className="group/btn inline-flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-200 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200/50 transition-all duration-300"
                              >
                                <UserPlus size={15} strokeWidth={2.5} />
                                <span>Assign Reviewer</span>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentData.map((doc) => {
                const status = getStatusStyleAdmin(
                  doc.status as ProposalStatus,
                );
                const hasReviewer = assignedMap[doc.id] > 0;

                return (
                  <div
                    key={doc.id}
                    className="group relative bg-white rounded-[28px] border border-slate-200/60 p-2 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col"
                  >
                    {/* Card Header & Content */}
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        {/* Title & ID Section */}
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-800 text-[15px] tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                            {doc.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              #{String(doc.id).slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Floating Status Icon/Badge */}
                        <div
                          className={`p-2 rounded-xl border ${status.className} bg-opacity-10 shrink-0`}
                        >
                          <FileText size={18} strokeWidth={2.5} />
                        </div>
                      </div>

                      {/* Status Badge & Reviewer Count */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${status.className}`}
                        >
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 bg-current"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
                          </span>
                          {status.label}
                        </div>

                        {hasReviewer && (
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {assignedMap[doc.id]} Reviewer
                            {assignedMap[doc.id] > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Footer - Premium Bento Glass Effect */}
                    <div className="bg-slate-50/80 rounded-[22px] p-3 flex gap-2 border border-slate-100/50">
                      {hasReviewer ? (
                        <>
                          <button
                            onClick={() => openAssignModal(doc)}
                            className="flex-1 inline-flex items-center justify-center gap-2 h-10 text-[11px] font-bold uppercase tracking-tight rounded-xl bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-sm transition-all duration-200"
                          >
                            <UserPlus size={14} />
                            Assign
                          </button>
                          <button
                            onClick={() => {
                              setSelectedForUnassign({
                                id: doc.id,
                                title: doc.title,
                              });
                              setIsUnassignModalOpen(true);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 h-10 text-[11px] font-bold uppercase tracking-tight rounded-xl bg-white text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white hover:border-rose-600 shadow-sm transition-all duration-200"
                          >
                            <UserMinus size={14} />
                            Unassign
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openAssignModal(doc)}
                          className="w-full inline-flex items-center justify-center gap-2 h-10 text-[11px] font-bold uppercase tracking-widest rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-200/50 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                        >
                          <UserPlus size={14} />
                          Assign Reviewer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Pagination Controls */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-4 py-6 bg-slate-50/50 rounded-[24px] border border-slate-100/80">
          {/* Stats Section */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1 overflow-hidden">
              {/* Subtle visual indicator of data density */}
              <div className="h-2 w-8 rounded-full bg-indigo-500/20" />
            </div>
            <span className="text-[13px] text-slate-500 font-medium tracking-tight">
              Showing{" "}
              <span className="text-slate-900 font-bold">{startIndex + 1}</span>
              <span className="mx-1 opacity-40">—</span>
              <span className="text-slate-900 font-bold">
                {Math.min(endIndex, filteredDocs.length)}
              </span>{" "}
              of{" "}
              <span className="text-slate-900 font-bold">
                {filteredDocs.length}
              </span>{" "}
              items
            </span>
          </div>

          <div className="flex items-center gap-8">
            {/* Minimalist Page Counter */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200/60 shadow-sm">
              <span className="text-[11px] uppercase font-black tracking-widest text-slate-400 ml-1">
                Page
              </span>
              <span className="text-sm font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full">
                {currentPage}
              </span>
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mr-1">
                of {totalPages}
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="group flex items-center gap-2.5 pl-3.5 pr-5 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-sm"
                title="Previous Page"
              >
                <ChevronLeft
                  size={16}
                  className="group-hover:-translate-x-0.5 transition-transform duration-300"
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Prev
                </span>
              </button>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="group flex items-center gap-2.5 pl-5 pr-3.5 h-10 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md shadow-slate-900/5 hover:shadow-indigo-500/20"
                title="Next Page"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Next
                </span>
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedProposal}
        onUpdate={() =>
          handleUpdateAssignments("Reviewer assigned successfully!")
        }
      />

      <UnassignModal
        isOpen={isUnassignModalOpen}
        onClose={() => setIsUnassignModalOpen(false)}
        data={selectedForUnassign}
        onUpdate={() =>
          handleUpdateAssignments("Reviewer unassigned successfully!")
        }
      />
    </>
  );
};

export default AssignToReview;
