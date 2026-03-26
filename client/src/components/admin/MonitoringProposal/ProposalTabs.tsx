import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Proposal, StatusFilter } from "./types";
import ProposalRow from "./ProposalTabs/ProposalRow";

type Props = { proposals: Proposal[] };
const ITEMS_PER_PAGE = 8;

const ProposalsTab = ({ proposals }: Props) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filtered = proposals.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filtered.length);
  const currentData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
              {["Proposal", "Type", "Status", "Progress", "Action"].map(
                (h, i) => (
                  <th
                    key={h}
                    className={`p-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 ${
                      i === 0
                        ? "text-left"
                        : i === 5
                          ? "text-right"
                          : "text-center"
                    }`}
                  >
                    {h}
                  </th>
                ),
              )}
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

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/60">
          {/* Left: range + total */}
          <p className="text-xs text-slate-500">
            <strong className="text-slate-700">
              {filtered.length > 0 ? startIndex + 1 : 0}
            </strong>
            –<strong className="text-slate-700">{endIndex}</strong> of{" "}
            <strong className="text-slate-700">{filtered.length}</strong>{" "}
            proposals
          </p>

          {/* Center: page indicator */}
          <p className="text-xs text-slate-500">
            Page{" "}
            <strong className="text-slate-700">
              {totalPages > 0 ? page : 0}
            </strong>{" "}
            of <strong className="text-slate-700">{totalPages}</strong>
          </p>

          {/* Right: prev / next */}
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || totalPages === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold transition-all"
            >
              <ChevronLeft size={13} /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-xs font-semibold transition-all"
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalsTab;
