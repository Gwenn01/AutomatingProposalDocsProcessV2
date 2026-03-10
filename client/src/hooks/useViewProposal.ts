import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { fetchProposalsNode, fetchProgramProposalDetail } from "@/api/implementor-api";
import { getNotifications } from "@/api/get-notification-api";
import { markNotificationRead } from "@/api/reviewer-api";
import { useAuth } from "@/context/auth-context";

// ================= TYPE DEFINITIONS =================
export type ProposalType = "Program" | "Research" | "Extension"; // ← extend as needed

export interface Document {
  proposal_id: string | number;
  child_id?: string | number;
  reviewer_count: number;
  reviewed_count: number;
  review_progress: number;
  title: string;
  file_path: string;
  status: string;
  submitted_at: string | null;
  reviews: any[] | number;
}

export interface Notification {
  id: string | number;
  is_read: 0 | 1 | boolean;
  message: string;
  created_at: string;
  [key: string]: any;
}

export interface StatusStyle {
  label: string;
  className: string;
}

export type ViewMode = "grid" | "table";

// ================= HOOK =================
export const useProposals = (proposalType: ProposalType = "Program") => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [proposalDetail, setProposalDetail] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const rowsPerPage: number = 10;
  const { user } = useAuth();

  // Use a ref so loadProposals can read the latest type without being a dep
  const proposalTypeRef = useRef<ProposalType>(proposalType);
  useEffect(() => {
    proposalTypeRef.current = proposalType;
  }, [proposalType]);

  // ── Progress bar simulation ──────────────────────────────────────────────
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

  // ── Fetch proposals + notifications ─────────────────────────────────────
  const loadProposals = useCallback(async () => {
    setPageLoading(true);
    try {
      const data: any[] = await fetchProposalsNode(proposalTypeRef.current);
      const mapped: Document[] = data.map((p) => ({
        proposal_id:     p.id,
        child_id:        p.child_id,
        reviewer_count:  p.reviewer_count,
        reviewed_count:  p.reviewed_count,
        review_progress: p.review_progress,
        title:           p.title,
        file_path:       p.file_path ?? "",
        status:          p.status ?? "unknown",
        submitted_at:    p.created_at ?? null,
        reviews:         p.reviews ?? 0,
      }));
      setDocuments(mapped);

      const notifData = await getNotifications();
      const mappedNotifs: Notification[] = notifData.map((n: any) => ({
        ...n,
        is_read: n.is_read ? 1 : 0,
      }));
      setNotifications(mappedNotifs);
    } catch (err) {
      console.error("[useProposals] Failed to fetch proposals:", err);
    } finally {
      setPageLoading(false);
    }
  }, []); // ← stable; reads proposalType from ref

  useEffect(() => {
    if (!user?.user_id) return;
    loadProposals();
  }, [user, loadProposals]);

  // ── Reset page on filter change ──────────────────────────────────────────
  useEffect(() => {
    setCurrentPage(1);
  }, [documents.length, searchQuery]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const fetchProposalDetail = useCallback(async (doc: Document): Promise<any | null> => {
    setActionLoading(true);
    setProposalDetail(null);
    try {
      const childId = doc.child_id ?? doc.proposal_id;
      const detail = await fetchProgramProposalDetail(childId);
      setProposalDetail(detail);
      return detail;
    } catch (err) {
      console.error("[useProposals] Failed to fetch proposal detail:", err);
      return null;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const markNotifRead = useCallback(async (id: string | number): Promise<void> => {
    const target = notifications.find((n) => n.id === id);
    if (!target || target.is_read === 1) return;

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
    );
    try {
      await markNotificationRead(id);
    } catch (error) {
      console.error(error);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 0 } : n))
      );
    }
  }, [notifications]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getStatusStyle = useCallback((status: string): StatusStyle => {
    switch (status) {
      case "submitted":    return { label: "Initial Review", className: "bg-[#FFC107] text-white" };
      case "for_review":   return { label: "For Review",     className: "bg-[#38BDF8] text-white" };
      case "under_review": return { label: "Under Review",   className: "bg-[#FFC107] text-white" };
      case "final_review": return { label: "Final Review",   className: "bg-[#FBBF24] text-white" };
      case "for_approval": return { label: "For Approval",   className: "bg-[#6366F1] text-white" };
      case "approved":     return { label: "Completed",      className: "bg-[#22C55E] text-white" };
      case "for_revision": return { label: "For Revision",   className: "bg-[#F97316] text-white" };
      case "rejected":     return { label: "Rejected",       className: "bg-[#EF4444] text-white" };
      default:             return { label: status,           className: "bg-gray-400 text-white" };
    }
  }, []);

  const formatDate = useCallback((dateString: string | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  }, []);

  // ── Derived state ────────────────────────────────────────────────────────
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const query = searchQuery.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.status.toLowerCase().includes(query)
    );
  }, [documents, searchQuery]);

  const totalPages: number         = Math.ceil(filteredDocuments.length / rowsPerPage);
  const startIndex: number         = (currentPage - 1) * rowsPerPage;
  const endIndex: number           = startIndex + rowsPerPage;
  const currentDocuments: Document[] = filteredDocuments.slice(startIndex, endIndex);
  const unreadCount: number        = notifications.filter((n) => n.is_read === 0).length;

  return {
    // State
    documents,
    currentDocuments,
    filteredDocuments,
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

    // Setters
    setSearchQuery,
    setCurrentPage,

    // Actions
    loadProposals,
    fetchProposalDetail,
    markNotifRead,

    // Helpers
    getStatusStyle,
    formatDate,

    // Pagination helpers
    goToNextPage:     () => { if (currentPage < totalPages) setCurrentPage((p) => p + 1); },
    goToPreviousPage: () => { if (currentPage > 1) setCurrentPage((p) => p - 1); },
  };
};