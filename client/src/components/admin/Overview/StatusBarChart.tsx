import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { getStatusStyle, type ProposalStatus } from "@/utils/statusStyles";

interface StatusItem {
  key: string;
  value: number;
}

interface StatusBarChartProps {
  statusBarData: StatusItem[];
}

const StatusBarChart = ({ statusBarData }: StatusBarChartProps) => {
  const statusChartData = statusBarData.map((item) => {
    const { label, className } = getStatusStyle(item.key as ProposalStatus);
    const bgColorMatch = className.match(/bg-\[(#[0-9a-fA-F]{6})\]/);
    const color = bgColorMatch ? bgColorMatch[1] : "#6366f1";
    return { name: label, value: item.value, color };
  });

  return (
    <div className="xl:col-span-12 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white/80 to-white/40 p-10 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
      <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-slate-400/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(30,41,59,0.5)]" />
              <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Proposal Lifecycle
              </h2>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
              Status Distribution
            </h3>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusChartData}
              layout="vertical"
              margin={{ left: 0, right: 40, top: 0, bottom: 0 }}
              barSize={24}
              barGap={20}
            >
              <defs>
                {statusChartData.map((entry, i) => (
                  <linearGradient
                    key={i}
                    id={`grad-${i}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop
                      offset="0%"
                      stopColor={entry.color}
                      stopOpacity={0.8}
                    />
                    <stop offset="100%" stopColor={entry.color} />
                  </linearGradient>
                ))}
              </defs>

              <XAxis type="number" hide />

              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={(props: any) => {
                  const { x, y, payload, index } = props;
                  const entry = statusChartData[index];
                  return (
                    <g transform={`translate(${x},${y - 25})`}>
                      <circle cx="10" cy="0" r="4" fill={entry.color} />
                      <text
                        x="22"
                        y="5"
                        fill="#64748b"
                        fontSize="11"
                        fontWeight="900"
                        className="uppercase tracking-[0.15em]"
                      >
                        {payload.value}
                      </text>
                    </g>
                  );
                }}
              />

              <Tooltip
                cursor={{ fill: "rgba(241, 245, 249, 0.4)", radius: 12 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-slate-800 min-w-[140px]">
                        <div className="flex items-center justify-between gap-6">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Total Units
                          </span>
                          <span className="text-sm font-black text-white">
                            {payload[0].value}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Bar
                dataKey="value"
                radius={[0, 12, 12, 0]}
                background={{ fill: "#f8fafc", radius: [0, 12, 12, 0] as any }}
              >
                {statusChartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#grad-${index})`}
                    className="transition-all duration-500 hover:brightness-110"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatusBarChart;
