import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b"];

interface UsersPieChartProps {
  admin: number;
  reviewer: number;
  implementor: number;
  totalUsers: number;
}

const UsersPieChart = ({
  admin,
  reviewer,
  implementor,
  totalUsers,
}: UsersPieChartProps) => {
  const pieData = [
    { name: "Admin", value: admin },
    { name: "Reviewer", value: reviewer },
    { name: "Implementor", value: implementor },
  ];

  return (
    <div className="xl:col-span-4 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white/80 to-white/40 p-8 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] hover:-translate-y-1">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-1000" />
      <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px] group-hover:bg-blue-500/10 transition-all duration-1000" />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              <h2 className="text-[13px] font-black uppercase tracking-[0.2em] text-slate-400">
                User Composition
              </h2>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
              Ecosystem Reach
            </h3>
          </div>
        </div>

        {/* Chart */}
        <div className="relative flex-grow h-[320px] w-full flex items-center justify-center mt-4">
          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
              Total Users
            </span>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-slate-800 tracking-tighter leading-none">
                {totalUsers}
              </span>
              <div className="mt-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-600 uppercase">
                  Live
                </span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <filter
                  id="softShadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="0" dy="4" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.1" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={85}
                outerRadius={105}
                paddingAngle={8}
                cornerRadius={12}
                stroke="none"
                filter="url(#softShadow)"
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                    className="focus:outline-none transition-all duration-500 cursor-pointer hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-slate-800">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter mb-1">
                          {payload[0].name}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-xl font-black text-white">
                            {payload[0].value}
                          </p>
                          <span className="text-xs text-slate-400 font-medium tracking-tight text-nowrap">
                            participants
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 border-t border-slate-100/50 pt-6">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                }}
              />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersPieChart;
