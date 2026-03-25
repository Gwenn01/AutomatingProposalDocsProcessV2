import { getWorkflowCardStyle } from "@/utils/statusCardStyle";

interface StatusItem {
  key: string;
  value: number;
}

interface WorkflowBreakdownProps {
  statusBarData: StatusItem[];
}

const WorkflowBreakdown = ({ statusBarData }: WorkflowBreakdownProps) => {
  return (
    <div className="space-y-6">
      {/* ── Section Header ── */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-semibold text-[11px] tracking-[0.15em] uppercase text-slate-400">
            Workflow Breakdown
          </h2>
          <p className="text-[10px] text-slate-400/70 font-medium mt-0.5">
            Live process tracking
          </p>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
      </div>

      {/* ── Cards Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statusBarData.map((item, index) => {
          const config = getWorkflowCardStyle(item.key);
          const StatusIcon = config.icon;

          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm p-6 flex flex-col justify-between gap-4"
            >
              {/* Watermark icon */}
              <StatusIcon
                size={120}
                strokeWidth={1}
                className="absolute -right-4 -bottom-4 opacity-[0.04] pointer-events-none"
                style={{ color: config.color }}
              />

              {/* Top: icon box + badge */}
              <div className="flex items-start justify-between relative z-10">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${config.color}15`,
                    color: config.color,
                  }}
                >
                  <StatusIcon size={18} strokeWidth={2} />
                </div>

                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border"
                  style={{
                    backgroundColor: `${config.color}08`,
                    borderColor: `${config.color}25`,
                  }}
                >
                  <div
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: config.color }}
                  />
                  <span
                    className="font-semibold text-[9px] uppercase tracking-[0.15em] whitespace-nowrap"
                    style={{ color: config.color }}
                  >
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Middle: count + label */}
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-slate-800 tabular-nums tracking-tight leading-none">
                  {item.value.toLocaleString()}
                </h3>
                <p className="font-semibold text-[11px] tracking-[0.15em] uppercase text-slate-400 mt-1">
                  {config.label}
                </p>
              </div>

              {/* Bottom: description + progress bar */}
              <div className="relative z-10 space-y-2">
                <p className="text-[11px] text-slate-400 font-medium leading-snug">
                  {config.description}
                </p>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full w-full transition-all duration-700"
                    style={{ backgroundColor: config.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowBreakdown;
