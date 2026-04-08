import FormSkeleton from "@/components/ui/FormSkeleton";
import type { TabType } from "@/types/reviewer-comment-types";
import { ProgramForm } from "./view-review/program-form";
import { ProjectForm } from "./view-review/project-form";
import { Activity, FolderOpen } from "lucide-react";
import { ActivityForm } from "./view-review/activity-form";
import { EmptyState } from "@/components/ui/EmptyState";

export const FormArea: React.FC<{
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
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
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
  scrollContainerRef
}) => {
  const sharedProps = { comments, onCommentChange, showCommentInputs, existingReview, reviewLoading };
  const skeletonCard = (
    <div className="bg-white rounded-2xl border border-gray-100 p-8">
      <FormSkeleton lines={6} />
    </div>
  );

  if (activeTab === "program") {
    return programDetailReady ? (
      <ProgramForm scrollContainerRef={scrollContainerRef} proposalData={activeProgramData} alreadyReviewed={false} {...sharedProps} />
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
        scrollContainerRef={scrollContainerRef}
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
      scrollContainerRef={scrollContainerRef}
      {...sharedProps}
    />
  );
};