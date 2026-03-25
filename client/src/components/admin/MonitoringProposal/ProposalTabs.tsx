import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  FileText,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Layers,
  BarChart3,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Proposal, FilterType, StatusFilter, ProposalType } from "./types";
import { getProgress, formatBudget, TYPE_BADGE, progressColor } from "./helper";
import { getStatusStyleAdmin } from "@/utils/statusStyles";

// ── Type icons map ────────────────────────────────────────────────────────────
const TYPE_ICON: Record<ProposalType, LucideIcon> = {
  Program: Layers,
  Project: BarChart3,
  Activity: Activity,
};

// ── Proposal table row ────────────────────────────────────────────────────────
const ProposalRow = ({ doc }: { doc: Proposal }) => {
  const status = getStatusStyleAdmin(doc.status as any);
  const prog = getProgress(doc.status);
  const Icon = TYPE_ICON[doc.proposal_type];
  const overBudget =
    (doc.budget_requested ?? 0) > (doc.budget_approved ?? 0) &&
    doc.budget_approved !== 0;

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors group">
      {/* Title */}
      <td className="p-4">
        <p className="font-semibold text-sm text-slate-800 group-hover:text-emerald-800 transition-colors">
          {doc.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
            ID-{String(doc.id).padStart(4, "0")}
          </span>
          {doc.created_by && (
            <span className="text-[10px] text-slate-400">{doc.created_by}</span>
          )}
        </div>
        {doc.proposal_type === "Activity" && (
          <p className="text-[10px] text-slate-400 mt-0.5">
            {doc.parent_program} → {doc.parent_project}
          </p>
        )}
      </td>

      {/* Type */}
      <td className="p-4 text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${TYPE_BADGE[doc.proposal_type]}`}
        >
          <Icon size={11} />
          {doc.proposal_type}
        </span>
      </td>

      {/* Status */}
      <td className="p-4 text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${status.className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {status.label}
        </span>
      </td>

      {/* Progress */}
      <td className="p-4 min-w-[130px]">
        <div className="w-full bg-slate-100 h-2 rounded-full">
          <div
            className={`h-2 rounded-full transition-all duration-700 ${progressColor(prog)}`}
            style={{ width: `${prog}%` }}
          />
        </div>
        <p className="text-[10px] text-center mt-1 font-semibold text-slate-500">
          {prog}%
        </p>
      </td>

      {/* Budget */}
      <td className="p-4 text-center">
        {doc.budget_requested ? (
          <div>
            <p
              className={`text-sm font-semibold ${overBudget ? "text-rose-600" : "text-slate-700"}`}
            >
              {formatBudget(doc.budget_requested)}
            </p>
            {overBudget && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full mt-0.5">
                <AlertTriangle size={8} /> Over
              </span>
            )}
          </div>
        ) : (
          <span className="text-slate-300 text-sm">—</span>
        )}
      </td>

      {/* Action */}
      <td className="p-4 text-right">
        <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-500 transition-all duration-200">
          <Eye size={15} />
        </button>
      </td>
    </tr>
  );
};

// ── Main tab ──────────────────────────────────────────────────────────────────
type Props = { proposals: Proposal[] };

const ITEMS_PER_PAGE = 8;

const ProposalsTab = ({ proposals }: Props) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [statusFilter, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, statusFilter]);

  const filtered = proposals.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.proposal_type === typeFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const counts: Record<FilterType, number> = {
    all: proposals.length,
    Program: proposals.filter((p) => p.proposal_type === "Program").length,
    Project: proposals.filter((p) => p.proposal_type === "Project").length,
    Activity: proposals.filter((p) => p.proposal_type === "Activity").length,
  };

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={15}
          />
          <input
            type="text"
            placeholder="Search proposals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
          />
        </div>

        {/* Type pills */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "Program", "Project", "Activity"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${
                typeFilter === t
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {t === "all" ? `All (${counts.all})` : `${t} (${counts[t]})`}
            </button>
          ))}
        </div>

        {/* Status dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <Filter size={13} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="for_revision">For Revision</option>
            <option value="for_approval">For Approval</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {[
                "Proposal",
                "Type",
                "Status",
                "Progress",
                "Budget",
                "Action",
              ].map((h, i) => (
                <th
                  key={h}
                  className={`p-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 ${
                    i === 0
                      ? "text-left"
                      : i === 6
                        ? "text-right"
                        : "text-center"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((doc) => (
              <ProposalRow key={doc.id} doc={doc} />
            ))}
          </tbody>
        </table>

        {currentData.length === 0 && (
          <div className="p-16 text-center">
            <FileText size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              No proposals found
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-slate-500">
            Showing <strong className="text-slate-700">{startIndex + 1}</strong>
            –
            <strong className="text-slate-700">
              {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)}
            </strong>{" "}
            of <strong className="text-slate-700">{filtered.length}</strong>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold transition-all"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-white hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-xs font-semibold transition-all"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalsTab;
