import React, { useEffect, useState } from "react";
import { Layers, Users, ShieldCheck, CheckCircle } from "lucide-react";
import { getGlobalStats, type GlobalStats } from "../../../api/admin-api";

const StatsSection: React.FC = () => {
  const [statsData, setStatsData] = useState<GlobalStats>({
    totalProposals: 0,
    activeImplementors: 0,
    assignedReviewers: 0,
    approvedProposals: 0,
  });

  useEffect(() => {
    getGlobalStats()
      .then(setStatsData)
      .catch((err) => console.error("Error loading stats:", err));
  }, []);

  const stats = [
    {
      label: "Total Proposals",
      value: statsData.totalProposals.toLocaleString(),
      description: "Aggregated activity submitted for institutional review.",
      icon: <Layers size={20} />,
      glow: "from-blue-400/20 to-blue-200/10",
    },
    {
      label: "Active Implementors",
      value: statsData.activeImplementors.toLocaleString(),
      description: "Registered Reviewers and Implementors drafting initiatives.",
      icon: <Users size={20} />,
      glow: "from-indigo-400/20 to-indigo-200/10",
    },
    {
      label: "Assigned Reviewers",
      value: statsData.assignedReviewers.toLocaleString(),
      description: "Authorized evaluators maintaining system quality.",
      icon: <ShieldCheck size={20} />,
      glow: "from-emerald-400/20 to-emerald-200/10",
    },
    {
      label: "Approved Proposals",
      value: statsData.approvedProposals.toLocaleString(),
      description: "Successfully vetted activities moved to implementation.",
      icon: <CheckCircle size={20} />,
      glow: "from-slate-400/20 to-slate-200/10",
    },
  ];

  return (
    <section className="relative py-24 bg-[#FBFBFD] overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-50/30 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-24">
          <div className="space-y-6">
            <h2 className="text-6xl md:text-8xl font-medium tracking-tight text-slate-900 leading-[0.85]">
              Ecosystem <br />
              <span className="font-extralight text-slate-300">Impact</span>
            </h2>
          </div>

          <div className="max-w-[340px] pb-2">
            <div className="h-px w-12 bg-slate-900 mb-6" />
            <p className="text-slate-500 text-[15px] leading-relaxed font-light">
              Real-time synchronization across institutional departments, driving a{" "}
              <span className="text-slate-950 font-medium">frictionless paperless lifecycle.</span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`relative bg-white/40 backdrop-blur-xl border border-white/30 rounded-[2rem] p-8 overflow-hidden shadow-lg`}
            >
              {/* Glow Layer */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.glow} opacity-20 rounded-[2rem] pointer-events-none`}
              />

              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur flex items-center justify-center mb-6 shadow-sm text-slate-600">
                {stat.icon}
              </div>

              {/* Label & Value */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  {stat.label}
                </p>
                <h3 className="text-4xl font-semibold text-slate-900 tracking-tight">{stat.value}</h3>
              </div>

              {/* Description Always Visible */}
              <p className="text-[13px] text-slate-500 leading-relaxed mt-4 font-light">
                {stat.description}
              </p>

              {/* Subtle Accent Line */}
              <div className="absolute inset-x-8 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;