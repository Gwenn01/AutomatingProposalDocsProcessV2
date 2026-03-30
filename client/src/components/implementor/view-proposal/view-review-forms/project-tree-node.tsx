import type { ApiActivity } from "@/types/reviewer-types";
import { formatDate } from "@/utils/dateFormat";
import { Activity, ChevronRight, FolderOpen, CheckCircle2, Clock } from "lucide-react";

type ProjectListFields = {
  assignment: number;
  proposal: number;
  child_id: number;
  implementor: number;
  project_title: string;
  project_leader: string;
  activity_title?: string;
  activity_date: string;
  type: string;
  status: string;
  reviewer_count: number;
  version_no: number;
  is_reviewed: boolean;
  assigned_at: string | null;
  activities?: ApiActivity[];
};

type ProjectItem = ProjectListFields;
type ActivityItem = ProjectListFields;
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
  const isProjectSelected = selectedProject?.child_id === project.child_id;
  const activities = activitiesCache[project.child_id] ?? [];
  const isLoadingActivities = loadingCache[project.child_id] ?? false;
  const isExpanded = activeTab === "activity" && isProjectSelected;

  return (
    <div className="group/node">
      {/* Project Row */}
      <button
        onClick={() => activeTab === "project" ? onSelectProject(project) : onExpandProject(project)}
        className={`
          w-full text-left px-3 py-2.5 transition-all duration-150 flex items-center gap-2.5
          relative
          ${isProjectSelected
            ? "bg-gradient-to-r from-emerald-50 to-transparent"
            : "hover:bg-gray-50/80"
          }
        `}
      >
        {/* Left accent bar */}
        <span
          className={`absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full transition-all duration-200
            ${isProjectSelected ? "bg-emerald-500 opacity-100" : "bg-transparent opacity-0 group-hover/node:opacity-40 group-hover/node:bg-gray-300"}
          `}
        />

        {/* Folder icon */}
        <span className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-md transition-colors duration-150
          ${isProjectSelected ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400 group-hover/node:bg-gray-200"}
        `}>
          <FolderOpen size={13} strokeWidth={2.2} />
        </span>

        {/* Text content + badge */}
        <div className="flex-1 min-w-0">
          <p className={`text-[11.5px] font-semibold leading-snug transition-colors mb-1.5 text-wrap
            ${isProjectSelected ? "text-emerald-700" : "text-gray-700"}
          `}>
            {project.project_title}
          </p>
          {project.project_leader && (
            <p className="text-[10px] text-gray-400 truncate mb-1">{project.project_leader}</p>
          )}
          {activeTab === "project" && <StatusBadge reviewed={project.is_reviewed} size="sm" />}
        </div>

        {/* Chevron for activity tab */}
        {activeTab === "activity" && (
          <ChevronRight
            size={13}
            strokeWidth={2.5}
            className={`shrink-0 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
          />
        )}
      </button>

      {/* Activity Sub-list */}
      {isExpanded && (
        <div className="relative ml-5 mb-1">
          {/* Vertical connector line */}
          <span className="absolute left-3 top-0 bottom-2 w-px bg-gray-200" />

          {isLoadingActivities ? (
            <div className="flex items-center gap-2 py-3 pl-7 pr-3">
              <div className="w-3.5 h-3.5 border-2 border-gray-200 border-t-emerald-400 rounded-full animate-spin" />
              <span className="text-[10px] text-gray-400">Loading activities…</span>
            </div>
          ) : activities.length === 0 ? (
            <div className="py-3 pl-7 pr-3">
              <p className="text-[10px] text-gray-400 italic">No activities found</p>
            </div>
          ) : (
            <div className="space-y-px pt-0.5">
              {activities.map((act) => {
                const isActSelected = selectedActivity?.child_id === act.child_id;
                return (
                  <ActivityRow
                    key={act.child_id}
                    act={act}
                    isSelected={isActSelected}
                    onSelect={() => onSelectActivity(project, act)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ── Sub-components ────────────────────────────────────────── */

interface ActivityRowProps {
  act: ProjectListFields;
  isSelected: boolean;
  onSelect: () => void;
}

const ActivityRow: React.FC<ActivityRowProps> = ({ act, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`
      group/act w-full text-left pl-6 pr-3 py-2 flex items-center gap-2.5 rounded-md mx-1
      transition-all duration-150
      ${isSelected
        ? "bg-blue-50 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]"
        : "hover:bg-gray-50 hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
      }
    `}
  >
    {/* Activity icon */}
    <span className={`relative shrink-0 flex items-center justify-center w-5 h-5 rounded-full transition-colors
      ${isSelected ? "bg-blue-100 text-blue-500" : "bg-gray-100 text-gray-400 group-hover/act:bg-gray-200"}
    `}>
      <Activity size={10} strokeWidth={2.3} />
    </span>

    <div className="flex-1 min-w-0">
      <p className={`text-[11px] font-medium leading-snug transition-colors mb-1
        ${isSelected ? "text-blue-700" : "text-gray-600"}
      `}>
        {act.activity_title || "Untitled Activity"}
      </p>
      <p className="text-[9px] text-gray-400">
        <span className="text-gray-500">Activity Date: </span>
        {formatDate(act.activity_date)}
      </p>
      <div className="mt-1">
        <StatusBadge reviewed={act.is_reviewed} size="xs" />
      </div>
    </div>
  </button>
);

interface StatusBadgeProps {
  reviewed: boolean;
  size?: "sm" | "xs";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ reviewed, size = "sm" }) => {
  const pad = size === "xs" ? "px-1.5 py-0.5" : "px-2 py-0.5";
  const text = size === "xs" ? "text-[9px]" : "text-[9.5px]";

  if (reviewed) {
    return (
      <span className={`inline-flex items-center gap-1 ${pad} ${text} font-semibold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 whitespace-nowrap`}>
        <CheckCircle2 size={8} strokeWidth={2.5} />
        Reviewed
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 ${pad} ${text} font-semibold rounded-full bg-amber-50 text-amber-600 border border-amber-200 whitespace-nowrap`}>
      <Clock size={8} strokeWidth={2.5} />
      Pending
    </span>
  );
};