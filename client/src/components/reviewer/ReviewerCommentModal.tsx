import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/context/auth-context";

import { submitProposalReview, updateProposalReview } from "@/api/reviewer-api";

import {
  mapSnapshotToProgram,
  mapSnapshotToProject,
  mapSnapshotToActivity,
} from "@/constants/reviewer/mappers";
import { useReviewState, useExistingReview, useHistoryPanel, useSidebarTree, useCurrentReview } from "@/hooks/useReviewerState";
import {
  ReviewedBanner,
  VersionHistoryItem,
  ApproveConfirmDialog,
} from "@/components/reviewer/reviewer-comment-modal";

import type { ReviewerCommentModalProps, TabType } from "@/types/reviewer-comment-types";
import { buildReviewPayload } from "@/constants/reviewer/payload-builder";
import { ProjectTreeNode } from "./reviewer-comment-modal/view-review/project-tree-node";
import { ProgramForm } from "./reviewer-comment-modal/view-review/program-form";
import { ProjectForm } from "./reviewer-comment-modal/view-review/project-form";
import { ActivityForm } from "./reviewer-comment-modal/view-review/activity-form";

// ─────────────────────────────────────────────────────────────────────────────
// ReviewerCommentModal
// ─────────────────────────────────────────────────────────────────────────────

const ReviewerCommentModal: React.FC<ReviewerCommentModalProps> = ({
  isOpen,
  onClose,
  proposalData,
  proposalDetail,
}) => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("program");

  // ── Derived IDs ─────────────────────────────────────────────────────────
  const childId = proposalDetail?.id ?? proposalData?.child_id;
  const programNodeId = proposalData?.proposal_id
    ? Number(proposalData.proposal_id)
    : null;
  const statusStyle = proposalData
    ? getStatusStyle(proposalData.status ?? "")
    : { className: "", label: "" };

  // ── Feature slices ──────────────────────────────────────────────────────
  const reviewState = useReviewState();

  const sidebar = useSidebarTree({ isOpen, childId });

  const { existingReview, existingReviewLoading, reset: resetExistingReview } =
    useExistingReview({
      isOpen,
      activeTab,
      programNodeId,
      selectedProjectProposal: sidebar.selectedProject?.proposal,
      selectedActivityProposal: sidebar.selectedActivity?.proposal,
    });

    const { currentReviewData, currentReviewLoading, reset: resetCurrentReview } =
      useCurrentReview({
        isOpen,
        activeTab,
        programNodeId,
        selectedProjectProposal: sidebar.selectedProject?.proposal,
        selectedActivityProposal: sidebar.selectedActivity?.proposal,
      });
// ── Pre-fill comment inputs from previous review when on current version ──
useEffect(() => {
  if (!currentReviewData) {
    reviewState.setComments({});
    return;
  }

  const feedbackKeyMap: Record<string, string> = {
    profile_feedback: "profile_feedback",
    implementing_agency_feedback: "implementing_agency_feedback",
    extension_site_feedback: "extension_site_feedback",
    tagging_cluster_extension_feedback: "tagging_cluster_extension_feedback",
    sdg_academic_program_feedback: "sdg_academic_program_feedback",
    rationale_feedback: "rationale_feedback",
    significance_feedback: "significance_feedback",
    general_objectives_feedback: "general_objectives_feedback",
    specific_objectives_feedback: "specific_objectives_feedback",
    objectives_feedback: "objectives_feedback",
    methodology_feedback: "methodology_feedback",
    expected_output_feedback: "expected_output_feedback",
    sustainability_plan_feedback: "sustainability_plan_feedback",
    org_staffing_feedback: "org_staffing_feedback",
    work_plan_feedback: "work_plan_feedback",
    budget_requirements_feedback: "budget_requirements_feedback",
  };

  const prefix =
    activeTab === "project" ? "proj_" :
    activeTab === "activity" ? "act_" :
    "";

  const prefilled: Record<string, string> = {};

  Object.entries(feedbackKeyMap).forEach(([apiKey, baseKey]) => {
    const value = currentReviewData[apiKey];
    if (value) {
      prefilled[`${prefix}${baseKey}`] = value;
    }
  });

  reviewState.setComments(prefilled);
}, [currentReviewData, activeTab]);

  const history = useHistoryPanel({
    isOpen,
    activeTab,
    programNodeId,
    selectedProjectProposal: sidebar.selectedProject?.proposal,
    selectedActivityProposal: sidebar.selectedActivity?.proposal,
    selectedProject: sidebar.selectedProject,
    selectedActivity: sidebar.selectedActivity,
  });

  // ── Derived display flags ───────────────────────────────────────────────
  const isCurrentVersion =
    !history.selectedHistoryVersion ||
    history.selectedHistoryVersion.status === "current";

  const showCommentInputs =
    isCurrentVersion ;

const showExistingFeedback =
  !history.isViewingHistory && (existingReviewLoading || !!existingReview);

// When browsing history → use the normalized history review.
// When on current version → use existingReview (the already-submitted review).
const activeExistingReview = history.isViewingHistory
  ? history.historyReview
  : showExistingFeedback
  ? existingReview
  : null;

const activeReviewLoading = history.isViewingHistory
  ? history.historyReviewLoading
  : existingReviewLoading;

  const showProjectSidebar = activeTab === "project" || activeTab === "activity";

  // ── Active form data (snapshot overrides live data when browsing history) ─
  const activeProgramData = history.historySnapshotData
    ? mapSnapshotToProgram(history.historySnapshotData)
    : proposalDetail;

  const activeProjectData = history.historySnapshotData
    ? mapSnapshotToProject(history.historySnapshotData)
    : sidebar.projectDetail ?? sidebar.selectedProject;

  const activeActivityData = history.historySnapshotData
    ? mapSnapshotToActivity(history.historySnapshotData)
    : sidebar.activityDetail ?? sidebar.selectedActivity;

  // ── Full reset when modal closes ────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("program");
      sidebar.reset();
      history.reset();
      reviewState.reset();
      resetExistingReview();
      resetCurrentReview();
    }
  }, [isOpen]);

  // ── Tab navigation helpers ──────────────────────────────────────────────
const switchToProjectTab = () => {
  setActiveTab("project");
  // Don't reset comments here — useEffect will repopulate from currentReviewData
  reviewState.setDecision("needs_revision");
  if (!sidebar.selectedProject && sidebar.projectList.length > 0) {
    sidebar.handleSelectProject(sidebar.projectList[0]);
  }
};

const switchToActivityTab = () => {
  setActiveTab("activity");
  reviewState.setDecision("needs_revision");
  sidebar.setSelectedActivity?.(null);
  sidebar.setActivityDetail?.(null);
};

  // ── Review submission ───────────────────────────────────────────────────
  const buildPayload = (overrideDecision?: "needs_revision" | "approved") =>
    buildReviewPayload(
      {
        activeTab,
        comments: reviewState.comments,
        decision: reviewState.decision,
        reviewRound: reviewState.reviewRound,
        programNodeId,
        proposalData,
        selectedProject: sidebar.selectedProject,
        selectedActivity: sidebar.selectedActivity,
        projectDetail: sidebar.projectDetail,
        activityDetail: sidebar.activityDetail,
        user,
      },
      overrideDecision
    );

  const executeSubmit = async (overrideDecision: "needs_revision" | "approved") => {
    const payload = buildPayload(overrideDecision);

    const currentHistory =
      activeTab === "activity"
        ? history.activeHistory
        : activeTab === "project"
        ? history.activeHistory
        : history.activeHistory;

    const isFirstReview = currentHistory.length <= 1;

    if (isFirstReview) {
      await submitProposalReview(payload);
    } else {
      const resolvedReviewer =
        activeTab === "activity" && sidebar.selectedActivity
          ? Number(sidebar.selectedActivity.assignment)
          : activeTab === "project" && sidebar.selectedProject
          ? Number(sidebar.selectedProject.assignment)
          : proposalData?.assignment_id
          ? Number(proposalData.assignment_id)
          : Number(user?.user_id);

      await updateProposalReview(payload.proposal_node!, resolvedReviewer, payload);
    }
  };

  const handleSubmitReview = async () => {
    reviewState.setIsSubmitting(true);
    try {
      await executeSubmit("needs_revision");
      showToast("Review submitted successfully!", "success");
      reviewState.reset();
      onClose();
    } catch (err: any) {
      showToast(err?.message ?? "Failed to submit review.", "error");
    } finally {
      reviewState.setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    reviewState.setIsApproving(true);
    try {
      await executeSubmit("approved");
      showToast("Proposal approved successfully!", "success");
      onClose();
    } catch (err: any) {
      showToast(err?.message ?? "Failed to approve proposal.", "error");
    } finally {
      reviewState.setIsApproving(false);
    }
  };

  // ── Early exit ──────────────────────────────────────────────────────────
  if (!isOpen || !proposalData) return null;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md animate-overlay-enter">
        <div className="bg-white flex-1 h-[100vh] flex flex-col overflow-hidden animate-modal-enter">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <ModalHeader
            title={proposalData.title}
            statusStyle={statusStyle}
            activeTab={activeTab}
            projectCount={sidebar.projectList.length}
            onTabProgram={() => { setActiveTab("program"); reviewState.reset(); }}
            onTabProject={switchToProjectTab}
            onTabActivity={switchToActivityTab}
            onClose={onClose}
          />

          {/* ── Body ───────────────────────────────────────────────────── */}
          <div className="flex flex-1 overflow-hidden">

            {/* Sidebar — project / activity tree */}
            {showProjectSidebar && (
              <ProjectSidebar
                activeTab={activeTab}
                projectList={sidebar.projectList}
                projectListLoading={sidebar.projectListLoading}
                selectedProject={sidebar.selectedProject}
                selectedActivity={sidebar.selectedActivity}
                activitiesCache={sidebar.activitiesCache}
                activitiesLoadingCache={sidebar.activitiesLoadingCache}
                onSelectProject={sidebar.handleSelectProject}
                onExpandProject={sidebar.handleExpandProject}
                onSelectActivity={sidebar.handleSelectActivity}
              />
            )}

            {/* Main form area */}
            <div className="flex-1 overflow-y-auto relative bg-white">
              {history.historySnapshotLoading && <SnapshotLoadingOverlay />}

              {/* In the <div className="p-10"> block, before <FormArea /> */}
{/* {history.isViewingHistory && (
  <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    {history.historyReviewLoading
      ? "Loading reviews for this version…"
      : history.historyReview
      ? "Showing reviewer feedback from this historical version"
      : "No reviewer feedback recorded for this version"}
  </div>
)} */}

{/* {showExistingFeedback && !history.isViewingHistory && (
  <ReviewedBanner
    loading={existingReviewLoading}
    review={existingReview}
  />
)} */}

              <div className="p-10">
                {/* {showExistingFeedback && (
                  <ReviewedBanner
                    loading={existingReviewLoading}
                    review={existingReview}
                  />
                )} */}

                <FormArea
                  activeTab={activeTab}
                  programDetailReady={!!proposalDetail}
                  activeProgramData={activeProgramData}
                  activeProjectData={activeProjectData}
                  activeActivityData={activeActivityData}
                  selectedProject={sidebar.selectedProject}
                  selectedActivity={sidebar.selectedActivity}
                  projectDetailLoading={sidebar.projectDetailLoading}
                  activityDetailLoading={sidebar.activityDetailLoading}
                  programTitle={
                    proposalDetail?.program_title ?? proposalData?.title ?? ""
                  }
                  comments={reviewState.comments}
                  onCommentChange={reviewState.handleCommentChange}
                  showCommentInputs={showCommentInputs}
                  //existingReview={showExistingFeedback ? existingReview : null}
                  //reviewLoading={existingReviewLoading}
                  existingReview={activeExistingReview}
                  reviewLoading={activeReviewLoading}
                />
              </div>

              {/* Floating action bar */}
              {showCommentInputs && (
                <ActionBar
                  activeTab={activeTab}
                  isSubmitting={reviewState.isSubmitting}
                  isApproving={reviewState.isApproving}
                  hasAnyComment={reviewState.hasAnyComment}
                  onSubmit={handleSubmitReview}
                  onApprove={() => reviewState.setShowApproveConfirm(true)}
                  onCancel={onClose}
                />
              )}
            </div>

            {/* Version history panel */}
            <HistoryPanel
              activeHistory={history.activeHistory}
              historyLoading={history.historyLoading}
              selectedHistoryVersion={history.selectedHistoryVersion}
              onSelectVersion={(item) => {
                const isSameAsSelected =
                  history.selectedHistoryVersion?.history_id === item.history_id;

                if (isSameAsSelected) {
                  const current = history.activeHistory.find(
                    (h) => h.status === "current"
                  ) ?? null;
                  history.setSelectedHistoryVersion(current);
                } else {
                  history.setSelectedHistoryVersion(item);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Approval confirmation dialog */}
      {reviewState.showApproveConfirm && (
        <ApproveConfirmDialog
          proposalTitle={proposalData?.title}
          isApproving={reviewState.isApproving}
          onConfirm={() => {
            reviewState.setShowApproveConfirm(false);
            handleApprove();
          }}
          onCancel={() => reviewState.setShowApproveConfirm(false)}
        />
      )}
    </>
  );
};

export default ReviewerCommentModal;

// ─────────────────────────────────────────────────────────────────────────────
// Layout sub-components (private to this file)
// ─────────────────────────────────────────────────────────────────────────────

// ── ModalHeader ───────────────────────────────────────────────────────────────

const ModalHeader: React.FC<{
  title: string;
  statusStyle: { className: string; label: string };
  activeTab: TabType;
  projectCount: number;
  onTabProgram: () => void;
  onTabProject: () => void;
  onTabActivity: () => void;
  onClose: () => void;
}> = ({
  title,
  statusStyle,
  activeTab,
  projectCount,
  onTabProgram,
  onTabProject,
  onTabActivity,
  onClose,
}) => {
  const tabClass = (tab: TabType) =>
    [
      "group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
      activeTab === tab
        ? "bg-white text-primaryGreen shadow-md"
        : "text-white hover:bg-white/20",
    ].join(" ");

  return (
    <div className="flex-shrink-0 flex items-center justify-between px-10 py-6 bg-primaryGreen border-b border-white/10 relative">
      {/* Title block */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-semibold text-[11px] tracking-[0.15em] uppercase text-white/70">
            Review Proposal
          </span>
          <ChevronRight size={13} className="text-white/40" />
          <span
            className={`inline-flex items-center px-4 py-[4px] rounded-full text-[12px] uppercase font-semibold backdrop-blur-md border border-white/20 shadow-sm ${statusStyle.className}`}
          >
            {statusStyle.label}
          </span>
        </div>
        <h1 className="font-bold text-[22px] text-white leading-snug truncate pr-10 drop-shadow-sm text-wrap">
          {title}
        </h1>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-2 mr-6 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/15 shadow-inner">
        <button onClick={onTabProgram} className={tabClass("program")}>
          <FileText size={15} /> Program
        </button>
        <button onClick={onTabProject} className={tabClass("project")}>
          <FolderOpen size={15} /> Project
          {projectCount > 0 && (
            <span
              className={`ml-1 text-[10px] px-2 py-[2px] rounded-full font-bold ${
                activeTab === "project"
                  ? "bg-primaryGreen text-white"
                  : "bg-white/30 text-white"
              }`}
            >
              {projectCount}
            </span>
          )}
        </button>
        <button onClick={onTabActivity} className={tabClass("activity")}>
          <Activity size={15} /> Activity
        </button>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/90 text-gray-600 shadow-sm border border-white/40 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <X size={17} />
      </button>
    </div>
  );
};

// ── ProjectSidebar ────────────────────────────────────────────────────────────

const ProjectSidebar: React.FC<{
  activeTab: TabType;
  projectList: any[];
  projectListLoading: boolean;
  selectedProject: any;
  selectedActivity: any;
  activitiesCache: Record<number, any[]>;
  activitiesLoadingCache: Record<number, boolean>;
  onSelectProject: (p: any) => void;
  onExpandProject: (p: any) => void;
  onSelectActivity: (p: any, a: any) => void;
}> = ({
  activeTab,
  projectList,
  projectListLoading,
  selectedProject,
  selectedActivity,
  activitiesCache,
  activitiesLoadingCache,
  onSelectProject,
  onExpandProject,
  onSelectActivity,
}) => (
  <div className="w-64 flex-shrink-0 bg-gray-50/80 border-r border-gray-200 flex flex-col overflow-y-scroll">
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
          <div
            key={proj.child_id}
            className="group rounded-xl transition-all duration-200 hover:bg-white hover:shadow-sm"
          >
            <ProjectTreeNode
              project={proj}
              activeTab={activeTab}
              selectedProject={selectedProject}
              selectedActivity={selectedActivity}
              onSelectProject={onSelectProject}
              onSelectActivity={onSelectActivity}
              activitiesCache={activitiesCache}
              loadingCache={activitiesLoadingCache}
              onExpandProject={onExpandProject}
            />
          </div>
        ))
      )}
    </div>
  </div>
);

// ── FormArea ──────────────────────────────────────────────────────────────────

const FormArea: React.FC<{
  activeTab: TabType;
  programDetailReady: boolean;
  activeProgramData: any;
  activeProjectData: any;
  activeActivityData: any;
  selectedProject: any;
  selectedActivity: any;
  projectDetailLoading: boolean;
  activityDetailLoading: boolean;
  programTitle: string;
  comments: Record<string, string>;
  onCommentChange: (key: string, value: string) => void;
  showCommentInputs: boolean;
  existingReview: any;
  reviewLoading: boolean;
}> = ({
  activeTab,
  programDetailReady,
  activeProgramData,
  activeProjectData,
  activeActivityData,
  selectedProject,
  selectedActivity,
  projectDetailLoading,
  activityDetailLoading,
  programTitle,
  comments,
  onCommentChange,
  showCommentInputs,
  existingReview,
  reviewLoading,
}) => {
  const sharedProps = { comments, onCommentChange, showCommentInputs, existingReview, reviewLoading };
  const skeletonCard = (
    <div className="bg-white rounded-2xl border border-gray-100 p-8">
      <FormSkeleton lines={6} />
    </div>
  );

  if (activeTab === "program") {
    return programDetailReady ? (
      <ProgramForm proposalData={activeProgramData} alreadyReviewed={false} {...sharedProps} />
    ) : skeletonCard;
  }

  if (activeTab === "project") {
    if (!selectedProject)
      return <EmptyState icon={<FolderOpen size={40} className="text-gray-300" />} message="Select a project from the sidebar" />;
    if (projectDetailLoading) return skeletonCard;
    return (
      <ProjectForm
        projectData={activeProjectData}
        programTitle={programTitle}
        alreadyReviewed={false}
        {...sharedProps}
      />
    );
  }

  // activity tab
  if (!selectedProject)
    return <EmptyState icon={<FolderOpen size={40} className="text-gray-300" />} message="Select a project to expand its activities" />;
  if (!selectedActivity)
    return (
      <EmptyState
        icon={<Activity size={40} className="text-gray-300" />}
        message="Select an activity from the sidebar"
        subtitle={selectedProject.title}
        fullHeight
      />
    );
  if (activityDetailLoading) return skeletonCard;
  return (
    <ActivityForm
      activityData={activeActivityData}
      programTitle={programTitle}
      projectTitle={selectedProject.title}
      alreadyReviewed={false}
      {...sharedProps}
    />
  );
};

// ── EmptyState ────────────────────────────────────────────────────────────────

const EmptyState: React.FC<{
  icon: React.ReactNode;
  message: string;
  subtitle?: string;
  fullHeight?: boolean;
}> = ({ icon, message, subtitle, fullHeight }) => (
  <div
    className={`flex flex-col items-center justify-center text-gray-400 gap-3 ${
      fullHeight ? "h-[60vh]" : "h-64"
    }`}
  >
    {icon}
    <p className="font-medium text-gray-500">{message}</p>
    {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
  </div>
);

// ── SnapshotLoadingOverlay ────────────────────────────────────────────────────

const SnapshotLoadingOverlay: React.FC = () => (
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-3">
    <div className="w-7 h-7 border-[3px] border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
    <p className="text-sm text-gray-500 font-medium">Loading version…</p>
  </div>
);

// ── ActionBar ────────────────────────────────────────────────────────────────

const ActionBar: React.FC<{
  activeTab: TabType;
  isSubmitting: boolean;
  isApproving: boolean;
  hasAnyComment: boolean;
  onSubmit: () => void;
  onApprove: () => void;
  onCancel: () => void;
}> = ({
  activeTab,
  isSubmitting,
  isApproving,
  hasAnyComment,
  onSubmit,
  onApprove,
  onCancel,
}) => {
  const positionClass =
    activeTab === "project" || activeTab === "activity"
      ? "left-1/4 -translate-x-1/4"
      : "left-0";

  return (
    <div className={`fixed z-50 bottom-2 ${positionClass} px-5`}>
      <div className="flex justify-end gap-3 p-3 rounded-2xl bg-gray-100">
        {/* Submit revision */}
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !hasAnyComment}
          title={!hasAnyComment ? "Add at least one comment to submit a revision request" : ""}
          className="px-6 py-2.5 rounded-xl bg-primaryGreen text-white text-xs font-semibold flex items-center gap-2 shadow-sm hover:bg-green-700 hover:shadow-md active:scale-[0.97] transition-all duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Submit Review
            </>
          )}
        </button>

        {/* Approve */}
        <button
          onClick={onApprove}
          disabled={hasAnyComment || isApproving}
          title={hasAnyComment ? "Clear all comments before approving" : ""}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 shadow-sm hover:bg-emerald-700 hover:shadow-md active:scale-[0.97] transition-all duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isApproving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Approving...
            </>
          ) : (
            "Approve"
          )}
        </button>

        {/* Cancel */}
        <button
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 hover:border-gray-400 active:scale-[0.97] transition-all duration-200 shadow-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// ── HistoryPanel ──────────────────────────────────────────────────────────────

const HistoryPanel: React.FC<{
  activeHistory: any[];
  historyLoading: boolean;
  selectedHistoryVersion: any;
  onSelectVersion: (item: any) => void;
}> = ({ activeHistory, historyLoading, selectedHistoryVersion, onSelectVersion }) => (
  <div
    style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    className="bg-white h-full w-72 flex-shrink-0 flex flex-col border-l border-gray-100"
  >
    {/* Panel header */}
    <div className="px-5 pt-6 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-base font-semibold text-gray-900 tracking-tight">
          Version History
        </span>
        {!historyLoading && activeHistory.length > 0 && (
          <span className="ml-auto text-[10px] font-semibold bg-gray-100 text-gray-400 rounded-full px-2 py-0.5">
            {activeHistory.length}
          </span>
        )}
      </div>
      <p className="text-[11px] text-gray-400 leading-tight">
        Track changes to this proposal
      </p>
    </div>

    {/* History list */}
    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
      {historyLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-5 h-5 border-[2.5px] border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-xs text-gray-400 tracking-wide">Loading history…</p>
        </div>
      ) : activeHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <svg
            className="w-8 h-8 text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
            />
          </svg>
          <p className="text-xs text-gray-400 text-center">
            No history available yet
          </p>
        </div>
      ) : (
        activeHistory.map((item, index) => (
          <VersionHistoryItem
            key={item.history_id}
            item={item}
            index={index}
            total={activeHistory.length}
            isSelected={selectedHistoryVersion?.history_id === item.history_id}
            onClick={() => onSelectVersion(item)}
          />
        ))
      )}
    </div>
  </div>
);