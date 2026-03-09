import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Send,
  ChevronRight,
  FileText,
  FolderOpen,
  Activity,
} from "lucide-react";
import { getStatusStyle } from "@/utils/statusStyles";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import { useToast } from "@/context/toast";
import {
  fetchProjectList,
  fetchActivityList,
  fetchProjectProposalDetail,
  fetchActivityProposalDetail,
  submitProposalReview,
  type ApiProjectListResponse,
  type ApiActivityListResponse,
  type ApiProject,
  type ApiActivity,
  type ProposalReviewPayload,
  fetchReviewerProjectProposal,
  type ReviewerProjectList,
  fetchReviewerActivityProposal,
} from "@/utils/reviewer-api";
import {
  fetchProgramHistoryList,
  fetchProjectHistoryList,
  fetchActivityHistoryList,
} from "@/utils/implementor-api";
import {
  fetchProgramHistoryData,
  fetchProjectHistoryData,
  fetchActivityHistoryData,
} from "@/utils/get-history-data-api";
import { ActivityForm } from "../view-review/activity-form";
import { ProjectForm } from "../view-review/project-form";
import { ProgramForm } from "../view-review/program-form";
import { ProjectTreeNode } from "../view-review/project-tree-node";
import { useAuth } from "@/context/auth-context";

// ================= TYPES =================

interface History {
  history_id: string;
  proposal_id: string;
  status: string;
  version: number;
  version_no: number;
  created_at: string;
}

interface Review {
  id: string;
  comment: string;
  reviewer_name?: string;
  created_at?: string;
}

export interface MethodologyPhase {
  phase: string;
  activities: string[];
}

interface OrgStaffingItem {
  name: string;
  role: string;
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
  org_and_staffing: OrgStaffingItem[];
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
// Used to normalize history snapshot responses (same nested shape as view-reviewed-document)

function mapSnapshotToProgram(data: any): any | null {
  if (!data) return null;
  return {
    id:                        data.id       ?? 0,
    proposal:                  data.proposal ?? 0,
    program_title:             data.profile?.program_title  ?? data.program_title ?? "",
    program_leader:            data.profile?.program_leader ?? "",
    project_list:              data.profile?.project_list   ?? [],
    implementing_agency:       data.agencies?.implementing_agency                              ?? [],
    cooperating_agencies:      data.agencies?.cooperating_agency ?? data.agencies?.cooperating_agencies ?? [],
    extension_sites:           data.extension_sites?.content ?? data.agencies?.extension_sites ?? [],
    tags:                      data.tagging_clustering_extension?.tags     ?? [],
    clusters:                  data.tagging_clustering_extension?.clusters ?? [],
    agendas:                   data.tagging_clustering_extension?.agendas  ?? [],
    sdg_addressed:             data.sdg_and_academic_program?.sdg_addressed             ?? data.sdg_addressed             ?? "",
    mandated_academic_program: data.sdg_and_academic_program?.mandated_academic_program ?? data.mandated_academic_program ?? "",
    rationale:                 data.rationale?.content    ?? "",
    significance:              data.significance?.content ?? "",
    general_objectives:        data.objectives?.general   ?? "",
    specific_objectives:       data.objectives?.specific  ?? "",
    methodology:               data.methodology?.content  ?? [],
    expected_output_6ps:       data.expected_output_6ps?.content ?? [],
    sustainability_plan:       data.sustainability_plan?.content  ?? "",
    org_and_staffing:          data.organization_and_staffing?.content ?? [],
    workplan:                  data.work_plan?.content    ?? [],
    budget_requirements:       data.budget_requirements?.content ?? [],
    created_at:                data.created_at ?? "",
  };
}

function mapSnapshotToProject(data: any): any | null {
  if (!data) return null;
  return {
    id:                        data.id ?? 0,
    project_title:             data.profile?.project_title  ?? data.project_title ?? "",
    project_leader:            data.profile?.project_leader ?? "",
    members:                   data.profile?.members ?? data.profile?.project_member ?? [],
    duration_months:           data.profile?.duration_months ?? data.profile?.project_duration ?? "",
    start_date:                data.profile?.start_date  ?? data.profile?.project_start_date ?? null,
    end_date:                  data.profile?.end_date    ?? data.profile?.project_end_date   ?? null,
    implementing_agency:       data.agencies?.implementing_agency                              ?? [],
    cooperating_agencies:      data.agencies?.cooperating_agency ?? data.agencies?.cooperating_agencies ?? [],
    extension_sites:           data.extension_sites?.content ?? data.agencies?.extension_sites ?? [],
    tags:                      data.tagging_clustering_extension?.tags     ?? [],
    clusters:                  data.tagging_clustering_extension?.clusters ?? [],
    agendas:                   data.tagging_clustering_extension?.agendas  ?? [],
    sdg_addressed:             data.sdg_and_academic_program?.sdg_addressed             ?? data.sdg_addressed             ?? "",
    mandated_academic_program: data.sdg_and_academic_program?.mandated_academic_program ?? data.mandated_academic_program ?? "",
    rationale:                 data.rationale?.content    ?? "",
    significance:              data.significance?.content ?? "",
    general_objectives:        data.objectives?.general   ?? "",
    specific_objectives:       data.objectives?.specific  ?? "",
    methodology:               data.methodology?.content  ?? [],
    expected_output_6ps:       data.expected_output_6ps?.content ?? [],
    sustainability_plan:       data.sustainability_plan?.content  ?? "",
    org_and_staffing:          data.organization_and_staffing?.content ?? [],
    workplan:                  data.work_plan?.content    ?? [],
    budget_requirements:       data.budget_requirements?.content ?? [],
  };
}

function mapSnapshotToActivity(data: any): any | null {
  if (!data) return null;
  return {
    id:                        data.id ?? 0,
    activity_title:            data.profile?.activity_title          ?? data.activity_title ?? "",
    project_leader:            data.profile?.project_leader          ?? "",
    members:                   data.profile?.members ?? data.profile?.project_member ?? [],
    activity_duration_hours:   data.profile?.activity_duration_hours ?? data.profile?.project_duration ?? "",
    activity_date:             data.profile?.activity_date ?? data.profile?.project_start_date ?? null,
    implementing_agency:       data.agencies?.implementing_agency                              ?? [],
    cooperating_agencies:      data.agencies?.cooperating_agency ?? data.agencies?.cooperating_agencies ?? [],
    extension_sites:           data.extension_sites?.content ?? data.agencies?.extension_sites ?? [],
    tags:                      data.tagging_clustering_extension?.tags     ?? [],
    clusters:                  data.tagging_clustering_extension?.clusters ?? [],
    agendas:                   data.tagging_clustering_extension?.agendas  ?? [],
    sdg_addressed:             data.sdg_and_academic_program?.sdg_addressed             ?? data.sdg_addressed             ?? "",
    mandated_academic_program: data.sdg_and_academic_program?.mandated_academic_program ?? data.mandated_academic_program ?? "",
    rationale:                 data.rationale?.content   ?? "",
    objectives:                data.objectives?.content  ?? data.objectives?.general ?? "",
    methodology:               data.methodology?.content ?? "",
    expected_output_6ps:       data.expected_output_6ps?.content ?? [],
    sustainability_plan:       data.sustainability_plan?.content   ?? "",
    org_and_staffing:          data.organization_and_staffing?.content ?? [],
    plan_of_activity:          data.plan_of_activity?.content ?? [],
    budget_requirements:       data.budget_requirements?.content ?? [],
  };
}

// ================= HISTORY NORMALIZER =================

function normalizeHistoryList(raw: any): History[] {
  if (!raw) return [];
  const items: any[] = Array.isArray(raw) ? raw : raw.history ?? raw.results ?? [];
  return items.map((item) => ({
    history_id:  String(item.history_id ?? item.id ?? ""),
    proposal_id: String(item.proposal_id ?? item.proposal ?? ""),
    status:      item.status ?? "unknown",
    version:     item.version ?? item.version_no ?? 0,
    version_no:  item.version_no ?? item.version ?? 0,
    created_at:  item.created_at ?? "",
  }));
}

// ================= MAIN MODAL =================

const ReviewerCommentModal: React.FC<ReviewerCommentModalProps> = ({
  isOpen, onClose, proposalData, proposalDetail, programNode_id, review_id,
}) => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("program");

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const [projectList,            setProjectList]            = useState<ProjectItem[]>([]);
  const [projectListLoading,     setProjectListLoading]     = useState(false);
  const [selectedProject,        setSelectedProject]        = useState<ProjectItem | null>(null);
  const [projectDetail,          setProjectDetail]          = useState<any | null>(null);
  const [projectDetailLoading,   setProjectDetailLoading]   = useState(false);
  const [activitiesCache,        setActivitiesCache]        = useState<Record<number, ActivityItem[]>>({});
  const [activitiesLoadingCache, setActivitiesLoadingCache] = useState<Record<number, boolean>>({});
  const [selectedActivity,       setSelectedActivity]       = useState<ActivityItem | null>(null);
  const [activityDetail,         setActivityDetail]         = useState<any | null>(null);
  const [activityDetailLoading,  setActivityDetailLoading]  = useState(false);

  // ── Review state ──────────────────────────────────────────────────────────
  const [comments,          setComments]          = useState<Comments>({});
  const [isSubmitting,      setIsSubmitting]      = useState(false);
  const [alreadyReviewed,   setAlreadyReviewed]   = useState(false);
  const [isApproving,       setIsApproving]       = useState(false);
  const [showApproveConfirm,setShowApproveConfirm]= useState(false);
  const [decision,          setDecision]          = useState<"needs_revision" | "approved">("needs_revision");
  const [reviewRound,       setReviewRound]       = useState<number>(1);

  // ── History (per tab) ─────────────────────────────────────────────────────
  const [programHistory,         setProgramHistory]         = useState<History[]>([]);
  const [projectHistory,         setProjectHistory]         = useState<History[]>([]);
  const [activityHistory,        setActivityHistory]        = useState<History[]>([]);
  const [historyLoading,         setHistoryLoading]         = useState(false);
  const [selectedHistoryVersion, setSelectedHistoryVersion] = useState<History | null>(null);

  // ── History snapshot data ─────────────────────────────────────────────────
  const [historySnapshotData,    setHistorySnapshotData]    = useState<any | null>(null);
  const [historySnapshotLoading, setHistorySnapshotLoading] = useState(false);

  // ── Derived ───────────────────────────────────────────────────────────────
  const childId      = proposalDetail?.id ?? proposalData?.child_id;
  const programNodeId = proposalData?.proposal_id ? Number(proposalData.proposal_id) : null;
  const statusStyle  = proposalData ? getStatusStyle(proposalData.status ?? "") : { className: "", label: "" };

  // Comment inputs only shown when viewing current version
  const showCommentInputs = !selectedHistoryVersion || selectedHistoryVersion.status === "current";

  const activeHistory: History[] =
    activeTab === "activity" ? activityHistory :
    activeTab === "project"  ? projectHistory  :
    programHistory;

  // ── 1. Program history ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !programNodeId) return;
    setHistoryLoading(true);
    fetchProgramHistoryList(programNodeId)
      .then((raw) => {
        const list = normalizeHistoryList(raw);
        setProgramHistory(list);
        // Auto-select current version on open
        if (activeTab === "program") {
          const current = list.find((h) => h.status === "current") ?? list[0] ?? null;
          setSelectedHistoryVersion(current);
        }
      })
      .catch((err) => { console.error("[ProgramHistory] Failed:", err); setProgramHistory([]); })
      .finally(() => setHistoryLoading(false));
  }, [isOpen, programNodeId]);

  // ── 2. Project list ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !childId) return;
    setProjectListLoading(true);
    fetchReviewerProjectProposal(childId)
      .then((data: ReviewerProjectList) => setProjectList(data))
      .catch((err) => console.error("[ProjectList] Failed:", err))
      .finally(() => setProjectListLoading(false));
  }, [isOpen, childId]);

  // ── 3. Project history when a project is selected ─────────────────────────
  useEffect(() => {
    if (!selectedProject?.proposal) {
      setProjectHistory([]);
      return;
    }
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
      .catch((err) => { console.error("[ProjectHistory] Failed:", err); setProjectHistory([]); })
      .finally(() => setHistoryLoading(false));
  }, [selectedProject?.proposal]);

  // ── 4. Activity history when an activity is selected ──────────────────────
  useEffect(() => {
    if (!selectedActivity?.proposal) {
      setActivityHistory([]);
      return;
    }
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
      .catch((err) => { console.error("[ActivityHistory] Failed:", err); setActivityHistory([]); })
      .finally(() => setHistoryLoading(false));
  }, [selectedActivity?.proposal]);

  // ── 5. Fetch snapshot when a past version is selected ────────────────────
  // Skip the fetch entirely for "current" — existing detail data is already loaded.
  useEffect(() => {
    if (!selectedHistoryVersion || selectedHistoryVersion.status === "current") {
      setHistorySnapshotData(null);
      return;
    }

    const { history_id, proposal_id, version } = selectedHistoryVersion;

    const resolvedProposalId =
      activeTab === "project"  ? (selectedProject?.proposal  ?? proposal_id) :
      activeTab === "activity" ? (selectedActivity?.proposal ?? proposal_id) :
      programNodeId ?? proposal_id;

    const fetcher =
      activeTab === "project"  ? fetchProjectHistoryData  :
      activeTab === "activity" ? fetchActivityHistoryData :
      fetchProgramHistoryData;

    setHistorySnapshotLoading(true);
    setHistorySnapshotData(null);

    fetcher(Number(resolvedProposalId), Number(history_id), version)
      .then(setHistorySnapshotData)
      .catch((err) => {
        console.error("[HistorySnapshot] fetch failed:", err);
        setHistorySnapshotData(null);
      })
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
    }
  }, [isOpen]);

  // ── Reset history selection when switching tabs / items ───────────────────
  useEffect(() => {
    const list =
      activeTab === "activity" ? activityHistory :
      activeTab === "project"  ? projectHistory  :
      programHistory;
    const current = list.find((h) => h.status === "current") ?? list[0] ?? null;
    setSelectedHistoryVersion(current);
    setHistorySnapshotData(null);
  }, [activeTab, selectedProject?.proposal, selectedActivity?.proposal]);

  // ── Load activities for a project (with cache) ────────────────────────────
  const loadActivitiesForProject = useCallback(async (project: ProjectItem) => {
    if (activitiesCache[project.child_id] !== undefined) return;
    setActivitiesLoadingCache((prev) => ({ ...prev, [project.child_id]: true }));
    try {
      const data: ApiActivity[] = await fetchReviewerActivityProposal(project.child_id);
      setActivitiesCache((prev) => ({ ...prev, [project.child_id]: data }));
    } catch (err) {
      console.error("[ActivityList] Failed:", err);
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
      console.error("[ProjectDetail] Failed:", err);
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
      console.error("[ActivityDetail] Failed:", err);
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

  const handleCommentChange = (inputValue: string, commentValue: string) => {
    setComments((prev) => ({ ...prev, [inputValue]: commentValue }));
  };

  const hasAnyComment = Object.values(comments).some((c) => c && c.trim() !== "");

  // ── Resolve active display data (snapshot overrides current when viewing history) ──
  const activeProgramData  = historySnapshotData ? mapSnapshotToProgram(historySnapshotData)  : proposalDetail;
  const activeProjectData  = historySnapshotData ? mapSnapshotToProject(historySnapshotData)  : (projectDetail ?? selectedProject);
  const activeActivityData = historySnapshotData ? mapSnapshotToActivity(historySnapshotData) : (activityDetail ?? selectedActivity);

  // ── Proposal type / node helpers ─────────────────────────────────────────
  const getProposalType = (): "program" | "project" | "activity" => {
    if (activeTab === "project")  return "project";
    if (activeTab === "activity") return "activity";
    return "program";
  };

  const getProposalNode = (): number | null => {
    if (activeTab === "project")  return projectDetail?.id  ?? selectedProject?.id  ?? null;
    if (activeTab === "activity") return activityDetail?.id ?? selectedActivity?.id ?? null;
    return proposalData?.proposal_id ? Number(proposalData.proposal_id) : (proposalDetail?.proposal ?? null);
  };

  const buildPayload = (overrideDecision?: "needs_revision" | "approved"): ProposalReviewPayload => {
    const proposalType = getProposalType();
    const proposalNode = getProposalNode()!;

    const resolveReviewerAssignment = (): number | undefined => {
      if (activeTab === "activity" && selectedActivity) return Number(selectedActivity.assignment);
      if (activeTab === "project"  && selectedProject)  return Number(selectedProject.assignment);
      return proposalData?.assignment_id
        ? Number(proposalData.assignment_id)
        : (user?.user_id ? Number(user.user_id) : undefined);
    };

    const resolveReviewerProposalNode = (): number | undefined => {
      if (activeTab === "activity" && selectedActivity) return Number(selectedActivity.proposal);
      if (activeTab === "project"  && selectedProject)  return Number(selectedProject.proposal);
      return Number(proposalData.proposal_id);
    };

    if (import.meta.env.DEV) {
      console.log("[buildPayload] activeTab:", activeTab, "| proposalType:", proposalType, "| proposalNode:", proposalNode);
      console.log("[buildPayload] resolvedAssignment:", resolveReviewerAssignment());
      console.log("[buildPayload] proposalData:", proposalData);
      console.log("[buildPayload] comments:", comments);
    }

    const base = {
      proposal_reviewer: resolveReviewerAssignment(),
      proposal_node:     resolveReviewerProposalNode(),
      decision:          overrideDecision ?? decision,
      review_round:      String(reviewRound),
      proposal_type:     proposalType,
    };

    if (proposalType === "program") {
      return {
        ...base, proposal_type: "program",
        profile_feedback:                   comments["profile_feedback"]                   || "",
        implementing_agency_feedback:       comments["implementing_agency_feedback"]       || "",
        extension_site_feedback:            comments["extension_site_feedback"]            || "",
        tagging_cluster_extension_feedback: comments["tagging_cluster_extension_feedback"] || "",
        sdg_academic_program_feedback:      comments["sdg_academic_program_feedback"]      || "",
        rationale_feedback:                 comments["rationale_feedback"]                 || "",
        significance_feedback:              comments["significance_feedback"]              || "",
        objectives_feedback:                comments["objectives_feedback"]                || "",
        general_objectives_feedback:        comments["general_objectives_feedback"]        || "",
        specific_objectives_feedback:       comments["specific_objectives_feedback"]       || "",
        methodology_feedback:               comments["methodology_feedback"]               || "",
        expected_output_feedback:           comments["expected_output_feedback"]           || "",
        sustainability_plan_feedback:       comments["sustainability_feedback"]            || "",
        org_staffing_feedback:              comments["org_staffing_feedback"]              || "",
        work_plan_feedback:                 comments["work_plan_feedback"]                 || "",
        budget_requirements_feedback:       comments["budget_feedback"]                    || "",
      };
    }

    if (proposalType === "project") {
      return {
        ...base, proposal_type: "project",
        profile_feedback:                   comments["proj_profile_feedback"]                   || "",
        implementing_agency_feedback:       comments["proj_implementing_agency_feedback"]       || "",
        extension_site_feedback:            comments["proj_extension_site_feedback"]            || "",
        tagging_cluster_extension_feedback: comments["proj_tagging_cluster_extension_feedback"] || "",
        sdg_academic_program_feedback:      comments["proj_sdg_academic_program_feedback"]      || "",
        rationale_feedback:                 comments["proj_rationale_feedback"]                 || "",
        significance_feedback:              comments["proj_significance_feedback"]              || "",
        objectives_feedback:                comments["proj_objectives_feedback"]                || "",
        general_objectives_feedback:        comments["proj_general_objectives_feedback"]        || "",
        specific_objectives_feedback:       comments["proj_specific_objectives_feedback"]       || "",
        methodology_feedback:               comments["proj_methodology_feedback"]               || "",
        expected_output_feedback:           comments["proj_expected_output_feedback"]           || "",
        sustainability_plan_feedback:       comments["proj_sustainability_feedback"]            || "",
        org_staffing_feedback:              comments["proj_org_staffing_feedback"]              || "",
        work_plan_feedback:                 comments["proj_work_plan_feedback"]                 || "",
        budget_requirements_feedback:       comments["proj_budget_feedback"]                    || "",
      };
    }

    return {
      ...base, proposal_type: "activity",
      profile_feedback:                   comments["act_profile_feedback"]                   || "",
      implementing_agency_feedback:       comments["act_implementing_agency_feedback"]        || "",
      extension_site_feedback:            comments["act_extension_site_feedback"]             || "",
      tagging_cluster_extension_feedback: comments["act_tagging_cluster_extension_feedback"]  || "",
      sdg_academic_program_feedback:      comments["act_sdg_academic_program_feedback"]       || "",
      rationale_feedback:                 comments["act_rationale_feedback"]                  || "",
      objectives_feedback:                comments["act_objectives_feedback"]                 || "",
      methodology_feedback:               comments["act_methodology_feedback"]                || "",
      expected_output_feedback:           comments["act_expected_output_feedback"]            || "",
      work_plan_feedback:                 comments["act_work_plan_feedback"]                  || "",
      budget_requirements_feedback:       comments["act_budget_feedback"]                     || "",
    };
  };

  const handleSubmitReview = async () => {
    const proposalNode = getProposalNode();
    if (!proposalNode) { showToast("Could not determine proposal node. Please try again.", "error"); return; }
    setIsSubmitting(true);
    try {
      await submitProposalReview(buildPayload("needs_revision"));
      showToast("Review submitted successfully!", "success");
      setComments({});
      onClose();
    } catch (err: any) {
      showToast(err?.message ?? "Failed to submit review.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    const proposalNode = getProposalNode();
    if (!proposalNode) { showToast("Could not determine proposal node. Please try again.", "error"); return; }
    setIsApproving(true);
    try {
      await submitProposalReview(buildPayload("approved"));
      showToast("Proposal approved successfully!", "success");
      onClose();
    } catch (err: any) {
      showToast(err?.message ?? "Failed to approve proposal.", "error");
    } finally {
      setIsApproving(false);
    }
  };

  // ── ALL HOOKS DONE — safe to early-return ─────────────────────────────────
  if (!isOpen || !proposalData) return null;

  const isProgramDetailReady = !!proposalDetail;
  const showProjectSidebar   = activeTab === "project" || activeTab === "activity";

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
                <span className={`inline-flex items-center px-4 py-[4px] rounded-full text-[12px] uppercase font-semibold backdrop-blur-md border border-white/20 shadow-sm ${statusStyle.className}`}>
                  {statusStyle.label}
                </span>
              </div>
              <h1 className="font-bold text-[22px] text-white leading-snug truncate pr-10 drop-shadow-sm text-wrap">
                {proposalData.title}
              </h1>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mr-6 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/15 shadow-inner">
              <button onClick={() => { setActiveTab("program"); setComments({}); }}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "program" ? "bg-white text-primaryGreen shadow-md" : "text-white hover:bg-white/20"}`}>
                <FileText size={15} /> Program
              </button>
              <button onClick={goToProjectTab}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "project" ? "bg-white text-primaryGreen shadow-md" : "text-white hover:bg-white/20"}`}>
                <FolderOpen size={15} /> Project
                {projectList.length > 0 && (
                  <span className={`ml-1 text-[10px] px-2 py-[2px] rounded-full font-bold ${activeTab === "project" ? "bg-primaryGreen text-white" : "bg-white/30 text-white"}`}>
                    {projectList.length}
                  </span>
                )}
              </button>
              <button onClick={goToActivityTab}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "activity" ? "bg-white text-primaryGreen shadow-md" : "text-white hover:bg-white/20"}`}>
                <Activity size={15} /> Activity
              </button>
            </div>

            <button onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/90 text-gray-600 shadow-sm border border-white/40 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 hover:scale-105 active:scale-95">
              <X size={17} />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="flex flex-1 overflow-hidden">

            {/* ── Project/Activity Sidebar ── */}
            {showProjectSidebar && (
              <div className="w-64 flex-shrink-0 bg-gray-50/80 border-r border-gray-200 flex flex-col overflow-hidden">
                <div className="sticky top-0 z-10 px-5 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-primaryGreen/10">
                    <FolderOpen size={14} className="text-primaryGreen" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">
                    {activeTab === "project" ? "Projects" : "Projects & Activities"}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                  {projectListLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <div className="w-6 h-6 border-2 border-gray-200 border-t-primaryGreen rounded-full animate-spin" />
                      <p className="text-xs text-gray-400">Loading projects...</p>
                    </div>
                  ) : projectList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                        <FolderOpen size={18} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">No projects yet</p>
                    </div>
                  ) : (
                    projectList.map((proj) => (
                      <div key={proj.child_id} className="group rounded-xl transition-all duration-200 hover:bg-white hover:shadow-sm">
                        <ProjectTreeNode
                          project={proj}
                          activeTab={activeTab}
                          selectedProject={selectedProject}
                          selectedActivity={selectedActivity}
                          onSelectProject={handleSelectProject}
                          onSelectActivity={handleSelectActivity}
                          activitiesCache={activitiesCache}
                          loadingCache={activitiesLoadingCache}
                          onExpandProject={handleExpandProject}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ── Document Content ── */}
            <div className="flex-1 overflow-y-auto relative bg-white">
              {/* History snapshot loading overlay */}
              {historySnapshotLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-3">
                  <div className="w-7 h-7 border-[3px] border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
                  <p className="text-sm text-gray-500 font-medium">Loading version…</p>
                </div>
              )}
              <div className="p-10">

                {/* PROGRAM TAB */}
                {activeTab === "program" && (
                  isProgramDetailReady ? (
                    <ProgramForm
                      proposalData={activeProgramData}
                      comments={comments}
                      onCommentChange={handleCommentChange}
                      alreadyReviewed={alreadyReviewed}
                      showCommentInputs={showCommentInputs}
                    />
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8">
                      <FormSkeleton lines={6} />
                    </div>
                  )
                )}

                {/* PROJECT TAB */}
                {activeTab === "project" && (
                  !selectedProject ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                      <FolderOpen size={40} className="text-gray-300" />
                      <p className="font-medium">Select a project from the sidebar</p>
                    </div>
                  ) : projectDetailLoading ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8">
                      <FormSkeleton lines={6} />
                    </div>
                  ) : (
                    <ProjectForm
                      projectData={activeProjectData}
                      programTitle={proposalDetail?.program_title ?? proposalData?.title ?? ""}
                      comments={comments}
                      onCommentChange={handleCommentChange}
                      alreadyReviewed={alreadyReviewed}
                      showCommentInputs={showCommentInputs}
                    />
                  )
                )}

                {/* ACTIVITY TAB */}
                {activeTab === "activity" && (
                  !selectedProject ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                      <FolderOpen size={40} className="text-gray-300" />
                      <p className="font-medium">Select a project to expand its activities</p>
                    </div>
                  ) : !selectedActivity ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 gap-3">
                      <Activity size={40} className="text-gray-300" />
                      <p className="font-medium">Select an activity from the sidebar</p>
                      <p className="text-sm text-gray-400">{selectedProject.title}</p>
                    </div>
                  ) : activityDetailLoading ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8">
                      <FormSkeleton lines={6} />
                    </div>
                  ) : (
                    <ActivityForm
                      activityData={activeActivityData}
                      programTitle={proposalDetail?.program_title ?? proposalData?.title ?? ""}
                      projectTitle={selectedProject.title}
                      comments={comments}
                      onCommentChange={handleCommentChange}
                      alreadyReviewed={alreadyReviewed}
                      showCommentInputs={showCommentInputs}
                    />
                  )
                )}

                {/* ── Action Buttons (only on current version) ── */}
                {showCommentInputs && (
                  <div className="mt-10 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-4 mb-5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          Review Round
                        </label>
                        <select
                          value={reviewRound}
                          onChange={(e) => setReviewRound(parseInt(e.target.value))}
                          disabled={alreadyReviewed}
                          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-primaryGreen disabled:bg-gray-50 disabled:cursor-not-allowed"
                        >
                          {["1","2","3","4","5"].map((r) => (
                            <option key={r} value={r}>Round {r}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          Reviewing
                        </label>
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primaryGreen/10 text-primaryGreen border border-primaryGreen/20">
                          {getProposalType().charAt(0).toUpperCase() + getProposalType().slice(1)}
                        </span>
                      </div>
                      {hasAnyComment && (
                        <span className="ml-auto text-xs text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg font-medium">
                          {Object.values(comments).filter((c) => c?.trim()).length} comment(s) — will submit as <strong>Needs Revision</strong>
                        </span>
                      )}
                    </div>
                    <div className="flex justify-end gap-4">
                      <button onClick={onClose}
                        className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitReview}
                        disabled={isSubmitting || alreadyReviewed || !hasAnyComment}
                        className="px-8 py-3 bg-primaryGreen text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                        title={!hasAnyComment ? "Add at least one comment to submit a revision request" : ""}
                      >
                        {isSubmitting ? (
                          <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</>
                        ) : (
                          <><Send className="w-5 h-5" />Submit Review</>
                        )}
                      </button>
                      <button
                        onClick={() => setShowApproveConfirm(true)}
                        disabled={alreadyReviewed || hasAnyComment || isApproving}
                        className="px-8 py-3 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                        title={hasAnyComment ? "Clear all comments before approving" : ""}
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* ── History Panel ── */}
            <div
              style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
              className="bg-white h-full w-72 flex-shrink-0 flex flex-col border-l border-gray-100"
            >
              {/* Header */}
              <div className="px-5 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-base font-semibold text-gray-900 tracking-tight">Version History</span>
                  {!historyLoading && activeHistory.length > 0 && (
                    <span className="ml-auto text-[10px] font-semibold bg-gray-100 text-gray-400 rounded-full px-2 py-0.5">
                      {activeHistory.length}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 leading-tight">Track changes to this proposal</p>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                {historyLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-5 h-5 border-[2.5px] border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-xs text-gray-400 tracking-wide">Loading history…</p>
                  </div>
                ) : activeHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-2">
                    <svg className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                    </svg>
                    <p className="text-xs text-gray-400 text-center">No history available yet</p>
                  </div>
                ) : (
                  activeHistory.map((item, index) => {
                    const isSelected = selectedHistoryVersion?.history_id === item.history_id;
                    const isCurrent  = item.status === "current";
                    const date = item.created_at
                      ? new Date(item.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                      : "";

                    return (
                      <div
                        key={item.history_id}
                        onClick={() => {
                          if (isSelected) {
                            // Click current-already-selected → stay on current
                            const current = activeHistory.find((h) => h.status === "current") ?? null;
                            setSelectedHistoryVersion(current);
                          } else {
                            setSelectedHistoryVersion(item);
                          }
                        }}
                        className={`group relative flex items-start gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-150 ${
                          isSelected ? "bg-emerald-50 ring-1 ring-emerald-400/60" : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Timeline dot + line */}
                        <div className="flex flex-col items-center pt-0.5 gap-0">
                          <div className={`w-2 h-2 rounded-full mt-1 shrink-0 transition-colors duration-150 ${
                            isCurrent ? "bg-emerald-500 ring-2 ring-emerald-200"
                            : isSelected ? "bg-emerald-400"
                            : "bg-gray-300 group-hover:bg-gray-400"
                          }`} />
                          {index < activeHistory.length - 1 && (
                            <div className="w-px flex-1 bg-gray-100 mt-1" style={{ minHeight: 24 }} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pb-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-sm font-medium leading-snug truncate ${isSelected ? "text-emerald-800" : "text-gray-800"}`}>
                              {isCurrent ? "Current Version" : `Revision ${item.version}`}
                            </span>
                            {isCurrent && (
                              <span className="shrink-0 text-[9px] font-semibold uppercase tracking-widest bg-emerald-100 text-emerald-600 rounded-full px-1.5 py-0.5">
                                Active
                              </span>
                            )}
                          </div>
                          <p className={`text-[11px] mt-0.5 ${isSelected ? "text-emerald-600/70" : "text-gray-400"}`}>
                            {date}
                          </p>
                        </div>

                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="shrink-0 self-center">
                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Approve Confirm Dialog ── */}
      {showApproveConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-[420px] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Confirm Approval</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Do you want to approve the proposal entitled{" "}
              <span className="font-semibold text-gray-800">"{proposalData?.title}"</span>?
            </p>
            <p className="text-sm text-red-500 mt-2">Are you sure there are no comments to add?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowApproveConfirm(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                Cancel
              </button>
              <button
                onClick={() => { setShowApproveConfirm(false); handleApprove(); }}
                disabled={isApproving}
                className="px-6 py-2 bg-primaryGreen text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                {isApproving ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Approving...</>
                ) : "Yes, Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewerCommentModal;