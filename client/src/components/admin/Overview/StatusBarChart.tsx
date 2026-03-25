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
    <div className="relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm p-8">
      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h2 className="font-semibold text-[11px] tracking-[0.15em] uppercase text-slate-400">
            Proposal Lifecycle
          </h2>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight mt-0.5">
            Status Distribution
          </h3>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
      </div>

      {/* ── Chart ── */}
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={statusChartData}
            layout="vertical"
            margin={{ left: 0, right: 40, top: 0, bottom: 0 }}
            barSize={20}
            barGap={16}
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
                  <stop offset="0%" stopColor={entry.color} stopOpacity={0.7} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={1} />
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
                  <g transform={`translate(${x},${y - 22})`}>
                    <circle cx="10" cy="0" r="3.5" fill={entry.color} />
                    <text
                      x="20"
                      y="5"
                      fill="#94a3b8"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {payload.value}
                    </text>
                  </g>
                );
              }}
            />

            <Tooltip
              cursor={{ fill: "rgba(241, 245, 249, 0.6)", radius: 8 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-slate-100 shadow-md p-3 rounded-xl min-w-[120px]">
                      <div className="flex items-center justify-between gap-6">
                        <span className="font-semibold text-[10px] uppercase tracking-[0.15em] text-slate-400">
                          Total
                        </span>
                        <span className="text-sm font-bold text-slate-800">
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
              radius={[0, 8, 8, 0]}
              background={{ fill: "#f8fafc", radius: [0, 8, 8, 0] as any }}
            >
              {statusChartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={`url(#grad-${index})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusBarChart;
