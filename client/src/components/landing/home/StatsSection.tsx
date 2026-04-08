import React from "react";
import {
  Layers,
  Users,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

const StatsSection: React.FC = () => {
  const stats = [
    {
      label: "Total Proposals",
      value: "1,284",
      description: "Aggregated activity submitted for institutional review.",
      icon: <Layers size={20} />,
    },
    {
      label: "Active Implementors",
      value: "450",
      description: "Registered faculty and students drafting initiatives.",
      icon: <Users size={20} />,
    },
    {
      label: "Assigned Reviewers",
      value: "82",
      description: "Authorized evaluators maintaining system quality.",
      icon: <ShieldCheck size={20} />,
    },
    {
      label: "Approved Proposals",
      value: "912",
      description: "Successfully vetted activities moved to implementation.",
      icon: <CheckCircle size={20} />,
    },
  ];

  return (
    <section className="relative py-24 bg-[#FBFBFD] overflow-hidden">
      {/* Apple-style Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-50/50 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Header: Minimalist & Spaced */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-24">
          <div className="space-y-6">
            {/* Removed Badge for a cleaner, ultra-minimalist look */}
            <h2 className="text-6xl md:text-8xl font-medium tracking-tight text-slate-900 leading-[0.85]">
              Ecosystem <br />
              <span className="font-extralight text-slate-300">Impact</span>
            </h2>
          </div>

          <div className="max-w-[340px] pb-2">
            {/* Architectural line establishes the vertical anchor */}
            <div className="h-px w-12 bg-slate-900 mb-6" />
            <p className="text-slate-500 text-[15px] leading-relaxed font-light">
              Real-time synchronization across institutional departments,
              driving a <span className="text-slate-950 font-medium">frictionless paperless lifecycle.</span>
            </p>
          </div>
        </div>

        {/* Bento Grid: Refined Glass */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-7 transition-all duration-500 hover:bg-white/80 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]"
            >
              <div className="flex justify-between items-start mb-10">
                {/* Icon Container: Glass-on-Glass */}
                <div className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 group-hover:text-emerald-500 group-hover:scale-110 transition-all duration-500">
                  {stat.icon}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">
                    {stat.label}
                  </p>
                  <h3 className="text-4xl font-semibold text-slate-900 tracking-tight">
                    {stat.value}
                  </h3>
                </div>
                <p className="text-[13px] text-slate-500 leading-snug font-light opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  {stat.description}
                </p>
              </div>

              {/* Sophisticated Hover Accent */}
              <div className="absolute inset-x-8 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;