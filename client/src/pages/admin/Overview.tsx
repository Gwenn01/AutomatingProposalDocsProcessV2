import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Users, FileText, CheckCircle, Zap } from "lucide-react";
import { getUsersOverview, getProposalsOverview } from "@/utils/admin-api";
import { getStatusStyle, type ProposalStatus } from "@/utils/statusStyles";
import { getWorkflowCardStyle } from "@/utils/statusCardStyle";
import Loading from "@/components/Loading";

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b"];

const AdminOverview = () => {
  const [users, setUsers] = useState<any>(null);
  const [proposals, setProposals] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: number;
    if (loading) {
      setProgress(0);
      let value = 0;
      const step = 5;
      const intervalTime = 200;

      intervalId = window.setInterval(() => {
        value += step;
        if (value >= 95) value = 95; // stop at 95%, wait for fetch
        setProgress(value);
      }, intervalTime);
    }

    return () => window.clearInterval(intervalId);
  }, [loading]);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const [usersData, proposalsData] = await Promise.all([
        getUsersOverview(),
        getProposalsOverview(),
      ]);
      setUsers(usersData);
      setProposals(proposalsData);
      setProgress(100);
      setTimeout(() => setLoading(false), 200);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch overview data");
      setUsers([]);
      setProposals([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <Loading
        title="Loading System Analytics"
        subtitle="System performance at a glance."
        progress={progress}
      />
    );
  }

  if (error) return <p className="p-8">{error}</p>;

  /* ================= USERS PIE DATA ================= */
  const pieData = [
    { name: "Admin", value: users.admin },
    { name: "Reviewer", value: users.reviewer },
    { name: "Implementor", value: users.implementor },
  ];

  const totalUsers = users.total_user;

  /* ================= PROPOSAL BAR DATA ================= */
  const proposalBarData = [
    {
      name: "Proposals",
      Program: proposals.proposal.total_program,
      Project: proposals.proposal.total_project,
      Activity: proposals.proposal.total_activity,
    },
  ];

  /* ================= STATUS BAR DATA ================= */
  const statusBarData = [
    { key: "under_review", value: proposals.status.total_under_review },
    { key: "for_review", value: proposals.status.total_for_review },
    { key: "for_revision", value: proposals.status.total_for_revision },
    { key: "for_approval", value: proposals.status.total_for_approval },
    { key: "approved", value: proposals.status.total_approved },
    { key: "rejected", value: proposals.status.total_rejected },
  ];

  const statusChartData = statusBarData.map((item) => {
    const { label, className } = getStatusStyle(item.key as ProposalStatus);
    const bgColorMatch = className.match(/bg-\[(#[0-9a-fA-F]{6})\]/);
    const color = bgColorMatch ? bgColorMatch[1] : "#6366f1";

    return {
      name: label,
      value: item.value,
      color,
    };
  });

  const totalProposals = proposals.proposal.total_proposals;
  const approvalRate =
    totalProposals > 0
      ? Math.round((proposals.status.total_approved / totalProposals) * 100)
      : 0;
  const pendingTotal =
    proposals.status.total_under_review +
    proposals.status.total_for_review +
    proposals.status.total_for_revision +
    proposals.status.total_for_approval;

  return (
    <div className="relative h-auto bg-slate-50 p-8 lg:p-12 space-y-16">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Overview Dashboard
          </h1>
          <p className="text-gray-500 text-sm font-normal">
            Monitoring proposal metrics and workflow status.
          </p>
        </div>
        {/* Premium Date Badge */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          Live System Data
        </div>
      </div>

      {/* ================= KPI ROW ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Card: Total Users */}
        <div className="group relative overflow-hidden rounded-[2rem] bg-white/40 p-8 backdrop-blur-md border border-white/60 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.04)] transition-all duration-500 hover:bg-white/70 hover:-translate-y-1">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700" />

          <div className="relative z-10">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-500/10 transition-transform duration-500 group-hover:scale-110">
              <Users size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                Users
              </p>
              <h3 className="mt-1 text-4xl font-extrabold tracking-tighter text-slate-800 tabular-nums">
                {totalUsers}
              </h3>
              <p className="mt-1 text-[13px] font-medium text-slate-400">
                Total Users
              </p>
            </div>
          </div>
        </div>

        {/* Card: Active Proposals */}
        <div className="group relative overflow-hidden rounded-[2rem] bg-white/40 p-8 backdrop-blur-md border border-white/60 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.04)] transition-all duration-500 hover:bg-white/70 hover:-translate-y-1">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/20 blur-2xl group-hover:bg-blue-500/20 transition-all duration-700" />

          <div className="relative z-10">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm ring-1 ring-inset ring-blue-500/10 transition-transform duration-500 group-hover:scale-110">
              <FileText size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                Proposals
              </p>
              <h3 className="mt-1 text-4xl font-extrabold tracking-tighter text-slate-800 tabular-nums">
                {totalProposals}
              </h3>
              <p className="mt-1 text-[13px] font-medium text-slate-400">
                Total Submissions
              </p>
            </div>
          </div>
        </div>

        {/* Card: Approval Rate */}
        <div className="group relative overflow-hidden rounded-[2rem] bg-white/40 p-8 backdrop-blur-md border border-white/60 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.04)] transition-all duration-500 hover:bg-white/70 hover:-translate-y-1">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700" />

          <div className="relative z-10">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-sm ring-1 ring-inset ring-emerald-500/10 transition-transform duration-500 group-hover:scale-110">
              <CheckCircle size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                Approvals
              </p>
              <h3 className="mt-1 text-4xl font-extrabold tracking-tighter text-emerald-600 tabular-nums">
                {approvalRate}%
              </h3>
              <p className="mt-1 text-[13px] font-medium text-slate-400">
                Approval Rate
              </p>
            </div>
          </div>
        </div>

        {/* Card: In Workflow */}
        <div className="group relative overflow-hidden rounded-[2rem] bg-white/40 p-8 backdrop-blur-md border border-white/60 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.04)] transition-all duration-500 hover:bg-white/70 hover:-translate-y-1">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl group-hover:bg-orange-500/20 transition-all duration-700" />

          <div className="relative z-10">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 shadow-sm ring-1 ring-inset ring-orange-500/10 transition-transform duration-500 group-hover:scale-110">
              <Zap size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                Pending
              </p>
              <h3 className="mt-1 text-4xl font-extrabold tracking-tighter text-slate-800 tabular-nums">
                {pendingTotal}
              </h3>
              <p className="mt-1 text-[13px] font-medium text-slate-400">
                Proposals in review
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ANALYTICS SECTION ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-8">
        {/* Users Distribution - 40% Width */}
        <div className="xl:col-span-4 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white/80 to-white/40 p-8 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] hover:-translate-y-1">
          {/* Animated Mesh Gradient background - Purely aesthetic */}
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

            {/* Chart Area */}
            <div className="relative flex-grow h-[320px] w-full flex items-center justify-center mt-4">
              {/* Centered Statistic Label (Floating in Donut Hole) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
                  Total Users
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black text-slate-800 tracking-tighter leading-none">
                    {totalUsers}
                  </span>
                  {/* Subtle indicator of growth or status below the number */}
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

            {/* Mini Legend Footer */}
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

        {/* Proposal Types - 60% Width */}
        <div className="xl:col-span-6 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white/80 to-white/40 p-8 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)] hover:-translate-y-1">
          {/* Matching Mesh Glow (Emerald for Proposals) */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-1000" />
          <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-slate-500/5 blur-[60px] pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col">
            {/* Header - Styled to match the Users card */}
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

              {/* Visual Activity Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-slate-200/50 backdrop-blur-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                  Live Updates
                </span>
              </div>
            </div>

            {/* Chart Area */}
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

            {/* Bottom Legend Matching the Users Card */}
            <div className="mt-4 flex items-center justify-center gap-8 border-t border-slate-100/50 pt-6">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                  Program Proposals
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                  Project Proposals
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                  Activity Proposals
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= WORKFLOW SECTION ================= */}
      <div className="xl:col-span-12 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white/80 to-white/40 p-10 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
        {/* Ambient Background Glow (Subtle Slate) */}
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-slate-400/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          {/* Header - Matching previous card style */}
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

          {/* Chart Container */}
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
                  {/* Dynamic Gradients for Statuses */}
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
                        {/* Color Dot + Status Name above the bar */}
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
                  background={{
                    fill: "#f8fafc",
                    radius: [0, 12, 12, 0] as any,
                  }} // Very subtle "track"
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

      {/* ================= STATUS BREAKDOWN GRID ================= */}
      <div className="space-y-10 pt-8">
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

        {/* Increased gap and height for more "breathing room" */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {statusBarData.map((item, index) => {
            const config = getWorkflowCardStyle(item.key);
            const StatusIcon = config.icon;

            return (
              <div
                key={index}
                className="group relative h-56 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 active:scale-95"
              >
                {/* Layer 1: Minimalist Glow - Reduced opacity and tighter blur */}
                <div
                  className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-xl"
                  style={{ backgroundColor: config.color }}
                />

                {/* Layer 2: Main Card Body */}
                <div className="relative h-full w-full bg-white border border-slate-100 rounded-[2.2rem] p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col justify-between">
                  {/* Background Decorative Icon */}
                  <StatusIcon
                    size={140}
                    className="absolute -right-6 -bottom-6 opacity-[0.04] -rotate-12 transition-transform duration-1000 group-hover:rotate-0 group-hover:scale-110"
                    style={{ color: config.color }}
                  />

                  {/* Top Content */}
                  <div className="flex justify-between items-start relative z-10">
                    <div
                      className="p-4 rounded-2xl transition-all duration-500 group-hover:scale-110"
                      style={{
                        backgroundColor: `${config.color}10`,
                        color: config.color,
                      }}
                    >
                      <StatusIcon size={24} strokeWidth={2.5} />
                    </div>

                    {/* Enhanced Dynamic Status Badge */}
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-500"
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

                  {/* Middle Content */}
                  <div className="z-10 mt-4">
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter tabular-nums mb-1">
                      {item.value}
                    </h3>
                    <p className="text-[12px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">
                      {config.label}
                    </p>
                  </div>

                  {/* Bottom Content */}
                  <div className="space-y-4 relative z-10">
                    <p className="text-[10px] text-slate-400 font-medium leading-none opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-1 group-hover:translate-y-0">
                      {config.description}
                    </p>

                    {/* Minimalist Progress Track */}
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.2,0,0,1)] w-0 group-hover:w-full"
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
    </div>
  );
};

export default AdminOverview;
