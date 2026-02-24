import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Grid,
  Table,
  ChevronRight,
  ChevronLeft,
  Users,
  User,
  Eye,
  Check,
  XCircle,
} from "lucide-react";
import { getProposals, type ProgramProposal } from "@/utils/admin-api";
import { getStatusStyleAdmin, type ProposalStatus } from "@/utils/statusStyles";
import Loading from "@/components/Loading";
import ReviewerAssignedModal from "@/components/admin/ReviewerAssignedModal";

const ManageDocuments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allDocs, setAllDocs] = useState<ProgramProposal[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isReviewerModalOpen, setIsReviewerModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const itemsPerPage = viewMode === "table" ? 10 : 12;

  // Loading animation
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

  // Fetch proposals ONLY
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const proposals = await getProposals();
        const staticProposals: ProgramProposal = {
          id: 9999,
          child_id: 0,
          reviewer_count: 0,
          title: "Sample Proposal for Approval",
          file_path: null,
          proposal_type: "Program",
          status: "for_approval",
          version_no: 1,
          created_at: new Date().toISOString(),
          user: 0,
        };
        setAllDocs([staticProposals, ...proposals]);
      } catch (error) {
        console.error("Failed to fetch proposals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDocs = allDocs.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredDocs.slice(startIndex, endIndex);

  const openReviewerModal = (id: number, title: string) => {
    setSelectedProposal({ id, title });
    setIsReviewerModalOpen(true);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, viewMode]);

  if (loading) {
    return (
      <Loading
        title="Synchronizing Proposal Data"
        subtitle="Loading proposals and related statistics."
        progress={progress}
      />
    );
  }

  return (
    <>
      <div className="p-8 lg:p-10 space-y-10 bg-[#fbfcfb] h-auto animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Manage Documents
            </h1>
            <p className="text-slate-500 text-sm">
              View proposals and reviewer statistics.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none text-[13px] font-semibold"
              />
            </div>

            {/* View Switch */}
            <div className="flex items-center bg-slate-100 p-1 rounded-[16px] border border-slate-200">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-[12px] ${
                  viewMode === "table"
                    ? "bg-white text-[#1cb35a] shadow-sm"
                    : "text-slate-400"
                }`}
              >
                <Table size={16} />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-[12px] ${
                  viewMode === "card"
                    ? "bg-white text-[#1cb35a] shadow-sm"
                    : "text-slate-400"
                }`}
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-8 rounded-[32px] shadow border border-slate-100 overflow-hidden">
          {currentData.length === 0 ? (
            <div className="py-24 text-center">
              <FileText size={40} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 uppercase text-xs font-bold tracking-widest">
                No proposals found
              </p>
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto pb-8 -mx-4 px-4">
              <table className="w-full border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] font-black tracking-[0.25em]">
                    <th className="text-left px-10 pb-2">Proposal</th>
                    <th className="text-center px-6 pb-2">Status</th>
                    <th className="text-center px-6 pb-2">Reviewers</th>
                    <th className="text-right px-10 pb-2">Management</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((doc) => {
                    const status = getStatusStyleAdmin(
                      doc.status as ProposalStatus,
                    );

                    return (
                      <tr key={doc.id} className="group">
                        {/* 1. Proposal Info - Left "Pill" */}
                        <td className="pl-10 pr-6 py-6 bg-white border-y border-l border-slate-100 rounded-l-[32px] shadow-sm group-hover:shadow-md group-hover:bg-slate-50/50 transition-all duration-500">
                          <div className="flex items-center gap-5">
                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all duration-500">
                                <FileText
                                  size={22}
                                  className="text-slate-400 group-hover:text-emerald-600 transition-colors"
                                />
                              </div>
                            </div>

                            <div className="min-w-0 max-w-[280px]">
                              <div className="font-bold text-[16px] text-slate-800 tracking-tight group-hover:text-emerald-800 transition-colors duration-300 truncate">
                                {doc.title}
                              </div>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-full border border-slate-200/50">
                                  ID-{String(doc.id).padStart(4, "0")}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-[11px] text-slate-400 font-semibold italic">
                                  Updated 2d ago
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Status - Middle Bento */}
                        <td className="px-6 py-6 text-center bg-white border-y border-slate-100 shadow-sm group-hover:shadow-md transition-all duration-500">
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${status.className} shadow-sm ring-4 ring-transparent group-hover:ring-slate-50 transition-all`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            {status.label}
                          </div>
                        </td>

                        {/* 3. Reviewers - Compact Pod */}
                        <td className="px-6 py-6 bg-white border-y border-slate-100 shadow-sm group-hover:shadow-md transition-all duration-500">
                          <div className="flex justify-center">
                            <button
                              onClick={() =>
                                openReviewerModal(doc.id, doc.title)
                              }
                              className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-300 group/btn"
                            >
                              <div className="relative">
                                <Users
                                  size={18}
                                  className="text-slate-400 group-hover/btn:text-emerald-600"
                                />
                                {doc.reviewer_count > 0 && (
                                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
                                )}
                              </div>
                              <span className="text-[14px] font-black text-slate-700">
                                {doc.reviewer_count || 0}
                              </span>
                            </button>
                          </div>
                        </td>

                        {/* 4. Actions - Right "Pill" */}
                        <td className="pl-6 pr-10 py-6 text-right bg-white border-y border-r border-slate-100 rounded-r-[32px] shadow-sm group-hover:shadow-md transition-all duration-500">
                          <div className="flex flex-col items-end gap-3 min-w-[200px]">
                            {/* Secondary Actions Row */}
                            <div className="flex justify-end gap-2">
                              <div className="relative group/tooltip flex items-center justify-center">
                                {/* The Tooltip */}
                                <div className="absolute bottom-full mb-3 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-[-4px] transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl">
                                  View Docs
                                  {/* Tooltip Arrow */}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                                </div>

                                {/* The Button */}
                                <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white hover:shadow-lg hover:shadow-slate-200 active:scale-90 transition-all duration-300">
                                  <FileText size={18} />
                                </button>
                              </div>
                              <div className="relative group/tooltip flex items-center justify-center">
                                {/* The Tooltip */}
                                <div className="absolute bottom-full mb-3 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-[-4px] transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl z-20">
                                  Review Details
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                                </div>

                                {/* The Button */}
                                <button className="h-10 px-5 rounded-xl bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-[0.15em] hover:bg-emerald-600 hover:text-white transition-all duration-300 border border-emerald-100/50 flex items-center gap-2 group/rev active:scale-95 shadow-sm hover:shadow-emerald-200">
                                  <Users
                                    size={16}
                                    className="group-hover/rev:rotate-12 transition-transform duration-300"
                                  />
                                  <span className="whitespace-nowrap">
                                    View Reviews
                                  </span>
                                </button>
                              </div>
                            </div>

                            {doc.status === "for_approval" && (
                              <div className="flex items-center gap-3 mt-1 animate-in fade-in duration-500">
                                {/* Subtle indicator text */}
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] mr-1">
                                  Action Required
                                </span>

                                <div className="flex gap-2">
                                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all duration-300 group/app">
                                    <Check size={12} strokeWidth={4} />
                                    <span className="text-[9px] font-black uppercase">
                                      Approve
                                    </span>
                                  </button>

                                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all duration-300 group/rej">
                                    <XCircle size={12} />
                                    <span className="text-[9px] font-black uppercase">
                                      Reject
                                    </span>
                                  </button>
                                </div>
                              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {currentData.map((doc) => {
                const status = getStatusStyleAdmin(
                  doc.status as ProposalStatus,
                );

                return (
                  <div
                    key={doc.id}
                    className="group relative bg-white rounded-[35px] border border-slate-100 p-2 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 hover:-translate-y-1"
                  >
                    {/* Main Card Content */}
                    <div className="p-6">
                      {/* Top Row: ID & Status */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                            <FileText
                              size={18}
                              className="text-slate-400 group-hover:text-emerald-600"
                            />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-300 leading-none mb-1">
                              Reference
                            </p>
                            <p className="text-[11px] font-mono font-bold text-slate-500">
                              #{String(doc.id).padStart(4, "0")}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`
    px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest shadow-sm transition-all duration-300
    ${status.className}
  `}
                        >
                          {/* Optional: Indicator dot na sumasabay sa kulay ng text */}
                          <div className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                            {status.label}
                          </div>
                        </div>
                      </div>

                      {/* Proposal Title */}
                      <div className="mb-8">
                        <h3 className="font-bold text-[17px] text-slate-800 leading-snug tracking-tight group-hover:text-emerald-700 transition-colors line-clamp-2 min-h-[3rem]">
                          {doc.title}
                        </h3>
                      </div>

                      {/* Stats Pod - Mini Bento Tile */}
                      <div
                        onClick={() => openReviewerModal(doc.id, doc.title)}
                        className="bg-slate-50/50 rounded-[24px] p-4 flex items-center justify-between border border-slate-100/50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {[...Array(Math.min(doc.reviewer_count, 3))].map(
                              (_, i) => (
                                <div
                                  key={i}
                                  className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden"
                                >
                                  <User size={12} className="text-slate-400" />
                                </div>
                              ),
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-slate-600">
                            {doc.reviewer_count} Reviewer
                            {doc.reviewer_count !== 1 && "s"}
                          </span>
                        </div>
                        <div
                          className={`h-2 w-2 rounded-full ${doc.reviewer_count > 0 ? "bg-emerald-500" : "bg-slate-300"} animate-pulse`}
                        />
                      </div>
                    </div>

                    {/* Action Footer - Split Layout */}
                    <div className="flex gap-2 p-2 mt-2">
                      <button className="flex-1 inline-flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest rounded-[22px] bg-slate-50 text-slate-500 hover:bg-slate-900 hover:text-white transition-all duration-300">
                        <Eye size={14} />
                        View Docs
                      </button>
                      <button className="flex-1 inline-flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest rounded-[22px] bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200/50 transition-all duration-300">
                        <Users size={14} />
                        Reviews
                      </button>
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
      <ReviewerAssignedModal
        isOpen={isReviewerModalOpen}
        onClose={() => setIsReviewerModalOpen(false)}
        proposalId={selectedProposal?.id || null}
        proposalTitle={selectedProposal?.title}
      />
    </>
  );
};

export default ManageDocuments;
