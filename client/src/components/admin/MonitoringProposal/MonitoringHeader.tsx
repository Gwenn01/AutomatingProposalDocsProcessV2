// ─────────────────────────────────────────────────────────────────────────────
// monitoring/MonitoringHeader.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { Calendar, Lock } from "lucide-react";
import type { YearConfig } from "./types";

type Props = {
  selectedYear: number;
  yearKeys: number[];
  config: YearConfig;
  onYearChange: (year: number) => void;
};

const MonitoringHeader = ({
  selectedYear,
  yearKeys,
  config,
  onYearChange,
}: Props) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
        Proposal Monitoring
      </h1>
      <p className="text-sm text-slate-500 mt-0.5">
        Track proposal lifecycle, budget allocation, and implementor access.
      </p>
    </div>

    <div className="flex items-center gap-3">
      {/* Year selector */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-sm">
        <Calendar size={14} className="text-slate-400" />
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="text-sm font-semibold text-slate-700 bg-transparent outline-none cursor-pointer"
        >
          {yearKeys.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Lock badge */}
      {config.is_locked && (
        <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-600 px-3.5 py-2 rounded-xl text-xs font-bold">
          <Lock size={12} />
          Submissions Locked
        </div>
      )}
    </div>
  </div>
);

export default MonitoringHeader;
