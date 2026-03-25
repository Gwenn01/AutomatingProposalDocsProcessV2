import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b"];

interface UsersPieChartProps {
  admin?: number;
  reviewer?: number;
  implementor?: number;
  totalUsers?: number;
}

const UsersPieChart = ({
  admin = 0,
  reviewer = 0,
  implementor = 0,
  totalUsers = 0,
}: UsersPieChartProps) => {
  const pieData = [
    { name: "Admin", value: admin },
    { name: "Reviewer", value: reviewer },
    { name: "Implementor", value: implementor },
  ];

  return (
    <div className="xl:col-span-4 relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm p-8 flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <h2 className="font-semibold text-[11px] tracking-[0.15em] uppercase text-slate-400">
            User Composition
          </h2>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight mt-0.5">
            Ecosystem Reach
          </h3>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
      </div>

      {/* ── Chart ── */}
      <div className="relative flex-grow h-[260px] w-full flex items-center justify-center">
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-semibold text-[10px] uppercase tracking-[0.15em] text-slate-400 mb-1">
            Total Users
          </span>
          <span className="text-4xl font-bold text-slate-800 tabular-nums leading-none">
            {totalUsers.toLocaleString()}
          </span>
          <div className="mt-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-100">
            <div className="h-1 w-1 rounded-full bg-primaryGreen animate-pulse" />
            <span className="font-semibold text-[9px] uppercase tracking-[0.15em] text-slate-400">
              Live
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={80}
              outerRadius={100}
              paddingAngle={6}
              cornerRadius={8}
              stroke="none"
            >
              {pieData.map((_, index) => (
                <Cell
                  key={index}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                  className="focus:outline-none cursor-pointer hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-slate-100 shadow-md p-3 rounded-xl">
                      <p className="font-semibold text-[10px] uppercase tracking-[0.15em] text-slate-400 mb-1">
                        {payload[0].name}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-slate-800">
                          {payload[0].value}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          users
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

      {/* ── Legend ── */}
      <div className="flex items-center justify-center gap-6 border-t border-slate-100 pt-5 mt-2">
        {pieData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
            />
            <span className="font-semibold text-[11px] uppercase tracking-[0.15em] text-slate-400">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPieChart;
