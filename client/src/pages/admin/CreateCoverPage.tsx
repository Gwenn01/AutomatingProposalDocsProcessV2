import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Grid,
  Table,
  ChevronRight,
  ChevronLeft,
  FilePlus,
  Lock,
} from "lucide-react";
import { getProposals, type ProgramProposal } from "@/utils/admin-api";
import { getStatusStyleAdmin, type ProposalStatus } from "@/utils/statusStyles";
import Loading from "@/components/Loading";
import CreateCoverPageModal from "@/components/admin/CreateCoverPageModal";

const CreateCoverPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allDocs, setAllDocs] = useState<ProgramProposal[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] =
    useState<ProgramProposal | null>(null);
  const itemsPerPage = viewMode === "table" ? 10 : 12;

  // Loading animation (clean deterministic version)
  useEffect(() => {
    if (!loading) return;
    setProgress(20);
    const timeout = setTimeout(() => setProgress(90), 400);
    return () => clearTimeout(timeout);
  }, [loading]);

  // Fetch proposals only
  useEffect(() => {
    const fetchDocs = async () => {
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
          status: "approved",
          version_no: 1,
          created_at: new Date().toISOString(),
          user: 0,
        };
        setAllDocs([...proposals, staticProposals]);
      } catch (error) {
        console.error("Failed to fetch proposals", error);
      } finally {
        setLoading(false);
        setProgress(100);
      }
    };

    fetchDocs();
  }, []);

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
        title="Loading Proposals"
        subtitle="Fetching proposal registry data."
        progress={progress}
      />
    );
  }

  return (
    <>
      <div className="p-8 lg:p-10 space-y-10 bg-[#fbfcfb] animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Create Cover Page
            </h1>
            <p className="text-slate-500 text-sm">
              Generate cover pages for submitted proposals.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search
                  className="text-slate-400 group-focus-within:text-[#1cb35a] transition-all"
                  size={16}
                />
              </div>
              <input
                type="text"
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-[#1cb35a]/10 focus:border-[#1cb35a]/30 outline-none text-[13px] font-semibold"
              />
            </div>

            {/* View Switch */}
            <div className="flex items-center bg-slate-100 p-1 rounded-[16px] border border-slate-200/50">
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
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          {currentData.length === 0 ? (
            <div className="py-20 text-center">
              <FileText size={30} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase text-xs">
                No proposals found
              </p>
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto rounded-[32px] border border-slate-100 bg-slate-50/50 p-6">
              <table className="w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                    <th className="px-8 pb-4 text-left">Proposal Details</th>
                    <th className="px-8 pb-4 text-center">Current Status</th>
                    <th className="px-8 pb-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((doc) => {
                    const status = getStatusStyleAdmin(
                      doc.status as ProposalStatus,
                    );
                    const isApproved = doc.status === "approved";

                    return (
                      <tr
                        key={doc.id}
                        className="group transition-all duration-300"
                      >
                        {/* 1. Proposal Info - Left Module */}
                        <td className="px-8 py-5 bg-white rounded-l-[28px] border-y border-l border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${isApproved ? "bg-emerald-50 border-emerald-100 text-emerald-500" : "bg-slate-50 border-slate-100 text-slate-400"}`}
                            >
                              <FileText size={22} />
                            </div>
                            <div>
                              <div className="font-bold text-[15px] text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                                {doc.title}
                              </div>
                              <div className="text-[10px] font-mono font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                                Ref ID: #{String(doc.id).padStart(4, "0")}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Status - Middle Module */}
                        <td className="px-8 py-5 bg-white border-y border-slate-100 shadow-sm group-hover:shadow-md transition-all text-center">
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${status.className}`}
                          >
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-40"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                            </span>
                            {status.label}
                          </div>
                        </td>

                        {/* 3. Action - Premium Minimalist Right Module */}
                        <td className="px-8 py-5 bg-white rounded-r-[28px] border-y border-r border-slate-100 shadow-sm group-hover:shadow-md transition-all text-right">
                          <div className="flex justify-end items-center">
                            {isApproved ? (
                              <button
                                onClick={() => {
                                  setSelectedProposal(doc);
                                  setIsModalOpen(true);
                                }}
                                className="group/action relative inline-flex items-center gap-2.5 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 shadow-lg shadow-slate-200 hover:shadow-emerald-200/40 transition-all duration-300 active:scale-95 overflow-hidden"
                              >
                                {/* Shine Effect Animation */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/action:animate-[shimmer_1.5s_infinite]" />

                                <FilePlus
                                  size={15}
                                  className="text-emerald-400 group-hover/action:text-white transition-colors"
                                />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                  Create Cover
                                </span>
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100/50 group/locked select-none cursor-default">
                                <Lock
                                  size={14}
                                  className="text-slate-300 group-hover:text-amber-400 transition-colors"
                                />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                  Pending Approval
                                </span>
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
                const isApproved = doc.status === "approved";

                return (
                  <div
                    key={doc.id}
                    className="group relative bg-white rounded-[35px] border border-slate-100 p-2 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  >
                    {/* Upper Content Section */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        {/* Reference Tag */}
                        <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[10px] font-mono font-bold text-slate-400">
                          #{String(doc.id).padStart(4, "0")}
                        </div>

                        {/* Minimalist Status Indicator */}
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${status.className}`}
                        >
                          <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                          {status.label}
                        </div>
                      </div>

                      <h3 className="font-bold text-[17px] text-slate-800 leading-snug tracking-tight mb-6 group-hover:text-emerald-700 transition-colors line-clamp-2 min-h-[3rem]">
                        {doc.title}
                      </h3>

                      {/* Abstract/Preview Decorative Element */}
                      <div className="flex gap-1.5 mb-2">
                        <div className="h-1 w-12 rounded-full bg-slate-100" />
                        <div className="h-1 w-6 rounded-full bg-slate-100" />
                        <div className="h-1 w-20 rounded-full bg-slate-100" />
                      </div>
                    </div>

                    {/* Lower Action Section (Bento Bottom Bar) */}
                    <div className="mt-auto">
                      {isApproved ? (
                        <button
                          onClick={() => {
                            setSelectedProposal(doc);
                            setIsModalOpen(true);
                          }}
                          className="w-full flex items-center justify-center gap-3 py-5 rounded-[28px] bg-slate-900 text-white hover:bg-emerald-600 transition-all duration-300 group/btn shadow-xl shadow-slate-200 hover:shadow-emerald-200/50"
                        >
                          <div className="p-1.5 bg-white/10 rounded-lg group-hover/btn:bg-white/20 transition-colors">
                            <FilePlus
                              size={16}
                              className="text-emerald-400 group-hover/btn:text-white"
                            />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                            Create Cover
                          </span>
                        </button>
                      ) : (
                        <div className="w-full flex items-center justify-center gap-3 py-5 rounded-[28px] bg-slate-50 text-slate-300 border border-slate-100/50 cursor-not-allowed select-none">
                          <Lock size={16} className="opacity-40" />
                          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                            Locked
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          <span className="text-sm text-slate-500">
            Showing {startIndex + 1} – {Math.min(endIndex, filteredDocs.length)}{" "}
            of {filteredDocs.length}
          </span>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
      <CreateCoverPageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        proposalId={selectedProposal?.id || null}
        proposalTitle={selectedProposal?.title}
      />
    </>
  );
};

export default CreateCoverPage;
