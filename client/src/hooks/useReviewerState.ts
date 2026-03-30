import { useState, useEffect, useCallback } from "react";
import {
  fetchProjectProposalDetail,
  fetchActivityProposalDetail,
  fetchReviewerProjectProposal,
  fetchReviewerActivityProposal,
  fetchExistingReview,
} from "@/api/reviewer-api";
import {
  fetchProgramHistoryList,
  fetchProjectHistoryList,
  fetchActivityHistoryList,
  fetchReviewedProposal,
} from "@/api/implementor-api";
import {
  fetchProgramHistoryData,
  fetchProjectHistoryData,
  fetchActivityHistoryData,
} from "@/api/get-history-data-api";
import { normalizeHistoryList } from "@/constants/reviewer/mappers";
import type {
  TabType,
  DecisionType,
  Comments,
  History,
  ProjectItem,
  ActivityItem,
} from "@/types/reviewer-comment-types";
import type { ProposalReviewResponse, ReviewerProjectList } from "@/types/reviewer-types";

// ─────────────────────────────────────────────────────────────────────────────
// useReviewState — comment inputs, decision, and submission flags
// ─────────────────────────────────────────────────────────────────────────────

export function useReviewState() {
  const [comments, setCommentsState] = useState<Comments>({});
  const [decision, setDecision] = useState<DecisionType>("needs_revision");
  const [reviewRound, setReviewRound] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

  const handleCommentChange = (inputKey: string, value: string) =>
    setCommentsState((prev) => ({ ...prev, [inputKey]: value }));

  const hasAnyComment = Object.values(comments).some((c) => c?.trim() !== "");

  const reset = () => {
    setCommentsState({});
    setDecision("needs_revision");
    setReviewRound(1);
    setIsSubmitting(false);
    setIsApproving(false);
    setShowApproveConfirm(false);
  };

  return {
    comments,
    decision,
    setDecision,
    reviewRound,
    setReviewRound,
    isSubmitting,
    setIsSubmitting,
    isApproving,
    setIsApproving,
    showApproveConfirm,
    setShowApproveConfirm,
    handleCommentChange,
    hasAnyComment,
    reset,
    setComments: setCommentsState
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useExistingReview — fetches the review for the currently visible proposal node
// ─────────────────────────────────────────────────────────────────────────────

interface UseExistingReviewOptions {
  isOpen: boolean;
  activeTab: TabType;
  programNodeId: number | null;
  selectedProjectProposal?: number;
  selectedActivityProposal?: number | string;
}

export function useExistingReview({
  isOpen,
  activeTab,
  programNodeId,
  selectedProjectProposal,
  selectedActivityProposal,
}: UseExistingReviewOptions) {
  const [existingReview, setExistingReview] =
    useState<ProposalReviewResponse | null>(null);
  const [existingReviewLoading, setExistingReviewLoading] = useState(false);

  const resolveNodeId = (): number | null => {
    if (activeTab === "activity" && selectedActivityProposal)
      return Number(selectedActivityProposal);
    if (activeTab === "project" && selectedProjectProposal)
      return Number(selectedProjectProposal);
    return programNodeId;
  };

  useEffect(() => {
    if (!isOpen) return;

    const nodeId = resolveNodeId();

    if (!nodeId) {
      setExistingReview(null);
      setExistingReviewLoading(false);
      return;
    }

    let cancelled = false;
    setExistingReview(null);
    setExistingReviewLoading(true);

    fetchExistingReview(nodeId)
      .then((data) => {
        if (!cancelled) setExistingReview(data ?? null);
      })
      .catch(() => {
        if (!cancelled) setExistingReview(null);
      })
      .finally(() => {
        if (!cancelled) setExistingReviewLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, activeTab, selectedProjectProposal, selectedActivityProposal, programNodeId]);

  const reset = () => {
    setExistingReview(null);
    setExistingReviewLoading(false);
  };

  return { existingReview, existingReviewLoading, reset };
}

// ─────────────────────────────────────────────────────────────────────────────
// useHistoryPanel — version history lists + snapshot loading
// ─────────────────────────────────────────────────────────────────────────────

interface UseHistoryPanelOptions {
  isOpen: boolean;
  activeTab: TabType;
  programNodeId: number | null;
  selectedProjectProposal?: number;
  selectedActivityProposal?: number | string;
  selectedProject: ProjectItem | null;
  selectedActivity: ActivityItem | null;
}

export function useHistoryPanel({
  isOpen,
  activeTab,
  programNodeId,
  selectedProjectProposal,
  selectedActivityProposal,
  selectedProject,
  selectedActivity,
}: UseHistoryPanelOptions) {
  const [programHistory, setProgramHistory] = useState<History[]>([]);
  const [projectHistory, setProjectHistory] = useState<History[]>([]);
  const [activityHistory, setActivityHistory] = useState<History[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistoryVersion, setSelectedHistoryVersion] =
    useState<History | null>(null);
  const [historySnapshotData, setHistorySnapshotData] = useState<any | null>(
    null
  );
  const [historySnapshotLoading, setHistorySnapshotLoading] = useState(false);

  // ── Program history ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen || !programNodeId) return;
    setHistoryLoading(true);

    fetchProgramHistoryList(programNodeId)
      .then((raw) => {
        const list = normalizeHistoryList(raw);
        setProgramHistory(list);
        if (activeTab === "program") {
          setSelectedHistoryVersion(
            list.find((h) => h.status === "current") ?? list[0] ?? null
          );
        }
      })
      .catch((err) => {
        console.error("[ProgramHistory]", err);
        setProgramHistory([]);
      })
      .finally(() => setHistoryLoading(false));
  }, [isOpen, programNodeId]);

  // ── Project history ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!selectedProjectProposal) {
      setProjectHistory([]);
      return;
    }
    setHistoryLoading(true);

    fetchProjectHistoryList(selectedProjectProposal)
      .then((raw) => {
        const list = normalizeHistoryList(raw);
        setProjectHistory(list);
        if (activeTab === "project") {
          setSelectedHistoryVersion(
            list.find((h) => h.status === "current") ?? list[0] ?? null
          );
        }
      })
      .catch((err) => {
        console.error("[ProjectHistory]", err);
        setProjectHistory([]);
      })
      .finally(() => setHistoryLoading(false));
  }, [selectedProjectProposal]);

  // ── Activity history ────────────────────────────────────────────────────

  useEffect(() => {
    if (!selectedActivityProposal) {
      setActivityHistory([]);
      return;
    }
    setHistoryLoading(true);

    fetchActivityHistoryList(selectedActivityProposal as number)
      .then((raw) => {
        const list = normalizeHistoryList(raw);
        setActivityHistory(list);
        if (activeTab === "activity") {
          setSelectedHistoryVersion(
            list.find((h) => h.status === "current") ?? list[0] ?? null
          );
        }
      })
      .catch((err) => {
        console.error("[ActivityHistory]", err);
        setActivityHistory([]);
      })
      .finally(() => setHistoryLoading(false));
  }, [selectedActivityProposal]);

  // ── Reset history selection on tab/item change ──────────────────────────

  useEffect(() => {
    const list =
      activeTab === "activity"
        ? activityHistory
        : activeTab === "project"
        ? projectHistory
        : programHistory;

    setSelectedHistoryVersion(
      list.find((h) => h.status === "current") ?? list[0] ?? null
    );
    setHistorySnapshotData(null);
  }, [activeTab, selectedProjectProposal, selectedActivityProposal]);

  // ── Snapshot loader ─────────────────────────────────────────────────────

  useEffect(() => {
    if (
      !selectedHistoryVersion ||
      selectedHistoryVersion.status === "current"
    ) {
      setHistorySnapshotData(null);
      return;
    }

    const { history_id, proposal_id, version } = selectedHistoryVersion;

    const resolvedId =
      activeTab === "project"
        ? selectedProject?.proposal ?? proposal_id
        : activeTab === "activity"
        ? selectedActivity?.proposal ?? proposal_id
        : programNodeId ?? proposal_id;

    const fetcher =
      activeTab === "project"
        ? fetchProjectHistoryData
        : activeTab === "activity"
        ? fetchActivityHistoryData
        : fetchProgramHistoryData;

    setHistorySnapshotLoading(true);
    setHistorySnapshotData(null);

    fetcher(Number(resolvedId), Number(history_id), version)
      .then(setHistorySnapshotData)
      .catch((err) => {
        console.error("[HistorySnapshot]", err);
        setHistorySnapshotData(null);
      })
      .finally(() => setHistorySnapshotLoading(false));
  }, [
    selectedHistoryVersion,
    activeTab,
    programNodeId,
    selectedProject?.proposal,
    selectedActivity?.proposal,
  ]);

  // ── Computed ────────────────────────────────────────────────────────────

  const activeHistory =
    activeTab === "activity"
      ? activityHistory
      : activeTab === "project"
      ? projectHistory
      : programHistory;

  const isViewingHistory =
    !!selectedHistoryVersion &&
    selectedHistoryVersion.status !== "current";

  const reset = () => {
    setProgramHistory([]);
    setProjectHistory([]);
    setActivityHistory([]);
    setSelectedHistoryVersion(null);
    setHistorySnapshotData(null);
  };

  return {
    activeHistory,
    historyLoading,
    selectedHistoryVersion,
    setSelectedHistoryVersion,
    historySnapshotData,
    historySnapshotLoading,
    isViewingHistory,
    reset,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useSidebarTree — project list, activity cache, and detail loaders
// ─────────────────────────────────────────────────────────────────────────────

interface UseSidebarTreeOptions {
  isOpen: boolean;
  childId: number | undefined;
}

export function useSidebarTree({ isOpen, childId }: UseSidebarTreeOptions) {
  const [projectList, setProjectList] = useState<ProjectItem[]>([]);
  const [projectListLoading, setProjectListLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [projectDetail, setProjectDetail] = useState<any | null>(null);
  const [projectDetailLoading, setProjectDetailLoading] = useState(false);

  const [activitiesCache, setActivitiesCache] = useState<
    Record<number, ActivityItem[]>
  >({});
  const [activitiesLoadingCache, setActivitiesLoadingCache] = useState<
    Record<number, boolean>
  >({});
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityItem | null>(null);
  const [activityDetail, setActivityDetail] = useState<any | null>(null);
  const [activityDetailLoading, setActivityDetailLoading] = useState(false);

  // ── Load project list when modal opens ─────────────────────────────────

  useEffect(() => {
    if (!isOpen || !childId) return;
    setProjectListLoading(true);

    fetchReviewerProjectProposal(childId)
      .then((data: ReviewerProjectList[]) => setProjectList(data))
      .catch((err) => console.error("[ProjectList]", err))
      .finally(() => setProjectListLoading(false));
  }, [isOpen, childId]);


  // ── Activity cache loader ───────────────────────────────────────────────

  const loadActivitiesForProject = useCallback(
    async (project: ProjectItem) => {
      if (activitiesCache[project.child_id] !== undefined) return;

      setActivitiesLoadingCache((prev) => ({
        ...prev,
        [project.child_id]: true,
      }));
      try {
        const data: any[] = await fetchReviewerActivityProposal(
          project.child_id
        );
        setActivitiesCache((prev) => ({
          ...prev,
          [project.child_id]: data,
        }));
      } catch (err) {
        console.error("[ActivityList]", err);
        setActivitiesCache((prev) => ({
          ...prev,
          [project.child_id]: [],
        }));
      } finally {
        setActivitiesLoadingCache((prev) => ({
          ...prev,
          [project.child_id]: false,
        }));
      }
    },
    [activitiesCache]
  );

  // ── Project selection ───────────────────────────────────────────────────

  const handleSelectProject = useCallback(async (project: ProjectItem) => {
    setSelectedProject(project);
    setSelectedActivity(null);
    setActivityDetail(null);
    setProjectDetail(null);
    setProjectDetailLoading(true);

    try {
      const detail = await fetchProjectProposalDetail(project.child_id);
      setProjectDetail(detail);
    } catch (err) {
      console.error("[ProjectDetail]", err);
    } finally {
      setProjectDetailLoading(false);
    }
  }, []);

  // ── Project expand (tree accordion) ────────────────────────────────────

  const handleExpandProject = useCallback(
    async (project: ProjectItem) => {
      if (selectedProject?.child_id === project.child_id) {
        setSelectedProject(null);
        setSelectedActivity(null);
        setActivityDetail(null);
        return;
      }
      setSelectedProject(project);
      setSelectedActivity(null);
      setActivityDetail(null);
      await loadActivitiesForProject(project);
    },
    [selectedProject, loadActivitiesForProject]
  );

  // ── Activity selection ──────────────────────────────────────────────────

  const handleSelectActivity = useCallback(
    async (project: ProjectItem, activity: ActivityItem) => {
      setSelectedProject(project);
      setSelectedActivity(activity);
      setActivityDetail(null);
      setActivityDetailLoading(true);

      try {
        const data = await fetchActivityProposalDetail(activity.child_id);
        setActivityDetail(data);
      } catch (err) {
        console.error("[ActivityDetail]", err);
      } finally {
        setActivityDetailLoading(false);
      }
    },
    []
  );

  // ── Reset ───────────────────────────────────────────────────────────────

  const reset = () => {
    setSelectedProject(null);
    setProjectDetail(null);
    setActivitiesCache({});
    setActivitiesLoadingCache({});
    setSelectedActivity(null);
    setActivityDetail(null);
  };

  return {
    projectList,
    projectListLoading,
    selectedProject,
    projectDetail,
    projectDetailLoading,
    activitiesCache,
    activitiesLoadingCache,
    selectedActivity,
    activityDetail,
    activityDetailLoading,
    handleSelectProject,
    handleExpandProject,
    handleSelectActivity,
    loadActivitiesForProject,
    reset,
    setSelectedActivity,
    setActivityDetail
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useCurrentReview — fetches the reviewer's own previous comments for the
// current version (used to pre-fill comment inputs when status === "current")
// ─────────────────────────────────────────────────────────────────────────────

interface UseCurrentReviewOptions {
  isOpen: boolean;
  activeTab: TabType;
  programNodeId: number | null;
  selectedProjectProposal?: number;
  selectedActivityProposal?: number | string;
}

export function useCurrentReview({
  isOpen,
  activeTab,
  programNodeId,
  selectedProjectProposal,
  selectedActivityProposal,
}: UseCurrentReviewOptions) {
  const [currentReviewData, setCurrentReviewData] = useState<any | null>(null);
  const [currentReviewLoading, setCurrentReviewLoading] = useState(false);
  

  const resolveArgs = (): { nodeId: number; type: "program" | "project" | "activity" } | null => {
    if (activeTab === "activity" && selectedActivityProposal)
      return { nodeId: Number(selectedActivityProposal), type: "activity" };
    if (activeTab === "project" && selectedProjectProposal)
      return { nodeId: Number(selectedProjectProposal), type: "project" };
    if (programNodeId)
      return { nodeId: programNodeId, type: "program" };
    return null;
  };

  useEffect(() => {
    if (!isOpen) return;

    const args = resolveArgs();
    if (!args) {
      setCurrentReviewData(null);
      return;
    }

    let cancelled = false;
    setCurrentReviewData(null);
    setCurrentReviewLoading(true);

    fetchReviewedProposal(args.nodeId, args.type)
      .then((data) => {
        if (!cancelled) setCurrentReviewData(data ?? null);
      })
      .catch(() => {
        if (!cancelled) setCurrentReviewData(null);
      })
      .finally(() => {
        if (!cancelled) setCurrentReviewLoading(false);
      });

    return () => { cancelled = true; };
  }, [isOpen, activeTab, selectedProjectProposal, selectedActivityProposal, programNodeId]);

  const reset = () => {
    setCurrentReviewData(null);
    setCurrentReviewLoading(false);
    
  };

  return { currentReviewData, currentReviewLoading, reset };
}