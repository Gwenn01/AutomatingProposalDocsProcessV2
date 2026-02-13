import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  UserCheck,
  FileText,
  Clock,
  Search,
  RefreshCcw,
  FileCheck,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/* ================= CONFIG ================= */

const STATIC_CARD_LOOKUP = {
  "Total Implementors": { icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  "Total Reviewers": { icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50" },
  "Total Documents": { icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
};

const STATUS_LOOKUP = {
  "For Reviews": { icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
  "Under Reviews": { icon: Search, color: "text-indigo-600", bg: "bg-indigo-50" },
  "Revisions": { icon: RefreshCcw, color: "text-amber-600", bg: "bg-amber-50" },
  "For Approval": { icon: FileCheck, color: "text-purple-600", bg: "bg-purple-50" },
  "Completed": { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  "Rejected": { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

const PIE_COLORS = ["#f59e0b", "#4ade80"];

/* ================= MAIN COMPONENT ================= */

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const [staticCards, setStaticCards] = useState([]);
  const [statusCycle, setStatusCycle] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  /* ================= FETCH ================= */

  useEffect(() => {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const fetchData = async () => {
      try {
        setLoading(true);
        setProgress(5);

        await delay(200);
        setProgress(15);

        const res = await axios.get("http://localhost:5000/api/admin-overview");

        await delay(200);
        setProgress(40);
        setStaticCards(res.data.static_cards);

        await delay(200);
        setProgress(65);
        setStatusCycle(res.data.status_cycle);

        await delay(200);
        setProgress(85);
        setPieData(res.data.pie_data.filter((i) => i.name !== "Total"));

        await delay(200);
        setProgress(100);
        setBarData(res.data.bar_data);

        await delay(300);
        setLoading(false);

      } catch {
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="w-full h-full bg-white inset-0 z-[60] flex items-center justify-center backdrop-blur-md animate-fade-in">
        <div className="relative bg-white px-14 py-10 flex flex-col items-center animate-pop-out w-[450px]">

          <p className="text-lg font-semibold shimmer-text mb-2 text-center text-slate-800">
            Assembling Dashboard Insights
          </p>

          <p className="text-xs w-full text-gray-500 mb-4 text-center">
            Aggregating real-time metrics and proposal analytics
          </p>

          {/* Progress Bar - EXACT MATCH */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-700 transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500 font-medium tabular-nums">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-red-500 font-semibold">{error}</span>
      </div>
    );

  const totalUsers = pieData.reduce((acc, curr) => acc + curr.value, 0);

  /* ================= RENDER ================= */

  return (
    <div className="relative h-auto p-8 lg:p-10 bg-[#fbfcfb] animate-in fade-in duration-700">
      
      {/* HEADER SECTION - Matched to Manage Accounts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Overview Dashboard
          </h1>
          <p className="text-gray-500 text-sm font-normal">
            Monitoring proposal metrics and workflow status.
          </p>
        </div>
      </div>

      {/* ================= TOP SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-stretch">
        
        {/* LEFT: STATS GRID (Bento Style) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {staticCards.map((card, i) => (
            <StatCard key={i} card={card} />
          ))}
          
          {/* Optional: Add a small "Quick Action" or "System Status" card here to fill the 4th slot of the grid if you have 3 cards */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-[#00923f] to-[#1cb35a] p-8 rounded-[32px] shadow-lg flex flex-col justify-between">
            <div className="relative z-10">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/70">System Status</span>
              <h3 className="text-xl font-bold text-white mt-1">Operational</h3>
            </div>
            <div className="relative z-10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[11px] text-white/90">All nodes synced</span>
            </div>
            {/* Abstract Background Pattern */}
            <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>

        {/* RIGHT: PREMIUM PIE CHART CARD */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between relative overflow-hidden h-full min-h-[460px]">
          
          {/* Gradient Defs for Recharts - Add this inside your SVG or PieChart component */}
          <svg style={{ height: 0, width: 0, position: 'absolute' }}>
            <defs>
              {PIE_COLORS.map((color, i) => (
                <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                </linearGradient>
              ))}
            </defs>
          </svg>

          {/* Header Section */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 block">
                Platform Analytics
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">User Distribution</h2>
          </div>

          {/* Chart Container */}
          <div className="flex-grow relative flex items-center justify-center min-h-[260px]">
            {/* Dynamic Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 translate-y-[-4px]">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mb-1">Total</span>
              <span className="text-5xl font-bold text-slate-800 tracking-tighter drop-shadow-sm">
                {totalUsers}
              </span>
              <div className="mt-1 px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Users</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={82}
                  outerRadius={102}
                  paddingAngle={8}
                  stroke="none"
                  startAngle={90}
                  endAngle={450}
                  cornerRadius={12}
                  /* Mouse Follow & Scale Effect */
                  activeShape={{ stroke: '#fff', strokeWidth: 5, outerRadius: 108 }}
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={1200}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#grad-${index % PIE_COLORS.length})`}
                      className="hover:opacity-100 transition-all duration-500 cursor-pointer outline-none"
                      style={{ filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.05))' }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Premium Legend Layout */}
          <div className="mt-2 grid grid-cols-2 gap-3 relative z-10">
            {pieData.map((entry, i) => (
              <div 
                key={i} 
                className="group relative flex items-center justify-between p-3 rounded-2xl border border-slate-50 hover:border-slate-200 hover:bg-slate-50/50 hover:shadow-sm transition-all duration-300 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-1.5 h-6 rounded-full transition-all duration-300 group-hover:h-8" 
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} 
                  />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      {entry.name}
                    </span>
                    <span className="text-sm font-bold text-slate-800 leading-none">
                      {entry.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sophisticated Background Elements */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-50/30 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-50/30 rounded-full blur-[80px] pointer-events-none" />
        </div>
      </div>

      {/* ================= SECOND SECTION ================= */}
      <div className="flex flex-col xl:flex-row gap-8 items-stretch">

        {/* BAR CHART CARD */}
        <div className="flex-1 bg-white p-8 rounded-[32px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 flex flex-col">
          <div className="flex flex-col mb-8 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 block mb-1">
              Monthly Tracking
            </span>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Proposal Progress</h2>
          </div>

          <div className="flex-grow w-full min-h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={barData} 
              margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
              barGap={8} 
            >
              <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
              
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}}
                dy={10}
              />

              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}}
                domain={[0, 'auto']} 
                allowDecimals={false}
                nice={true} 
              />

              <Tooltip 
                isAnimationActive={false}
                cursor={{ fill: '#f8fafc', radius: 12 }} 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const allStatusKeys = [
                      { key: "ForReview", label: "For Review", color: "#3b82f6" },
                      { key: "UnderReview", label: "Under Review", color: "#6366f1" },
                      { key: "Revisions", label: "Revisions", color: "#f59e0b" },
                      { key: "Approval", label: "For Approval", color: "#a855f7" },
                      { key: "Completed", label: "Completed", color: "#10b981" },
                      { key: "Rejected", label: "Rejected", color: "#ef4444" },
                    ];

                    const currentData = payload[0].payload;

                    return (
                      <div className="bg-white/90 backdrop-blur-md px-4 py-4 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 min-w-[210px] animate-in fade-in zoom-in duration-200 pointer-events-none">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3 border-b border-slate-100/50 pb-2">
                          {label} Overview
                        </p>
                        
                        <div className="flex flex-col gap-2.5">
                          {allStatusKeys.map((status) => {
                            const value = currentData[status.key] || 0;
                            return (
                              <div key={status.key} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                    {status.label}
                                  </span>
                                </div>
                                <span className={`text-xs font-black ${value > 0 ? 'text-slate-800' : 'text-slate-300'}`}>
                                  {value.toLocaleString()}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Bar implementation with rounded tops and hover effects */}
              <Bar dataKey="ForReview" fill="#3b82f6" radius={[4,4,0,0]} barSize={12} />
              <Bar dataKey="UnderReview" fill="#6366f1" radius={[4,4,0,0]} barSize={12} />
              <Bar dataKey="Revisions" fill="#f59e0b" radius={[4,4,0,0]} barSize={12} />
              <Bar dataKey="Approval" fill="#a855f7" radius={[4,4,0,0]} barSize={12} />
              <Bar dataKey="Completed" fill="#10b981" radius={[4,4,0,0]} barSize={12} />
              <Bar dataKey="Rejected" fill="#ef4444" radius={[4,4,0,0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        </div>

        {/* STATUS GRID CARD - Premium 2-Column Layout */}
        <div className="xl:w-[420px] bg-white p-8 rounded-[32px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 flex flex-col min-h-full">
          
          {/* Header Section - Fixed Height */}
          <div className="mb-8 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 block mb-1">
              Real-time Status
            </span>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Proposal Summary</h2>
          </div>

          {/* Main Grid - Flexible but grows to fill available space */}
          <div className="grid grid-cols-2 gap-4 flex-grow">
            {statusCycle.map((status, index) => {
              const config = STATUS_LOOKUP[status.label] || STATUS_LOOKUP["Under Reviews"];
              
              return (
                <div
                  key={index}
                  className="group relative flex flex-col justify-between p-6 rounded-[28px] bg-[#f8fafc]/50 border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden cursor-default"
                >
                  {/* Top: Icon & Glow */}
                  <div className="relative z-10 flex justify-between items-start">
                    <div className={`w-11 h-11 rounded-2xl ${config.bg} ${config.color} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      {React.createElement(config.icon, { size: 20, strokeWidth: 2.2 })}
                    </div>
                    
                    {/* Status Indicator Dot */}
                    <div className={`w-1.5 h-1.5 rounded-full ${status.value > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />
                  </div>

                  {/* Bottom: Label & Value */}
                  <div className="mt-4 relative z-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 truncate">
                      {status.label}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <h4 className="text-2xl font-bold text-slate-800 tracking-tight">
                        {status.value}
                      </h4>
                      <span className="text-[9px] font-bold text-slate-300 uppercase">Items</span>
                    </div>
                  </div>

                  {/* Subtle Apple-style Aura on hover */}
                  <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${config.bg}`} />
                </div>
              );
            })}
          </div>

          {/* Footer Section - Fixed at Bottom */}
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Updated</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Total:</span>
              <span className="text-lg font-bold text-slate-800">
                {statusCycle.reduce((acc, curr) => acc + curr.value, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */

const StatCard = ({ card }) => {
  const config = STATIC_CARD_LOOKUP[card.label];

  return (
    <div className="group relative flex-1 bg-white p-8 rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden">
      
      {/* 1. Subtle Glass Gradient Background - Appears on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-transparent via-slate-50/30 to-slate-100/20" />

      {/* 2. Top Row: Icon & Background "Aura" */}
      <div className="relative z-10 flex justify-between items-start">
        <div className={`relative p-4 rounded-[22px] ${config.bg} ${config.color} transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-${config.color.split('-')[1]}-500/20`}>
          {/* Inner Glossy Effect */}
          <div className="absolute inset-0 rounded-[22px] bg-gradient-to-tr from-white/0 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative">
            {React.createElement(config.icon, { 
              size: 24, 
              strokeWidth: 2.5,
              className: "drop-shadow-sm" 
            })}
          </div>
        </div>

        {/* 3. Decorative "Mini Graph" - Adds that 'Analytics' feel */}
        <div className="flex gap-1 items-end h-8 opacity-20 group-hover:opacity-100 transition-all duration-700">
          <div className="w-1 bg-slate-200 rounded-full h-[40%] group-hover:h-[60%] transition-all duration-500" />
          <div className="w-1 bg-slate-200 rounded-full h-[70%] group-hover:h-[40%] transition-all duration-500 delay-75" />
          <div className="w-1 bg-slate-200 rounded-full h-[50%] group-hover:h-[90%] transition-all duration-500 delay-100" />
          <div className={`w-1 rounded-full h-[80%] group-hover:h-[100%] transition-all duration-500 delay-150 ${config.bg.replace('/10', '')}`} />
        </div>
      </div>

      {/* 4. Text Content */}
      <div className="relative z-10 mt-10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            {card.label}
          </span>
          {/* Pulsing "Live" dot */}
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex items-baseline gap-1 mt-1">
          <h3 className="text-3xl font-bold text-slate-800 tracking-tighter transition-all duration-500 group-hover:text-black">
            {card.value}
          </h3>
          <span className="text-[10px] font-bold text-slate-400">Total</span>
        </div>
      </div>

      {/* 5. Decorative Corner Light - Minimalist Flare */}
      <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-1000 ${config.bg}`} />
      
      {/* 6. Border Highlight - Matches System Core style */}
      <div className="absolute inset-0 border border-transparent group-hover:border-slate-200/60 rounded-[32px] transition-colors duration-500" />
    </div>
  );
};

export default Overview;
