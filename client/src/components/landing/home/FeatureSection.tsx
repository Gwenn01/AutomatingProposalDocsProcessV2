import React from "react";
import {
  Edit3,
  MessageSquare,
  Search,
  ShieldCheck,
  History,
  Bell,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const FeatureSection: React.FC = () => {
  const features = [
    {
      title: "Online Proposal Creation",
      desc: "Implementors can create proposals and fill out digital forms directly within the platform with auto-save capabilities.",
      icon: <Edit3 size={22} />,
      size: "lg:col-span-2",
      bg: "bg-gradient-to-br from-emerald-50/50 to-teal-50/30",
      accent: "text-emerald-600",
      badge: "Fast Entry",
    },
    {
      title: "Digital Annotation",
      desc: "Reviewers add precise, timestamped comments and suggestions online.",
      icon: <MessageSquare size={22} />,
      size: "lg:col-span-1",
      bg: "bg-gradient-to-br from-blue-50/50 to-indigo-50/30",
      accent: "text-blue-600",
      badge: "Real-time",
    },
    {
      title: "Status Tracking",
      desc: "Live visibility: from submitted to approved.",
      icon: <Search size={22} />,
      size: "lg:col-span-1",
      bg: "bg-gradient-to-br from-amber-50/50 to-orange-50/30",
      accent: "text-amber-600",
      badge: "Insights",
    },
    {
      title: "Role-Based Access",
      desc: "Secure, tiered access for implementors and reviewers ensures top-tier data integrity and privacy.",
      icon: <ShieldCheck size={22} />,
      size: "lg:col-span-2",
      bg: "bg-slate-900",
      accent: "text-emerald-400",
      dark: true,
      badge: "Security",
    },
    {
      title: "Version Control",
      desc: "Complete audit logs of every revision and document update.",
      icon: <History size={22} />,
      size: "lg:col-span-1",
      bg: "bg-gradient-to-br from-indigo-50/50 to-purple-50/30",
      accent: "text-indigo-600",
      badge: "Audit Ready",
    },
    {
      title: "Smart Notifications",
      desc: "Automated alerts via dashboard and email for every feedback loop and final sign-off.",
      icon: <Bell size={22} />,
      size: "lg:col-span-2",
      bg: "bg-white",
      accent: "text-rose-500",
      border: true,
      badge: "Automated",
    },
  ];

  return (
    <section
      id="features"
      className="relative py-12 lg:py-20 bg-[#fafafa] overflow-hidden"
    >
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Modern Header Section */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 mb-6 shadow-sm">
            <Sparkles size={12} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Core Capabilities
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.95] mb-8">
            The New Standard for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-900">
              Proposal Reviews.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
            Eliminate bottlenecks with a unified ecosystem designed for speed,
            accuracy, and complete transparency.
          </p>
        </div>

        {/* Enhanced Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-[2.5rem] p-10 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 
              ${feature.size} ${feature.bg} 
              ${feature.border ? "border border-slate-200/60" : "border border-transparent"}`}
            >
              {/* Feature Badge */}
              <div className="absolute top-8 right-8">
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border 
                 ${feature.dark ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-slate-200 text-slate-400 bg-white/50"}`}
                >
                  {feature.badge}
                </span>
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Icon Container with Glass Effect */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-16 transition-all duration-500 group-hover:rotate-[10deg] shadow-sm 
                ${feature.dark ? "bg-emerald-500 text-slate-950" : "bg-white text-slate-900 border border-slate-100"}`}
                >
                  <span
                    className={feature.dark ? "text-slate-950" : feature.accent}
                  >
                    {feature.icon}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3
                      className={`text-2xl font-black tracking-tight ${feature.dark ? "text-white" : "text-slate-900"}`}
                    >
                      {feature.title}
                    </h3>
                    <ArrowUpRight
                      size={16}
                      className={`opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${feature.dark ? "text-emerald-400" : "text-slate-300"}`}
                    />
                  </div>
                  <p
                    className={`text-sm md:text-base leading-relaxed font-medium ${feature.dark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {feature.desc}
                  </p>
                </div>
              </div>

              {/* Sophisticated Mesh Glow */}
              <div
                className={`absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-[80px] transition-opacity duration-700 opacity-0 group-hover:opacity-40 
              ${feature.dark ? "bg-emerald-500" : "bg-emerald-200"}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
