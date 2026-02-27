import {
  Layers,
  Users,
  ShieldCheck,
  CheckCircle,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

const StatsSection: React.FC = () => {
  const stats = [
    {
      label: "Total Proposals",
      value: "1,284",
      description:
        "Aggregated proposal activities submitted for institutional review.",
      icon: <Layers size={22} />,
      trend: "+12.5%",
      color: "emerald",
    },
    {
      label: "Active Implementors",
      value: "450",
      description:
        "Registered faculty and students actively drafting initiatives.",
      icon: <Users size={22} />,
      trend: "Verified",
      color: "slate",
    },
    {
      label: "Assigned Reviewers",
      value: "82",
      description: "Authorized evaluators maintaining system quality.",
      icon: <ShieldCheck size={22} />,
      trend: "Live",
      color: "emerald",
    },
    {
      label: "Approved Proposals",
      value: "912",
      description: "Successfully vetted activities moved to implementation.",
      icon: <CheckCircle size={22} />,
      trend: "71% Rate",
      color: "emerald",
    },
  ];

  return (
    <section className="relative py-12 bg-[#fafafa] overflow-hidden">
      {/* Background Continuity from Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-emerald-100/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[10%] w-[20%] h-[20%] bg-slate-200/40 rounded-full blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-20">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                Live Telemetry
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
              Ecosystem <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 italic font-serif lowercase tracking-normal font-light">
                impact.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pb-2">
            <p className="text-slate-500 font-medium text-base leading-relaxed border-l-2 border-emerald-500/20 pl-6">
              Quantifying the transition to a{" "}
              <span className="text-slate-900 font-bold">fully paperless</span>{" "}
              institutional lifecycle. Real-time data synchronization across all
              departments.
            </p>
          </div>
        </div>

        {/* Stats Grid - Modern Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative bg-white/60 backdrop-blur-md border border-white p-8 rounded-[2.5rem] transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-3"
            >
              {/* Card Top Row */}
              <div className="flex justify-between items-start mb-12">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-emerald-400 shadow-xl group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  <TrendingUp
                    size={12}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {stat.trend}
                  </span>
                </div>
              </div>

              {/* Data Content */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {stat.label}
                  </p>
                  <h3 className="text-5xl font-black text-slate-900 tracking-tighter">
                    {stat.value}
                  </h3>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed pr-4 opacity-80 group-hover:opacity-100 transition-opacity">
                  {stat.description}
                </p>
              </div>

              {/* Decorative Linear Accent */}
              <div className="absolute bottom-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </div>
          ))}
        </div>

        {/* Floating Detail Indicator */}
        <div className="mt-20 flex justify-center">
          <div className="px-6 py-3 rounded-2xl bg-slate-950 flex items-center gap-4 shadow-2xl shadow-emerald-900/20 group cursor-pointer hover:bg-emerald-600 transition-colors duration-500">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
              View Detailed Performance Audit
            </span>
            <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
              <ArrowUpRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
