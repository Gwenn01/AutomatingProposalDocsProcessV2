import type { TabType } from "@/types/reviewer-comment-types";
import { FolderOpen } from "lucide-react";
import { ProjectTreeNode } from "./view-review/project-tree-node";

export const ProjectSidebar: React.FC<{
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