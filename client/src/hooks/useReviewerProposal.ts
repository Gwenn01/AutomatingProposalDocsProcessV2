import { useEffect, useState, useMemo, useCallback } from "react";
import {
  fetchReviewerProposals,
  fetchProgramProposalDetail
} from "@/api/reviewer-api";
import {
  getNotifications,
  markNotificationRead,
  type Notification,
} from "@/api/get-notification-api";
import type { ReviewerProposal } from "@/types/reviewer-types";

// ================= TYPE DEFINITIONS =================
export interface Proposal {
  proposal_id: string;
  child_id: number;
  assignment_id: number;
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
  implementor_name: string;
}

export type ReviewFilter =
  | "all"
  | "for_review"
  | "under_review"
  | "final_review"
  | "for_approval"
  | "approved"
  | "for_revision"
  | "rejected";

// ================= MAPPER =================
function mapApiProposal(p: ReviewerProposal): Proposal {
  return {
    proposal_id:    String(p.proposal),
    child_id:       Number(p.child_id),
    assignment_id:  Number(p.assignment),
    status:         p.status,
    decision:       p.is_reviewed ? "approved" : "",
    review_status:  p.is_reviewed ? "Reviewed" : "Pending Review",
    is_reviewed:    p.is_reviewed ? 1 : 0,
    title:          p.title,
    description:    `${p.type} Proposal — Version ${p.version_no}`,
    date:           new Date(p.assigned_at).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    }),
    name:           p.title,
    review_id:      String(p.assignment),
    reviewer_id:    "",
    implementor_id: String(p.implementor),
    type:           p.type,
    version_no:     p.version_no,
    implementor_name: p.implementor_name,
  };
}

// ================= HOOK =================
export const useReviewerProposals = () => {
  const [proposals, setProposals]           = useState<Proposal[]>([]);
  const [notifications, setNotifications]   = useState<Notification[]>([]);
  const [loading, setLoading]               = useState<boolean>(true);
  const [actionLoading, setActionLoading]   = useState<boolean>(false);
  const [error, setError]                   = useState<string | null>(null);
  const [proposalDetail, setProposalDetail] = useState<any | null>(null);
  const [searchQuery, setSearchQuery]       = useState<string>("");
  const [activeFilter, setActiveFilter]     = useState<ReviewFilter>("all");
  const [progress, setProgress]             = useState<number>(0);
  const [actionProgress, setActionProgress] = useState<number>(0);

  // ── Progress bar (page load) ─────────────────────────────────────────────
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

  // ── Progress bar (action load) ───────────────────────────────────────────
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

  // Snap to 100 when done
  useEffect(() => {
    if (!actionLoading && actionProgress > 0) {
      setActionProgress(100);
    }
  }, [actionLoading]);

  // ── Fetch proposals + notifications ──────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [apiProposals, notifData] = await Promise.all([
        fetchReviewerProposals(),
        getNotifications(),
      ]);
      setProposals(apiProposals.map(mapApiProposal));
      setNotifications(
        notifData.map((n: any) => ({ ...n, is_read: Boolean(n.is_read) }))
      );
    } catch (err: any) {
      console.error("[useReviewerProposals] Failed to load data:", err);
      setError(err?.message ?? "Failed to load proposals.");
    } finally {
      setProgress(100);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Fetch proposal detail ─────────────────────────────────────────────────
  const fetchDetail = useCallback(async (doc: Proposal): Promise<any | null> => {
    setActionLoading(true);
    setProposalDetail(null);
    try {
      const detail = await fetchProgramProposalDetail(Number(doc.child_id));
      setProposalDetail(detail);
      return detail;
    } catch (err) {
      console.error("[useReviewerProposals] Failed to fetch detail:", err);
      return null;
    } finally {
      setActionLoading(false);
    }
  }, []);

  // ── Mark notification read ────────────────────────────────────────────────
  const markNotifRead = useCallback(async (id: string | number): Promise<void> => {
    const target = notifications.find((n) => n.id === id);
    if (!target || target.is_read) return;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error("[useReviewerProposals] Failed to mark notification read:", err);
      // Rollback on failure
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n))
      );
    }
  }, [notifications]);

  // ── Derived / filtered state ──────────────────────────────────────────────
  const filteredProposals = useMemo(() => {
    let filtered = proposals;

    if (activeFilter !== "all") {
      filtered = filtered.filter((p) => p.status === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.name.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [proposals, searchQuery, activeFilter]);

  const counts = useMemo(() => ({
    all:          proposals.length,
    for_review:   proposals.filter((p) => p.status === "for_review").length,
    under_review: proposals.filter((p) => p.status === "under_review").length,
    final_review: proposals.filter((p) => p.status === "final_review").length,
    for_approval: proposals.filter((p) => p.status === "for_approval").length,
    approved:     proposals.filter((p) => p.status === "approved").length,
    for_revision: proposals.filter((p) => p.status === "for_revision").length,
    rejected:     proposals.filter((p) => p.status === "rejected").length,
  }), [proposals]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    // State
    proposals,
    filteredProposals,
    notifications,
    proposalDetail,
    loading,
    actionLoading,
    error,
    progress,
    actionProgress,
    searchQuery,
    activeFilter,
    counts,
    unreadCount,

    // Setters
    setSearchQuery,
    setActiveFilter,

    // Actions
    loadData,
    fetchDetail,
    markNotifRead,
  };
};