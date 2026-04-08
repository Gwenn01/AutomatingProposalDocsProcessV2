import React from "react";
import { Cpu, Fingerprint, Layers } from "lucide-react";

const FeaturesOverview: React.FC = () => {
  return (
    <section className="relative pt-32 pb-32 bg-[#fafafa] overflow-hidden selection:bg-emerald-100">
      {/* Ambient Glows */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-50 blur-[120px] rounded-full opacity-60" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-100/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-end mb-32">
          <div className="lg:col-span-7 space-y-8">
            <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-[-0.05em] uppercase leading-[0.8] mb-0">
              System
              <br />
              <span className="text-emerald-500 font-serif lowercase italic tracking-normal font-light">
                features.
              </span>
            </h1>
          </div>

          <div className="lg:col-span-5 pb-2">
            <div className="relative pl-8 border-l-2 border-emerald-500/20">
              <p className="text-xl text-slate-500 font-medium leading-relaxed italic">
                Digitizing the PRMSU Extension Services review lifecycle through{" "}
                <span className="text-slate-950 font-semibold">high-precision tools</span>{" "}
                that make submission, tracking, and approval
                <span className="relative inline-block ml-2">
                  fully paperless.
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-emerald-100/40 -z-10 rounded-full" />
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Cpu size={28} />,
              title: "Automated Logic",
              tag: "Routing",
              desc: "Smart routing ensures proposals reach the right reviewers instantly, eliminating manual sorting.",
            },
            {
              icon: <Fingerprint size={28} />,
              title: "Immutable Audit",
              tag: "Security",
              desc: "Every action is cryptographically logged, creating a transparent trail for institutional compliance.",
            },
            {
              icon: <Layers size={28} />,
              title: "Unified Pipeline",
              tag: "Workflow",
              desc: "A single source of truth for all stakeholders—from students to the highest administration.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative bg-white/40 backdrop-blur-xl border border-white/30 p-10 rounded-[3rem] transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-200/20 hover:-translate-y-2"
            >
              {/* Tag */}
              <div className="absolute top-8 right-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-emerald-500 transition-colors">
                {item.tag}
              </div>

              <div className="space-y-8">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-emerald-500/20">
                  {item.icon}
                </div>

                {/* Title + Description */}
                <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesOverview;