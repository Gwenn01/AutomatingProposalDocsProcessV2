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
  totalProgram: number;
  totalProject: number;
  totalActivity: number;
}

const ProposalBarChart = ({
  totalProgram,
  totalProject,
  totalActivity,
}: ProposalBarChartProps) => {
  const proposalBarData = [
    {
      name: "Proposals",
      Program: totalProgram,
      Project: totalProject,
      Activity: totalActivity,
    },
  ];

  return (
    <div className="xl:col-span-6 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white/80 to-white/40 p-8 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)] hover:-translate-y-1">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-1000" />
      <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-slate-500/5 blur-[60px] pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <h2 className="text-[13px] font-black uppercase tracking-[0.2em] text-slate-400">
                Proposal Metrics
              </h2>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
              Submission Volume
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-slate-200/50 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
              Live Updates
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-grow h-[320px] w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={proposalBarData}
              margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
              barCategoryGap="15%"
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
                stroke="#e2e8f0"
                strokeDasharray="10 10"
                opacity={0.4}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                dy={12}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
              />

              <Tooltip
                cursor={{ fill: "rgba(241, 245, 249, 0.6)", radius: 16 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-slate-800 min-w-[140px]">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">
                          {label}
                        </p>
                        {payload.map((entry, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between gap-4 mt-2"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-xs font-medium text-slate-300">
                                {entry.name}
                              </span>
                            </div>
                            <span className="text-sm font-black text-white">
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
                radius={[6, 6, 6, 6]}
              />
              <Bar
                dataKey="Project"
                fill="url(#barEmerald)"
                radius={[6, 6, 6, 6]}
              />
              <Bar
                dataKey="Activity"
                fill="url(#barAmber)"
                radius={[6, 6, 6, 6]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-8 border-t border-slate-100/50 pt-6">
          {[
            { color: "bg-indigo-500", label: "Program Proposals" },
            { color: "bg-emerald-500", label: "Project Proposals" },
            { color: "bg-amber-500", label: "Activity Proposals" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${item.color}`} />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProposalBarChart;
