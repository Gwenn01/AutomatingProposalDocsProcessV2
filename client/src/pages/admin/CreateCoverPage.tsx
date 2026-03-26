import { useState, useEffect } from "react";
import { Search, Grid, Table, FileText } from "lucide-react";
import {
  getProposals,
  getAllCoverPage,
  type ProgramProposal,
  type ProposalCoverPage,
} from "@/api/admin-api";
import Loading from "@/components/Loading";
import CreateCoverPageModal from "@/components/admin/CreateCoverPageModal";
import ViewCoverPageModal from "@/components/admin/ViewCoverPageModal";

// ── Sub-components ─────────────────────────────────────────────────────────────
import CoverPageTableView from "@/components/admin/CreateCoverPage/CreateCoverTableView";
import CoverPageCardView from "@/components/admin/CreateCoverPage/CreateCoverCardView";
import EmptyState from "@/components/admin/EmptyState";
import AdminPagination from "@/components/admin/Pagination";

const CreateCoverPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allDocs, setAllDocs] = useState<ProgramProposal[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProgramProposal | null>(null);
  const itemsPerPage = viewMode === "table" ? 5 : 6;
  const [coverPages, setCoverPages] = useState<ProposalCoverPage[]>([]);
  const [viewCoverId, setViewCoverId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Loading animation
  useEffect(() => {
    if (!loading) return;
    setProgress(20);
    const timeout = setTimeout(() => setProgress(90), 400);
    return () => clearTimeout(timeout);
  }, [loading]);

  // Fetch proposals and cover pages
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const [proposals, covers] = await Promise.all([
          getProposals(),
          getAllCoverPage(),
        ]);
        setAllDocs(proposals);
        setCoverPages(covers);
      } catch (error) {
        console.error("Failed to fetch proposals", error);
      } finally {
        setLoading(false);
        setProgress(100);
      }
    };
    fetchDocs();
  }, []);

  // Reset page on search / view mode change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, viewMode]);

  // Derived data
  const filteredDocs = allDocs.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredDocs.slice(startIndex, endIndex);

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
      <div className="p-8 lg:p-10 bg-[#fbfcfb] min-h-screen flex flex-col animate-in fade-in duration-500">

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col space-y-10">

          {/* Header */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2">
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
                  className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none text-[13px] font-semibold"
                />
              </div>

              {/* View Switch */}
              <div className="flex items-center bg-slate-100 p-1 rounded-[16px] border border-slate-200">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-[12px] ${viewMode === "table"
                      ? "bg-white text-[#1cb35a] shadow-sm"
                      : "text-slate-400"
                    }`}
                >
                  <Table size={16} />
                </button>
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-2 rounded-[12px] ${viewMode === "card"
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
          <div className="flex-1">
            {currentData.length === 0 ? (
              <EmptyState icon={FileText} message="No proposals found" />
            ) : viewMode === "table" ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <CoverPageTableView
                  data={currentData}
                  coverPages={coverPages}
                  onOpenCreate={(doc) => {
                    setSelectedProposal(doc);
                    setIsModalOpen(true);
                  }}
                  onOpenView={(coverId) => {
                    setViewCoverId(coverId);
                    setIsViewOpen(true);
                  }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <CoverPageCardView
                  data={currentData}
                  coverPages={coverPages}
                  onOpenCreate={(doc) => {
                    setSelectedProposal(doc);
                    setIsModalOpen(true);
                  }}
                  onOpenView={(coverId) => {
                    setViewCoverId(coverId);
                    setIsViewOpen(true);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Pagination (Pinned Bottom) */}
        <div className="mt-auto pt-6">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filteredDocs.length}
            itemsPerPage={itemsPerPage}
            onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            onPageChange={(page) => setCurrentPage(page)}
            itemName="proposals"
          />
        </div>
      </div>

      {/* Modals */}
      <CreateCoverPageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        proposalId={selectedProposal?.id || null}
        proposalTitle={selectedProposal?.title}
      />
      <ViewCoverPageModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        coverPageId={viewCoverId}
      />
    </>
  );
};

export default CreateCoverPage;