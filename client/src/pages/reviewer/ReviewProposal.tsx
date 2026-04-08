import React, { useState, useEffect } from "react";
import {
  Search,
  Grid,
  Table,
  Eye,
  FileText,
  Users,
  X,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { getStatusStyle } from "@/utils/statusStyles";
import ReviewerCommentModal from "@/components/reviewer/ReviewerCommentModal";
import NotificationBell from "../../components/NotificationBell";
import { useToast } from "@/context/toast";
import DocumentViewerModal from "@/components/implementor/DocumentViewerModal";
import FormSkeleton from "@/components/ui/FormSkeleton";
import ReviewerListStatus from "@/components/implementor/ReviewerListStatus";
import { useReviewerProposals, type Proposal } from "@/hooks/useReviewerProposal";
import GridSkeleton from "@/components/ui/GridSkeleton";

// ── Persistence keys ───────────────────────────────────────────────────────
const SK = {
  VIEW_MODE:          "rp_viewMode",
  ACTIVE_FILTER:      "rp_activeFilter",
  SHOW_VIEWER:        "rp_showViewerModal",
  SHOW_REVIEWER:      "rp_showReviewerModal",
  SHOW_REVIEWER_LIST: "rp_showReviewerList",
  SELECTED_DOC_ID:    "rp_selectedDocId",
  SELECTED_PROP_ID:   "rp_selectedProposalId",
} as const;

function persist(key: string, value: string | null) {
  if (value === null) localStorage.removeItem(key);
  else localStorage.setItem(key, value);
}

const ReviewProposal: React.FC = () => {
  const { showToast } = useToast();

  const {
    filteredProposals,
    notifications,
    proposalDetail,
    loading,
    actionLoading,
    error,
    actionProgress,
    searchQuery,
    activeFilter,
    counts,
    unreadCount,
    setSearchQuery,
    setActiveFilter,
    loadData,
    fetchDetail,
    markNotifRead,
  } = useReviewerProposals();

  // ── Local UI state (initialised from localStorage) ────────────────────────
  const [viewMode, setViewMode] = useState<"grid" | "table">(
    () => (localStorage.getItem(SK.VIEW_MODE) as "grid" | "table") || "grid"
  );
  const [showNotif,           setShowNotif]           = useState(false);
  const [showViewerModal,     setShowViewerModal]     = useState(
    () => localStorage.getItem(SK.SHOW_VIEWER) === "true"
  );
  const [showReviewerModal,   setShowReviewerModal]   = useState(
    () => localStorage.getItem(SK.SHOW_REVIEWER) === "true"
  );
  const [showReviewerList,    setShowReviewerList]    = useState(
    () => localStorage.getItem(SK.SHOW_REVIEWER_LIST) === "true"
  );
  const [selectedDoc,         setSelectedDoc]         = useState<Proposal | null>(null);
  const [selectedProposalId,  setSelectedProposalId]  = useState<string | null>(
    () => localStorage.getItem(SK.SELECTED_PROP_ID)
  );

  // The proposal_id of the doc whose modal should be restored after proposals load
  const [pendingDocId, setPendingDocId] = useState<string | null>(
    () => localStorage.getItem(SK.SELECTED_DOC_ID)
  );

  // ── Persist simple flags whenever they change ─────────────────────────────
  useEffect(() => { persist(SK.VIEW_MODE,          viewMode);                          }, [viewMode]);
  useEffect(() => { persist(SK.SHOW_VIEWER,        showViewerModal    ? "true" : null); }, [showViewerModal]);
  useEffect(() => { persist(SK.SHOW_REVIEWER,      showReviewerModal  ? "true" : null); }, [showReviewerModal]);
  useEffect(() => { persist(SK.SHOW_REVIEWER_LIST, showReviewerList   ? "true" : null); }, [showReviewerList]);
  useEffect(() => { persist(SK.SELECTED_PROP_ID,   selectedProposalId);                }, [selectedProposalId]);

  // ── Restore modal + selectedDoc once proposals are loaded ─────────────────
  useEffect(() => {
    if (loading || !pendingDocId || filteredProposals.length === 0) return;

    const match = filteredProposals.find(
      (p) => String(p.proposal_id) === pendingDocId
    );
    if (!match) return;

    // Restore the doc and silently fetch its detail so modals are fully populated
    (async () => {
      const detail = await fetchDetail(match);
      if (!detail) return;
      setSelectedDoc(match);
      // showViewerModal / showReviewerModal are already true from localStorage init
    })();

    setPendingDocId(null); // only restore once
  }, [loading, filteredProposals, pendingDocId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleViewProposal = async (doc: Proposal): Promise<void> => {
    const detail = await fetchDetail(doc);
    if (!detail) return;
    setSelectedDoc(doc);
    persist(SK.SELECTED_DOC_ID, String(doc.proposal_id));
    setShowViewerModal(true);
    setShowReviewerModal(false);
  };

  const handleViewReview = async (doc: Proposal): Promise<void> => {
    const detail = await fetchDetail(doc);
    if (!detail) return;
    setSelectedDoc(doc);
    persist(SK.SELECTED_DOC_ID, String(doc.proposal_id));
    setShowReviewerModal(true);
    setShowViewerModal(false);
  };

  const handleCloseViewerModal = () => {
    setShowViewerModal(false);
    persist(SK.SELECTED_DOC_ID, null);
  };

  const handleCloseReviewerModal = () => {
    setShowReviewerModal(false);
    persist(SK.SELECTED_DOC_ID, null);
  };

  const handleCloseReviewerList = () => {
    setShowReviewerList(false);
    setSelectedProposalId(null);
  };

  const handleReview = (proposal: Proposal) =>
    showToast(`Opening review form for: ${proposal.title}`, "info");

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex-1 bg-white p-10 min-h-screen animate-pulse">
        <GridSkeleton />
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 bg-white min-h-screen font-sans">

      {/* Action Loading Overlay */}
      {actionLoading && (
        <div className="absolute z-[70] w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-md" />
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-gray-100 px-12 py-10 flex flex-col items-center w-[420px] gap-5">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-green-50 animate-ping opacity-30" />
              <div className="absolute inset-0 rounded-full bg-green-100" />
              <FileText className="relative w-7 h-7 text-green-600" />
            </div>
            <div className="text-center">
              <p className="text-[17px] font-bold text-gray-900 mb-1">Opening Proposal</p>
              <p className="text-sm text-gray-400">Fetching document details…</p>
            </div>
            <div className="w-full">
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 transition-all duration-300 ease-out"
                  style={{ width: `${actionProgress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-[11px] text-gray-400 font-medium">Loading</p>
                <p className="text-[11px] text-green-600 font-bold">{Math.round(actionProgress)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-10">
        {error ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-2">Error loading proposals</div>
              <div className="text-gray-400 text-sm">{error}</div>
              <button
                onClick={loadData}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-8 relative">
              <h1 className="text-[32px] font-bold text-gray-900">Review Proposal</h1>
              <NotificationBell
                notifications={notifications}
                unreadCount={unreadCount}
                show={showNotif}
                onToggle={() => setShowNotif((p) => !p)}
                onClose={() => setShowNotif(false)}
                onRead={markNotifRead}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-col xl:flex-row justify-between items-center mb-8 space-y-6 xl:space-y-0">
              <div className="relative w-full xl:w-96">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-200 outline-none shadow-sm bg-white text-gray-600"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto justify-between xl:justify-end">
                <div className="flex space-x-8 text-sm font-bold text-gray-500">
                  {(["all", "completed", "pending"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`pb-1 transition-colors capitalize ${
                        activeFilter === filter
                          ? "text-green-600 border-b-2 border-green-600"
                          : "hover:text-gray-700"
                      }`}
                    >
                      {filter === "pending"
                        ? `Pending Evaluation (${counts.pending})`
                        : filter === "completed"
                          ? `Completed (${counts.completed})`
                          : `All (${counts.all})`}
                    </button>
                  ))}
                </div>

                <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-white shadow-sm text-green-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2.5 rounded-lg transition-colors ${
                      viewMode === "table" ? "bg-white shadow-sm text-green-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Table className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {filteredProposals.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No proposals found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter</p>
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && filteredProposals.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProposals.map((proposal) => {
                  const statusStyle = getStatusStyle(proposal.status);
                  return (
                    <div
                      key={proposal.proposal_id}
                      className="bg-white rounded-[32px] p-7 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border flex flex-col justify-between h-full"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-5">
                          <span className={`px-4 py-2.5 rounded-full text-xs font-extrabold tracking-wide ${statusStyle.className}`}>
                            {statusStyle.label}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-3 leading-tight" title={proposal.title}>
                          {proposal.title}
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed mb-1 font-semibold">
                          Implementor: <span className="font-normal">{proposal.implementor_name}</span>
                        </p>
                        {proposal.review_status && (
                          <p className={`flex items-center gap-2 text-xs rounded-md px-3 py-2 mt-1 mb-3 border ${
                            proposal.decision === "approved"
                              ? "text-green-700 bg-green-50 border-green-200"
                              : proposal.is_reviewed === 1
                                ? "text-red-700 bg-red-50 border-red-200"
                                : "text-orange-700 bg-orange-50 border-orange-200"
                          }`}>
                            {proposal.decision === "approved" ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : proposal.is_reviewed === 1 ? (
                              <AlertTriangle className="w-4 h-4" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                            <span>{proposal.review_status}</span>
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-semibold mb-5">
                          Assigned Date: <span className="font-normal">{proposal.date}</span>
                        </p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleViewProposal(proposal)}
                            className="flex-1 flex items-center justify-center space-x-2 bg-[#16A34A] text-white py-2 rounded-md font-bold text-sm hover:bg-[#15803d] transition-colors"
                          >
                            <Eye className="w-[18px] h-[18px]" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleViewReview(proposal)}
                            className="flex-1 flex items-center justify-center space-x-2 bg-[#DC2626] text-white py-2 rounded-md font-bold text-sm hover:bg-[#b91c1c] transition-colors"
                          >
                            <FileText className="w-[18px] h-[18px]" />
                            <span>Review</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProposalId(proposal.proposal_id);
                              setShowReviewerList(true);
                            }}
                            className="flex-none flex items-center justify-center bg-gray-900 text-white p-3 hover:bg-gray-700 transition-colors rounded-md"
                            title="View Others"
                          >
                            <Users className="w-[18px] h-[18px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Table View */}
            {viewMode === "table" && filteredProposals.length > 0 && (
              <div className="bg-white rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-8 py-5 text-sm font-bold text-gray-600">Status</th>
                      <th className="text-left px-8 py-5 text-sm font-bold text-gray-600">Title</th>
                      <th className="text-left px-8 py-5 text-sm font-bold text-gray-600">Type</th>
                      <th className="text-left px-8 py-5 text-sm font-bold text-gray-600">Assigned Date</th>
                      <th className="text-left px-8 py-5 text-sm font-bold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProposals.map((proposal) => {
                      const statusStyle = getStatusStyle(proposal.status);
                      return (
                        <tr
                          key={proposal.proposal_id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-8 py-5">
                            <span className={`px-5 py-2.5 rounded-full text-xs font-extrabold tracking-wide ${statusStyle.className}`}>
                              {statusStyle.label}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm font-semibold text-gray-900 max-w-xs">
                            {proposal.title}
                          </td>
                          <td className="px-8 py-5 text-sm text-gray-500">{proposal.type}</td>
                          <td className="px-8 py-5 text-xs font-bold text-gray-400 whitespace-nowrap">
                            {proposal.date}
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewProposal(proposal)}
                                className="p-2 bg-[#16A34A] text-white rounded-lg hover:bg-[#15803d] transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleViewReview(proposal)}
                                className="p-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#b91c1c] transition-colors"
                                title="Review"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedProposalId(proposal.proposal_id);
                                  setShowReviewerList(true);
                                }}
                                className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                title="View Others"
                              >
                                <Users className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= MODALS ================= */}
      <DocumentViewerModal
        isOpen={showViewerModal}
        proposalData={proposalDetail}
        proposalStatus={selectedDoc?.status ?? ""}
        proposalTitle={selectedDoc?.title ?? ""}
        onClose={handleCloseViewerModal}
      />

      <ReviewerCommentModal
        isOpen={showReviewerModal}
        proposalData={selectedDoc}
        proposalDetail={proposalDetail}
        onClose={handleCloseReviewerModal}
        reviewe={selectedDoc?.reviewer_id}
        review_id={selectedDoc?.review_id}
      />

      <ReviewerListStatus
        isOpen={showReviewerList}
        proposalId={
          selectedProposalId !== null ? Number(selectedProposalId) : undefined
        }
        onClose={handleCloseReviewerList}
      />
    </div>
  );
};

export default ReviewProposal;