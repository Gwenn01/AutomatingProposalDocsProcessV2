import { useState, useEffect } from "react";
import {
  Settings,
  Lock,
  Unlock,
  AlertTriangle,
  ShieldAlert,
  PencilLine,
  Save,
} from "lucide-react";
import type { YearConfig } from "../types";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });

const toNum = (v: string | number | undefined | null) =>
  parseFloat(String(v ?? "0")) || 0;

// ── Year Config Panel ─────────────────────────────────────────────────────────
const YearConfigPanel = ({
  config,
  usedBudget,
  onToggleLock,
  onBudgetChange,
}: {
  config: YearConfig;
  usedBudget: number;
  onToggleLock: () => void;
  onBudgetChange: (val: number) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(config.total_budget));

  useEffect(() => {
    setDraft(String(config.total_budget));
  }, [config.total_budget]);

  const total = toNum(config.total_budget);
  const remaining = total - usedBudget;
  const over = usedBudget > total;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
            <Settings size={16} className="text-slate-400" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
              Year Configuration
            </p>
            <p className="text-xl font-black text-slate-800">{config.year}</p>
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

      {/* Budget setter */}
      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
            Annual Budget Ceiling
          </p>
          <button
            onClick={() => {
              if (editing) {
                const val = Number(draft);
                if (!isNaN(val)) onBudgetChange(val);
              }
              setEditing((e) => !e);
            }}
            className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
              editing
                ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600"
                : "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            }`}
          >
            {editing ? (
              <>
                <Save size={11} /> Save
              </>
            ) : (
              <>
                <PencilLine size={11} /> Edit
              </>
            )}
          </button>
        </div>

        {editing ? (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              ₱
            </span>
            <input
              type="number"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border-2 border-indigo-300 rounded-xl text-2xl font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            />
          </div>
        ) : (
          <p className="text-3xl font-black text-slate-800 tabular-nums">
            {fmt(total)}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-white rounded-xl border border-slate-100 px-4 py-3">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
              Used
            </p>
            <p className="text-sm font-black tabular-nums text-slate-700 mt-0.5">
              {fmt(usedBudget)}
            </p>
          </div>
          <div
            className={`rounded-xl border px-4 py-3 ${over ? "bg-rose-50 border-rose-100" : "bg-white border-slate-100"}`}
          >
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
              Remaining
            </p>
            <p
              className={`text-sm font-black tabular-nums mt-0.5 ${over ? "text-rose-600" : "text-emerald-600"}`}
            >
              {over ? "-" : ""}
              {fmt(Math.abs(remaining))}
            </p>
          </div>
        </div>

        {over && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
            <ShieldAlert size={13} className="text-rose-500 flex-shrink-0" />
            <p className="text-[11px] font-semibold text-rose-600">
              Exceeded by <strong>{fmt(Math.abs(remaining))}</strong> — revise
              the ceiling or reject pending proposals.
            </p>
          </div>
        )}
      </div>

      {config.is_locked && (
        <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
          <AlertTriangle size={14} className="text-rose-500 flex-shrink-0" />
          <p className="text-xs font-semibold text-rose-600">
            Implementors are{" "}
            <span className="font-bold underline">blocked</span> from creating
            new proposals for {config.year}.
          </p>
        </div>
      )}
    </div>
  );
};

export default YearConfigPanel;
