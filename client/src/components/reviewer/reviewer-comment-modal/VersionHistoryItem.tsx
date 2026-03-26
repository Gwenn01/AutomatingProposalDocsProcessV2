import type { History } from "@/types/reviewer-comment-types";

export const VersionHistoryItem: React.FC<{
  item: History;
  index: number;
  total: number;
  isSelected: boolean;
  onClick: () => void;
}> = ({ item, index, total, isSelected, onClick }) => {
  const isCurrent = item.status === "current";
 
  return (
    <div
      onClick={onClick}
      className={[
        "group relative flex items-start gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-150",
        isSelected ? "bg-emerald-50 ring-1 ring-emerald-400/60" : "hover:bg-gray-50",
      ].join(" ")}
    >
      {/* Timeline dot + connector */}
      <div className="flex flex-col items-center pt-0.5 gap-0">
        <div
          className={[
            "w-2 h-2 rounded-full mt-1 shrink-0 transition-colors duration-150",
            isCurrent
              ? "bg-emerald-500 ring-2 ring-emerald-200"
              : isSelected
              ? "bg-emerald-400"
              : "bg-gray-300 group-hover:bg-gray-400",
          ].join(" ")}
        />
        {index < total - 1 && (
          <div
            className="w-px flex-1 bg-gray-100 mt-1"
            style={{ minHeight: 24 }}
          />
        )}
      </div>
 
      {/* Content */}
      <div className="flex-1 min-w-0 pb-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-sm font-medium leading-snug truncate ${
              isSelected ? "text-emerald-800" : "text-gray-800"
            }`}
          >
            {isCurrent ? "Current Version" : `Revision ${item.version}`}
          </span>
          {isCurrent && (
            <span className="shrink-0 text-[9px] font-semibold uppercase tracking-widest bg-emerald-100 text-emerald-600 rounded-full px-1.5 py-0.5">
              Active
            </span>
          )}
        </div>
        <p
          className={`text-[11px] mt-0.5 ${
            isSelected ? "text-emerald-600/70" : "text-gray-400"
          }`}
        >
          Title: <span>{item.program_title}</span>
        </p>
      </div>
 
      {/* Check mark when selected */}
      {isSelected && (
        <div className="shrink-0 self-center">
          <svg
            className="w-3.5 h-3.5 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
};