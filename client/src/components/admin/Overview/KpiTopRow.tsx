import { CheckCircle2, Clock4 } from "lucide-react";

interface KpiTopRowProps {
  totalApprove?: number;
  totalPending?: number;
}

const KpiTopRow = ({ totalApprove = 0, totalPending = 0 }: KpiTopRowProps) => {
  const total = totalApprove + totalPending;
  const approvePercent =
    total > 0 ? Math.round((totalApprove / total) * 100) : 0;
  const pendingPercent =
    total > 0 ? Math.round((totalPending / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* ── Approved Card ── */}
      <div className="relative overflow-hidden rounded-xl bg-primaryGreen border-b border-white/10 px-8 pt-6 pb-5 flex flex-col gap-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.10)_0%,_transparent_65%)] pointer-events-none" />

        {/* Top: label + number / icon pill */}
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="font-semibold text-[11px] tracking-[0.15em] uppercase text-white/70">
              Total Approved
            </span>
            <p className="mt-1 text-4xl font-bold text-white tabular-nums drop-shadow-sm">
              {totalApprove.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/15 shadow-inner">
            <CheckCircle2
              size={15}
              strokeWidth={2.5}
              className="text-white/80"
            />
            <span className="text-sm font-semibold text-white">Approved</span>
          </div>
        </div>

        {/* Bottom: progress bar + percent */}
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
              Approval Rate
            </span>
            <span className="text-[11px] font-bold text-white/80">
              {approvePercent}%
            </span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-white/50 transition-all duration-700"
              style={{ width: `${approvePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Pending Card ── */}
      <div className="relative overflow-hidden rounded-xl bg-primaryGreen border-b border-white/10 px-8 pt-6 pb-5 flex flex-col gap-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.10)_0%,_transparent_65%)] pointer-events-none" />

        {/* Top: label + number / icon pill */}
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="font-semibold text-[11px] tracking-[0.15em] uppercase text-white/70">
              Total Pending
            </span>
            <p className="mt-1 text-4xl font-bold text-white tabular-nums drop-shadow-sm">
              {totalPending.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/15 shadow-inner">
            <Clock4 size={15} strokeWidth={2.5} className="text-white/80" />
            <span className="text-sm font-semibold text-white">Pending</span>
          </div>
        </div>

        {/* Bottom: progress bar + percent */}
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
              In Pipeline
            </span>
            <span className="text-[11px] font-bold text-white/80">
              {pendingPercent}%
            </span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-white/50 transition-all duration-700"
              style={{ width: `${pendingPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiTopRow;
