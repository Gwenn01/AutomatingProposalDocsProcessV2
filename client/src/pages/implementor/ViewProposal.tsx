import React, { useEffect, useState, useMemo } from "react";
import {
  List,
  Eye,
  ChevronLeft,
  ChevronRight,
  Grid,
  Table,
  Search,
  X,
  FileX,
} from "lucide-react";

import DocumentViewerModal from "@/components/implementor/DocumentViewerModal";
import ReviewerListStatus from "@/components/implementor/ReviewerListStatus";
import NotificationBell from "@/components/NotificationBell";
import { fetchProposalsNode, fetchProgramProposalDetail } from "@/utils/implementor-api";
import { useAuth } from "@/context/auth-context";

// ================= TYPE DEFINITIONS =================

interface User {
  user_id: string | number;
  [key: string]: any;
}

interface Review {
  review_id: string | number;
  reviewer_id: string | number;
  status: string;
  [key: string]: any;
}

interface Document {
  proposal_id: string | number;
  child_id?: string | number;
  reviewer_count: number;
  title: string;
  file_path: string;
  status: string;
  submitted_at: string | null;
  reviews: Review[] | number;
  reviews_per_docs?: any;
}

interface Notification {
  id: string | number;
  is_read: 0 | 1;
  message: string;
  created_at: string;
  [key: string]: any;
}

interface StatusStyle {
  label: string;
  className: string;
}

type ViewMode = "grid" | "table";

// ================= COMPONENT =================

const ViewProposal: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  //const [user, setUser] = useState<User | null>(null);
  const [showReviewerModal, setShowReviewerModal] = useState<boolean>(false);
  const [showViewerModal, setShowViewerModal] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showReviewerStatus, setShowReviewerStatus] = useState<boolean>(false);
  const [showNotif, setShowNotif] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [progress, setProgress] = useState<number>(0);

  // Holds the full detail response from /api/program-proposal/{child_id}/
  const [proposalDetail, setProposalDetail] = useState<any | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage: number = 10;

  const { user } = useAuth();


  // ================= PROGRESS BAR =================
  useEffect(() => {
    if (!actionLoading) return;
    setProgress(0);
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 10;
      setProgress(Math.min(value, 95));
    }, 300);
    return () => clearInterval(interval);
  }, [actionLoading]);

  // ================= FETCH USER =================
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     try {
  //       setUser(JSON.parse(storedUser));
  //     } catch (error) {
  //       console.error("Error parsing user data:", error);
  //     }
  //   }
  // }, []);

  // ================= NOTIFICATIONS =================
  useEffect(() => {
    if (!user) return;
    // Placeholder for future API implementation
  }, [user]);

  const unreadCount: number = notifications.filter((n) => n.is_read === 0).length;

  const handleRead = async (id: string | number): Promise<void> => {
    if (!user) return;
    const target = notifications.find((n) => n.id === id);
    if (!target || target.is_read === 1) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
    );
    try {
      console.log("Marking notification as read:", id);
    } catch (error) {
      console.error(error);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 0 } : n))
      );
    }
  };

  // ================= FETCH PROPOSALS LIST =================
  useEffect(() => {
    if (!user?.user_id) return;
    const load = async () => {
      setPageLoading(true);
      try {
        const data: any[] = await fetchProposalsNode("Program");
        const mapped: Document[] = data.map((p) => ({
          proposal_id: p.id,
          child_id: p.child_id,
          reviewer_count: p.reviewer_count,
          title: p.title,
          file_path: p.file_path ?? "",
          status: p.status ?? "unknown",
          submitted_at: p.created_at ?? null,
          reviews: p.reviews ?? 0,
        }));

        setDocuments(mapped);

      } catch (err) {
        console.error("[ViewProposal] Failed to fetch proposals:", err);
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [user]);




  // ================= VIEW PROPOSAL — uses authFetch via implementor-api =================
  const handleViewProposal = async (doc: Document): Promise<void> => {
    setActionLoading(true);
    setSelectedDoc(doc);
    setProposalDetail(null);
    try {
      const childId = doc.child_id ?? doc.proposal_id;
      const detail = await fetchProgramProposalDetail(childId);
      setProposalDetail(detail);
      setShowViewerModal(true);
    } catch (err) {
      console.error("[ViewProposal] Failed to fetch proposal detail:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // ================= STATUS STYLE =================
  const getStatusStyle = (status: string): StatusStyle => {
    switch (status) {
      case "submitted":   return { label: "Initial Review", className: "bg-[#FFC107] text-white" };
      case "for_review":  return { label: "For Review",     className: "bg-[#38BDF8] text-white" };
      case "under_review":return { label: "Under Review",   className: "bg-[#FFC107] text-white" };
      case "final_review":return { label: "Final Review",   className: "bg-[#FBBF24] text-white" };
      case "for_approval":return { label: "For Approval",   className: "bg-[#6366F1] text-white" };
      case "approved":    return { label: "Completed",      className: "bg-[#22C55E] text-white" };
      case "for_revision":return { label: "For Revision",   className: "bg-[#F97316] text-white" };
      case "rejected":    return { label: "Rejected",       className: "bg-[#EF4444] text-white" };
      default:            return { label: status,           className: "bg-gray-400 text-white" };
    }
  };

  // ================= FILTER & PAGINATION =================
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const query = searchQuery.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.status.toLowerCase().includes(query)
    );
  }, [documents, searchQuery]);

  const totalPages: number = Math.ceil(filteredDocuments.length / rowsPerPage);
  const startIndex: number = (currentPage - 1) * rowsPerPage;
  const endIndex: number = startIndex + rowsPerPage;
  const currentDocuments: Document[] = filteredDocuments.slice(startIndex, endIndex);

  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const goToPreviousPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  useEffect(() => { setCurrentPage(1); }, [documents.length, searchQuery]);

  // ================= PAGE LOADING SKELETON =================
  if (pageLoading) {
    return (
      <div className="flex-1 bg-white p-10 min-h-screen animate-pulse">
        <div className="mb-10">
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
        </div>
      </div>
    );
  }

  // ================= RENDER =================
  return (
    <div className="flex-1 bg-white p-10 min-h-screen">

      {/* Action Loading Overlay */}
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

      {/* Page Header */}
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
              onRead={handleRead}
            />
          </div>
        </div>
      </div>

      {/* ================= GRID VIEW ================= */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 place-items-start h-[78%]">
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
                      className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition"
                    >
                      <p className="text-xs font-extralight">List of Reviewer</p>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-700 font-semibold text-xs">
                        {doc.reviewer_count}
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
                    onClick={() => { setSelectedDoc(doc); setShowReviewerModal(true); }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-[#166534] text-white py-3 rounded-md font-bold text-xs hover:bg-[#14532d] transition-colors"
                  >
                    <List className="w-[18px] h-[18px]" />
                    <span>Reviewer</span>
                  </button>
                </div>
              </div>
            );
          })}

          {currentDocuments.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-24">
              <div className="relative flex flex-col items-center text-center gap-4 max-w-sm">
                
                {/* Glow Background */}
                <div className="absolute -top-10 -z-10 w-40 h-40 bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 rounded-full blur-3xl opacity-60" />

                {/* Icon Container */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner flex items-center justify-center">
                  <FileX className="w-9 h-9 text-gray-500" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-700">
                  No proposals yet
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed">
                  You haven’t created any proposals yet. Once you do, they’ll show up right here.
                </p>

                {/* CTA Button (optional)
                <button 
                  //onClick={() => } 
                  className="mt-4 px-5 py-2.5 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition">
                  Create Proposal
                </button> */}
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
                <th className="px-6 py-4 text-center">Actions</th>
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
                        onClick={() => { setSelectedDoc(doc); setShowReviewerModal(true); }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 text-[#166534] px-5 py-2.5 rounded-lg text-xs font-semibold hover:from-green-100 hover:to-emerald-100 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      >
                        <List className="w-4 h-4" />
                        Reviewer
                      </button>
                    </td>
                    <td className="px-2 py-5 text-center align-middle">
                      <button
                        onClick={() => { setSelectedDoc(doc); setShowReviewerStatus(true); }}
                        className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-700 font-semibold text-xs">
                          {doc.reviewer_count}
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {currentDocuments.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="col-span-full flex items-center justify-center py-24">
                      <div className="relative flex flex-col items-center text-center gap-4 max-w-sm">
                        
                        {/* Glow Background */}
                        <div className="absolute -top-10 -z-10 w-40 h-40 bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 rounded-full blur-3xl opacity-60" />

                        {/* Icon Container */}
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner flex items-center justify-center">
                          <FileX className="w-9 h-9 text-gray-500" />
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-700">
                          No proposals yet
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 leading-relaxed">
                          You haven’t created any proposals yet. Once you do, they’ll show up right here.
                        </p>

                        {/* CTA Button (optional)
                        <button 
                          //onClick={() => } 
                          className="mt-4 px-5 py-2.5 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition">
                          Create Proposal
                        </button> */}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredDocuments.length > 0 && (
        <div className="mt-6 flex items-center justify-between px-8">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredDocuments.length)} of{" "}
            {filteredDocuments.length} proposals
            {searchQuery && ` (filtered from ${documents.length} total)`}
          </div>
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
            <span className="text-sm font-medium text-gray-700 px-4">
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
        onClose={() => { setShowViewerModal(false); setProposalDetail(null); }}
      />

      <ReviewerListStatus
        isOpen={showReviewerStatus}
        proposalId={selectedDoc?.proposal_id}
        onClose={() => setShowReviewerStatus(false)}
      />
    </div>
  );
};

export default ViewProposal;