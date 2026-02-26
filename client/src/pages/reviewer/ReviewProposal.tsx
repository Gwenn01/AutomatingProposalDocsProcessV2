import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Grid,
  Table,
  MoreVertical,
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
import ReviewerList from "@/components/reviewer/ReviewerList";
import NotificationBell from "../../components/NotificationBell";
import { useToast } from "@/context/toast";
import ViewDocument from "@/components/reviewer/ViewDocument";
import {
  fetchReviewerProposals,
  fetchProgramProposalDetail,
  type ReviewerProposal,
} from "@/utils/reviewer-api";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import DocumentViewerModal from "@/components/implementor/DocumentViewerModal";

interface User {
  user_id: string;
  fullname: string;
}

interface Proposal {
  proposal_id: string;
  child_id: number;
  assignment_id: string;
  status: string;
  decision: string;
  review_status: string;
  is_reviewed: number;
  title: string;
  description: string;
  date: string;
  name: string;
  review_id: string;
  reviewer_id: string;
  implementor_id: string;
  type: string;
  version_no: number;
}

function mapApiProposal(p: ReviewerProposal): Proposal {
  return {
    proposal_id: String(p.proposal),
    child_id: Number(p.program),
    assignment_id: String(p.assignment),
    status: p.status,
    decision: p.is_reviewed ? "approved" : "",
    review_status: p.is_reviewed ? "Reviewed" : "Pending Review",
    is_reviewed: p.is_reviewed ? 1 : 0,
    title: p.title,
    description: `${p.type} Proposal — Version ${p.version_no}`,
    date: new Date(p.assigned_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    name: p.title,
    review_id: String(p.assignment),
    reviewer_id: "",
    implementor_id: String(p.implementor),
    type: p.type,
    version_no: p.version_no,
  };
}

const ReviewProposal: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [proposalsData, setProposalsData] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewerModal, setShowViewerModal] = useState<boolean>(false);
  const [showReviewerModal, setShowReviewerModal] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<Proposal | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [showReviewerList, setShowReviewerList] = useState<boolean>(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [proposalDetail, setProposalDetail] = useState<any | null>(null);
  const [actionProgress, setActionProgress] = useState<number>(0);

  // ── Progress bar while loading ──────────────────────────────────────────
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

  // ── Progress bar for action loading (View button) ────────────────────────
useEffect(() => {
  if (!actionLoading) {
    setActionProgress(0);
    return;
  }
  setActionProgress(0);
  let value = 0;
  const interval = setInterval(() => {
    value += Math.random() * 15 + 5;
    setActionProgress(Math.min(value, 90));
  }, 200);
  return () => clearInterval(interval);
}, [actionLoading]);

// When done, snap to 100
useEffect(() => {
  if (!actionLoading && actionProgress > 0) {
    setActionProgress(100);
  }
}, [actionLoading]);

  // ── Hydrate user from localStorage ─────────────────────────────────────
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLoading(false);
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Error parsing user data:", err);
      setLoading(false);
    }
  }, []);

  // ── Fetch proposals once user is available ──────────────────────────────
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiProposals = await fetchReviewerProposals();
        setProposalsData(apiProposals.map(mapApiProposal));
      } catch (err: any) {
        console.error("[ReviewProposal] Failed to load data:", err);
        setError(err?.message ?? "Failed to load proposals.");
      } finally {
        setProgress(100);
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // ── Filtering ───────────────────────────────────────────────────────────
  const filteredProposals = useMemo(() => {
    let filtered = proposalsData;
    if (activeFilter === "completed") {
      filtered = filtered.filter((p) => p.status === "approved");
    } else if (activeFilter === "pending") {
      filtered = filtered.filter((p) => p.status === "for_review");
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.name && p.name.toLowerCase().includes(query)),
      );
    }
    return filtered;
  }, [searchQuery, activeFilter, proposalsData]);

  const counts = useMemo(
    () => ({
      all: proposalsData.length,
      completed: proposalsData.filter((p) => p.status === "approved").length,
      pending: proposalsData.filter((p) => p.status === "for_review").length,
    }),
    [proposalsData],
  );

  const handleReview = (proposal: Proposal) =>
    showToast(`Opening review form for: ${proposal.title}`, "info");
  const handleViewOthers = (proposal: Proposal) =>
    showToast(`Viewing other reviewers for: ${proposal.title}`, "info");

  // ── View Proposal ───────────────────────────────────────────────────────
const handleViewProposal = async (doc: Proposal): Promise<void> => {
  setActionLoading(true);
  setProposalDetail(null);
  try {
    const detail = await fetchProgramProposalDetail(Number(doc.child_id)); // ← was doc.child_id
    setSelectedDoc(doc);
    setProposalDetail(detail);
    setShowViewerModal(true);
  } catch (err) {
    console.error("[ViewProposal] Failed to fetch proposal detail:", err);
  } finally {
    setActionLoading(false);
  }
};

const handleViewReview = async (doc: Proposal): Promise<void> => {
  setActionLoading(true);
  setProposalDetail(null);

  try {
    const detail = await fetchProgramProposalDetail(Number(doc.child_id)); // ← was doc.child_id
    setSelectedDoc(doc);
    setProposalDetail(detail);
    setShowReviewerModal(true);
  } catch (err) {
    console.error("[ViewProposal] Failed to fetch proposal detail:", err);
  } finally {
    setActionLoading(false);
  }
};

  // ── Loading screen ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full h-full p-20 bg-white/80 inset-0 z-[60] backdrop-blur-md animate-fade-in">
          <FormSkeleton lines={5} />
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────
  return (
    <div className="flex-1 p-10 bg-white min-h-screen font-sans">
      {!user ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400 text-lg">Please log in to view proposals</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">Error loading proposals</div>
            <div className="text-gray-400 text-sm">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
{/* Action Loading Overlay */}
{actionLoading && (
  <div className="fixed w-full h-full z-[70] flex items-center justify-center">
    {/* Blurred backdrop */}
    <div className="absolute inset-0 bg-white/60 backdrop-blur-md" />

    {/* Card */}
    <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-gray-100 px-12 py-10 flex flex-col items-center w-[420px] gap-5">
      
      {/* Animated icon */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-green-50 animate-ping opacity-30" />
        <div className="absolute inset-0 rounded-full bg-green-100" />
        <FileText className="relative w-7 h-7 text-green-600" />
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-[17px] font-bold text-gray-900 mb-1">Opening Proposal</p>
        <p className="text-sm text-gray-400">Fetching document details…</p>
      </div>

      {/* Progress bar */}
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

          {/* Header */}
          <div className="flex justify-between items-center mb-8 relative">
            <h1 className="text-[32px] font-bold text-gray-900">Review Proposal</h1>
            <NotificationBell
              notifications={[]}
              unreadCount={0}
              show={false}
              onToggle={() => {}}
              onClose={() => {}}
              onRead={() => {}}
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
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-green-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2.5 rounded-lg transition-colors ${
                    viewMode === "table"
                      ? "bg-white shadow-sm text-green-600"
                      : "text-gray-400 hover:text-gray-600"
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
                        <span
                          className={`px-4 py-2.5 rounded-full text-xs font-extrabold tracking-wide ${statusStyle.className}`}
                        >
                          {statusStyle.label}
                        </span>
                        <button className="text-gray-300 hover:text-gray-500 transition-colors">
                          <MoreVertical className="w-6 h-6" />
                        </button>
                      </div>
                      <h3
                        className="text-base font-bold text-gray-900 mb-3 leading-tight"
                        title={proposal.title}
                      >
                        {proposal.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-1">
                        {proposal.description}
                      </p>
                      {proposal.review_status && (
                        <p
                          className={`flex items-center gap-2 text-xs rounded-md px-3 py-2 mt-1 mb-3 border ${
                            proposal.decision === "approved"
                              ? "text-green-700 bg-green-50 border-green-200"
                              : proposal.is_reviewed === 1
                                ? "text-red-700 bg-red-50 border-red-200"
                                : "text-orange-700 bg-orange-50 border-orange-200"
                          }`}
                        >
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
                      <p className="text-gray-400 text-xs font-bold mb-5">{proposal.date}</p>
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
                    <th className="text-left px-8 py-5 text-sm font-bold text-gray-600">Date</th>
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
                          <span
                            className={`px-5 py-2.5 rounded-full text-xs font-extrabold tracking-wide ${statusStyle.className}`}
                          >
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
                              onClick={() => handleReview(proposal)}
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

          {/* Detail Modal */}
          {selectedProposal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedProposal(null)}
            >
              <div
                className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <span
                    className={`px-4 py-2.5 rounded-full text-xs font-extrabold tracking-wide ${
                      getStatusStyle(selectedProposal.status).className
                    }`}
                  >
                    {selectedProposal.status}
                  </span>
                  <button
                    onClick={() => setSelectedProposal(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedProposal.title}</h2>
                <p className="text-gray-500 text-sm mb-6">{selectedProposal.date}</p>
                <p className="text-gray-700 leading-relaxed mb-8">{selectedProposal.description}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReview(selectedProposal)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-[#DC2626] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#b91c1c] transition-colors"
                  >
                    <FileText className="w-[18px] h-[18px]" />
                    <span>Review</span>
                  </button>
                  <button
                    onClick={() => handleViewOthers(selectedProposal)}
                    className="flex items-center justify-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-gray-700 transition-colors"
                  >
                    <Users className="w-[18px] h-[18px]" />
                    <span>View Others</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <DocumentViewerModal
        isOpen={showViewerModal}
        proposalData={proposalDetail}
        proposalStatus={selectedDoc?.status ?? ""}
        proposalTitle={selectedDoc?.title ?? ""}
        onClose={() => { setShowViewerModal(false); setProposalDetail(null); }}
      />


      <ReviewerCommentModal
        isOpen={showReviewerModal}
        proposalData={selectedDoc}           
        proposalDetail={proposalDetail}  
        onClose={() => { setShowReviewerModal(false); setProposalDetail(null); }}
        reviewe={user?.user_id}
        review_id={selectedDoc?.review_id}
      />
      
      <ReviewerList
        isOpen={showReviewerList}
        proposalId={selectedProposalId}
        user_id={user?.user_id}
        onClose={() => setShowReviewerList(false)}
      />
    </div>
  );
};

export default ReviewProposal;