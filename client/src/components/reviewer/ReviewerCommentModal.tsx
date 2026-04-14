import React, { useState, useEffect, useRef } from "react";
import { getStatusStyle } from "@/utils/statusStyles";
import { useToast } from "@/context/toast";
import { useAuth } from "@/context/auth-context";
import { approveProposal, submitProposalReview, updateProposalReview } from "@/api/reviewer-api";
import { mapSnapshotToProgram, mapSnapshotToProject, mapSnapshotToActivity } from "@/constants/reviewer/mappers";
import { useReviewState, useExistingReview, useHistoryPanel, useSidebarTree, useCurrentReview } from "@/hooks/useReviewerState";
import { ApproveConfirmDialog } from "@/components/reviewer/reviewer-comment-modal";
import type { ReviewerCommentModalProps, TabType } from "@/types/reviewer-comment-types";
import { buildReviewPayload } from "@/constants/reviewer/payload-builder";
import SubmittingOverlay from "./reviewer-comment-modal/SubmittingOverlay";
import { SnapshotLoadingOverlay } from "../ui/SnapshotLoadingOverlay";
import { HistoryPanel } from "./reviewer-comment-modal/HistoryPanel";
import { ModalHeader } from "./reviewer-comment-modal/ModalHeader";
import { ProjectSidebar } from "./reviewer-comment-modal/ProjectSidebar";
import { ActionBar } from "./reviewer-comment-modal/ActionBar";
import { FormArea } from "./reviewer-comment-modal/FormArea";


const ReviewerCommentModal: React.FC<ReviewerCommentModalProps> = ({
  isOpen,
  onClose,
  proposalData,
  proposalDetail,
}) => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const formScrollRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<TabType>("program");

  const childId = proposalDetail?.id ?? proposalData?.child_id;
  const programNodeId = proposalData?.proposal_id
    ? Number(proposalData.proposal_id)
    : null;
  const statusStyle = proposalData
    ? getStatusStyle(proposalData.status ?? "")
    : { className: "", label: "" };

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

    const { currentReviewData, reset: resetCurrentReview } =
      useCurrentReview({
        isOpen,
        activeTab,
        programNodeId,
        selectedProjectProposal: sidebar.selectedProject?.proposal,
        selectedActivityProposal: sidebar.selectedActivity?.proposal,
      });

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

const activeExistingReview = history.isViewingHistory
  ? history.historyReview
  : showExistingFeedback
  ? existingReview
  : null;

const activeReviewLoading = history.isViewingHistory
  ? history.historyReviewLoading
  : existingReviewLoading;

  const showProjectSidebar = activeTab === "project" || activeTab === "activity";

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

const switchToProjectTab = () => {
  setActiveTab("project");
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
      await approveProposal(proposalData?.proposal_id);
      showToast("Proposal approved successfully!", "success");
      onClose();
    } catch (err: any) {
      showToast(err?.message ?? "Failed to approve proposal.", "error");
    } finally {
      reviewState.setIsApproving(false);
    }
  };

  if (!isOpen || !proposalData) return null;

  const proposalStatus = proposalData.status === "for_approval";


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
            isDisabled={reviewState.isSubmitting}
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
            <div 
              ref={formScrollRef}
              className={`flex-1 relative bg-white ${history.historySnapshotLoading === true ? "" : "overflow-y-auto"}`}>
              {history.historySnapshotLoading && <SnapshotLoadingOverlay />}


              <div className="p-10">

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
                  existingReview={activeExistingReview}
                  reviewLoading={activeReviewLoading}
                  scrollContainerRef={formScrollRef}
                />
              </div>

              {/* Floating action bar */}
              {showCommentInputs  && (
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

            {reviewState.isSubmitting && 
              (
                <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
                  <SubmittingOverlay message="Submitting Review." />
                </div>
              )  
            }

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
