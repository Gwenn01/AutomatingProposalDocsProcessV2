// ─────────────────────────────────────────────────────────────────────────────
// monitoring/MonitoringHeader.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { Calendar, Search, Table, Grid } from "lucide-react";
import NotificationBell, {
  type Notification,
} from "@/components/NotificationBell";

type Props = {
  selectedYear: number;
  yearKeys: number[];
  onYearChange: (year: number) => void;
  // ── Search ────────────────────────────────────────────────────────────────
  searchQuery: string;
  onSearchChange: (val: string) => void;
  // ── View mode ─────────────────────────────────────────────────────────────
  viewMode: "table" | "card";
  onViewModeChange: (mode: "table" | "card") => void;
  // ── Notifications ─────────────────────────────────────────────────────────
  notifications: Notification[];
  unreadCount: number;
  showNotifications: boolean;
  onToggleNotifications: () => void;
  onCloseNotifications: () => void;
  onReadNotification: (id: string | number) => void;
};

const MonitoringHeader = ({
  selectedYear,
  yearKeys,
  onYearChange,
  searchQuery,
  onSearchChange,
  //viewMode,
  //onViewModeChange,
  notifications,
  unreadCount,
  showNotifications,
  onToggleNotifications,
  onCloseNotifications,
  onReadNotification,
}: Props) => (
  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
    {/* Title */}
    <div>
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
        Proposal Monitoring
      </h1>
      <p className="text-sm text-slate-500 mt-0.5">
        Track proposal lifecycle, budget allocation, and implementor access.
      </p>
    </div>

    {/* Controls */}
    <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
      {/* Search */}
      <div className="relative w-full md:w-72 group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={16} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search proposals..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none text-[13px] font-semibold"
        />
      </div>

      {/* Year Selector */}
      {yearKeys.length > 0 ? (
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-sm h-11">
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
      ) : (
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-sm h-11 text-sm text-slate-400 font-medium">
          <Calendar size={14} className="text-slate-300" />
          No proposals yet
        </div>
      )}

      {/* View Switch */}
      {/* <div className="flex items-center bg-slate-100 p-1 rounded-[16px] border border-slate-200">
        <button
          onClick={() => onViewModeChange("table")}
          className={`p-2 rounded-[12px] transition-all ${
            viewMode === "table"
              ? "bg-white text-[#1cb35a] shadow-sm"
              : "text-slate-400"
          }`}
        >
          <Table size={16} />
        </button>
        <button
          onClick={() => onViewModeChange("card")}
          className={`p-2 rounded-[12px] transition-all ${
            viewMode === "card"
              ? "bg-white text-[#1cb35a] shadow-sm"
              : "text-slate-400"
          }`}
        >
          <Grid size={16} />
        </button>
      </div> */}

      {/* Notification Bell */}
      <NotificationBell
        notifications={notifications}
        unreadCount={unreadCount}
        show={showNotifications}
        onToggle={onToggleNotifications}
        onClose={onCloseNotifications}
        onRead={onReadNotification}
      />
    </div>
  </div>
);

export default MonitoringHeader;
