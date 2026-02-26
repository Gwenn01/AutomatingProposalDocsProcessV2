import type { ApiActivity, ApiProject } from "@/utils/reviewer-api";
import { Activity, ChevronRight, FolderOpen } from "lucide-react";

type ProjectItem = ApiProject;
type ActivityItem = ApiActivity;
type TabType = "program" | "project" | "activity";

interface ProjectTreeNodeProps {
  project: ProjectItem;
  activeTab: TabType;
  selectedProject: ProjectItem | null;
  selectedActivity: ActivityItem | null;
  onSelectProject: (project: ProjectItem) => void;
  onSelectActivity: (project: ProjectItem, activity: ActivityItem) => void;
  activitiesCache: Record<number, ActivityItem[]>;
  loadingCache: Record<number, boolean>;
  onExpandProject: (project: ProjectItem) => void;
}

export const ProjectTreeNode: React.FC<ProjectTreeNodeProps> = ({
  project, activeTab, selectedProject, selectedActivity,
  onSelectProject, onSelectActivity, activitiesCache, loadingCache, onExpandProject,
}) => {
  const isProjectSelected = selectedProject?.id === project.id;
  const activities = activitiesCache[project.id] ?? [];
  const isLoadingActivities = loadingCache[project.id] ?? false;

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => activeTab === "project" ? onSelectProject(project) : onExpandProject(project)}
        className={`w-full text-left px-4 py-3 transition-colors flex items-start gap-2 border-l-2 ${
          isProjectSelected ? "bg-green-50 border-primaryGreen" : "border-transparent hover:bg-gray-100 hover:border-gray-300"
        }`}
      >
        <FolderOpen size={13} className={`mt-0.5 shrink-0 ${isProjectSelected ? "text-primaryGreen" : "text-gray-400"}`} />
        <div className="flex-1 min-w-0">
          <p className={`truncate text-xs font-semibold leading-relaxed text-wrap ${isProjectSelected ? "text-primaryGreen" : "text-gray-700"}`}>
            {project.project_title}
          </p>
          {project.project_leader && (
            <p className="text-[10px] text-gray-400 mt-0.5 truncate">{project.project_leader}</p>
          )}
        </div>
        {activeTab === "activity" && (
          <ChevronRight size={12} className={`shrink-0 mt-0.5 transition-transform text-gray-400 ${isProjectSelected ? "rotate-90" : ""}`} />
        )}
      </button>

      {activeTab === "activity" && isProjectSelected && (
        <div className="bg-white">
          {isLoadingActivities ? (
            <div className="flex items-center justify-center py-4 pl-8">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : activities.length === 0 ? (
            <p className="text-[10px] text-gray-400 py-2 pl-10 italic">No activities</p>
          ) : (
            activities.map((act) => {
              const isActSelected = selectedActivity?.id === act.id;
              return (
                <button
                  key={act.id}
                  onClick={() => onSelectActivity(project, act)}
                  className={`w-full text-left pl-10 pr-4 py-2.5 transition-colors flex items-start gap-2 border-l-2 ${
                    isActSelected ? "bg-blue-50 border-blue-500" : "border-transparent hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <Activity size={11} className={`mt-0.5 shrink-0 ${isActSelected ? "text-blue-500" : "text-gray-300"}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`truncate text-[11px] font-medium leading-relaxed text-wrap ${isActSelected ? "text-blue-700" : "text-gray-600"}`}>
                      {act.activity_title}
                    </p>
                    {act.activity_date && <p className="text-[9px] text-gray-400 mt-0.5">{act.activity_date}</p>}
                    {act.activity_duration_hours > 0 && <p className="text-[9px] text-gray-400">{act.activity_duration_hours}h</p>}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};