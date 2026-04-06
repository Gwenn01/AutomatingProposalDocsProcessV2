import React, { useState } from "react";
import { Eye, ChevronLeft, ChevronRight, Grid, Table, Search, X, FileX, Edit } from "lucide-react";
import DocumentViewerModal from "@/components/implementor/DocumentViewerModal";
import ReviewerListStatus from "@/components/implementor/ReviewerListStatus";
import NotificationBell from "@/components/NotificationBell";
import ViewReviewedDocuments from "@/components/implementor/view-proposal/view-reviewed-document";
import { useProposals, type Document, type ViewMode } from "@/hooks/useViewProposal";
import GridSkeleton from "@/components/skeletons/GridSkeleton";

const ViewProposal: React.FC = () => {
  const [viewMode, setViewMode]                   = useState<ViewMode>("grid");
  const {
    currentDocuments,
    filteredDocuments,
    documents,
    notifications,
    proposalDetail,
    pageLoading,
    actionLoading,
    progress,
    searchQuery,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    unreadCount,
    setSearchQuery,
    fetchProposalDetail,
    markNotifRead,
    getStatusStyle,
    formatDate,
    goToNextPage,
    goToPreviousPage,
  } = useProposals("Program", viewMode === "grid" ? 6 : 10);

  const [showNotif, setShowNotif]                 = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc]             = useState<Document | null>(null);
  const [showViewerModal, setShowViewerModal]     = useState<boolean>(false);
  const [showReviewerStatus, setShowReviewerStatus] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal]     = useState<boolean>(false);
  const [reviewProposalData, setReviewProposalData] = useState<any | null>(null);

  const handleViewProposal = async (doc: Document): Promise<void> => {
    setSelectedDoc(doc);
    const detail = await fetchProposalDetail(doc);
    if (detail) setShowViewerModal(true);
  };

  const handleOpenReview = (doc: Document): void => {
    setReviewProposalData({
      title:       doc.title,
      status:      doc.status,
      proposal_id: doc.proposal_id,
      child_id:    doc.child_id,
    });
    setShowReviewModal(true);
  };

  if (pageLoading) {
    return (
      <div className="flex-1 bg-white p-10 min-h-screen animate-pulse">
        {/* <div className="mb-10">
          <div className="h-8 w-56 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 w-72 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {Array.from({ length: 5 }).map((_, i) => (
                  <th key={i} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-6 py-5">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
        <GridSkeleton />
      </div>
    );
  }

  // ================= RENDER =================
  return (
    <div className="flex flex-col h-screen bg-white px-10 pt-10 overflow-hidden">

      {actionLoading && (
        <div className="absolute inset-0 bg-white/80 z-[60] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white px-14 py-10 flex flex-col items-center w-[380px] shadow-xl rounded-xl">
            <p className="text-lg font-semibold mb-1">Loading proposal</p>
            <p className="text-sm text-gray-500 mb-4">Preparing your document…</p>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-700 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-gray-500 font-medium">{Math.round(progress)}%</p>
          </div>
        </div>
      )}

      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">View Proposals</h2>
          <p className="text-sm text-gray-500 mt-1">Track status, reviews, and proposal progress</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-full xl:w-96">
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-200 outline-none shadow-sm bg-white text-gray-600"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-green-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2.5 rounded-lg transition-colors ${viewMode === "table" ? "bg-white shadow-sm text-green-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Table className="w-5 h-5" />
              </button>
            </div>
            <NotificationBell
              notifications={notifications}
              unreadCount={unreadCount}
              show={showNotif}
              onToggle={() => setShowNotif((p) => !p)}
              onClose={() => setShowNotif(false)}
              onRead={markNotifRead}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {/* ================= GRID VIEW ================= */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {currentDocuments.map((doc) => {
              const status = getStatusStyle(doc.status);
              return (
                <div
                  key={doc.proposal_id}
                  className="bg-white rounded-xl p-7 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border flex flex-col justify-between min-h-[260px]"
                >
                  <div>
                    <div className="flex justify-between items-start mb-5">
                      <span className={`px-4 py-2.5 rounded-full text-xs font-extrabold tracking-wide ${status.className}`}>
                        {status.label}
                      </span>
                      <button
                        onClick={() => { setSelectedDoc(doc); setShowReviewerStatus(true); }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-100 transition  ${doc.review_progress === "0 out of 0" ? "bg-gray-100" : "bg-green-50"}`}
                      >
                        <div className={`w-2 h-2  rounded-full ${doc.review_progress === "0 out of 0" ? "bg-gray-400" : "bg-green-500 animate-pulse"}`}></div>
                          <span className={` font-semibold text-xs ${doc.review_progress === "0 out of 0" ? "text-gray-400" : "text-green-700"}`}>
                            {doc.review_progress === "0 out of 0"
                              ? "No Assigned Reviewer"
                              : `No. of Reviewer (${doc.reviewer_count})`}
                          </span>
                      </button>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-3 leading-tight" title={doc.title}>
                      {doc.title}
                    </h3>
                    <p className="text-gray-400 text-xs font-bold mb-3">
                      Submitted: {formatDate(doc.submitted_at)}
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleViewProposal(doc)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-[#4F46E5] text-white py-3 rounded-md font-bold text-xs hover:bg-[#4338CA] transition-colors"
                    >
                      <Eye className="w-[18px] h-[18px]" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleOpenReview(doc)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-amber-500 text-white py-3 rounded-md font-bold text-xs hover:bg-amber-600 transition-colors"
                    >
                      <Edit className="w-[18px] h-[18px]" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {currentDocuments.length === 0 && (
              <div className="col-span-full text-center py-16 border">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileX className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No proposals found</p>
                  <p className="text-sm text-gray-400">Create your first proposal to get started</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TABLE VIEW ================= */}
        {viewMode === "table" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300">
                <tr className="text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">View</th>
                  <th className="px-6 py-4 text-center">Edit</th>
                  <th className="px-6 py-4 text-center">Reviewer List</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentDocuments.map((doc, index) => {
                  const status = getStatusStyle(doc.status);
                  return (
                    <tr key={doc.proposal_id} className="hover:bg-gray-50/50 transition-colors group border">
                      <td className="px-6 py-5 align-middle">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {index + 1 + startIndex}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-medium text-base leading-relaxed group-hover:text-blue-600 transition-colors line-clamp-2">
                              {doc.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Submitted: {formatDate(doc.submitted_at)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center align-middle">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center justify-center min-w-[140px] shadow-sm ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center align-middle">
                        <button
                          onClick={() => handleViewProposal(doc)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-[#4F46E5] px-5 py-2.5 rounded-lg text-xs font-semibold hover:from-blue-100 hover:to-indigo-100 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                      <td className="px-6 py-5 text-center align-middle">
                        <button
                          onClick={() => handleOpenReview(doc)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 px-5 py-2.5 rounded-lg text-xs font-semibold hover:from-amber-100 hover:to-orange-100 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </td>
                      <td className="px-2 py-5 text-center align-middle">
                        <button
                          onClick={() => { setSelectedDoc(doc); setShowReviewerStatus(true); }}
                          className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-700 font-semibold text-xs">                            {doc.review_progress === "0 out of 0" ? "No Assigned Reviewer" : doc.review_progress}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {currentDocuments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Eye className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No proposals found</p>
                        <p className="text-sm text-gray-400">Create your first proposal to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>


      {/* Pagination */}
      {filteredDocuments.length > 0 && (
        <div className="shrink-0 border-t border-gray-100 bg-white py-4 flex items-center justify-end gap-4 px-8">
          <span className="text-sm text-gray-500">
            {startIndex + 1}–{Math.min(endIndex, filteredDocuments.length)} of {filteredDocuments.length} proposals
            {searchQuery && ` (filtered from ${documents.length} total)`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF]"
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-sm font-medium text-gray-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF]"
              }`}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}
      <DocumentViewerModal
        isOpen={showViewerModal}
        proposalData={proposalDetail}
        proposalStatus={selectedDoc?.status ?? ""}
        proposalTitle={selectedDoc?.title ?? ""}
        onClose={() => setShowViewerModal(false)}
      />

      <ReviewerListStatus
        isOpen={showReviewerStatus}
        proposalId={
          selectedDoc?.proposal_id !== undefined
            ? Number(selectedDoc.proposal_id)
            : undefined
        }
        onClose={() => setShowReviewerStatus(false)}
      />

      <ViewReviewedDocuments
        isOpen={showReviewModal}
        onClose={() => { setShowReviewModal(false); setReviewProposalData(null); }}
        proposalData={reviewProposalData}
      />
    </div>
  );
};

export default ViewProposal;