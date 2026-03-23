// components/implementor/create-proposal/ui/BudgetIndicator.tsx

interface BudgetIndicatorProps {
  programTotal: number;
  usedByOthers: number;   // sum of all OTHER projects/activities already allocated
  currentAmount: number;  // sum of the form currently being edited
  label?: string;
}

function fmt(n: number) {
  return n.toLocaleString('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 });
}

export const BudgetIndicator = ({
  programTotal,
  usedByOthers,
  currentAmount,
  label = 'project',
}: BudgetIndicatorProps) => {
  if (!programTotal) return null;

  const totalUsed   = usedByOthers + currentAmount;
  const remaining   = programTotal - totalUsed;
  const usedPct     = Math.min((totalUsed / programTotal) * 100, 100);
  const othersPct   = Math.min((usedByOthers / programTotal) * 100, 100);
  const currentPct  = Math.min((currentAmount / programTotal) * 100, 100);
  const isOver      = totalUsed > programTotal;
  const isNearLimit = !isOver && usedPct >= 85;

  return (
    <div
      className={`rounded-2xl border-2 p-5 mb-1 transition-all duration-300
        ${isOver      ? 'border-red-300 bg-red-50'
        : isNearLimit ? 'border-amber-300 bg-amber-50'
        :               'border-emerald-200 bg-emerald-50/60'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full animate-pulse
            ${isOver ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <p className={`text-xs font-bold uppercase tracking-widest
            ${isOver ? 'text-red-700' : isNearLimit ? 'text-amber-700' : 'text-emerald-700'}`}>
            Program Budget Allocation
          </p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full
          ${isOver
            ? 'bg-red-100 text-red-700'
            : isNearLimit
            ? 'bg-amber-100 text-amber-700'
            : 'bg-emerald-100 text-emerald-700'}`}>
          {isOver ? `⚠ Over by ${fmt(Math.abs(remaining))}` : `${fmt(remaining)} remaining`}
        </span>
      </div>

      {/* Stacked progress bar */}
      <div className="relative h-5 bg-gray-200 rounded-full overflow-hidden mb-4 shadow-inner">
        {/* Other projects/activities portion */}
        <div
          className="absolute top-0 left-0 h-full bg-slate-400 transition-all duration-500 ease-out"
          style={{ width: `${othersPct}%` }}
        />
        {/* Current form portion */}
        <div
          className={`absolute top-0 h-full transition-all duration-500 ease-out
            ${isOver ? 'bg-red-500' : isNearLimit ? 'bg-amber-400' : 'bg-emerald-500'}`}
          style={{ left: `${othersPct}%`, width: `${Math.min(currentPct, 100 - othersPct)}%` }}
        />
        {/* Overflow stripe (when over budget) */}
        {isOver && (
          <div
            className="absolute top-0 right-0 h-full"
            style={{
              width: `${Math.min(((totalUsed - programTotal) / programTotal) * 100, 100)}%`,
              background: 'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 4px, #fca5a5 4px, #fca5a5 8px)',
            }}
          />
        )}
        {/* Percentage label inside bar */}
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow">
          {usedPct.toFixed(1)}% used
        </span>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-gray-100 border-2 border-gray-300 inline-block" />
            <span className="text-gray-500 font-medium">Program Total</span>
          </div>
          <span className="font-black text-gray-800 pl-4">{fmt(programTotal)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 inline-block" />
            <span className="text-gray-500 font-medium">Other {label}s</span>
          </div>
          <span className="font-black text-gray-800 pl-4">{fmt(usedByOthers)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm inline-block
              ${isOver ? 'bg-red-500' : isNearLimit ? 'bg-amber-400' : 'bg-emerald-500'}`} />
            <span className="text-gray-500 font-medium">This {label}</span>
          </div>
          <span className={`font-black pl-4 ${isOver ? 'text-red-700' : 'text-gray-800'}`}>
            {fmt(currentAmount)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm inline-block
              ${isOver ? 'bg-red-200' : 'bg-emerald-200'}`} />
            <span className="text-gray-500 font-medium">Remaining</span>
          </div>
          <span className={`font-black pl-4 ${isOver ? 'text-red-700' : 'text-emerald-700'}`}>
            {fmt(remaining)}
          </span>
        </div>
      </div>

      {/* Warning messages */}
      {isOver && (
        <div className="mt-3 flex items-start gap-2 bg-red-100 border border-red-200 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-red-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div>
            <p className="text-xs font-bold text-red-700">Budget Exceeded — Cannot Save</p>
            <p className="text-xs text-red-600 mt-0.5">
              This {label}'s budget exceeds the program allocation by <strong>{fmt(Math.abs(remaining))}</strong>.
              Reduce the budget before saving.
            </p>
          </div>
        </div>
      )}
      {isNearLimit && (
        <div className="mt-3 flex items-start gap-2 bg-amber-100 border border-amber-200 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
          </svg>
          <p className="text-xs text-amber-700 font-medium">
            <strong>Heads up:</strong> You've used {usedPct.toFixed(1)}% of the program budget. Only <strong>{fmt(remaining)}</strong> left.
          </p>
        </div>
      )}
    </div>
  );
};