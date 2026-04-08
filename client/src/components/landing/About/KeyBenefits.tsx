import React from "react";
import {
  Zap,
  Leaf,
  Eye,
  MessageSquare,
  History,
} from "lucide-react";

const KeyBenefits: React.FC = () => {
  const benefits = [
    {
      title: "Efficiency",
      desc: "Architected to reduce manual overhead, accelerating the institutional review cycle by up to 70%.",
      icon: <Zap size={24} />,
      metric: "70% Velocity Increase",
      tag: "PERFORMANCE",
    },
    {
      title: "Sustainability",
      desc: "A 100% paperless pipeline that eliminates print costs and physical archival requirements.",
      icon: <Leaf size={24} />,
      metric: "Zero Paper Waste",
      tag: "ENVIRONMENTAL",
    },
    {
      title: "Transparency",
      desc: "Real-time visibility into the pipeline. Implementors and Admins monitor live progress at every stage.",
      icon: <Eye size={24} />,
      metric: "Real-Time Tracking",
      tag: "VISIBILITY",
    },
    {
      title: "Collaboration",
      desc: "Reviewers provide precision feedback and annotations directly within the digital workspace.",
      icon: <MessageSquare size={24} />,
      metric: "Integrated Feedback",
      tag: "SYNERGY",
    },
    {
      title: "Version Control",
      desc: "Automatic versioning tracks every revision, ensuring a complete and immutable audit trail.",
      icon: <History size={24} />,
      metric: "Immutable History",
      tag: "INTEGRITY",
    },
  ];

  return (
    <section className="relative py-20 bg-[#fafafa] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Strategic <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 italic font-serif lowercase tracking-normal">
                outcomes.
              </span>
            </h2>
          </div>
          <div className="lg:text-right">
            <p className="text-sm font-bold text-slate-700 uppercase tracking-widest leading-relaxed">
              Propelling PRMSU Extension Services <br /> into a high-precision future.
            </p>
          </div>
        </div>

        {/* Benefits Scroll-Track */}
        <div className="flex flex-col gap-6">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/30 p-8 md:p-12 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-emerald-200/40 hover:-translate-y-1"
            >
              {/* Animated Accent Bar */}
              <div className="absolute top-0 left-0 w-2 h-full bg-emerald-400 transition-all duration-500 group-hover:w-3 rounded-tr-lg rounded-br-lg" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Meta Data */}
                <div className="lg:col-span-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-300 mb-2 block tracking-widest">
                    GEN-0{idx + 1}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50/60 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-500 shadow-md">
                    {item.icon}
                  </div>
                </div>

                {/* Core Content */}
                <div className="lg:col-span-4">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-500 tracking-[0.2em] uppercase">
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="lg:col-span-4">
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Metric Action */}
                <div className="lg:col-span-2 lg:text-right">
                  <div className="inline-flex flex-col items-end">
                    <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1 group-hover:text-slate-900 transition-colors">
                      {item.metric}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyBenefits;