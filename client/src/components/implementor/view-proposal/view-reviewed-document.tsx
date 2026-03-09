// view-reviewed-document.tsx
import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, FileText, FolderOpen, Activity } from "lucide-react";
import { getStatusStyle } from "@/utils/statusStyles";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import {
  fetchProjectList,
  type ApiProjectListResponse,
  type ApiActivity,
} from "@/api/reviewer-api";
import {
  fetchActivityList,
  fetchActivityProposalDetail,
  fetchReviewedProposal,
  fetchProgramHistoryList,
  fetchProjectHistoryList,
  fetchActivityHistoryList,
  type ApiActivityListResponse,
} from "@/api/implementor-api";
import { useAuth } from "@/context/auth-context";
import { ActivityForm } from "./view-review-forms/activity-form";
import { ProjectForm } from "./view-review-forms/project-form";
import { ProgramForm } from "./view-review-forms/program-form";
import { ProjectTreeNode } from "./view-review-forms/project-tree-node";
import EditSaveButton from "./EditSaveButton";
import { useProposalEdit } from "@/hooks/useProposalEdit";
import { fetchActivityHistoryData, fetchProgramHistoryData, fetchProjectHistoryData } from "@/api/get-history-data-api";

// ================= TYPES =================

export interface MethodologyPhase { phase: string; activities: string[]; }
export interface WorkplanItem     { month: string; activity: string; }
export interface BudgetItem       { item: string; amount: number | string; }

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

export interface Comments { [key: string]: string; }

type ProjectListFields = {
  proposal_id: number;
  child_id: number;
  implementor: number;
  project_title: string;
  project_leader: string;
  type: string;
  status: string;
  reviewer_count: number;
  version_no: number;
  is_reviewed: boolean;
  assigned_at: string | null;
  activities?: ApiActivity[];
};

type ProjectItem  = ProjectListFields;
type ActivityItem = ProjectListFields;
type TabType      = "program" | "project" | "activity";

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

export interface ViewReviewedDocumentsProps {
  isOpen: boolean;
  onClose: () => void;
  proposalData: {
    title: string;
    status: string;
    proposal_id: number | string;
    child_id: number | string;
    assignment_id?: number | string;
  } | null;
  proposalDetail?: any;
  programNode_id?: number;
  review_id?: string;
}

// ================= DATA MAPPERS =================

function mapReviewedToProgram(data: any): ApiProposalDetail | null {
  if (!data) return null;
  return {
    id:                        data.id       ?? 0,
    proposal:                  data.proposal ?? 0,
    program_title:             data.profile?.program_title        ?? data.program_title ?? "",
    program_leader:            data.profile?.program_leader       ?? "",
    project_list:              data.profile?.project_list         ?? [],
    implementing_agency:       data.agencies?.implementing_agency ?? [],
    cooperating_agencies:      data.agencies?.cooperating_agency  ?? [],
    extension_sites:           data.extension_sites?.content      ?? [],
    tags:                      data.tagging_clustering_extension?.tags     ?? [],
    clusters:                  data.tagging_clustering_extension?.clusters ?? [],
    agendas:                   data.tagging_clustering_extension?.agendas  ?? [],
    sdg_addressed:             data.sdg_and_academic_program?.sdg_addressed             ?? "",
    mandated_academic_program: data.sdg_and_academic_program?.mandated_academic_program ?? "",
    rationale:                 data.rationale?.content    ?? "",
    significance:              data.significance?.content ?? "",
    general_objectives:        data.objectives?.general   ?? "",
    specific_objectives:       data.objectives?.specific  ?? "",
    methodology:               data.methodology?.content  ?? [],
    expected_output_6ps:       data.expected_output_6ps?.content ?? [],
    sustainability_plan:       data.sustainability_plan?.content  ?? "",
    org_and_staffing:          data.organization_and_staffing?.content ?? [],
    workplan:                  data.work_plan?.content     ?? [],
    budget_requirements:       data.budget_requirements?.content  ?? [],
    created_at:                data.created_at ?? "",
  };
}

function mapReviewedToProject(data: any): any | null {
  if (!data) return null;
  return {
    id:                        data.id ?? 0,
    project_title:             data.profile?.project_title   ?? data.project_title ?? "",
    project_leader:            data.profile?.project_leader  ?? "",
    members:                   data.profile?.members         ?? [],
    duration_months:           data.profile?.duration_months ?? "",
    start_date:                data.profile?.start_date      ?? null,
    end_date:                  data.profile?.end_date        ?? null,
    implementing_agency:       data.agencies?.implementing_agency  ?? [],
    cooperating_agencies:      data.agencies?.cooperating_agencies ?? [],
    extension_sites:           data.extension_sites?.content       ?? [],
    tags:                      data.tagging_clustering_extension?.tags     ?? [],
    clusters:                  data.tagging_clustering_extension?.clusters ?? [],
    agendas:                   data.tagging_clustering_extension?.agendas  ?? [],
    sdg_addressed:             data.sdg_and_academic_program?.sdg_addressed             ?? "",
    mandated_academic_program: data.sdg_and_academic_program?.mandated_academic_program ?? "",
    rationale:                 data.rationale?.content    ?? "",
    significance:              data.significance?.content ?? "",
    general_objectives:        data.objectives?.general   ?? "",
    specific_objectives:       data.objectives?.specific  ?? "",
    methodology:               data.methodology?.content  ?? [],
    expected_output_6ps:       data.expected_output_6ps?.content ?? [],
    sustainability_plan:       data.sustainability_plan?.content  ?? "",
    org_and_staffing:          data.organization_and_staffing?.content ?? [],
    workplan:                  data.work_plan?.content     ?? [],
    budget_requirements:       data.budget_requirements?.content  ?? [],
  };
}

function mapReviewedToActivity(data: any): any | null {
  if (!data) return null;
  return {
    id:                        data.id ?? 0,
    activity_title:            data.profile?.activity_title          ?? data.activity_title ?? "",
    project_leader:            data.profile?.project_leader          ?? "",
    members:                   data.profile?.members                 ?? [],
    activity_duration_hours:   data.profile?.activity_duration_hours ?? "",
    activity_date:             data.profile?.activity_date           ?? null,
    implementing_agency:       data.agencies?.implementing_agency    ?? [],
    cooperating_agencies:      data.agencies?.cooperating_agencies   ?? [],
    extension_sites:           data.extension_sites?.content         ?? [],
    tags:                      data.tagging_clustering_extension?.tags     ?? [],
    clusters:                  data.tagging_clustering_extension?.clusters ?? [],
    agendas:                   data.tagging_clustering_extension?.agendas  ?? [],
    sdg_addressed:             data.sdg_and_academic_program?.sdg_addressed             ?? "",
    mandated_academic_program: data.sdg_and_academic_program?.mandated_academic_program ?? "",
    rationale:                 data.rationale?.content    ?? "",
    objectives:                data.objectives?.content   ?? "",
    methodology:               data.methodology?.content  ?? "",
    expected_output_6ps:       data.expected_output_6ps?.content ?? [],
    sustainability_plan:       data.sustainability_plan?.content  ?? "",
    org_and_staffing:          data.organization_and_staffing?.content ?? [],
    plan_of_activity:          data.plan_of_activity?.content ?? [],
    budget_requirements:       data.budget_requirements?.content  ?? [],
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
    program_title:  String(item.program_title ?? item.project_title ?? item.activity_title ?? ""),
  }));
}

// ================= MAIN MODAL =================

const ViewReviewedDocuments: React.FC<ViewReviewedDocumentsProps> = ({
  isOpen,
  onClose,
  proposalData,
}) => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("program");

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const [projectList,            setProjectList]            = useState<ProjectItem[]>([]);
  const [projectListLoading,     setProjectListLoading]     = useState(false);
  const [selectedProject,        setSelectedProject]        = useState<ProjectItem | null>(null);
  const [selectedActivity,       setSelectedActivity]       = useState<ActivityItem | null>(null);
  const [activitiesCache,        setActivitiesCache]        = useState<Record<number, ActivityItem[]>>({});
  const [activitiesLoadingCache, setActivitiesLoadingCache] = useState<Record<number, boolean>>({});

  // ── Reviewed API data ─────────────────────────────────────────────────────
  const [programReviewedData,  setProgramReviewedData]  = useState<any | null>(null);
  const [projectReviewedData,  setProjectReviewedData]  = useState<any | null>(null);
  const [activityReviewedData, setActivityReviewedData] = useState<any | null>(null);
  const [programLoading,       setProgramLoading]       = useState(false);
  const [projectLoading,       setProjectLoading]       = useState(false);
  const [activityLoading,      setActivityLoading]      = useState(false);

  // ── History (per tab) ─────────────────────────────────────────────────────
  const [programHistory,         setProgramHistory]         = useState<History[]>([]);
  const [projectHistory,         setProjectHistory]         = useState<History[]>([]);
  const [activityHistory,        setActivityHistory]        = useState<History[]>([]);
  const [historyLoading,         setHistoryLoading]         = useState(false);
  const [selectedHistoryVersion, setSelectedHistoryVersion] = useState<History | null>(null);

  // ── History snapshot data ─────────────────────────────────────────────────
  const [historySnapshotData,    setHistorySnapshotData]    = useState<any | null>(null);
  const [historySnapshotLoading, setHistorySnapshotLoading] = useState(false);

  // ── Edit state ────────────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);

  // ── Misc ──────────────────────────────────────────────────────────────────
  const [comments, setComments] = useState<Comments>({});

  const [projectDetail,         setProjectDetail]         = useState<any | null>(null);
  const [projectDetailLoading,  setProjectDetailLoading]  = useState(false);
  const [activityDetail,        setActivityDetail]        = useState<any | null>(null);
  const [activityDetailLoading, setActivityDetailLoading] = useState(false);

  const showCommentInputs = selectedHistoryVersion?.status === "current" || !selectedHistoryVersion;

  const statusStyle = proposalData
    ? getStatusStyle(proposalData.status ?? "")
    : { className: "", label: "" };

  const nodeId  = proposalData ? Number(proposalData.proposal_id) : null;
  const childId = proposalData ? Number(proposalData.child_id)    : null;

  const activeHistory: History[] =
    activeTab === "activity" ? activityHistory :
    activeTab === "project"  ? projectHistory  :
    programHistory;

  // ── Mapped form data (memoized to prevent infinite re-render loops) ────────
  const mappedProgram  = React.useMemo(() => mapReviewedToProgram(programReviewedData),   [programReviewedData]);
  const mappedProject  = React.useMemo(() => mapReviewedToProject(projectReviewedData),   [projectReviewedData]);
  const mappedActivity = React.useMemo(() => mapReviewedToActivity(activityReviewedData), [activityReviewedData]);

  // ── Resolved IDs for each PUT endpoint ───────────────────────────────────
  const programChildId    = proposalData?.child_id;
  const programProposalId = nodeId;
  const projectChildId    = selectedProject  ? Number(selectedProject.child_id)    : null;
  const projectProposalId = selectedProject  ? Number(selectedProject.proposal_id) : null;
  const activityChildId   = selectedActivity ? Number(selectedActivity.child_id)   : null;
  const activityProposalId = selectedActivity ? Number(selectedActivity.proposal_id) : null;

  // ── Edit hook ─────────────────────────────────────────────────────────────
  const {
    programDraft,  setProgramDraft,
    projectDraft,  setProjectDraft,
    activityDraft, setActivityDraft,
    isSaving,
    saveError,
    handleSave,
    handleCancel,
  } = useProposalEdit({
    activeTab,
    programChildId,
    programProposalId,
    projectChildId,
    projectProposalId,
    activityChildId,
    activityProposalId,
    mappedProgram,
    mappedProject,
    mappedActivity,
    isEditing,
    onEditingChange: setIsEditing,
  });

  const programTitle = mappedProgram?.program_title ?? proposalData?.title ?? "";

  // ── 1. Program reviewed data + history ────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !nodeId) return;

    setProgramLoading(true);
    setProgramReviewedData(null);
    fetchReviewedProposal(nodeId, "program")
      .then(setProgramReviewedData)
      .catch((err) => { console.error("[ViewReviewed] program fetch failed:", err); setProgramReviewedData(null); })
      .finally(() => setProgramLoading(false));

    setHistoryLoading(true);
    fetchProgramHistoryList(nodeId)
      .then((raw) => {
        const list = normalizeHistoryList(raw);
        setProgramHistory(list);
        const current = list.find((h) => h.status === "current") ?? list[0] ?? null;
        setSelectedHistoryVersion(current);
      })
      .catch((err) => { console.error("[ProgramHistory] fetch failed:", err); setProgramHistory([]); })
      .finally(() => setHistoryLoading(false));
  }, [isOpen, nodeId]);

  // ── 2. Sidebar project list ───────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !childId) return;
    setProjectListLoading(true);
    fetchProjectList(childId)
      .then((data: ApiProjectListResponse) => setProjectList(data.projects || []))
      .catch((err) => console.error("[ProjectList] Failed:", err))
      .finally(() => setProjectListLoading(false));
  }, [isOpen, childId]);

  // ── 3. Project reviewed data + history ───────────────────────────────────
  useEffect(() => {
    if (!selectedProject?.proposal_id) {
      setProjectReviewedData(null);
      setProjectHistory([]);
      return;
    }
    const proposalId = selectedProject.proposal_id;

    setProjectLoading(true);
    setProjectReviewedData(null);
    fetchReviewedProposal(proposalId, "project")
      .then(setProjectReviewedData)
      .catch((err) => { console.error("[ViewReviewed] project fetch failed:", err); setProjectReviewedData(null); })
      .finally(() => setProjectLoading(false));

    setHistoryLoading(true);
    fetchProjectHistoryList(proposalId)
      .then((raw) => {
        const list = normalizeHistoryList(raw);
        setProjectHistory(list);
        const current = list.find((h) => h.status === "current") ?? list[0] ?? null;
        setSelectedHistoryVersion(current);
      })
      .catch((err) => { console.error("[ProjectHistory] fetch failed:", err); setProjectHistory([]); })
      .finally(() => setHistoryLoading(false));
  }, [selectedProject?.proposal_id]);

  // ── 4. Activity reviewed data + history ──────────────────────────────────
  useEffect(() => {
    if (!selectedActivity?.proposal_id) {
      setActivityReviewedData(null);
      setActivityHistory([]);
      return;
    }
    const proposalId = selectedActivity.proposal_id;

    setActivityLoading(true);
    setActivityReviewedData(null);
    fetchReviewedProposal(proposalId, "activity")
      .then(setActivityReviewedData)
      .catch((err) => { console.error("[ViewReviewed] activity fetch failed:", err); setActivityReviewedData(null); })
      .finally(() => setActivityLoading(false));

    setHistoryLoading(true);
    fetchActivityHistoryList(proposalId)
      .then((raw) => {
        const list = normalizeHistoryList(raw);
        setActivityHistory(list);
        const current = list.find((h) => h.status === "current") ?? list[0] ?? null;
        setSelectedHistoryVersion(current);
      })
      .catch((err) => { console.error("[ActivityHistory] fetch failed:", err); setActivityHistory([]); })
      .finally(() => setHistoryLoading(false));
  }, [selectedActivity?.proposal_id]);

  // ── 5. Fetch history snapshot when a version is selected ─────────────────
  // If the selected version is "current", skip the API call entirely —
  // the existing programReviewedData / projectReviewedData / activityReviewedData
  // already holds the current data, so historySnapshotData stays null and
  // the active* derived values fall through to the base reviewed data.
  useEffect(() => {
    if (!selectedHistoryVersion || selectedHistoryVersion.status === "current") {
      setHistorySnapshotData(null);
      return;
    }

    const { history_id, proposal_id, version } = selectedHistoryVersion;

    const resolvedProposalId =
      activeTab === "project"  ? (selectedProject?.proposal_id  ?? proposal_id) :
      activeTab === "activity" ? (selectedActivity?.proposal_id ?? proposal_id) :
      nodeId ?? proposal_id;

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

  }, [selectedHistoryVersion, activeTab, nodeId, selectedProject?.proposal_id, selectedActivity?.proposal_id]);

  // ── Reset on close ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) return;
    setActiveTab("program");
    setSelectedProject(null);
    setSelectedActivity(null);
    setActivitiesCache({});
    setActivitiesLoadingCache({});
    setComments({});
    setSelectedHistoryVersion(null);
    setHistorySnapshotData(null);
    setProgramReviewedData(null);
    setProjectReviewedData(null);
    setActivityReviewedData(null);
    setProjectList([]);
    setProgramHistory([]);
    setProjectHistory([]);
    setActivityHistory([]);
    setIsEditing(false);
  }, [isOpen]);

  // ── Reset edit + history state when navigating between tabs / items ───────
  useEffect(() => {
    const list =
      activeTab === "activity" ? activityHistory :
      activeTab === "project"  ? projectHistory  :
      programHistory;
    const current = list.find((h) => h.status === "current") ?? list[0] ?? null;
    setSelectedHistoryVersion(current);
    setHistorySnapshotData(null);
    setIsEditing(false);
  }, [activeTab, selectedProject?.proposal_id, selectedActivity?.proposal_id]);

  // ── Load activities for a project (with cache) ────────────────────────────
  const loadActivitiesForProject = useCallback(async (project: ProjectItem) => {
    if (activitiesCache[project.child_id] !== undefined) return;
    setActivitiesLoadingCache((prev) => ({ ...prev, [project.child_id]: true }));
    try {
      const data: ApiActivityListResponse = await fetchActivityList(project.child_id);
      setActivitiesCache((prev) => ({ ...prev, [project.child_id]: data.activities || [] }));
    } catch (err) {
      console.error("[ActivityList] Failed:", err);
      setActivitiesCache((prev) => ({ ...prev, [project.child_id]: [] }));
    } finally {
      setActivitiesLoadingCache((prev) => ({ ...prev, [project.child_id]: false }));
    }
  }, [activitiesCache]);

  // ── Select project (project tab) ──────────────────────────────────────────
  const handleSelectProject = useCallback(async (project: ProjectItem) => {
    setSelectedProject(project);
    setSelectedActivity(null);
    setActivityDetail(null);
    setProjectDetail(null);
    setProjectDetailLoading(true);
    try {
      const detail = await fetchReviewedProposal(project.proposal_id, "project");
      setProjectDetail(detail);
    } catch (err) {
      console.error("[ProjectDetail] Failed:", err);
    } finally {
      setProjectDetailLoading(false);
    }
  }, []);

  // ── Expand project in activity tab ────────────────────────────────────────
  const handleExpandProject = useCallback(async (project: ProjectItem) => {
    if (selectedProject?.proposal_id === project.proposal_id) {
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

  // ── Select activity ───────────────────────────────────────────────────────
  const handleSelectActivity = useCallback(async (project: ProjectItem, activity: ActivityItem) => {
    setSelectedProject(project);
    setSelectedActivity(activity);
    setActivityDetail(null);
    setActivityDetailLoading(true);
    try {
      const data = await fetchActivityProposalDetail(activity.proposal_id);
      setActivityDetail(data);
    } catch (err) {
      console.error("[ActivityDetail] Failed:", err);
    } finally {
      setActivityDetailLoading(false);
    }
  }, []);

  // ── Resolved reviewed data: history snapshot takes priority ───────────────
  const activeProgramReviewedData  = historySnapshotData ?? programReviewedData;
  const activeProjectReviewedData  = historySnapshotData ?? projectReviewedData;
  const activeActivityReviewedData = historySnapshotData ?? activityReviewedData;

  // ── Resolved mapped data when a history snapshot is active ────────────────
  const activeMappedProgram  = historySnapshotData ? mapReviewedToProgram(historySnapshotData)  : mappedProgram;
  const activeMappedProject  = historySnapshotData ? mapReviewedToProject(historySnapshotData)  : mappedProject;
  const activeMappedActivity = historySnapshotData ? mapReviewedToActivity(historySnapshotData) : mappedActivity;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const goToProjectTab = () => {
    setActiveTab("project");
    setComments({});
    if (!selectedProject && projectList.length > 0) handleSelectProject(projectList[0]);
  };

  const goToActivityTab = () => {
    setActiveTab("activity");
    setComments({});
    setSelectedActivity(null);
    setActivityReviewedData(null);
  };

  const handleCommentChange = (key: string, val: string) =>
    setComments((prev) => ({ ...prev, [key]: val }));

  // ── ALL HOOKS ARE DONE — early return is now safe ─────────────────────────
  if (!isOpen || !proposalData) return null;

  const showProjectSidebar = activeTab === "project" || activeTab === "activity";

  const commentProps = { comments, onCommentChange: handleCommentChange };
  const reviewProps  = { alreadyReviewed: false, showCommentInputs };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-white flex-1 h-[100vh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-10 py-6 bg-primaryGreen border-b border-white/10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold text-[11px] tracking-[0.15em] uppercase text-white/70">
                Review Proposal
              </span>
              <ChevronRight size={13} className="text-white/40" />
              <span className={`inline-flex items-center px-4 py-[4px] rounded-full text-[12px] uppercase font-semibold border border-white/20 shadow-sm ${statusStyle.className}`}>
                {statusStyle.label}
              </span>
            </div>
            <h1 className="font-bold text-[22px] text-white leading-snug truncate pr-10 drop-shadow-sm text-wrap">
              {proposalData.title}
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mr-6 bg-white/10 p-1.5 rounded-xl border border-white/15">
            {(["program", "project", "activity"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === "project")       goToProjectTab();
                  else if (tab === "activity") goToActivityTab();
                  else { setActiveTab("program"); setComments({}); }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${
                  activeTab === tab ? "bg-white text-primaryGreen shadow-md" : "text-white hover:bg-white/20"
                }`}
              >
                {tab === "program"  && <FileText  size={15} />}
                {tab === "project"  && <FolderOpen size={15} />}
                {tab === "activity" && <Activity  size={15} />}
                {tab}
                {tab === "project" && projectList.length > 0 && (
                  <span className={`ml-1 text-[10px] px-2 py-[2px] rounded-full font-bold ${
                    activeTab === "project" ? "bg-primaryGreen text-white" : "bg-white/30 text-white"
                  }`}>
                    {projectList.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/90 text-gray-600 shadow-sm border border-white/40
                      hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
          >
            <X size={17} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar */}
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

          {/* Document content */}
          <div className="flex-1 overflow-y-auto relative bg-white">
            {/* History snapshot loading overlay */}
            {historySnapshotLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-3">
                <div className="w-7 h-7 border-[3px] border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-sm text-gray-500 font-medium">Loading version…</p>
              </div>
            )}
            <div className="p-5">

              {/* ── Save error banner ── */}
              {saveError && (
                <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <span className="font-medium">{saveError}</span>
                </div>
              )}

              {/* ── PROGRAM TAB ── */}
              {activeTab === "program" && (
                programLoading ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8">
                    <FormSkeleton lines={6} />
                  </div>
                ) : activeMappedProgram ? (
                  <div className="flex flex-col items-end justify-center relative">
                    <ProgramForm
                      proposalData={activeMappedProgram}
                      draft={programDraft}
                      onDraftChange={setProgramDraft}
                      isEditing={isEditing && (!selectedHistoryVersion || selectedHistoryVersion.status === "current")}
                      reviewedData={activeProgramReviewedData}
                      {...commentProps}
                      {...reviewProps}
                    />
                    <EditSaveButton
                      isEditing={isEditing}
                      isSaving={isSaving}
                      canEdit={!selectedHistoryVersion || selectedHistoryVersion.status === "current"}
                      isDocumentReady={!!activeMappedProgram}
                      onEdit={() => setIsEditing(true)}
                      onSave={handleSave}
                      onCancel={handleCancel}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                    <FileText size={40} className="text-gray-300" />
                    <p className="font-medium">No program data available</p>
                  </div>
                )
              )}

              {/* ── PROJECT TAB ── */}
              {activeTab === "project" && (
                !selectedProject ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                    <FolderOpen size={40} className="text-gray-300" />
                    <p className="font-medium">Select a project from the sidebar</p>
                  </div>
                ) : projectLoading ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8">
                    <FormSkeleton lines={6} />
                  </div>
                ) : activeMappedProject ? (
                  <div className="flex flex-col items-end justify-center relative">
                    <ProjectForm
                      projectData={activeMappedProject}
                      programTitle={programTitle}
                      draft={projectDraft}
                      onDraftChange={setProjectDraft}
                      isEditing={isEditing && (!selectedHistoryVersion || selectedHistoryVersion.status === "current")}
                      reviewedData={activeProjectReviewedData}
                      {...commentProps}
                      {...reviewProps}
                    />
                    <EditSaveButton
                      isEditing={isEditing}
                      isSaving={isSaving}
                      canEdit={!selectedHistoryVersion || selectedHistoryVersion.status === "current"}
                      isDocumentReady={!!activeMappedProject}
                      onEdit={() => setIsEditing(true)}
                      onSave={handleSave}
                      onCancel={handleCancel}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                    <FolderOpen size={40} className="text-gray-300" />
                    <p className="font-medium">No project review data available</p>
                  </div>
                )
              )}

              {/* ── ACTIVITY TAB ── */}
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
                    <p className="text-sm text-gray-400">{selectedProject.project_title}</p>
                  </div>
                ) : activityLoading ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8">
                    <FormSkeleton lines={6} />
                  </div>
                ) : activeMappedActivity ? (
                  <div className="flex flex-col items-end justify-center relative">
                    <ActivityForm
                      activityData={activeMappedActivity}
                      programTitle={programTitle}
                      projectTitle={selectedProject.project_title}
                      draft={activityDraft}
                      onDraftChange={setActivityDraft}
                      isEditing={isEditing && (!selectedHistoryVersion || selectedHistoryVersion.status === "current")}
                      reviewedData={activeActivityReviewedData}
                      {...commentProps}
                      {...reviewProps}
                    />
                    <EditSaveButton
                      isEditing={isEditing}
                      isSaving={isSaving}
                      canEdit={!selectedHistoryVersion || selectedHistoryVersion.status === "current"}
                      isDocumentReady={!!activeMappedActivity}
                      onEdit={() => setIsEditing(true)}
                      onSave={handleSave}
                      onCancel={handleCancel}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                    <Activity size={40} className="text-gray-300" />
                    <p className="font-medium">No activity review data available</p>
                  </div>
                )
              )}

            </div>
          </div>

          {/* ── History panel ── */}
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
                    ? new Date(item.created_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })
                    : "";

                  return (
                    <div
                      key={item.history_id}
                      onClick={() => {
                        if (isSelected) {
                          // Deselecting: snap back to current version
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
                        <div
                          className={`w-2 h-2 rounded-full mt-1 shrink-0 transition-colors duration-150 ${
                            isCurrent
                              ? "bg-emerald-500 ring-2 ring-emerald-200"
                              : isSelected
                              ? "bg-emerald-400"
                              : "bg-gray-300 group-hover:bg-gray-400"
                          }`}
                        />
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
                        <p className={`text-[10px] mt-0.5 ${isSelected ? "text-emerald-600/70" : "text-gray-400"}`}>
                           Title: <span>{item.program_title || item.project_title || item.activity_title}</span>
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

            {/* Footer — shown when a version is selected */}
            {/* {selectedHistoryVersion && (
              <div className="px-4 py-3 border-t border-gray-100">
                <button
                  onClick={() => {
                    const current = activeHistory.find((h) => h.status === "current") ?? null;
                    setSelectedHistoryVersion(current);
                  }}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors text-center"
                >
                  Clear selection
                </button>
              </div>
            )} */}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewReviewedDocuments;