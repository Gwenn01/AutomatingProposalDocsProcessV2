import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Send,
  ChevronRight,
  FileText,
  FolderOpen,
  Activity,
  MessageSquare,
} from "lucide-react";
import { getStatusStyle } from "@/utils/statusStyles";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import { useToast } from "@/context/toast";
import {
  fetchProjectProposalDetail,
  fetchActivityProposalDetail,
  submitProposalReview,
  updateProposalReview,
  fetchReviewerProjectProposal,
  fetchReviewerActivityProposal,
  fetchExistingReview,
} from "@/api/reviewer-api";
import {
  fetchProgramHistoryList,
  fetchProjectHistoryList,
  fetchActivityHistoryList,
} from "@/api/implementor-api";
import {
  fetchProgramHistoryData,
  fetchProjectHistoryData,
  fetchActivityHistoryData,
} from "@/api/get-history-data-api";
import { ActivityForm } from "../view-review/activity-form";
import { ProjectForm } from "../view-review/project-form";
import { ProgramForm } from "../view-review/program-form";
import { ProjectTreeNode } from "../view-review/project-tree-node";
import { useAuth } from "@/context/auth-context";
import type {
  ApiActivity,
  ProposalReviewPayload,
  ProposalReviewResponse,
  ReviewerProjectList,
} from "@/types/reviewer-types";

// ================= TYPES =================

interface History {
  history_id: number;
  proposal_id: number;
  status: string;
  version: number;
  program_title: string;
  program_leader: string;
  project_title: string;
  project_leader: string;
  activity_title: string;
  created_at: any;
}

export interface MethodologyPhase {
  phase: string;
  activities: string[];
}

export interface WorkplanItem {
  month: string;
  activity: string;
}

export interface BudgetItem {
  item: string;
  amount: number | string;
}

export interface ApiProposalDetail {
  id: number;
  proposal: number;
  program_title: string;
  program_leader: string;
  project_list: any[];
  implementing_agency: string[];
  cooperating_agencies: string[];
  extension_sites: string[];
  tags: string[];
  clusters: string[];
  agendas: string[];
  sdg_addressed: string;
  mandated_academic_program: string;
  rationale: string;
  significance: string;
  general_objectives: string;
  specific_objectives: string;
  methodology: MethodologyPhase[];
  expected_output_6ps: string[];
  sustainability_plan: string;
  org_and_staffing: { name: string; role: string }[];
  workplan: WorkplanItem[];
  budget_requirements: BudgetItem[];
  created_at: string;
}

type ProjectItem = ReviewerProjectList;
type ActivityItem = ReviewerProjectList;
type TabType = "program" | "project" | "activity";

export interface Comments {
  [key: string]: string;
}

interface ReviewerCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalData: any | null;
  proposalDetail: ApiProposalDetail | null;
  reviewe?: string;
  review_id?: string;
  programNode_id?: number;
}

// ================= DATA MAPPERS =================

function mapSnapshotToProgram(data: any): any | null {
  if (!data) return null;
  return {
    id: data.id ?? 0,
    proposal: data.proposal ?? 0,
    program_title: data.profile?.program_title ?? data.program_title ?? "",
    program_leader: data.profile?.program_leader ?? "",
    project_list: data.profile?.project_list ?? [],
    implementing_agency: data.agencies?.implementing_agency ?? [],
    cooperating_agencies: data.agencies?.cooperating_agency ?? data.agencies?.cooperating_agencies ?? [],
    extension_sites: data.extension_sites?.content ?? data.agencies?.extension_sites ?? [],
    tags: data.tagging_clustering_extension?.tags ?? [],
    clusters: data.tagging_clustering_extension?.clusters ?? [],
    agendas: data.tagging_clustering_extension?.agendas ?? [],
    sdg_addressed: data.sdg_and_academic_program?.sdg_addressed ?? data.sdg_addressed ?? "",
    mandated_academic_program: data.sdg_and_academic_program?.mandated_academic_program ?? data.mandated_academic_program ?? "",
    rationale: data.rationale?.content ?? "",
    significance: data.significance?.content ?? "",
    general_objectives: data.objectives?.general ?? "",
    specific_objectives: data.objectives?.specific ?? "",
    methodology: data.methodology?.content ?? [],
    expected_output_6ps: data.expected_output_6ps?.content ?? [],
    sustainability_plan: data.sustainability_plan?.content ?? "",
    org_and_staffing: data.organization_and_staffing?.content ?? [],
    workplan: data.work_plan?.content ?? [],
    budget_requirements: data.budget_requirements?.content ?? [],
    created_at: data.created_at ?? "",
  };
}

function mapSnapshotToProject(data: any): any | null {
  if (!data) return null;
  return {
    id: data.id ?? 0,
    project_title: data.profile?.project_title ?? data.project_title ?? "",
    project_leader: data.profile?.project_leader ?? "",
    members: data.profile?.members ?? data.profile?.project_member ?? [],
    duration_months: data.profile?.duration_months ?? data.profile?.project_duration ?? "",
    start_date: data.profile?.start_date ?? data.profile?.project_start_date ?? null,
    end_date: data.profile?.end_date ?? data.profile?.project_end_date ?? null,
    implementing_agency: data.agencies?.implementing_agency ?? [],
    cooperating_agencies: data.agencies?.cooperating_agency ?? data.agencies?.cooperating_agencies ?? [],
    extension_sites: data.extension_sites?.content ?? data.agencies?.extension_sites ?? [],
    tags: data.tagging_clustering_extension?.tags ?? [],
    clusters: data.tagging_clustering_extension?.clusters ?? [],
    agendas: data.tagging_clustering_extension?.agendas ?? [],
    sdg_addressed: data.sdg_and_academic_program?.sdg_addressed ?? data.sdg_addressed ?? "",
    mandated_academic_program: data.sdg_and_academic_program?.mandated_academic_program ?? data.mandated_academic_program ?? "",
    rationale: data.rationale?.content ?? "",
    significance: data.significance?.content ?? "",
    general_objectives: data.objectives?.general ?? "",
    specific_objectives: data.objectives?.specific ?? "",
    methodology: data.methodology?.content ?? [],
    expected_output_6ps: data.expected_output_6ps?.content ?? [],
    sustainability_plan: data.sustainability_plan?.content ?? "",
    org_and_staffing: data.organization_and_staffing?.content ?? [],
    workplan: data.work_plan?.content ?? [],
    budget_requirements: data.budget_requirements?.content ?? [],
  };
}

function mapSnapshotToActivity(data: any): any | null {
  if (!data) return null;
  return {
    id: data.id ?? 0,
    activity_title: data.profile?.activity_title ?? data.activity_title ?? "",
    project_leader: data.profile?.project_leader ?? "",
    members: data.profile?.members ?? data.profile?.project_member ?? [],
    activity_duration_hours: data.profile?.activity_duration_hours ?? data.profile?.project_duration ?? "",
    activity_date: data.profile?.activity_date ?? data.profile?.project_start_date ?? null,
    implementing_agency: data.agencies?.implementing_agency ?? [],
    cooperating_agencies: data.agencies?.cooperating_agency ?? data.agencies?.cooperating_agencies ?? [],
    extension_sites: data.extension_sites?.content ?? data.agencies?.extension_sites ?? [],
    tags: data.tagging_clustering_extension?.tags ?? [],
    clusters: data.tagging_clustering_extension?.clusters ?? [],
    agendas: data.tagging_clustering_extension?.agendas ?? [],
    sdg_addressed: data.sdg_and_academic_program?.sdg_addressed ?? data.sdg_addressed ?? "",
    mandated_academic_program: data.sdg_and_academic_program?.mandated_academic_program ?? data.mandated_academic_program ?? "",
    rationale: data.rationale?.content ?? "",
    objectives: data.objectives?.content ?? data.objectives?.general ?? "",
    methodology: data.methodology?.content ?? "",
    expected_output_6ps: data.expected_output_6ps?.content ?? [],
    sustainability_plan: data.sustainability_plan?.content ?? "",
    org_and_staffing: data.organization_and_staffing?.content ?? [],
    plan_of_activity: data.plan_of_activity?.content ?? [],
    budget_requirements: data.budget_requirements?.content ?? [],
  };
}

// ================= HISTORY NORMALIZER =================

function normalizeHistoryList(raw: any): History[] {
  if (!raw) return [];
  const items: any[] = Array.isArray(raw) ? raw : raw.history ?? raw.results ?? [];
  return items.map((item) => ({
    history_id: String(item.history_id ?? item.id ?? ""),
    proposal_id: String(item.proposal_id ?? item.proposal ?? ""),
    status: item.status ?? "unknown",
    version: item.version ?? item.version_no ?? 0,
    version_no: item.version_no ?? item.version ?? 0,
    created_at: item.created_at ?? "",
    program_title: String(item.program_title ?? item.project_title ?? item.activity_title ?? ""),
  }));
}

// ================= FEEDBACK DISPLAY COMPONENTS =================

/** Shimmer skeleton shown inside each feedback slot while the review is loading */
export const FeedbackSkeleton: React.FC = () => (
  <div className="my-2 mx-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center gap-3">
    
    {/* Spinner */}
    <div className="w-5 h-5 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />

    {/* Loading text */}
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500">
        Loading feedback...
      </span>
      <span className="text-xs text-gray-400">
        Please wait while comments are being fetched
      </span>
    </div>

  </div>
);
/**
 * Shows an existing feedback value after the review loads.
 * - While loading → shows the shimmer skeleton
 * - After loaded, empty value → soft "No comment provided" placeholder
 * - After loaded, has value → amber comment card
 */
export const FeedbackBadge: React.FC<{
  label: string;
  value?: string;
  loading?: boolean;
}> = ({ label, value, loading }) => {
  if (loading) return <FeedbackSkeleton />;

  const hasComment = value && value.trim() !== "";

  return (
    <div
      className={`my-4 mx-1 rounded-xl border px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md ${
        hasComment
          ? "border-green-200 bg-gradient-to-br from-green-50 to-white"
          : "border-dashed border-gray-200 bg-gray-50"
      }`}
    >
      {/* Header */}
      <h2 className="text-sm font-semibold text-gray-500 mb-3 tracking-wide uppercase">
        Feedback
      </h2>

      {/* Label + Icon */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`p-1.5 rounded-lg ${
            hasComment ? "bg-green-100" : "bg-gray-200"
          }`}
        >
          <MessageSquare
            size={16}
            className={hasComment ? "text-green-600" : "text-gray-400"}
          />
        </div>

        <span
          className={`text-sm font-semibold ${
            hasComment ? "text-green-700" : "text-gray-500"
          }`}
        >
          {label}
        </span>
      </div>

      {/* Content */}
      {hasComment ? (
        <p className="text-sm text-gray-700 leading-relaxed pl-8 text-wrap">
          {value}
        </p>
      ) : (
        <div className="pl-8 flex items-center gap-2">
          <span className="text-gray-300">—</span>
          <p className="text-xs text-gray-400 italic">
            No comment provided
          </p>
        </div>
      )}
    </div>
  );
};

// ================= MAIN MODAL =================

const ReviewerCommentModal: React.FC<ReviewerCommentModalProps> = ({
  isOpen,
  onClose,
  proposalData,
  proposalDetail,
  programNode_id,
  review_id,
}) => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("program");

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const [projectList, setProjectList] = useState<ProjectItem[]>([]);
  const [projectListLoading, setProjectListLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [projectDetail, setProjectDetail] = useState<any | null>(null);
  const [projectDetailLoading, setProjectDetailLoading] = useState(false);
  const [activitiesCache, setActivitiesCache] = useState<Record<number, ActivityItem[]>>({});
  const [activitiesLoadingCache, setActivitiesLoadingCache] = useState<Record<number, boolean>>({});
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [activityDetail, setActivityDetail] = useState<any | null>(null);
  const [activityDetailLoading, setActivityDetailLoading] = useState(false);

  // ── Review state ──────────────────────────────────────────────────────────
  const [comments, setComments] = useState<Comments>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [decision, setDecision] = useState<"needs_revision" | "approved">("needs_revision");
  const [reviewRound, setReviewRound] = useState<number>(1);

  // ── Existing review ───────────────────────────────────────────────────────
  // null  = not yet loaded or no review exists
  // object = review found
  const [existingReview, setExistingReview] = useState<ProposalReviewResponse | null>(null);
  const [existingReviewLoading, setExistingReviewLoading] = useState(false);

  // ── History ───────────────────────────────────────────────────────────────
  const [programHistory, setProgramHistory] = useState<History[]>([]);
  const [projectHistory, setProjectHistory] = useState<History[]>([]);
  const [activityHistory, setActivityHistory] = useState<History[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistoryVersion, setSelectedHistoryVersion] = useState<History | null>(null);

  // ── History snapshot ──────────────────────────────────────────────────────
  const [historySnapshotData, setHistorySnapshotData] = useState<any | null>(null);
  const [historySnapshotLoading, setHistorySnapshotLoading] = useState(false);

  // ── Derived IDs ───────────────────────────────────────────────────────────
  const childId = proposalDetail?.id ?? proposalData?.child_id;
  const programNodeId = proposalData?.proposal_id ? Number(proposalData.proposal_id) : null;
  const statusStyle = proposalData
    ? getStatusStyle(proposalData.status ?? "")
    : { className: "", label: "" };

  const isViewingHistory =
    !!selectedHistoryVersion && selectedHistoryVersion.status !== "current";

  /**
   * Show comment inputs only when:
   *   - Viewing the current version
   *   - The review fetch is finished
   *   - No existing review was found
   */
  const showCommentInputs = !isViewingHistory && !existingReviewLoading && !existingReview;

  /**
   * Show the feedback badges (existing review) when:
   *   - Viewing the current version
   *   - The review is loading (badges will show skeletons) OR a review was found
   */
  const showExistingFeedback = !isViewingHistory && (existingReviewLoading || !!existingReview);

  const activeHistory: History[] =
    activeTab === "activity"
      ? activityHistory
      : activeTab === "project"
      ? projectHistory
      : programHistory;

  // ── Resolve the proposal_node for the currently visible form ─────────────
  const resolveActiveProposalNode = useCallback((): number | null => {
    if (activeTab === "activity" && selectedActivity)
      return Number(selectedActivity.proposal);
    if (activeTab === "project" && selectedProject)
      return Number(selectedProject.proposal);
    return programNodeId;
  }, [activeTab, selectedActivity, selectedProject, programNodeId]);

  // ── Fetch existing review whenever the active proposal_node is known ──────
  useEffect(() => {
    if (!isOpen) return;

    const nodeId = resolveActiveProposalNode();

    // No node yet (e.g. project tab opened but no project selected) — clear and wait
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
        if (cancelled) return;
        setExistingReview(data ?? null);
        if (import.meta.env.DEV)
          console.log("[ExistingReview] node", nodeId, "→", data);
      })
      .catch(() => {
        if (!cancelled) setExistingReview(null);
      })
      .finally(() => {
        if (!cancelled) setExistingReviewLoading(false);
      });

    return () => { cancelled = true; };
  }, [
    isOpen,
    activeTab,
    selectedProject?.proposal,
    selectedActivity?.proposal,
    programNodeId,
  ]);

  // ── 1. Program history ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !programNodeId) return;
    setHistoryLoading(true);
    fetchProgramHistoryList(programNodeId)
      .then((raw) => {
        const list = normalizeHistoryList(raw);
        setProgramHistory(list);
        if (activeTab === "program") {
          const current = list.find((h) => h.status === "current") ?? list[0] ?? null;
          setSelectedHistoryVersion(current);
        }
      })
      .catch((err) => { console.error("[ProgramHistory]", err); setProgramHistory([]); })
      .finally(() => setHistoryLoading(false));
  }, [isOpen, programNodeId]);

  // ── 2. Project list ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !childId) return;
    setProjectListLoading(true);
    fetchReviewerProjectProposal(childId)
      .then((data: ReviewerProjectList) => setProjectList(data))
      .catch((err) => console.error("[ProjectList]", err))
      .finally(() => setProjectListLoading(false));
  }, [isOpen, childId]);

  // ── 3. Project history ────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedProject?.proposal) { setProjectHistory([]); return; }
    setHistoryLoading(true);
    fetchProjectHistoryList(selectedProject.proposal)
      .then((raw) => {
        const list = normalizeHistoryList(raw);
        setProjectHistory(list);
        if (activeTab === "project") {
          const current = list.find((h) => h.status === "current") ?? list[0] ?? null;
          setSelectedHistoryVersion(current);
        }
      })
      .catch((err) => { console.error("[ProjectHistory]", err); setProjectHistory([]); })
      .finally(() => setHistoryLoading(false));
  }, [selectedProject?.proposal]);

  // ── 4. Activity history ───────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedActivity?.proposal) { setActivityHistory([]); return; }
    setHistoryLoading(true);
    fetchActivityHistoryList(selectedActivity.proposal)
      .then((raw) => {
        const list = normalizeHistoryList(raw);
        setActivityHistory(list);
        if (activeTab === "activity") {
          const current = list.find((h) => h.status === "current") ?? list[0] ?? null;
          setSelectedHistoryVersion(current);
        }
      })
      .catch((err) => { console.error("[ActivityHistory]", err); setActivityHistory([]); })
      .finally(() => setHistoryLoading(false));
  }, [selectedActivity?.proposal]);

  // ── 5. History snapshot ───────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedHistoryVersion || selectedHistoryVersion.status === "current") {
      setHistorySnapshotData(null);
      return;
    }
    const { history_id, proposal_id, version } = selectedHistoryVersion;
    const resolvedId =
      activeTab === "project" ? selectedProject?.proposal ?? proposal_id
      : activeTab === "activity" ? selectedActivity?.proposal ?? proposal_id
      : programNodeId ?? proposal_id;

    const fetcher =
      activeTab === "project" ? fetchProjectHistoryData
      : activeTab === "activity" ? fetchActivityHistoryData
      : fetchProgramHistoryData;

    setHistorySnapshotLoading(true);
    setHistorySnapshotData(null);
    fetcher(Number(resolvedId), Number(history_id), version)
      .then(setHistorySnapshotData)
      .catch((err) => { console.error("[HistorySnapshot]", err); setHistorySnapshotData(null); })
      .finally(() => setHistorySnapshotLoading(false));
  }, [selectedHistoryVersion, activeTab, programNodeId, selectedProject?.proposal, selectedActivity?.proposal]);

  // ── Reset on close ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("program");
      setSelectedProject(null);
      setProjectDetail(null);
      setActivitiesCache({});
      setActivitiesLoadingCache({});
      setSelectedActivity(null);
      setActivityDetail(null);
      setComments({});
      setDecision("needs_revision");
      setReviewRound(1);
      setProgramHistory([]);
      setProjectHistory([]);
      setActivityHistory([]);
      setSelectedHistoryVersion(null);
      setHistorySnapshotData(null);
      setExistingReview(null);
      setExistingReviewLoading(false);
    }
  }, [isOpen]);

  // ── Reset history selection on tab / item change ──────────────────────────
  useEffect(() => {
    const list =
      activeTab === "activity" ? activityHistory
      : activeTab === "project" ? projectHistory
      : programHistory;
    const current = list.find((h) => h.status === "current") ?? list[0] ?? null;
    setSelectedHistoryVersion(current);
    setHistorySnapshotData(null);
  }, [activeTab, selectedProject?.proposal, selectedActivity?.proposal]);

  // ── Activity cache loader ─────────────────────────────────────────────────
  const loadActivitiesForProject = useCallback(async (project: ProjectItem) => {
    if (activitiesCache[project.child_id] !== undefined) return;
    setActivitiesLoadingCache((prev) => ({ ...prev, [project.child_id]: true }));
    try {
      const data: ApiActivity[] = await fetchReviewerActivityProposal(project.child_id);
      setActivitiesCache((prev) => ({ ...prev, [project.child_id]: data }));
    } catch (err) {
      console.error("[ActivityList]", err);
      setActivitiesCache((prev) => ({ ...prev, [project.child_id]: [] }));
    } finally {
      setActivitiesLoadingCache((prev) => ({ ...prev, [project.child_id]: false }));
    }
  }, [activitiesCache]);

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

  const handleExpandProject = useCallback(async (project: ProjectItem) => {
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
  }, [selectedProject, loadActivitiesForProject]);

  const handleSelectActivity = useCallback(async (project: ProjectItem, activity: ActivityItem) => {
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
  }, []);

  const goToProjectTab = () => {
    setActiveTab("project");
    setComments({});
    if (!selectedProject && projectList.length > 0) handleSelectProject(projectList[0]);
  };

  const goToActivityTab = () => {
    setActiveTab("activity");
    setComments({});
    setSelectedActivity(null);
    setActivityDetail(null);
  };

  const handleCommentChange = (inputValue: string, commentValue: string) =>
    setComments((prev) => ({ ...prev, [inputValue]: commentValue }));

  const hasAnyComment = Object.values(comments).some((c) => c && c.trim() !== "");

  // ── Active display data ───────────────────────────────────────────────────
  const activeProgramData  = historySnapshotData ? mapSnapshotToProgram(historySnapshotData)  : proposalDetail;
  const activeProjectData  = historySnapshotData ? mapSnapshotToProject(historySnapshotData)  : projectDetail ?? selectedProject;
  const activeActivityData = historySnapshotData ? mapSnapshotToActivity(historySnapshotData) : activityDetail ?? selectedActivity;

  // ── Payload builders ──────────────────────────────────────────────────────
  const getProposalType = (): "program" | "project" | "activity" => {
    if (activeTab === "project")  return "project";
    if (activeTab === "activity") return "activity";
    return "program";
  };

  const getProposalNode = (): number | null => {
    if (activeTab === "project")  return projectDetail?.id ?? selectedProject?.id ?? null;
    if (activeTab === "activity") return activityDetail?.id ?? selectedActivity?.id ?? null;
    return proposalData?.proposal_id ? Number(proposalData.proposal_id) : proposalDetail?.proposal ?? null;
  };

  const buildPayload = (overrideDecision?: "needs_revision" | "approved"): ProposalReviewPayload => {
    const proposalType = getProposalType();
    const resolveAssignment = (): number | undefined => {
      if (activeTab === "activity" && selectedActivity) return Number(selectedActivity.assignment);
      if (activeTab === "project"  && selectedProject)  return Number(selectedProject.assignment);
      return proposalData?.assignment_id ? Number(proposalData.assignment_id) : user?.user_id ? Number(user.user_id) : undefined;
    };
    const resolveProposalNode = (): number | undefined => {
      if (activeTab === "activity" && selectedActivity) return Number(selectedActivity.proposal);
      if (activeTab === "project"  && selectedProject)  return Number(selectedProject.proposal);
      return Number(proposalData.proposal_id);
    };
    const base = {
      proposal_reviewer: resolveAssignment(),
      proposal_node: resolveProposalNode(),
      decision: overrideDecision ?? decision,
      review_round: String(reviewRound),
      proposal_type: proposalType,
    };
    if (proposalType === "program") return { ...base, proposal_type: "program", profile_feedback: comments["profile_feedback"] || "", implementing_agency_feedback: comments["implementing_agency_feedback"] || "", extension_site_feedback: comments["extension_site_feedback"] || "", tagging_cluster_extension_feedback: comments["tagging_cluster_extension_feedback"] || "", sdg_academic_program_feedback: comments["sdg_academic_program_feedback"] || "", rationale_feedback: comments["rationale_feedback"] || "", significance_feedback: comments["significance_feedback"] || "", objectives_feedback: comments["objectives_feedback"] || "", general_objectives_feedback: comments["general_objectives_feedback"] || "", specific_objectives_feedback: comments["specific_objectives_feedback"] || "", methodology_feedback: comments["methodology_feedback"] || "", expected_output_feedback: comments["expected_output_feedback"] || "", sustainability_plan_feedback: comments["sustainability_feedback"] || "", org_staffing_feedback: comments["org_staffing_feedback"] || "", work_plan_feedback: comments["work_plan_feedback"] || "", budget_requirements_feedback: comments["budget_feedback"] || "" };
    if (proposalType === "project") return { ...base, proposal_type: "project", profile_feedback: comments["proj_profile_feedback"] || "", implementing_agency_feedback: comments["proj_implementing_agency_feedback"] || "", extension_site_feedback: comments["proj_extension_site_feedback"] || "", tagging_cluster_extension_feedback: comments["proj_tagging_cluster_extension_feedback"] || "", sdg_academic_program_feedback: comments["proj_sdg_academic_program_feedback"] || "", rationale_feedback: comments["proj_rationale_feedback"] || "", significance_feedback: comments["proj_significance_feedback"] || "", objectives_feedback: comments["proj_objectives_feedback"] || "", general_objectives_feedback: comments["proj_general_objectives_feedback"] || "", specific_objectives_feedback: comments["proj_specific_objectives_feedback"] || "", methodology_feedback: comments["proj_methodology_feedback"] || "", expected_output_feedback: comments["proj_expected_output_feedback"] || "", sustainability_plan_feedback: comments["proj_sustainability_feedback"] || "", org_staffing_feedback: comments["proj_org_staffing_feedback"] || "", work_plan_feedback: comments["proj_work_plan_feedback"] || "", budget_requirements_feedback: comments["proj_budget_feedback"] || "" };
    return { ...base, proposal_type: "activity", profile_feedback: comments["act_profile_feedback"] || "", implementing_agency_feedback: comments["act_implementing_agency_feedback"] || "", extension_site_feedback: comments["act_extension_site_feedback"] || "", tagging_cluster_extension_feedback: comments["act_tagging_cluster_extension_feedback"] || "", sdg_academic_program_feedback: comments["act_sdg_academic_program_feedback"] || "", rationale_feedback: comments["act_rationale_feedback"] || "", objectives_feedback: comments["act_objectives_feedback"] || "", methodology_feedback: comments["act_methodology_feedback"] || "", expected_output_feedback: comments["act_expected_output_feedback"] || "", work_plan_feedback: comments["act_work_plan_feedback"] || "", budget_requirements_feedback: comments["act_budget_feedback"] || "" };
  };

  const submitReview = async (overrideDecision: "needs_revision" | "approved") => {
    const proposalNode = getProposalNode();
    if (!proposalNode) { showToast("Could not determine proposal node. Please try again.", "error"); return; }
    const payload = buildPayload(overrideDecision);
    const currentHistory = activeTab === "activity" ? activityHistory : activeTab === "project" ? projectHistory : programHistory;
    if (currentHistory.length <= 1) {
      await submitProposalReview(payload);
    } else {
      const resolvedReviewer = activeTab === "activity" && selectedActivity ? Number(selectedActivity.assignment) : activeTab === "project" && selectedProject ? Number(selectedProject.assignment) : proposalData?.assignment_id ? Number(proposalData.assignment_id) : Number(user?.user_id);
      await updateProposalReview(payload.proposal_node!, resolvedReviewer, payload);
    }
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try { await submitReview("needs_revision"); showToast("Review submitted successfully!", "success"); setComments({}); onClose(); }
    catch (err: any) { showToast(err?.message ?? "Failed to submit review.", "error"); }
    finally { setIsSubmitting(false); }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try { await submitReview("approved"); showToast("Proposal approved successfully!", "success"); onClose(); }
    catch (err: any) { showToast(err?.message ?? "Failed to approve proposal.", "error"); }
    finally { setIsApproving(false); }
  };

  // ── ALL HOOKS DONE ────────────────────────────────────────────────────────
  if (!isOpen || !proposalData) return null;

  const isProgramDetailReady = !!proposalDetail;
  const showProjectSidebar   = activeTab === "project" || activeTab === "activity";

  // Reviewed banner — shows skeleton while loading, then the amber card
  const ReviewedBanner = () => {
    if (existingReviewLoading) {
      return (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 animate-pulse">
          <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-52 rounded bg-gray-200" />
            <div className="h-2.5 w-36 rounded bg-gray-200" />
          </div>
        </div>
      );
    }
    if (!existingReview) return null;
    return (
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 shadow-sm">
        <MessageSquare size={18} className="text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800">You have already reviewed this proposal</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Submitted{" "}
            {existingReview.created_at
              ? new Date(existingReview.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
              : ""}
            {" · "}Decision:{" "}
            <span className="font-semibold capitalize">{existingReview.decision?.replace("_", " ")}</span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md animate-overlay-enter">
        <div className="bg-white flex-1 h-[100vh] flex flex-col overflow-hidden animate-modal-enter">

          {/* ── Header ── */}
          <div className="flex-shrink-0 flex items-center justify-between px-10 py-6 bg-primaryGreen border-b border-white/10 relative">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-[11px] tracking-[0.15em] uppercase text-white/70">Review Proposal</span>
                <ChevronRight size={13} className="text-white/40" />
                <span className={`inline-flex items-center px-4 py-[4px] rounded-full text-[12px] uppercase font-semibold backdrop-blur-md border border-white/20 shadow-sm ${statusStyle.className}`}>{statusStyle.label}</span>
              </div>
              <h1 className="font-bold text-[22px] text-white leading-snug truncate pr-10 drop-shadow-sm text-wrap">{proposalData.title}</h1>
            </div>
            <div className="flex items-center gap-2 mr-6 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/15 shadow-inner">
              <button onClick={() => { setActiveTab("program"); setComments({}); }} className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "program" ? "bg-white text-primaryGreen shadow-md" : "text-white hover:bg-white/20"}`}><FileText size={15} /> Program</button>
              <button onClick={goToProjectTab} className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "project" ? "bg-white text-primaryGreen shadow-md" : "text-white hover:bg-white/20"}`}>
                <FolderOpen size={15} /> Project
                {projectList.length > 0 && <span className={`ml-1 text-[10px] px-2 py-[2px] rounded-full font-bold ${activeTab === "project" ? "bg-primaryGreen text-white" : "bg-white/30 text-white"}`}>{projectList.length}</span>}
              </button>
              <button onClick={goToActivityTab} className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "activity" ? "bg-white text-primaryGreen shadow-md" : "text-white hover:bg-white/20"}`}><Activity size={15} /> Activity</button>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/90 text-gray-600 shadow-sm border border-white/40 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 hover:scale-105 active:scale-95"><X size={17} /></button>
          </div>

          {/* ── Body ── */}
          <div className="flex flex-1 overflow-hidden">

            {/* Sidebar */}
            {showProjectSidebar && (
              <div className="w-64 flex-shrink-0 bg-gray-50/80 border-r border-gray-200 flex flex-col overflow-y-scroll">
                <div className="sticky top-0 z-10 px-5 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-primaryGreen/10"><FolderOpen size={14} className="text-primaryGreen" /></div>
                  <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">{activeTab === "project" ? "Projects" : "Projects & Activities"}</span>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                  {projectListLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <div className="w-6 h-6 border-2 border-gray-200 border-t-primaryGreen rounded-full animate-spin" />
                      <p className="text-xs text-gray-400">Loading projects...</p>
                    </div>
                  ) : projectList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3"><FolderOpen size={18} className="text-gray-400" /></div>
                      <p className="text-sm font-medium text-gray-500">No projects yet</p>
                    </div>
                  ) : (
                    projectList.map((proj) => (
                      <div key={proj.child_id} className="group rounded-xl transition-all duration-200 hover:bg-white hover:shadow-sm">
                        <ProjectTreeNode project={proj} activeTab={activeTab} selectedProject={selectedProject} selectedActivity={selectedActivity} onSelectProject={handleSelectProject} onSelectActivity={handleSelectActivity} activitiesCache={activitiesCache} loadingCache={activitiesLoadingCache} onExpandProject={handleExpandProject} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Document content */}
            <div className="flex-1 overflow-y-auto relative bg-white">
              {historySnapshotLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-3">
                  <div className="w-7 h-7 border-[3px] border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
                  <p className="text-sm text-gray-500 font-medium">Loading version…</p>
                </div>
              )}

              <div className="p-10">
                {showExistingFeedback && <ReviewedBanner />}

                {/* PROGRAM */}
                {activeTab === "program" && (
                  isProgramDetailReady ? (
                    <ProgramForm
                      proposalData={activeProgramData}
                      comments={comments}
                      onCommentChange={handleCommentChange}
                      alreadyReviewed={alreadyReviewed}
                      showCommentInputs={showCommentInputs}
                      existingReview={showExistingFeedback ? existingReview : null}
                      reviewLoading={existingReviewLoading}
                    />
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8"><FormSkeleton lines={6} /></div>
                  )
                )}

                {/* PROJECT */}
                {activeTab === "project" && (
                  !selectedProject ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3"><FolderOpen size={40} className="text-gray-300" /><p className="font-medium">Select a project from the sidebar</p></div>
                  ) : projectDetailLoading ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8"><FormSkeleton lines={6} /></div>
                  ) : (
                    <ProjectForm
                      projectData={activeProjectData}
                      programTitle={proposalDetail?.program_title ?? proposalData?.title ?? ""}
                      comments={comments}
                      onCommentChange={handleCommentChange}
                      alreadyReviewed={alreadyReviewed}
                      showCommentInputs={showCommentInputs}
                      existingReview={showExistingFeedback ? existingReview : null}
                      reviewLoading={existingReviewLoading}
                    />
                  )
                )}

                {/* ACTIVITY */}
                {activeTab === "activity" && (
                  !selectedProject ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3"><FolderOpen size={40} className="text-gray-300" /><p className="font-medium">Select a project to expand its activities</p></div>
                  ) : !selectedActivity ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 gap-3"><Activity size={40} className="text-gray-300" /><p className="font-medium">Select an activity from the sidebar</p><p className="text-sm text-gray-400">{selectedProject.title}</p></div>
                  ) : activityDetailLoading ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8"><FormSkeleton lines={6} /></div>
                  ) : (
                    <ActivityForm
                      activityData={activeActivityData}
                      programTitle={proposalDetail?.program_title ?? proposalData?.title ?? ""}
                      projectTitle={selectedProject.title}
                      comments={comments}
                      onCommentChange={handleCommentChange}
                      alreadyReviewed={alreadyReviewed}
                      showCommentInputs={showCommentInputs}
                      existingReview={showExistingFeedback ? existingReview : null}
                      reviewLoading={existingReviewLoading}
                    />
                  )
                )}
              </div>

              {/* Action bar */}
              {showCommentInputs && (
                <div className={`fixed z-50 bottom-2 ${activeTab === "project" || activeTab === "activity" ? "left-1/4 -translate-x-1/4" : "left-0"} px-5`}>
                  <div className="flex justify-end gap-3 p-3 rounded-2xl bg-gray-100">
                    <button onClick={handleSubmitReview} disabled={isSubmitting || alreadyReviewed || !hasAnyComment} title={!hasAnyComment ? "Add at least one comment to submit a revision request" : ""} className="px-6 py-2.5 rounded-xl bg-primaryGreen text-white text-xs font-semibold flex items-center gap-2 shadow-sm hover:bg-green-700 hover:shadow-md active:scale-[0.97] transition-all duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed">
                      {isSubmitting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</>) : (<><Send className="w-4 h-4" />Submit Review</>)}
                    </button>
                    <button onClick={() => setShowApproveConfirm(true)} disabled={alreadyReviewed || hasAnyComment || isApproving} title={hasAnyComment ? "Clear all comments before approving" : ""} className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 shadow-sm hover:bg-emerald-700 hover:shadow-md active:scale-[0.97] transition-all duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed">
                      {isApproving ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Approving...</>) : <>Approve</>}
                    </button>
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 hover:border-gray-400 active:scale-[0.97] transition-all duration-200 shadow-sm">Cancel</button>
                  </div>
                </div>
              )}
            </div>

            {/* History panel */}
            <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }} className="bg-white h-full w-72 flex-shrink-0 flex flex-col border-l border-gray-100">
              <div className="px-5 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-base font-semibold text-gray-900 tracking-tight">Version History</span>
                  {!historyLoading && activeHistory.length > 0 && <span className="ml-auto text-[10px] font-semibold bg-gray-100 text-gray-400 rounded-full px-2 py-0.5">{activeHistory.length}</span>}
                </div>
                <p className="text-[11px] text-gray-400 leading-tight">Track changes to this proposal</p>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                {historyLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-5 h-5 border-[2.5px] border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-xs text-gray-400 tracking-wide">Loading history…</p>
                  </div>
                ) : activeHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-2">
                    <svg className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" /></svg>
                    <p className="text-xs text-gray-400 text-center">No history available yet</p>
                  </div>
                ) : (
                  activeHistory.map((item, index) => {
                    const isSelected = selectedHistoryVersion?.history_id === item.history_id;
                    const isCurrent  = item.status === "current";
                    return (
                      <div key={item.history_id} onClick={() => { if (isSelected) { setSelectedHistoryVersion(activeHistory.find((h) => h.status === "current") ?? null); } else { setSelectedHistoryVersion(item); } }} className={`group relative flex items-start gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-150 ${isSelected ? "bg-emerald-50 ring-1 ring-emerald-400/60" : "hover:bg-gray-50"}`}>
                        <div className="flex flex-col items-center pt-0.5 gap-0">
                          <div className={`w-2 h-2 rounded-full mt-1 shrink-0 transition-colors duration-150 ${isCurrent ? "bg-emerald-500 ring-2 ring-emerald-200" : isSelected ? "bg-emerald-400" : "bg-gray-300 group-hover:bg-gray-400"}`} />
                          {index < activeHistory.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" style={{ minHeight: 24 }} />}
                        </div>
                        <div className="flex-1 min-w-0 pb-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-sm font-medium leading-snug truncate ${isSelected ? "text-emerald-800" : "text-gray-800"}`}>{isCurrent ? "Current Version" : `Revision ${item.version}`}</span>
                            {isCurrent && <span className="shrink-0 text-[9px] font-semibold uppercase tracking-widest bg-emerald-100 text-emerald-600 rounded-full px-1.5 py-0.5">Active</span>}
                          </div>
                          <p className={`text-[11px] mt-0.5 ${isSelected ? "text-emerald-600/70" : "text-gray-400"}`}>Title: <span>{item.program_title}</span></p>
                        </div>
                        {isSelected && <div className="shrink-0 self-center"><svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approve confirm */}
      {showApproveConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-[420px] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Confirm Approval</h2>
            <p className="text-sm text-gray-600 leading-relaxed">Do you want to approve the proposal entitled <span className="font-semibold text-gray-800">"{proposalData?.title}"</span>?</p>
            <p className="text-sm text-red-500 mt-2">Are you sure there are no comments to add?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowApproveConfirm(false)} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition">Cancel</button>
              <button onClick={() => { setShowApproveConfirm(false); handleApprove(); }} disabled={isApproving} className="px-6 py-2 bg-primaryGreen text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                {isApproving ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Approving...</>) : "Yes, Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default ReviewerCommentModal;