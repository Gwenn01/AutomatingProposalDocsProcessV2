import { useState } from "react";
import {
  CheckCircle2,
  Layers,
  Eye,
  TrendingUp,
  TrendingDown,
  PencilLine,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Proposal } from "../types";
import { TYPE_BADGE } from "../helper";
import { getStatusStyleAdmin } from "@/utils/statusStyles";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });

const toNum = (v: string | number | undefined | null) =>
  parseFloat(String(v ?? "0")) || 0;
const ITEMS_PER_PAGE = 8;

const ProposalsBudgetTable = ({
  proposals,
  totalBudget,
  onView,
  onApproveBudget,
  onSetBudget,
}: {
  proposals: Proposal[];
  totalBudget: number;
  onView: (id: number) => void;
  onApproveBudget: (id: number) => void;
  onSetBudget: (id: number, val: number) => void;
}) => {
  const [budgetDrafts, setBudgetDrafts] = useState<Record<number, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const totalRequested = proposals.reduce(
    (s, p) => s + toNum(p.budget_requested),
    0,
  );
  const totalApproved = proposals.reduce(
    (s, p) => s + toNum(p.budget_approved),
    0,
  );
  const overBudget = totalApproved > totalBudget;

  const totalPages = Math.max(1, Math.ceil(proposals.length / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, proposals.length);
  const currentData = proposals.slice(startIndex, endIndex);

  const handleSave = (id: number) => {
    const val = Number(budgetDrafts[id] ?? 0);
    if (!isNaN(val)) onSetBudget(id, val);
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            Proposal Budget List
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            {proposals.length} proposals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Total Requested
            </p>
            <p className="text-sm font-black text-slate-700 tabular-nums">
              {fmt(totalRequested)}
            </p>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Total Approved
            </p>
            <p
              className={`text-sm font-black tabular-nums ${overBudget ? "text-rose-600" : "text-emerald-600"}`}
            >
              {fmt(totalApproved)}
            </p>
          </div>
          {overBudget && (
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200 px-2.5 py-1.5 rounded-full">
              <TrendingUp size={10} /> Over ceiling
            </span>
          )}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {[
              "Proposal",
              "Type",
              "Status",
              "Budget Requested",
              "Approved Budget",
              "Action",
            ].map((h, i) => (
              <th
                key={h}
                className={`px-5 py-3 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 ${
                  i === 0 ? "text-left" : i === 5 ? "text-right" : "text-center"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {currentData.map((p) => {
            const st = getStatusStyleAdmin(p.status as any);
            const isApproved = p.status === "approved";
            const isEditing = editingId === p.id;
            const approved = toNum(p.budget_approved);
            const requested = toNum(p.budget_requested);
            const over = approved > 0 && approved > requested;

            return (
              <tr
                key={p.id}
                className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors group"
              >
                {/* Title */}
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-sm text-slate-800 group-hover:text-emerald-700 transition-colors">
                    {p.title}
                  </p>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                    ID-{String(p.id).padStart(4, "0")}
                  </span>
                  {p.created_by && (
                    <span className="text-[10px] text-slate-400 ml-1">
                      {p.created_by}
                    </span>
                  )}
                </td>

                {/* Type */}
                <td className="px-5 py-3.5 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${TYPE_BADGE[p.proposal_type]}`}
                  >
                    <Layers size={11} /> {p.proposal_type}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-3.5 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${st.className}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {st.label}
                  </span>
                </td>

                {/* Budget Requested */}
                <td className="px-5 py-3.5 text-center">
                  <p className="text-sm font-bold tabular-nums text-slate-700">
                    {fmt(requested)}
                  </p>
                </td>

                {/* Approved Budget — inline edit */}
                <td className="px-5 py-3.5 text-center">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 justify-center">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                          ₱
                        </span>
                        <input
                          type="number"
                          autoFocus
                          value={budgetDrafts[p.id] ?? approved}
                          onChange={(e) =>
                            setBudgetDrafts((prev) => ({
                              ...prev,
                              [p.id]: e.target.value,
                            }))
                          }
                          className="w-32 pl-6 pr-2 py-1.5 border-2 border-indigo-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white tabular-nums"
                        />
                      </div>
                      <button
                        onClick={() => handleSave(p.id)}
                        className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
                      >
                        <Save size={11} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ) : approved > 0 ? (
                    <div>
                      <p
                        className={`text-sm font-bold tabular-nums ${isApproved ? "text-emerald-600" : over ? "text-rose-600" : "text-slate-700"}`}
                      >
                        {fmt(approved)}
                      </p>
                      {over && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-500 mt-0.5">
                          <TrendingUp size={9} /> Over request
                        </span>
                      )}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 mt-0.5">
                          <TrendingDown size={9} /> Counted
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-300 text-sm font-bold">—</span>
                  )}
                </td>

                {/* Action */}
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {!isApproved && (
                      <button
                        onClick={() => {
                          setEditingId(p.id);
                          setBudgetDrafts((prev) => ({
                            ...prev,
                            [p.id]: String(approved || requested),
                          }));
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-500 hover:text-white text-indigo-600 border border-indigo-200 text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                      >
                        <PencilLine size={11} /> Set
                      </button>
                    )}
                    {p.status === "for_approval" && (
                      <button
                        onClick={() => onApproveBudget(p.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                      >
                        <CheckCircle2 size={11} /> Approve
                      </button>
                    )}
                    <button
                      onClick={() => onView(p.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-500 text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                    >
                      <Eye size={12} /> View
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>

        {/* Footer — totals + pagination */}
        <tfoot className="bg-slate-50 border-t-2 border-slate-200">
          <tr>
            {/* Left: range + total count */}
            <td className="px-5 py-3.5" colSpan={2}>
              <p className="text-xs text-slate-500">
                <strong className="text-slate-700">
                  {proposals.length > 0 ? startIndex + 1 : 0}
                </strong>
                –<strong className="text-slate-700">{endIndex}</strong> of{" "}
                <strong className="text-slate-700">{proposals.length}</strong>{" "}
                proposals
              </p>
            </td>

            {/* Center: total requested */}
            <td className="px-5 py-3.5 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Page
              </p>
              <p className="text-xs font-black text-slate-700">
                {page} of {totalPages}
              </p>
            </td>

            <td className="px-5 py-3.5 text-center">
              <p className="text-sm font-black text-slate-800 tabular-nums">
                {fmt(totalRequested)}
              </p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                requested
              </p>
            </td>

            {/* Right: prev / next */}
            <td className="px-5 py-3.5 text-right" colSpan={2}>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold transition-all"
                >
                  <ChevronLeft size={13} /> Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-xs font-semibold transition-all"
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ProposalsBudgetTable;
