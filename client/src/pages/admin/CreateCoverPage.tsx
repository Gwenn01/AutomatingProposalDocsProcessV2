import { useState, useEffect } from "react";
import { Search, Grid, Table, FileText } from "lucide-react";
import {
  getProposals,
  getAllCoverPage,
  deleteCoverPage,
  type ProgramProposal,
  type ProposalCoverPage,
} from "@/api/admin-api";

import Loading from "@/components/Loading";
import CreateCoverPageModal from "@/components/admin/CreateCoverPageModal";
import ViewCoverPageModal from "@/components/admin/ViewCoverPageModal";
import EditCoverPageModal from "@/components/admin/EditCoverPageModal";

import CoverPageTableView from "@/components/admin/CreateCoverPage/CreateCoverTableView";
import CoverPageCardView from "@/components/admin/CreateCoverPage/CreateCoverCardView";
import DeleteCoverPageConfirmationModal from "@/components/admin/CreateCoverPage/DeleteCoverPageModalConfirmation";
import EmptyState from "@/components/admin/EmptyState";
import AdminPagination from "@/components/admin/Pagination";

const CreateCoverPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allDocs, setAllDocs] = useState<ProgramProposal[]>([]);
  const [coverPages, setCoverPages] = useState<ProposalCoverPage[]>([]);

  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProgramProposal | null>(null);

  const [viewCoverId, setViewCoverId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [editCoverId, setEditCoverId] = useState<number | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [deleteCoverId, setDeleteCoverId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = viewMode === "table" ? 5 : 6;

  // ✅ Fetch function (SINGLE SOURCE OF TRUTH)
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

  const handleDeleteCoverPage = async () => {
    if (!deleteCoverId) return;

    try {
      setIsDeleting(true);
      await deleteCoverPage(deleteCoverId);

      // Close modal
      setIsDeleteOpen(false);

      // Refresh data (important)
      await fetchDocs();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // ✅ Loading animation
  useEffect(() => {
    if (!loading) return;
    setProgress(20);
    const timeout = setTimeout(() => setProgress(90), 400);
    return () => clearTimeout(timeout);
  }, [loading]);

  // ✅ Initial fetch (ONLY ONCE)
  useEffect(() => {
    fetchDocs();
  }, []);

  // ✅ Reset pagination
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, viewMode]);

  // ✅ Derived data
  const filteredDocs = allDocs.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredDocs.slice(startIndex, endIndex);

  // ✅ Safe conditional render AFTER hooks
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
                  <Search size={16} className="text-slate-400 group-focus-within:text-[#1cb35a]" />
                </div>
                <input
                  type="text"
                  placeholder="Search proposals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none text-[13px] font-semibold"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-[16px] border border-slate-200">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-[12px] ${viewMode === "table" ? "bg-white text-[#1cb35a]" : "text-slate-400"
                    }`}
                >
                  <Table size={16} />
                </button>
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-2 rounded-[12px] ${viewMode === "card" ? "bg-white text-[#1cb35a]" : "text-slate-400"
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
                  onOpenEdit={(coverId, doc) => {
                    setEditCoverId(coverId);
                    setSelectedProposal(doc);
                    setIsEditOpen(true);
                  }}
                  onOpenDelete={(coverId) => {
                    setDeleteCoverId(coverId);
                    setIsDeleteOpen(true);
                  }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <CoverPageCardView
                  data={currentData}
                  coverPages={coverPages}
                  onOpenCreate={(doc) => {
                    setSelectedProposal(doc);
                    setIsModalOpen(true);
                  }}
                  onOpenView={(coverId) => {
                    setViewCoverId(coverId);
                    const found = allDocs.find(
                      (doc) =>
                        coverPages.find((cp) => cp.id === coverId)?.proposal === doc.id
                    );
                    setSelectedProposal(found || null);
                    setIsViewOpen(true);
                  }}
                  onOpenEdit={(coverId, doc) => {
                    setEditCoverId(coverId);
                    setSelectedProposal(doc);
                    setIsEditOpen(true);
                  }}
                  onOpenDelete={(coverId) => {
                    setDeleteCoverId(coverId);
                    setIsDeleteOpen(true);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredDocs.length}
          itemsPerPage={itemsPerPage}
          onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          onPageChange={setCurrentPage}
          itemName="proposals"
        />
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
        proposalId={selectedProposal?.id || null}
        proposalTitle={selectedProposal?.title}
      />

      <EditCoverPageModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          fetchDocs(); // ✅ refresh safely
        }}
        coverPageId={editCoverId}
        proposalId={selectedProposal?.id || null}
        proposalTitle={selectedProposal?.title}
      />

      <DeleteCoverPageConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteCoverPage}
        isLoading={isDeleting}
      />
    </>
  );
};

export default CreateCoverPage;