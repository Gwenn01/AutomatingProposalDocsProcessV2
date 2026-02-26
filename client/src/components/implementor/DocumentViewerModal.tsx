import React, { useEffect, useState, useCallback } from "react";
import { ChevronRight, X, FileText, FolderOpen, Activity } from "lucide-react";
import { getStatusStyle } from "../../utils/statusStyles";
import {
  fetchProjectList,
  fetchActivityList,
  fetchProgramProposalDetail,
  fetchProjectProposalDetail,
  fetchActivityProposalDetail,
  type ApiProjectListResponse,
  type ApiActivityListResponse,
  type ApiProject,
  type ApiActivity,
} from "@/utils/implementor-api";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import { ProjectTreeNode } from "../view-review/project-tree-node";
import { ProgramFormDocument } from "../view-document/program-form";
import { ProjectFormDocument } from "../view-document/project-form";
import { ActivityFormDocument } from "../view-document/activity-form";
import { val } from "@/constants";

// ================= TYPE DEFINITIONS =================

interface MethodologyPhase {
  phase: string;
  activities: string[];
}

export interface OrgStaffingItem {
  name: string;
  role: string;
}

interface WorkplanItem {
  month: string;
  activity: string;
}

interface BudgetItem {
  item: string;
  amount: number | string;
}

interface ApiProposalDetail {
  id: number;
  proposal: number;
  program_title: string;
  program_leader: string;
  projects_list: any[];
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

// Re-export for local use with clearer names
type ProjectItem = ApiProject;
type ActivityItem = ApiActivity;

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalData: ApiProposalDetail | null;
  proposalStatus: string;
  proposalTitle: string;
}

// ================= HELPERS =================



type TabType = "program" | "project" | "activity";

// ================= SHARED PROFILE FIELDS (Project & Activity) =================

const CheckboxList = ({ items, checked }: { items: string[]; checked: (item: string) => boolean }) => (
  <div className="space-y-1">
    {items.map((label) => (
      <div key={label} className="flex items-start gap-2 py-0.5">
        <span className="mt-0.5 text-sm shrink-0">{checked(label) ? "☑" : "☐"}</span>
        <span className="text-sm">{label}</span>
      </div>
    ))}
  </div>
);





// ================= MAIN MODAL =================

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen, onClose, proposalData, proposalStatus, proposalTitle,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("program");

  // Project list
  const [projectList, setProjectList] = useState<ProjectItem[]>([]);
  const [projectListLoading, setProjectListLoading] = useState(false);

  // Selected project & its detail
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [projectDetail, setProjectDetail] = useState<any | null>(null);
  const [projectDetailLoading, setProjectDetailLoading] = useState(false);

  // Per-project activity cache
  const [activitiesCache, setActivitiesCache] = useState<Record<number, ActivityItem[]>>({});
  const [activitiesLoadingCache, setActivitiesLoadingCache] = useState<Record<number, boolean>>({});

  // Selected activity & its detail
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [activityDetail, setActivityDetail] = useState<any | null>(null);
  const [activityDetailLoading, setActivityDetailLoading] = useState(false);

  const statusStyle = getStatusStyle(proposalStatus);
  const childId = proposalData?.id;

  // ── Fetch project list when modal opens ──
  useEffect(() => {
    if (!isOpen || !childId) return;
    const load = async () => {
      setProjectListLoading(true);
      try {
        const data: ApiProjectListResponse = await fetchProjectList(childId);
        setProjectList(data.projects || []);
      } catch (err) {
        console.error("[ProjectList] Failed:", err);
      } finally {
        setProjectListLoading(false);
      }
    };
    load();
  }, [isOpen, childId]);

  // ── Reset state when modal closes ──
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("program");
      setSelectedProject(null);
      setProjectDetail(null);
      setActivitiesCache({});
      setActivitiesLoadingCache({});
      setSelectedActivity(null);
      setActivityDetail(null);
    }
  }, [isOpen]);

  // ── Load activities for a project (with cache) ──
  const loadActivitiesForProject = useCallback(async (project: ProjectItem) => {
    if (activitiesCache[project.id] !== undefined) return; // already cached
    setActivitiesLoadingCache((prev) => ({ ...prev, [project.id]: true }));
    try {
      const data: ApiActivityListResponse = await fetchActivityList(project.id);
      setActivitiesCache((prev) => ({ ...prev, [project.id]: data.activities || [] }));
    } catch (err) {
      console.error("[ActivityList] Failed:", err);
      setActivitiesCache((prev) => ({ ...prev, [project.id]: [] }));
    } finally {
      setActivitiesLoadingCache((prev) => ({ ...prev, [project.id]: false }));
    }
  }, [activitiesCache]);

  // ── Select project (project tab) ──
  const handleSelectProject = useCallback(async (project: ProjectItem) => {
    setSelectedProject(project);
    setSelectedActivity(null);
    setActivityDetail(null);
    setProjectDetail(null);
    setProjectDetailLoading(true);
    try {
      const detail = await fetchProjectProposalDetail(project.id);
      setProjectDetail(detail);
    } catch (err) {
      console.error("[ProjectDetail] Failed:", err);
    } finally {
      setProjectDetailLoading(false);
    }
  }, []);

  // ── Expand project in activity tab (toggle + load activities) ──
  const handleExpandProject = useCallback(async (project: ProjectItem) => {
    if (selectedProject?.id === project.id) {
      // Collapse
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

  // ── Select activity ──
  const handleSelectActivity = useCallback(async (project: ProjectItem, activity: ActivityItem) => {
    setSelectedProject(project);
    setSelectedActivity(activity);
    setActivityDetail(null);
    setActivityDetailLoading(true);
    try {
      const data = await fetchActivityProposalDetail(activity.id);
      setActivityDetail(data);
    } catch (err) {
      console.error("[ActivityDetail] Failed:", err);
    } finally {
      setActivityDetailLoading(false);
    }
  }, []);

  const goToProjectTab = () => {
    setActiveTab("project");
    if (!selectedProject && projectList.length > 0) handleSelectProject(projectList[0]);
  };

  const goToActivityTab = () => {
    setActiveTab("activity");
    setSelectedActivity(null);
    setActivityDetail(null);
  };

  if (!isOpen || !proposalData) return null;

  const showProjectSidebar = activeTab === "project" || activeTab === "activity";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md animate-overlay-enter">
      <div className="bg-white w-full h-[100vh] flex flex-col overflow-hidden animate-modal-enter">

        {/* ── Header ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-10 py-7 bg-primaryGreen border-b border-white/10 relative">

          {/* Left Section */}
          <div className="flex-1 min-w-0">
            
            {/* Breadcrumb + Status */}
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold text-[11px] tracking-[0.15em] uppercase text-white/70">
                Extension Proposal
              </span>

              <ChevronRight size={13} className="text-white/40" />

              <span
                className={`inline-flex items-center px-4 py-[4px] rounded-full text-[12px] uppercase font-semibold backdrop-blur-md border border-white/20 shadow-sm ${statusStyle.className}`}
              >
                {statusStyle.label}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-bold text-[22px] text-white leading-snug truncate pr-10 drop-shadow-sm text-wrap">
              {proposalTitle || val(proposalData.program_title)}
            </h1>
          </div>


          {/* Tabs */}
          <div className="flex items-center gap-2 mr-6 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/15 shadow-inner">

            {/* Program Tab */}
            <button
              onClick={() => setActiveTab("program")}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${
                  activeTab === "program"
                    ? "bg-white text-primaryGreen shadow-md"
                    : "text-white hover:bg-white/20"
                }`}
            >
              <FileText size={15} className="opacity-80 group-hover:opacity-100" />
              Program
            </button>


            {/* Project Tab */}
            <button
              onClick={goToProjectTab}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${
                  activeTab === "project"
                    ? "bg-white text-primaryGreen shadow-md"
                    : "text-white hover:bg-white/20"
                }`}
            >
              <FolderOpen size={15} className="opacity-80 group-hover:opacity-100" />
              Project

              {projectList.length > 0 && (
                <span
                  className={`ml-1 text-[10px] px-2 py-[2px] rounded-full font-bold transition-all
                  ${
                    activeTab === "project"
                      ? "bg-primaryGreen text-white"
                      : "bg-white/30 text-white"
                  }`}
                >
                  {projectList.length}
                </span>
              )}
            </button>


            {/* Activity Tab */}
            <button
              onClick={goToActivityTab}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${
                  activeTab === "activity"
                    ? "bg-white text-primaryGreen shadow-md"
                    : "text-white hover:bg-white/20"
                }`}
            >
              <Activity size={15} className="opacity-80 group-hover:opacity-100" />
              Activity
            </button>

          </div>


          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/90 text-gray-600 shadow-sm border border-white/40
                      hover:bg-red-50 hover:text-red-600 hover:border-red-200
                      transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <X size={17} />
          </button>

        </div>

        {/* ── Body: Sidebar + Content ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Sidebar ── */}
          {showProjectSidebar && (
            <div className="w-72 flex-shrink-0 bg-gray-50/80 backdrop-blur-sm border-r border-gray-200 flex flex-col overflow-hidden">

              {/* Header */}
              <div className="sticky top-0 z-10 px-5 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center gap-2">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-primaryGreen/10">
                  <FolderOpen size={14} className="text-primaryGreen" />
                </div>

                <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">
                  {activeTab === "project" ? "Projects" : "Projects & Activities"}
                </span>
              </div>


              {/* Content */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                {projectListLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-primaryGreen rounded-full animate-spin"></div>
                    <p className="text-xs text-gray-400">Loading projects...</p>
                  </div>

                ) : projectList.length === 0 ? (

                  <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                      <FolderOpen size={18} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">No projects yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Projects will appear here once created.
                    </p>
                  </div>

                ) : (

                  projectList.map((proj) => (
                    <div
                      key={proj.id}
                      className="group rounded-xl transition-all duration-200 hover:bg-white hover:shadow-sm"
                    >
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

          {/* ── Main Content Area ── */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-10">

              {/* PROGRAM TAB */}
              {activeTab === "program" && (
                <ProgramFormDocument proposalData={proposalData} />
              )}

              {/* PROJECT TAB */}
              {activeTab === "project" && (
                <>
                  {!selectedProject ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                      <FolderOpen size={40} className="text-gray-300" />
                      <p className="font-medium">Select a project from the sidebar</p>
                    </div>
                  ) : projectDetailLoading ? (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <FormSkeleton lines={6} />
                      </div>
                  ) : (
                    <ProjectFormDocument
                      projectData={projectDetail || selectedProject}
                      programTitle={proposalData.program_title}
                    />
                  )}
                </>
              )}

              {/* ACTIVITY TAB */}
              {activeTab === "activity" && (
                <>
                  {!selectedProject ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                      <FolderOpen size={40} className="text-gray-300" />
                      <p className="font-medium">Select a project to expand its activities</p>
                    </div>
                  ) : !selectedActivity ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] w-full text-gray-500 gap-3">
                        <Activity size={40} className="text-gray-300" />
                        <p className="font-medium">Select an activity from the sidebar</p>
                        <p className="text-sm text-gray-400">{selectedProject.project_title}</p>
                    </div>
                  ) : activityDetailLoading ? (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <FormSkeleton lines={6} />
                      </div>
                  ) : (
                    <ActivityFormDocument
                      activityData={activityDetail || selectedActivity}
                      programTitle={proposalData.program_title}
                      projectTitle={selectedProject.project_title}
                    />
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;