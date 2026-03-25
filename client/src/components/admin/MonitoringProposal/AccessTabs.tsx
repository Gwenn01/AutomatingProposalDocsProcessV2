import { Lock, Unlock, Shield, FileText, DollarSign } from "lucide-react";
import type { YearConfig, ImplementorLock } from "./types";
import { formatBudget } from "./helper";

// ── Global lock banner ────────────────────────────────────────────────────────
const GlobalLockBanner = ({
  config,
  selectedYear,
  onToggle,
}: {
  config: YearConfig;
  selectedYear: number;
  onToggle: () => void;
}) => (
  <div
    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border px-6 py-5 transition-all duration-300 ${
      config.is_locked
        ? "bg-rose-50 border-rose-100"
        : "bg-emerald-50 border-emerald-100"
    }`}
  >
    <div className="flex items-center gap-4">
      {config.is_locked ? (
        <Lock size={20} className="text-rose-500 flex-shrink-0" />
      ) : (
        <Unlock size={20} className="text-emerald-600 flex-shrink-0" />
      )}
      <div>
        <p
          className={`font-bold text-sm ${config.is_locked ? "text-rose-700" : "text-emerald-700"}`}
        >
          {config.is_locked
            ? `Proposal creation is LOCKED for ${selectedYear}`
            : `Proposal creation is OPEN for ${selectedYear}`}
        </p>
        <p
          className={`text-xs mt-0.5 ${config.is_locked ? "text-rose-500" : "text-emerald-600"}`}
        >
          {config.is_locked
            ? "No implementor can submit new proposals until this is unlocked."
            : "Implementors can create and submit new proposals."}
        </p>
      </div>
    </div>
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex-shrink-0 ${
        config.is_locked
          ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
          : "bg-rose-500 text-white hover:bg-rose-600 shadow-sm"
      }`}
    >
      {config.is_locked ? <Unlock size={13} /> : <Lock size={13} />}
      {config.is_locked ? "Unlock Submissions" : "Lock All Submissions"}
    </button>
  </div>
);

// ── Implementor access table ──────────────────────────────────────────────────
const ImplementorTable = ({
  implementors,
  onToggle,
  onApproveBudget,
}: {
  implementors: ImplementorLock[];
  onToggle: (id: number) => void;
  onApproveBudget: (id: number) => void;
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    {/* Panel header */}
    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
        <Shield size={16} className="text-slate-500" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Implementor Access Control
        </p>
        <p className="text-sm font-semibold text-slate-700">
          Per-user proposal creation toggle
        </p>
      </div>
    </div>

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {[
              "Implementor",
              "Proposals",
              "Budget Used",
              "Budget Request",
              "Access",
              "Action",
            ].map((h, i) => (
              <th
                key={h}
                className={`p-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 ${
                  i === 0 ? "text-left" : i === 5 ? "text-right" : "text-center"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {implementors.map((imp) => (
            <tr
              key={imp.user_id}
              className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors"
            >
              {/* Name */}
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-500 flex-shrink-0">
                    {imp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">
                      {imp.name}
                    </p>
                    <p className="text-[11px] text-slate-400">{imp.email}</p>
                  </div>
                </div>
              </td>

              {/* Proposals count */}
              <td className="p-4 text-center">
                <span className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-600">
                  <FileText size={11} /> {imp.proposals_count}
                </span>
              </td>

              {/* Budget used */}
              <td className="p-4 text-center">
                <span className="text-sm font-semibold text-slate-700">
                  {formatBudget(imp.total_budget_used)}
                </span>
              </td>

              {/* Budget request */}
              <td className="p-4 text-center">
                {imp.has_pending_budget_request ? (
                  <button
                    onClick={() => onApproveBudget(imp.user_id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-white transition-all duration-200 animate-pulse"
                  >
                    <DollarSign size={11} /> Pending
                  </button>
                ) : (
                  <span className="text-slate-300 text-sm font-semibold">
                    —
                  </span>
                )}
              </td>

              {/* Access badge */}
              <td className="p-4 text-center">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    imp.is_locked
                      ? "bg-rose-50 text-rose-600 border-rose-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${imp.is_locked ? "bg-rose-500" : "bg-emerald-500 animate-pulse"}`}
                  />
                  {imp.is_locked ? "Locked" : "Active"}
                </div>
              </td>

              {/* Toggle button */}
              <td className="p-4 text-right">
                <button
                  onClick={() => onToggle(imp.user_id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 ${
                    imp.is_locked
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white"
                      : "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-500 hover:text-white"
                  }`}
                >
                  {imp.is_locked ? <Unlock size={12} /> : <Lock size={12} />}
                  {imp.is_locked ? "Unlock" : "Lock"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ── Main access tab ───────────────────────────────────────────────────────────
type Props = {
  config: YearConfig;
  selectedYear: number;
  implementors: ImplementorLock[];
  onToggleGlobalLock: () => void;
  onToggleImplementor: (id: number) => void;
  onApproveBudget: (id: number) => void;
};

const AccessTab = ({
  config,
  selectedYear,
  implementors,
  onToggleGlobalLock,
  onToggleImplementor,
  onApproveBudget,
}: Props) => (
  <div className="space-y-6">
    <GlobalLockBanner
      config={config}
      selectedYear={selectedYear}
      onToggle={onToggleGlobalLock}
    />
    <ImplementorTable
      implementors={implementors}
      onToggle={onToggleImplementor}
      onApproveBudget={onApproveBudget}
    />
  </div>
);

export default AccessTab;
