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
import CommentInput from "@/components/reviewer/CommentInput";
import PreviousComment from "@/components/reviewer/PreviousComment";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import { useToast } from "@/context/toast";
import {
  fetchProjectList,
  fetchActivityList,
  fetchProjectProposalDetail,
  fetchActivityProposalDetail,
  type ApiProjectListResponse,
  type ApiActivityListResponse,
  type ApiProject,
  type ApiActivity,
} from "@/utils/reviewer-api";
import { ActivityForm } from "../view-review/activity-form";
import { ProjectForm } from "../view-review/project-form";
import { ProgramForm } from "../view-review/program-form";
import { ProjectTreeNode } from "../view-review/project-tree-node";
// ================= TYPES =================


interface History {
  history_id: string;
  proposal_id: string;
  status: string;
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

type ProjectItem = ApiProject;
type ActivityItem = ApiActivity;
type TabType = "program" | "project" | "activity";

export interface Comments {
  [key: string]: string;
}

interface ReviewerCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalData: any | null;           // Shallow proposal from ReviewProposal (has child_id, title, status)
  proposalDetail: ApiProposalDetail | null; // Full detail already fetched
  reviewe?: string;
  review_id?: string;
}


// ================= MAIN MODAL =================

const ReviewerCommentModal: React.FC<ReviewerCommentModalProps> = ({
  isOpen, onClose, proposalData, proposalDetail, reviewe, review_id,
}) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabType>("program");

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

  const [comments, setComments] = useState<Comments>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [decision, setDecision] = useState<"needs_revision" | "approved">("needs_revision");
  const [reviewRound, setReviewRound] = useState<string>("1");
  const [user, setUser] = useState<{ user_id: string; fullname: string } | null>(null);

  const [history, setHistory] = useState<History[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistoryVersion, setSelectedHistoryVersion] = useState<History | null>(null);

  // ── FIX: derive childId from proposalDetail.id OR proposalData.child_id ──
  const childId = proposalDetail?.id ?? proposalData?.child_id;

  const statusStyle = proposalData ? getStatusStyle(proposalData.status ?? "") : { className: "", label: "" };
  const showCommentInputs = !selectedHistoryVersion || selectedHistoryVersion.status === "current";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // ── Fetch project list when modal opens ──────────────────────────────────
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

  // ── Fetch history when modal opens ───────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !proposalData?.proposal_id) return;
    const load = async () => {
      setHistoryLoading(true);
      try {
        setHistory([]);
      } catch (err) {
        console.error("[History] Failed:", err);
      } finally {
        setHistoryLoading(false);
      }
    };
    load();
  }, [isOpen, proposalData?.proposal_id]);

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
      setReviewRound("1");
      setHistory([]);
      setSelectedHistoryVersion(null);
    }
  }, [isOpen]);

  // ── Activity loading ──────────────────────────────────────────────────────
  const loadActivitiesForProject = useCallback(async (project: ProjectItem) => {
    if (activitiesCache[project.id] !== undefined) return;
    setActivitiesLoadingCache((prev) => ({ ...prev, [project.id]: true }));
    try {
      const data: ApiActivityListResponse = await fetchActivityList(project.id);
      setActivitiesCache((prev) => ({ ...prev, [project.id]: data.activities || [] }));
    } catch (err) {
      setActivitiesCache((prev) => ({ ...prev, [project.id]: [] }));
    } finally {
      setActivitiesLoadingCache((prev) => ({ ...prev, [project.id]: false }));
    }
  }, [activitiesCache]);

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

  const handleExpandProject = useCallback(async (project: ProjectItem) => {
    if (selectedProject?.id === project.id) {
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

  const handleCommentChange = (inputValue: string, commentValue: string) => {
    setComments((prev) => ({ ...prev, [inputValue]: commentValue }));
  };

  const hasAnyComment = Object.values(comments).some((c) => c && c.trim() !== "");

  // ── Derive proposal_type from active tab ──────────────────────────────────
  const getProposalType = (): "Program" | "Project" | "Activity" => {
    if (activeTab === "project") return "Project";
    if (activeTab === "activity") return "Activity";
    return "Program";
  };

  // ── Build the node ID for the currently-viewed proposal ──────────────────
  // Program  → proposalDetail.proposal  (the proposal FK on the program node)
  // Project  → projectDetail?.proposal  or selectedProject?.id
  // Activity → activityDetail?.proposal or selectedActivity?.id
  const getProposalNode = (): number | null => {
    if (activeTab === "project") return projectDetail?.proposal ?? selectedProject?.id ?? null;
    if (activeTab === "activity") return activityDetail?.proposal ?? selectedActivity?.id ?? null;
    return proposalDetail?.proposal ?? null;
  };

  // ── Build submit payload matching the API contract ────────────────────────
  const buildPayload = (overrideDecision?: "needs_revision" | "approved") => {
    const proposalType = getProposalType();
    const proposalNode = getProposalNode();

    const base = {
      proposal_reviewer: user?.user_id ? Number(user.user_id) : undefined,
      proposal_node: proposalNode,
      decision: overrideDecision ?? decision,
      review_round: reviewRound,
      proposal_type: proposalType,
    };

    if (proposalType === "Program") {
      return {
        ...base,
        profile_feedback:                  comments["profile_feedback"]                  || "",
        implementing_agency_feedback:      comments["implementing_agency_feedback"]      || "",
        extension_site_feedback:           comments["extension_site_feedback"]           || "",
        tagging_cluster_extension_feedback:comments["tagging_cluster_extension_feedback"]|| "",
        sdg_academic_program_feedback:     comments["sdg_academic_program_feedback"]     || "",
        rationale_feedback:                comments["rationale_feedback"]                || "",
        significance_feedback:             comments["significance_feedback"]             || "",
        objectives_feedback:               comments["objectives_feedback"]               || "",
        general_objectives_feedback:       comments["general_objectives_feedback"]       || "",
        specific_objectives_feedback:      comments["specific_objectives_feedback"]      || "",
        methodology_feedback:              comments["methodology_feedback"]              || "",
        expected_output_feedback:          comments["expected_output_feedback"]          || "",
        sustainability_plan_feedback:      comments["sustainability_feedback"]           || "",
        org_staffing_feedback:             comments["org_staffing_feedback"]             || "",
        work_plan_feedback:                comments["work_plan_feedback"]                || "",
        budget_requirements_feedback:      comments["budget_feedback"]                   || "",
      };
    }

    if (proposalType === "Project") {
      return {
        ...base,
        profile_feedback:                  comments["proj_profile_feedback"]                  || "",
        implementing_agency_feedback:      comments["proj_implementing_agency_feedback"]      || "",
        extension_site_feedback:           comments["proj_extension_site_feedback"]           || "",
        tagging_cluster_extension_feedback:comments["proj_tagging_cluster_extension_feedback"]|| "",
        sdg_academic_program_feedback:     comments["proj_sdg_academic_program_feedback"]     || "",
        rationale_feedback:                comments["proj_rationale_feedback"]                || "",
        significance_feedback:             comments["proj_significance_feedback"]             || "",
        objectives_feedback:               comments["proj_objectives_feedback"]               || "",
        general_objectives_feedback:       comments["proj_general_objectives_feedback"]       || "",
        specific_objectives_feedback:      comments["proj_specific_objectives_feedback"]      || "",
        methodology_feedback:              comments["proj_methodology_feedback"]              || "",
        expected_output_feedback:          comments["proj_expected_output_feedback"]          || "",
        sustainability_plan_feedback:      comments["proj_sustainability_feedback"]           || "",
        org_staffing_feedback:             comments["proj_org_staffing_feedback"]             || "",
        work_plan_feedback:                comments["proj_work_plan_feedback"]                || "",
        budget_requirements_feedback:      comments["proj_budget_feedback"]                   || "",
      };
    }

    // Activity
    return {
      ...base,
      implementing_agency_feedback:      comments["act_implementing_agency_feedback"]        || "",
      extension_site_feedback:           comments["act_extension_site_feedback"]             || "",
      tagging_cluster_extension_feedback:comments["act_tagging_cluster_extension_feedback"]  || "",
      sdg_academic_program_feedback:     comments["act_sdg_academic_program_feedback"]       || "",
      rationale_feedback:                comments["act_rationale_feedback"]                  || "",
      objectives_feedback:               comments["act_objectives_feedback"]                 || "",
      methodology_feedback:              comments["act_methodology_feedback"]                || "",
      expected_output_feedback:          comments["act_expected_output_feedback"]            || "",
      plan_of_activities:                comments["act_plan_of_activities"]                  || "",
      budget_requirements_feedback:      comments["act_budget_feedback"]                     || "",
    };
  };
  

  const handleSubmitReview = async () => {
    const proposalNode = getProposalNode();
    if (!proposalNode) {
      showToast("Could not determine proposal node. Please try again.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = buildPayload("needs_revision");
      console.log("[Submit Review] Payload:", payload);
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
    if (!proposalNode) {
      showToast("Could not determine proposal node. Please try again.", "error");
      return;
    }
    setIsApproving(true);
    try {
      const payload = buildPayload("approved");
      console.log("[Approve] Payload:", payload);
      showToast("Proposal approved successfully!", "success");
      onClose();
    } catch (err: any) {
      showToast(err?.message ?? "Failed to approve proposal.", "error");
    } finally {
      setIsApproving(false);
    }
  };

  if (!isOpen || !proposalData) return null;

  // ── FIX: show loading skeleton if proposalDetail hasn't arrived yet ──
  const isProgramDetailReady = !!proposalDetail;

  const showProjectSidebar = activeTab === "project" || activeTab === "activity";

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md animate-overlay-enter">
        <div className="bg-white flex-1 h-[100vh] flex flex-col overflow-hidden animate-modal-enter">

          {/* ── Header ── */}
          <div className="flex-shrink-0 flex items-center justify-between px-10 py-6 bg-primaryGreen border-b border-white/10 relative">

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-[11px] tracking-[0.15em] uppercase text-white/70">
                  Review Proposal
                </span>
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
              <button
                onClick={() => setActiveTab("program")}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "program" ? "bg-white text-primaryGreen shadow-md" : "text-white hover:bg-white/20"
                }`}
              >
                <FileText size={15} />
                Program
              </button>
              <button
                onClick={goToProjectTab}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "project" ? "bg-white text-primaryGreen shadow-md" : "text-white hover:bg-white/20"
                }`}
              >
                <FolderOpen size={15} />
                Project
                {projectList.length > 0 && (
                  <span className={`ml-1 text-[10px] px-2 py-[2px] rounded-full font-bold ${
                    activeTab === "project" ? "bg-primaryGreen text-white" : "bg-white/30 text-white"
                  }`}>
                    {projectList.length}
                  </span>
                )}
              </button>
              <button
                onClick={goToActivityTab}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "activity" ? "bg-white text-primaryGreen shadow-md" : "text-white hover:bg-white/20"
                }`}
              >
                <Activity size={15} />
                Activity
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/90 text-gray-600 shadow-sm border border-white/40
                        hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 hover:scale-105 active:scale-95"
            >
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
                      <div className="w-6 h-6 border-2 border-gray-200 border-t-primaryGreen rounded-full animate-spin"></div>
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
                      <div key={proj.id} className="group rounded-xl transition-all duration-200 hover:bg-white hover:shadow-sm">
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
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="p-10">

                {/* PROGRAM TAB */}
                {activeTab === "program" && (
                  isProgramDetailReady ? (
                    // ── FIX: pass proposalDetail (full data) instead of proposalData (shallow) ──
                    <ProgramForm
                      proposalData={proposalDetail}
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
                  <>
                    {!selectedProject ? (
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
                        projectData={projectDetail || selectedProject}
                        // ── FIX: use proposalDetail.program_title for the program title ──
                        programTitle={proposalDetail?.program_title ?? proposalData?.title ?? ""}
                        comments={comments}
                        onCommentChange={handleCommentChange}
                        alreadyReviewed={alreadyReviewed}
                        showCommentInputs={showCommentInputs}
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
                      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 gap-3">
                        <Activity size={40} className="text-gray-300" />
                        <p className="font-medium">Select an activity from the sidebar</p>
                        <p className="text-sm text-gray-400">{selectedProject.project_title}</p>
                      </div>
                    ) : activityDetailLoading ? (
                      <div className="bg-white rounded-2xl border border-gray-100 p-8">
                        <FormSkeleton lines={6} />
                      </div>
                    ) : (
                      <ActivityForm
                        activityData={activityDetail || selectedActivity}
                        // ── FIX: use proposalDetail.program_title for the program title ──
                        programTitle={proposalDetail?.program_title ?? proposalData?.title ?? ""}
                        projectTitle={selectedProject.project_title}
                        comments={comments}
                        onCommentChange={handleCommentChange}
                        alreadyReviewed={alreadyReviewed}
                        showCommentInputs={showCommentInputs}
                      />
                    )}
                  </>
                )}

                {/* ── Action Buttons ── */}
                {showCommentInputs && (
                  <div className="mt-10 pt-6 border-t border-gray-100">
                    {/* Review round + decision row */}
                    <div className="flex items-center gap-4 mb-5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          Review Round
                        </label>
                        <select
                          value={reviewRound}
                          onChange={(e) => setReviewRound(e.target.value)}
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
                          {getProposalType()}
                        </span>
                      </div>

                      {hasAnyComment && (
                        <span className="ml-auto text-xs text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg font-medium">
                          {Object.values(comments).filter((c) => c?.trim()).length} comment(s) — will submit as <strong>Needs Revision</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        onClick={onClose}
                        className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitReview}
                        disabled={isSubmitting || alreadyReviewed || !hasAnyComment}
                        className="px-8 py-3 bg-primaryGreen text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                        title={!hasAnyComment ? "Add at least one comment to submit a revision request" : ""}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Submit Review
                          </>
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
            <div className="bg-white h-full w-72 flex-shrink-0 shadow-sm border-l border-gray-200 flex flex-col">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">History</h2>
                  <p className="text-xs text-gray-400 mt-1">Recent changes of proposal</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {historyLoading ? (
                  <div className="px-2 py-2 space-y-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-xl bg-gray-100">
                        <div className="w-9 h-9 rounded-full bg-gray-300" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
                          <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-10">No history available</p>
                ) : (
                  <div className="space-y-2">
                    {history.map((item) => {
                      const label = item.status === "current" ? "Current Proposal" : `Revision ${item.version_no}`;
                      const formattedDate = new Date(item.created_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      });
                      const isSelected = selectedHistoryVersion?.history_id === item.history_id;
                      return (
                        <div
                          key={item.history_id}
                          onClick={() => setSelectedHistoryVersion(isSelected ? null : item)}
                          className={`flex items-start gap-3 p-4 rounded-xl transition cursor-pointer ${
                            isSelected ? "bg-emerald-100 border-2 border-emerald-500" : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-semibold">
                            V{item.version_no}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 font-medium">{label}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Proposal ID {item.proposal_id} • {formattedDate}
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
              <button
                onClick={() => setShowApproveConfirm(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowApproveConfirm(false); handleApprove(); }}
                disabled={isApproving}
                className="px-6 py-2 bg-primaryGreen text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                {isApproving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Approving...
                  </>
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