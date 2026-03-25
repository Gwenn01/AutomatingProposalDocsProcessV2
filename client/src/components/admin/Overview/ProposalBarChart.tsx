import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProposalBarChartProps {
  totalProgram?: number;
  totalProject?: number;
  totalActivity?: number;
}

const ProposalBarChart = ({
  totalProgram = 0,
  totalProject = 0,
  totalActivity = 0,
}: ProposalBarChartProps) => {
  const proposalBarData = [
    {
      name: "Proposals",
      Program: totalProgram,
      Project: totalProject,
      Activity: totalActivity,
    },
  ];

  const legend = [
    { color: "#6366f1", label: "Program" },
    { color: "#10b981", label: "Project" },
    { color: "#f59e0b", label: "Activity" },
  ];

  return (
    <div className="xl:col-span-6 relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm p-8 flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h2 className="font-semibold text-[11px] tracking-[0.15em] uppercase text-slate-400">
            Proposal Metrics
          </h2>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight mt-0.5">
            Submission Volume
          </h3>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
          <div className="h-1.5 w-1.5 rounded-full bg-primaryGreen animate-pulse" />
          <span className="font-semibold text-[10px] uppercase tracking-[0.15em] text-slate-400">
            Live
          </span>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="flex-grow h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={proposalBarData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barCategoryGap="20%"
          >
            <defs>
              <linearGradient id="barIndigo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="barEmerald" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="barAmber" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#f1f5f9"
              strokeDasharray="6 6"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
            />

            <Tooltip
              cursor={{ fill: "rgba(241, 245, 249, 0.6)", radius: 8 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-slate-100 shadow-md p-3 rounded-xl min-w-[140px]">
                      <p className="font-semibold text-[10px] uppercase tracking-[0.15em] text-slate-400 mb-2 pb-2 border-b border-slate-100">
                        {label}
                      </p>
                      {payload.map((entry, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-4 mt-1.5"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-[11px] font-medium text-slate-500">
                              {entry.name}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-slate-800">
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar
              dataKey="Program"
              fill="url(#barIndigo)"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="Project"
              fill="url(#barEmerald)"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="Activity"
              fill="url(#barAmber)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center justify-center gap-6 border-t border-slate-100 pt-5 mt-4">
        {legend.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-semibold text-[11px] uppercase tracking-[0.15em] text-slate-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalBarChart;
