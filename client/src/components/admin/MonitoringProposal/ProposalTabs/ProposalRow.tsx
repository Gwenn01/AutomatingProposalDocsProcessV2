import { Layers, Eye } from "lucide-react";
import type { Proposal } from "../types";
import { TYPE_BADGE, progressColor } from "../helper";
import { getStatusStyleAdmin } from "@/utils/statusStyles";

// ── Proposal table row ────────────────────────────────────────────────────────
const ProposalRow = ({
  doc,
  onView,
}: {
  doc: Proposal;
  onView: () => void;
}) => {
  const status = getStatusStyleAdmin(doc.status as any);

  // doc.progress is 0–1 (e.g. 0.50), convert to 0–100 for display
  const progPercent = Math.min(
    Math.round(parseFloat(String(doc.progress ?? "0")) * 100),
    100,
  );

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
      </td>

      {/* Type */}
      <td className="p-4 text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${TYPE_BADGE["Program"]}`}
        >
          <Layers size={11} />
          Program
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
      <td className="p-4 min-w-[140px]">
        <div className="flex flex-col items-center gap-1.5">
          {/* Track */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${progressColor(progPercent)}`}
              style={{ width: `${progPercent}%` }}
            />
          </div>
          {/* Label */}
          <p className="text-[11px] font-bold tabular-nums text-slate-500">
            {progPercent}%
          </p>
        </div>
      </td>

      {/* Action */}
      <td className="p-4 text-right">
        <button
          onClick={onView}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-500 transition-all duration-200"
        >
          <Eye size={15} />
        </button>
      </td>
    </tr>
  );
};

export default ProposalRow;
