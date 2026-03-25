import { useState, useEffect, useCallback } from "react";
import { Search, Table, Grid, FileText } from "lucide-react";
import { getProposals, type ProgramProposal } from "@/api/admin-api";
import { getNotifications } from "@/api/get-notification-api";
import NotificationBell, { type Notification } from "@/components/NotificationBell";
import Loading from "@/components/Loading";
import ReviewerAssignedModal from "@/components/admin/ReviewerAssignedModal";
import DocumentViewerModal from "@/components/implementor/DocumentViewerModal";
import ViewReviewedDocuments from "@/components/implementor/view-proposal/view-reviewed-document";
import { useProposals } from "@/hooks/useViewProposal";

// ── Sub-components ────────────────────────────────────────────────────────────
import ProposalsTableView from "@/components/admin/ManageDocuments/ProposalsTableView";
import ProposalsCardView from "@/components/admin/ManageDocuments/ProposalsCardView";
import AdminPagination from "@/components/admin/Pagination";
import EmptyState from "@/components/admin/EmptyState";

const ManageDocuments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allDocs, setAllDocs] = useState<ProgramProposal[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "table" ? 5 : 6;

  // ── Reviewer modal state ──────────────────────────────────────────────────
  const [isReviewerModalOpen, setIsReviewerModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<{
    id: number;
    title: string;
  } | null>(null);

  // ── Notification state ────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // ── DocumentViewerModal state ─────────────────────────────────────────────
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [selectedProposalData, setSelectedProposalData] = useState<any | null>(null);
  const [selectedProposalStatus, setSelectedProposalStatus] = useState("");
  const [selectedProposalTitle, setSelectedProposalTitle] = useState("");

  // ── ViewReviewedDocuments state ───────────────────────────────────────────
  const [isReviewedDocOpen, setIsReviewedDocOpen] = useState(false);
  const [selectedReviewedProposal, setSelectedReviewedProposal] = useState<{
    title: string;
    status: string;
    proposal_id: number | string;
    child_id: number | string;
  } | null>(null);

  // ── Hook for DocumentViewerModal ──────────────────────────────────────────
  const { fetchProposalDetail, actionLoading: docViewerLoading } =
    useProposals("Program");

  // ── Modal loading progress ────────────────────────────────────────────────
  const [modalProgress, setModalProgress] = useState(0);

  useEffect(() => {
    if (!docViewerLoading) {
      setModalProgress(0);
      return;
    }
    setModalProgress(0);
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 15;
      setModalProgress(Math.min(value, 90));
    }, 200);
    return () => clearInterval(interval);
  }, [docViewerLoading]);

  // ── Page loading animation ────────────────────────────────────────────────
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

  // ── Fetch proposals ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const proposals = await getProposals();
        setAllDocs(proposals);
      } catch (error) {
        console.error("Failed to fetch proposals", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Reset page on search / view mode / page size change ───────────────────
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, viewMode]);

  // ── Notifications ─────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
      setUnreadCount((data || []).filter((n: Notification) => !n.is_read).length);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleReadNotification = (id: string | number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  // ── Derived data ──────────────────────────────────────────────────────────
  const filteredDocs = allDocs.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredDocs.slice(startIndex, endIndex);

  // ── Modal handlers ────────────────────────────────────────────────────────
  const openReviewerModal = (id: number, title: string) => {
    setSelectedProposal({ id, title });
    setIsReviewerModalOpen(true);
  };

  const openDocViewer = async (doc: ProgramProposal) => {
    const detail = await fetchProposalDetail({
      proposal_id: doc.id,
      child_id: doc.child_id,
      reviewer_count: doc.reviewer_count ?? 0,
      reviewed_count: 0,
      review_progress: "",
      title: doc.title,
      file_path: "",
      status: doc.status,
      submitted_at: null,
      reviews: 0,
    });
    if (detail) {
      setSelectedProposalData(detail);
      setSelectedProposalStatus(doc.status);
      setSelectedProposalTitle(doc.title);
      setIsDocViewerOpen(true);
    }
  };

  const openReviewedDoc = (doc: ProgramProposal) => {
    setSelectedReviewedProposal({
      title: doc.title,
      status: doc.status,
      proposal_id: doc.id,
      child_id: doc.child_id,
    });
    setIsReviewedDocOpen(true);
  };

  // ── Render ────────────────────────────────────────────────────────────────
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
      <div className="p-8 lg:p-10 bg-[#fbfcfb] min-h-screen flex flex-col animate-in fade-in duration-500">

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col space-y-10">

          {/* Header */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2">
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

              {/* Notification Bell */}
              <div className="ml-4">
                <NotificationBell
                  notifications={notifications}
                  unreadCount={unreadCount}
                  show={showNotifications}
                  onToggle={() => setShowNotifications((prev) => !prev)}
                  onClose={() => setShowNotifications(false)}
                  onRead={handleReadNotification}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {currentData.length === 0 ? (
              <EmptyState icon={FileText} message="No proposals found" />
            ) : viewMode === "table" ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <ProposalsTableView
                  data={currentData}
                  docViewerLoading={docViewerLoading}
                  onOpenReviewerModal={openReviewerModal}
                  onOpenDocViewer={openDocViewer}
                  onOpenReviewedDoc={openReviewedDoc}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <ProposalsCardView
                  data={currentData}
                  docViewerLoading={docViewerLoading}
                  onOpenReviewerModal={openReviewerModal}
                  onOpenDocViewer={openDocViewer}
                  onOpenReviewedDoc={openReviewedDoc}
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
            onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            onPageChange={(page) => setCurrentPage(page)}
            itemName="proposals"
          />
        </div>
      </div>

      {/* Modal Loading Overlay */}
      {docViewerLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
          <Loading
            title="Fetching Document"
            subtitle="Loading proposal details, please wait…"
            progress={modalProgress}
          />
        </div>
      )}

      {/* Reviewer Assigned Modal */}
      <ReviewerAssignedModal
        isOpen={isReviewerModalOpen}
        onClose={() => setIsReviewerModalOpen(false)}
        proposalId={selectedProposal?.id || null}
        proposalTitle={selectedProposal?.title}
      />

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isDocViewerOpen}
        onClose={() => {
          setIsDocViewerOpen(false);
          setSelectedProposalData(null);
        }}
        proposalData={selectedProposalData}
        proposalStatus={selectedProposalStatus}
        proposalTitle={selectedProposalTitle}
      />

      {/* View Reviewed Documents Modal */}
      <ViewReviewedDocuments
        isOpen={isReviewedDocOpen}
        onClose={() => {
          setIsReviewedDocOpen(false);
          setSelectedReviewedProposal(null);
        }}
        proposalData={selectedReviewedProposal}
      />
    </>
  );
};

export default ManageDocuments;