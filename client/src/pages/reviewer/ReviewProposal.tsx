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
import { Bell } from "lucide-react";
import ReviewerCommentModal from "@/components/reviewer/ReviewerCommentModal";
import ReviewerList from "@/components/reviewer/ReviewerList";
import NotificationBell from "../../components/NotificationBell";
import { useToast } from "@/context/toast";
import DocumentViewerModal from "@/components/implementor/DocumentViewerModal";
interface User {
  user_id: string;
  fullname: string;
}

interface Proposal {
  proposal_id: string;
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
}

interface Notification {
  id: string;
  is_read: number;
  message: string;
  created_at: string;
}

interface History {
  history_id: string;
  proposal_id: string;
  status: string;
  version_no: number;
  created_at: string;
}

const ReviewProposal: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null,
  );
  const [user, setUser] = useState<User | null>(null);
  const [proposalsData, setProposalsData] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewerModal, setShowViewerModal] = useState<boolean>(false);
  const [showReviewerModal, setShowReviewerModal] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0);
  const [showReviewerList, setShowReviewerList] = useState<boolean>(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
    null,
  );
  const [showNotif, setShowNotif] = useState<boolean>(false);
  const [history, setHistory] = useState<History[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  const statusStyle = getStatusStyle(proposalsData[0]?.status || "");

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.log("No user found, would redirect to login");
      setLoading(false);
      return;
    }

    try {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setLoading(false);
    }
  }, []);

  // Mock data - API calls removed
  useEffect(() => {
    if (!user) return;

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      // Set mock data here if needed
      setProposalsData([]);
      setNotifications([]);
    }, 1000);
  }, [user]);

  const unreadCount = notifications.filter((n) => n.is_read === 0).length;

  const handleRead = async (id: string) => {
    if (!user) return;

    const target = notifications.find((n) => n.id === id);
    if (!target || target.is_read === 1) return;

    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, is_read: 1 } : notif)),
    );

    // API call removed
  };

  const fetchCoverPage = async (proposalId: string) => {
    // API call removed
    return null;
  };

  const fetchProposalContent = async (proposalId: string) => {
    // API call removed
    return null;
  };

  const fetchHistory = async (proposalId: string) => {
    // API call removed
    setHistory([]);
  };

  const filteredProposals = useMemo(() => {
    let filtered = proposalsData;

    if (activeFilter === "completed") {
      filtered = filtered.filter((p) => p.status === "Reviewer Completed");
    } else if (activeFilter === "pending") {
      filtered = filtered.filter((p) => p.status === "Pending Evaluation");
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

  const counts = useMemo(() => {
    return {
      all: proposalsData.length,
      completed: proposalsData.filter((p) => p.status === "Reviewer Completed")
        .length,
      pending: proposalsData.filter((p) => p.status === "Pending Evaluation")
        .length,
    };
  }, [proposalsData]);

  const handleView = (proposal: Proposal) => {
    setSelectedProposal(proposal);
  };

  const handleReview = (proposal: Proposal) => {
    showToast(`Opening review form for: ${proposal.title}`, "info");
  };

  const handleViewOthers = (proposal: Proposal) => {
    showToast(`Viewing other reviewers for: ${proposal.title}`, "info");
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white/80 inset-0 z-[60] flex items-center justify-center backdrop-blur-md animate-fade-in">
        <div
          key={selectedDoc?.proposal_id}
          className="relative bg-white/80 px-14 py-10 flex flex-col items-center animate-pop-out w-[380px]"
        >
          <p className="text-lg font-semibold shimmer-text mb-1">
            Loading Proposals
          </p>

          <p className="text-sm text-gray-500 mb-4">Preparing documents…</p>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-700 transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500 font-medium">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-10 bg-white min-h-screen font-sans">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-pulse text-gray-400 text-lg">
              Loading proposals...
            </div>
          </div>
        </div>
      ) : !user ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-gray-400 text-lg">
              Please log in to view proposals
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">
              Error loading proposals
            </div>
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
          <div className="flex justify-between items-center mb-8 relative">
            <h1 className="text-[32px] font-bold text-gray-900">
              Review Proposal
            </h1>

            <NotificationBell
              notifications={notifications}
              unreadCount={unreadCount}
              show={showNotif}
              onToggle={() => setShowNotif((prev) => !prev)}
              onClose={() => setShowNotif(false)}
              onRead={handleRead}
            />
          </div>

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
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`pb-1 transition-colors ${activeFilter === "all" ? "text-green-600 border-b-2 border-green-600" : "hover:text-gray-700"}`}
                >
                  All ({counts.all})
                </button>
                <button
                  onClick={() => setActiveFilter("completed")}
                  className={`pb-1 transition-colors ${activeFilter === "completed" ? "text-green-600 border-b-2 border-green-600" : "hover:text-gray-700"}`}
                >
                  Completed ({counts.completed})
                </button>
                <button
                  onClick={() => setActiveFilter("pending")}
                  className={`pb-1 transition-colors ${activeFilter === "pending" ? "text-green-600 border-b-2 border-green-600" : "hover:text-gray-700"}`}
                >
                  Pending Evaluation ({counts.pending})
                </button>
              </div>

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
            </div>
          </div>

          {filteredProposals.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No proposals found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search or filter
              </p>
            </div>
          )}

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
                          className={`flex items-center gap-2 text-xs rounded-md px-3 py-2 mt-1 mb-3 border
                                  ${
                                    proposal.decision === "approved"
                                      ? "text-green-700 bg-green-50 border-green-200"
                                      : proposal.is_reviewed === 1
                                        ? "text-red-700 bg-red-50 border-red-200"
                                        : "text-orange-700 bg-orange-50 border-orange-200"
                                  }
                                `}
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
                      <p className="text-gray-400 text-xs font-bold mb-5">
                        {proposal.date}
                      </p>

                      <div className="flex space-x-3">
                        <button
                          onClick={async () => {
                            setLoading(true);

                            const cover = await fetchCoverPage(
                              proposal.proposal_id,
                            );
                            const content = await fetchProposalContent(
                              proposal.proposal_id,
                            );

                            setSelectedDoc({
                              ...proposal,
                              cover_page: cover,
                              full_content: content,
                            });

                            setShowViewerModal(true);
                            setLoading(false);
                          }}
                          className="flex-1 flex items-center justify-center space-x-2 bg-[#16A34A] text-white py-2 rounded-md font-bold text-sm hover:bg-[#15803d] transition-colors"
                        >
                          <Eye className="w-[18px] h-[18px]" />
                          <span>View</span>
                        </button>

                        <button
                          onClick={async () => {
                            setLoading(true);

                            const cover = await fetchCoverPage(
                              proposal.proposal_id,
                            );
                            const content = await fetchProposalContent(
                              proposal.proposal_id,
                            );
                            const historyData = await fetchHistory(
                              proposal.proposal_id,
                            );

                            setSelectedDoc({
                              ...proposal,
                            });

                            setShowReviewerModal(true);
                            setLoading(false);
                          }}
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

          {viewMode === "table" && filteredProposals.length > 0 && (
            <div className="bg-white rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-8 py-5 text-sm font-bold text-gray-600">
                      Status
                    </th>
                    <th className="text-left px-8 py-5 text-sm font-bold text-gray-600">
                      Title
                    </th>
                    <th className="text-left px-8 py-5 text-sm font-bold text-gray-600">
                      Submitted By
                    </th>
                    <th className="text-left px-8 py-5 text-sm font-bold text-gray-600">
                      Date
                    </th>
                    <th className="text-left px-8 py-5 text-sm font-bold text-gray-600">
                      Actions
                    </th>
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
                        <td className="px-8 py-5 text-sm text-gray-500 max-w-md">
                          <div className="line-clamp-2">
                            {proposal.description}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-xs font-bold text-gray-400 whitespace-nowrap">
                          {proposal.date}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleView(proposal)}
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
                    className={`px-4 py-2.5 rounded-full text-xs font-extrabold tracking-wide ${getStatusStyle(selectedProposal.status).className}`}
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

                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedProposal.title}
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  {selectedProposal.date}
                </p>
                <p className="text-gray-700 leading-relaxed mb-8">
                  {selectedProposal.description}
                </p>

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
        proposalData={selectedDoc}
        onClose={() => setShowViewerModal(false)}
      />

      <ReviewerCommentModal
        isOpen={showReviewerModal}
        proposalData={selectedDoc}
        onClose={() => setShowReviewerModal(false)}
        reviewe={user?.user_id}
        review_id={proposalsData[0]?.review_id}
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
