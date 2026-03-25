import type { ActiveTab } from "./types";

type Tab = { key: ActiveTab; label: string; emoji: string };

const TABS: Tab[] = [
  { key: "proposals", label: "Proposals", emoji: "📋" },
  { key: "budget", label: "Budget", emoji: "💰" },
  { key: "access", label: "Access", emoji: "🔒" },
];

type Props = {
  active: ActiveTab;
  onChange: (tab: ActiveTab) => void;
};

const MonitoringTabs = ({ active, onChange }: Props) => (
  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
    {TABS.map(({ key, label, emoji }) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        className={`px-5 py-2 rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
          active === key
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        {emoji} {label}
      </button>
    ))}
  </div>
);

export default MonitoringTabs;
