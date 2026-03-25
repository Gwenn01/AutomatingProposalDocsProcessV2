import {
  FileText,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Proposal, YearConfig, ImplementorLock } from "./types";
import { formatBudget } from "./helper";

// ── Single stat card ──────────────────────────────────────────────────────────
type CardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  iconBg: string;
};

const StatCard = ({ icon, label, value, sub, iconBg }: CardProps) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}
    >
      {icon}
    </div>
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">
      {label}
    </p>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);

// ── Stats row ─────────────────────────────────────────────────────────────────
type Props = {
  proposals: Proposal[];
  config: YearConfig;
  implementors: ImplementorLock[];
};

const MonitoringStats = ({ proposals, config, implementors }: Props) => {
  const approved = proposals.filter((p) => p.status === "approved").length;
  const inProgress = proposals.filter(
    (p) => !["approved", "draft"].includes(p.status),
  ).length;
  const pending = implementors.filter(
    (i) => i.has_pending_budget_request,
  ).length;
  const programs = proposals.filter(
    (p) => p.proposal_type === "Program",
  ).length;
  const projects = proposals.filter(
    (p) => p.proposal_type === "Project",
  ).length;
  const activities = proposals.filter(
    (p) => p.proposal_type === "Activity",
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={<FileText size={18} className="text-indigo-600" />}
        iconBg="bg-indigo-50"
        label="Total Proposals"
        value={String(proposals.length)}
        sub={`${programs} Prog · ${projects} Proj · ${activities} Act`}
      />
      <StatCard
        icon={<CheckCircle2 size={18} className="text-emerald-600" />}
        iconBg="bg-emerald-50"
        label="Approved"
        value={String(approved)}
        sub={`${inProgress} still in progress`}
      />
      <StatCard
        icon={<DollarSign size={18} className="text-amber-600" />}
        iconBg="bg-amber-50"
        label="Budget Used"
        value={formatBudget(config.used_budget)}
        sub={`of ${formatBudget(config.total_budget)}`}
      />
      <StatCard
        icon={<AlertTriangle size={18} className="text-rose-500" />}
        iconBg="bg-rose-50"
        label="Budget Requests"
        value={String(pending)}
        sub="pending approval"
      />
    </div>
  );
};

export default MonitoringStats;
