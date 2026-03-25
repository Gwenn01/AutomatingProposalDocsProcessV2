import { useState } from "react";
import {
  Settings,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  Layers,
  BarChart3,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  Proposal,
  ProposalType,
  YearConfig,
  ImplementorLock,
} from "./types";
import { formatBudget, TYPE_BADGE } from "./helper";

// ── Budget gauge ──────────────────────────────────────────────────────────────
const BudgetGauge = ({ used, total }: { used: number; total: number }) => {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const color =
    pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-amber-400" : "bg-emerald-500";
  return (
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

// ── Year config panel ─────────────────────────────────────────────────────────
const YearConfigPanel = ({
  config,
  onToggleLock,
  onBudgetChange,
}: {
  config: YearConfig;
  onToggleLock: () => void;
  onBudgetChange: (val: number) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(config.total_budget));
  const pct =
    config.total_budget > 0
      ? Math.min((config.used_budget / config.total_budget) * 100, 100).toFixed(
          1,
        )
      : "0.0";
  const remaining = config.total_budget - config.used_budget;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
            <Settings size={16} className="text-slate-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Year Configuration
            </p>
            <p className="text-base font-bold text-slate-800">{config.year}</p>
          </div>
        </div>
        <button
          onClick={onToggleLock}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all duration-200 ${
            config.is_locked
              ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-500 hover:text-white"
              : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white"
          }`}
        >
          {config.is_locked ? <Lock size={13} /> : <Unlock size={13} />}
          {config.is_locked ? "Locked" : "Open"}
        </button>
      </div>

      {/* Budget */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Annual Budget
          </p>
          <button
            onClick={() => {
              if (editing) onBudgetChange(Number(draft));
              setEditing(!editing);
            }}
            className="text-xs font-bold text-indigo-500 hover:text-indigo-700"
          >
            {editing ? "Save" : "Edit"}
          </button>
        </div>

        {editing ? (
          <input
            type="number"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full border border-indigo-200 rounded-lg px-4 py-2 text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        ) : (
          <p className="text-xl font-bold text-slate-800">
            {formatBudget(config.total_budget)}
          </p>
        )}

        <BudgetGauge used={config.used_budget} total={config.total_budget} />

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Used",
              value: formatBudget(config.used_budget),
              color: "text-slate-700",
            },
            {
              label: "Remaining",
              value: formatBudget(remaining),
              color: remaining < 0 ? "text-rose-600" : "text-emerald-600",
            },
            {
              label: "Consumed",
              value: `${pct}%`,
              color: Number(pct) >= 90 ? "text-rose-500" : "text-amber-500",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center"
            >
              <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {config.is_locked && (
        <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
          <AlertTriangle size={14} className="text-rose-500 flex-shrink-0" />
          <p className="text-xs font-semibold text-rose-600">
            All implementors are{" "}
            <span className="font-bold underline">blocked</span> from creating
            new proposals for {config.year}.
          </p>
        </div>
      )}
    </div>
  );
};

// ── Budget by type panel ──────────────────────────────────────────────────────
const TYPE_ICON: Record<ProposalType, LucideIcon> = {
  Program: Layers,
  Project: BarChart3,
  Activity,
};

const BudgetByType = ({
  proposals,
  totalBudget,
}: {
  proposals: Proposal[];
  totalBudget: number;
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
      Budget Breakdown by Type
    </p>
    {(["Program", "Project", "Activity"] as ProposalType[]).map((t) => {
      const Icon = TYPE_ICON[t];
      const total = proposals
        .filter((p) => p.proposal_type === t)
        .reduce((s, p) => s + (p.budget_requested ?? 0), 0);
      const frac = totalBudget > 0 ? (total / totalBudget) * 100 : 0;
      return (
        <div key={t} className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${TYPE_BADGE[t]}`}
            >
              <Icon size={11} /> {t}
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {formatBudget(total)}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-indigo-400 transition-all duration-700"
              style={{ width: `${frac}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-medium text-right">
            {frac.toFixed(1)}% of total
          </p>
        </div>
      );
    })}
  </div>
);

// ── Budget request queue ──────────────────────────────────────────────────────
const BudgetRequestQueue = ({
  implementors,
  onApprove,
}: {
  implementors: ImplementorLock[];
  onApprove: (id: number) => void;
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Budget Requests
      </p>
      {implementors.some((i) => i.has_pending_budget_request) && (
        <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200 px-2 py-1 rounded-full animate-pulse">
          {implementors.filter((i) => i.has_pending_budget_request).length}{" "}
          Pending
        </span>
      )}
    </div>
    <div className="space-y-2">
      {implementors.map((imp) => (
        <div
          key={imp.user_id}
          className={`rounded-xl border p-3.5 transition-all duration-200 ${
            imp.has_pending_budget_request
              ? "bg-amber-50/60 border-amber-100"
              : "bg-slate-50/60 border-slate-100"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                {imp.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">{imp.name}</p>
                <p className="text-[10px] text-slate-400">
                  {formatBudget(imp.total_budget_used)} used
                </p>
              </div>
            </div>
            {imp.has_pending_budget_request ? (
              <button
                onClick={() => onApprove(imp.user_id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all duration-200"
              >
                <CheckCircle2 size={11} /> Approve
              </button>
            ) : (
              <CheckCircle2 size={15} className="text-slate-200" />
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Main budget tab ───────────────────────────────────────────────────────────
type Props = {
  config: YearConfig;
  proposals: Proposal[];
  implementors: ImplementorLock[];
  onToggleLock: () => void;
  onBudgetChange: (val: number) => void;
  onApproveRequest: (id: number) => void;
};

const BudgetTab = ({
  config,
  proposals,
  implementors,
  onToggleLock,
  onBudgetChange,
  onApproveRequest,
}: Props) => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <div className="xl:col-span-2 space-y-6">
      <YearConfigPanel
        config={config}
        onToggleLock={onToggleLock}
        onBudgetChange={onBudgetChange}
      />
      <BudgetByType proposals={proposals} totalBudget={config.total_budget} />
    </div>
    <div>
      <BudgetRequestQueue
        implementors={implementors}
        onApprove={onApproveRequest}
      />
    </div>
  </div>
);

export default BudgetTab;
