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
      accent: "text-emerald-600",
      badge: "Fast Entry",
    },
    {
      title: "Digital Annotation",
      desc: "Reviewers add precise, timestamped comments and suggestions online.",
      icon: <MessageSquare size={22} />,
      size: "lg:col-span-1",
      accent: "text-blue-600",
      badge: "Real-time",
    },
    {
      title: "Status Tracking",
      desc: "Live visibility: from submitted to approved.",
      icon: <Search size={22} />,
      size: "lg:col-span-1",
      accent: "text-amber-600",
      badge: "Insights",
    },
    {
      title: "Role-Based Access",
      desc: "Secure, tiered access ensures top-tier data integrity and privacy.",
      icon: <ShieldCheck size={22} />,
      size: "lg:col-span-2",
      accent: "text-emerald-400",
      dark: true,
      badge: "Security",
    },
    {
      title: "Version Control",
      desc: "Complete audit logs of every revision and document update.",
      icon: <History size={22} />,
      size: "lg:col-span-1",
      accent: "text-indigo-600",
      badge: "Audit Ready",
    },
    {
      title: "Smart Notifications",
      desc: "Automated alerts via dashboard and email for every feedback loop and final sign-off.",
      icon: <Bell size={22} />,
      size: "lg:col-span-2",
      accent: "text-rose-500",
      badge: "Automated",
    },
  ];

  return (
    <section id="features" className="relative py-16 lg:py-24 bg-[#fafafa] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/20 rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-20 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/30 backdrop-blur-xl border border-white/20 mb-6 shadow-sm">
            <Sparkles size={12} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Core Capabilities
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.95] mb-6">
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

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative ${feature.size} overflow-hidden rounded-[2.5rem] p-10 transition-all duration-500
              bg-white/30 backdrop-blur-xl border border-white/20 shadow-lg hover:-translate-y-2 hover:shadow-2xl`}
            >
              {/* Badge */}
              <div className="absolute top-6 right-6">
                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/30 bg-white/20 text-slate-600 backdrop-blur">
                  {feature.badge}
                </span>
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 mb-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[10deg] shadow-md bg-white/40 backdrop-blur ${feature.accent}`}>
                {feature.icon}
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">{feature.title}</h3>
                  <ArrowUpRight
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-slate-300"
                  />
                </div>
                <p className="text-sm md:text-base leading-relaxed font-medium text-slate-500">
                  {feature.desc}
                </p>
              </div>

              {/* Ambient Glow */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-[80px] bg-emerald-200 opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;