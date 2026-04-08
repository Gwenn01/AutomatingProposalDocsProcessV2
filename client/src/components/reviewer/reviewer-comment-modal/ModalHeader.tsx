import type { TabType } from "@/types/reviewer-comment-types";
import { Activity, ChevronRight, FileText, FolderOpen, X } from "lucide-react";

export const ModalHeader: React.FC<{
  title: string;
  statusStyle: { className: string; label: string };
  activeTab: TabType;
  projectCount: number;
  onTabProgram: () => void;
  onTabProject: () => void;
  onTabActivity: () => void;
  onClose: () => void;
  isDisabled: boolean;
}> = ({
  title,
  statusStyle,
  activeTab,
  projectCount,
  onTabProgram,
  onTabProject,
  onTabActivity,
  onClose,
  isDisabled
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
        className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/90 text-gray-600 shadow-sm border border-white/40 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 hover:scale-105 active:scale-95 ${isDisabled === true ? "cursor-not-allowed" : ""}`}
        disabled={isDisabled}
      >
        <X size={17} />
      </button>
    </div>
  );
};