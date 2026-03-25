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
    <div className="space-y-10 pt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h2 className="text-xs uppercase tracking-[0.4em] text-slate-400 font-black">
            Workflow Breakdown
          </h2>
          <p className="text-[10px] text-slate-400/80 font-medium italic">
            Live process tracking
          </p>
        </div>
        <div className="h-px w-2/3 bg-gradient-to-r from-slate-200 to-transparent" />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {statusBarData.map((item, index) => {
          const config = getWorkflowCardStyle(item.key);
          const StatusIcon = config.icon;

          return (
            <div key={index} className="relative h-56 rounded-[2.5rem]">
              {/* Background Glow */}
              <div
                className="absolute inset-0 rounded-[2.5rem] opacity-5 blur-xl"
                style={{ backgroundColor: config.color }}
              />

              <div className="relative h-full w-full bg-white border border-slate-100 rounded-[2.2rem] p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col justify-between">
                {/* Background Large Icon */}
                <StatusIcon
                  size={140}
                  className="absolute -right-6 -bottom-6 opacity-[0.04] -rotate-12"
                  style={{ color: config.color }}
                />

                {/* Top: Icon + Badge */}
                <div className="flex justify-between items-start relative z-10">
                  <div
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: `${config.color}10`,
                      color: config.color,
                    }}
                  >
                    <StatusIcon size={24} strokeWidth={2.5} />
                  </div>

                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md"
                    style={{
                      backgroundColor: `${config.color}08`,
                      borderColor: `${config.color}25`,
                    }}
                  >
                    <div
                      className="h-1.5 w-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                      style={{
                        backgroundColor: config.color,
                        boxShadow: `0 0 10px ${config.color}60`,
                      }}
                    />
                    <span
                      className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap"
                      style={{ color: config.color }}
                    >
                      {config.label}
                    </span>
                  </div>
                </div>

                {/* Middle: Count + Label */}
                <div className="z-10 mt-4">
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter tabular-nums mb-1">
                    {item.value}
                  </h3>
                  <p className="text-[12px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">
                    {config.label}
                  </p>
                </div>

                {/* Bottom: Description + Progress Bar */}
                <div className="space-y-4 relative z-10">
                  <p className="text-[10px] text-slate-400 font-medium leading-none">
                    {config.description}
                  </p>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full w-full"
                      style={{ backgroundColor: config.color }}
                    />
                  </div>
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
