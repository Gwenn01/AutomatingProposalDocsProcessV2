// view-reviewed-document.tsx
import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, FileText, FolderOpen, Activity } from "lucide-react";
import { getStatusStyle } from "@/utils/statusStyles";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import {
  fetchProjectList,
  type ApiProjectListResponse,
  type ApiActivity,
} from "@/utils/reviewer-api";
import {
  fetchActivityList,
  fetchActivityProposalDetail,
  fetchReviewedProposal,
  fetchProgramHistoryList,
  fetchProjectHistoryList,
  fetchActivityHistoryList,
  type ApiActivityListResponse,
} from "@/utils/implementor-api";
import { useAuth } from "@/context/auth-context";
import { ActivityForm } from "./view-review-forms/activity-form";
import { ProjectForm } from "./view-review-forms/project-form";
import { ProgramForm } from "./view-review-forms/program-form";
import { ProjectTreeNode } from "./view-review-forms/project-tree-node";
import EditSaveButton from "./EditSaveButton";
import { useProposalEdit } from "@/hooks/useProposalEdit";

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
  history_id: string;
  proposal_id: string;
  status: string;
  version_no: number;
  created_at: string;
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
    version_no:  item.version ?? item.version_no ?? 0,
    created_at:  item.created_at ?? "",
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

  // ── Edit state ────────────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);

  // ── Misc ──────────────────────────────────────────────────────────────────
  const [comments, setComments] = useState<Comments>({});

  const [projectDetail,         setProjectDetail]         = useState<any | null>(null);
  const [projectDetailLoading,  setProjectDetailLoading]  = useState(false);
  const [activityDetail,        setActivityDetail]        = useState<any | null>(null);
  const [activityDetailLoading, setActivityDetailLoading] = useState(false);

  const showCommentInputs =
    !selectedHistoryVersion || selectedHistoryVersion.status === "current";

  const statusStyle = proposalData
    ? getStatusStyle(proposalData.status ?? "")
    : { className: "", label: "" };

  const nodeId  = proposalData ? Number(proposalData.proposal_id) : null;
  const childId = proposalData ? Number(proposalData.child_id)    : null;

  const activeHistory: History[] =
    activeTab === "activity" ? activityHistory :
    activeTab === "project"  ? projectHistory  :
    programHistory;

  // ── Mapped form data (memoized to prevent infinite re-render loops) ─────────
  // Without useMemo, mapReviewedTo* creates new object references every render,
  // which causes the useEffect deps in useProposalEdit to fire endlessly.
  const mappedProgram  = React.useMemo(() => mapReviewedToProgram(programReviewedData),  [programReviewedData]);
  const mappedProject  = React.useMemo(() => mapReviewedToProject(projectReviewedData),  [projectReviewedData]);
  const mappedActivity = React.useMemo(() => mapReviewedToActivity(activityReviewedData), [activityReviewedData]);

  // ── Resolved IDs for each PUT endpoint ──────────────────────────────────
  // Program  → nodeId (proposal_id)             → PUT /program-proposal/{nodeId}/
  //            payload: proposal = nodeId
  // Project  → selectedProject.child_id         → PUT /project-proposal/{child_id}/update-project-save-history/
  //            payload: proposal = selectedProject.proposal_id
  // Activity → selectedActivity.child_id        → PUT /activity-proposal/{child_id}/update-activity-save-history/
  //            payload: proposal = selectedActivity.proposal_id
  const programChildId   = proposalData?.child_id;  
  const programProposalId = nodeId;                                                           // payload proposal field
  const projectChildId   = selectedProject  ? Number(selectedProject.child_id)   : null;     // URL id for project
  const projectProposalId = selectedProject ? Number(selectedProject.proposal_id) : null;     // payload proposal field
  const activityChildId  = selectedActivity ? Number(selectedActivity.child_id)  : null;     // URL id for activity
  const activityProposalId = selectedActivity ? Number(selectedActivity.proposal_id) : null; // payload proposal field

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
      .then((raw) => setProgramHistory(normalizeHistoryList(raw)))
      .catch((err) => { console.error("[ProgramHistory] fetch failed:", err); setProgramHistory([]); })
      .finally(() => setHistoryLoading(false));
  }, [isOpen, nodeId]);

  // ── 2. Sidebar project list ────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !childId) return;
    setProjectListLoading(true);
    fetchProjectList(childId)
      .then((data: ApiProjectListResponse) => setProjectList(data.projects || []))
      .catch((err) => console.error("[ProjectList] Failed:", err))
      .finally(() => setProjectListLoading(false));
  }, [isOpen, childId]);

  // ── 3. Project reviewed data + history ────────────────────────────────────
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
      .then((raw) => setProjectHistory(normalizeHistoryList(raw)))
      .catch((err) => { console.error("[ProjectHistory] fetch failed:", err); setProjectHistory([]); })
      .finally(() => setHistoryLoading(false));
  }, [selectedProject?.proposal_id]);

  // ── 4. Activity reviewed data + history ───────────────────────────────────
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
      .then((raw) => setActivityHistory(normalizeHistoryList(raw)))
      .catch((err) => { console.error("[ActivityHistory] fetch failed:", err); setActivityHistory([]); })
      .finally(() => setHistoryLoading(false));
  }, [selectedActivity?.proposal_id]);

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
    setProgramReviewedData(null);
    setProjectReviewedData(null);
    setActivityReviewedData(null);
    setProjectList([]);
    setProgramHistory([]);
    setProjectHistory([]);
    setActivityHistory([]);
    setIsEditing(false);
  }, [isOpen]);

  // ── Reset edit state when navigating between tabs / items ─────────────────
  useEffect(() => {
    setSelectedHistoryVersion(null);
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

  if (!isOpen || !proposalData) return null;

  const showProjectSidebar = activeTab === "project" || activeTab === "activity";

  // Shared props passed to every form
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
                ) : mappedProgram ? (
                  <div className="flex flex-col items-end justify-center relative">
                    <ProgramForm
                      proposalData={mappedProgram}
                      draft={programDraft}
                      onDraftChange={setProgramDraft}
                      isEditing={isEditing}
                      reviewedData={programReviewedData}
                      {...commentProps}
                      {...reviewProps}
                    />
                    <EditSaveButton
                      isEditing={isEditing}
                      isSaving={isSaving}
                      canEdit={true}
                      isDocumentReady={!!mappedProgram}
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
                ) : mappedProject ? (
                  <div className="flex flex-col items-end justify-center relative">
                    <ProjectForm
                      projectData={mappedProject}
                      programTitle={programTitle}
                      draft={projectDraft}
                      onDraftChange={setProjectDraft}
                      isEditing={isEditing}
                      reviewedData={projectReviewedData}
                      {...commentProps}
                      {...reviewProps}
                    />
                    <EditSaveButton
                      isEditing={isEditing}
                      isSaving={isSaving}
                      canEdit={true}
                      isDocumentReady={!!mappedProject}
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
                ) : mappedActivity ? (
                  <div className="flex flex-col items-end justify-center relative">
                    <ActivityForm
                      activityData={mappedActivity}
                      programTitle={programTitle}
                      projectTitle={selectedProject.project_title}
                      draft={activityDraft}
                      onDraftChange={setActivityDraft}
                      isEditing={isEditing}
                      reviewedData={activityReviewedData}
                      {...commentProps}
                      {...reviewProps}
                    />
                    <EditSaveButton
                      isEditing={isEditing}
                      isSaving={isSaving}
                      canEdit={true}
                      isDocumentReady={!!mappedActivity}
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
          <div className="bg-white h-full w-72 flex-shrink-0 shadow-sm border-l border-gray-200 flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">History</h2>
              <p className="text-xs text-gray-400 mt-1">Recent changes of proposal</p>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {historyLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-6 h-6 border-2 border-gray-200 border-t-primaryGreen rounded-full animate-spin" />
                  <p className="text-xs text-gray-400">Loading history...</p>
                </div>
              ) : activeHistory.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">No history available</p>
              ) : (
                <div className="space-y-2">
                  {activeHistory.map((item) => {
                    const isSelected = selectedHistoryVersion?.history_id === item.history_id;
                    return (
                      <div
                        key={item.history_id}
                        onClick={() => setSelectedHistoryVersion(isSelected ? null : item)}
                        className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition ${
                          isSelected
                            ? "bg-emerald-100 border-2 border-emerald-500"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-semibold">
                          V{item.version_no}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 font-medium">
                            {item.status === "current" ? "Current Proposal" : `Revision ${item.version_no}`}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(item.created_at).toLocaleDateString("en-US", {
                              year: "numeric", month: "short", day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewReviewedDocuments;