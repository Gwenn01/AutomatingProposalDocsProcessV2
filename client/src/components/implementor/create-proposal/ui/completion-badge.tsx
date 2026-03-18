export const CompletionBadge = ({ pct }: { pct: number }) => {
  const isComplete = pct === 100;
  const isGood = pct >= 60;

  const accent = isComplete ? "#16a34a" : isGood ? "#d97706" : "#dc2626";
  const trackColor = isComplete ? "#dcfce7" : isGood ? "#fef3c7" : "#fee2e2";
  const label = isComplete ? "Complete" : isGood ? "In Progress" : "Incomplete";

  return (
    <div className="flex items-center gap-3">
      {/* pill label */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide"
        style={{ backgroundColor: trackColor, color: accent }}
      >
        {isComplete ? (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: accent }}
          />
        )}
        {label}
      </div>

      {/* progress bar + percentage */}
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: trackColor }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%`, backgroundColor: accent }}
          />
        </div>
        <span className="text-[11px] font-black tabular-nums" style={{ color: accent }}>
          {pct}%
        </span>
      </div>
    </div>
  );
};