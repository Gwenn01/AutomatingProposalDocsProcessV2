import React from "react";
import {
  Leaf,
  Clock,
  FileText,
  ShieldCheck,
  BarChart3,
  ChevronRight,
  Binary,
} from "lucide-react";

const AboutContent: React.FC = () => {
  return (
    <section className="relative bg-white pb-12 overflow-hidden">
      {/* Cinematic Background Accents */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-emerald-50/40 to-transparent rounded-full blur-[140px] -z-10 translate-x-1/3 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-50/50 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section: Institutional Authority */}
        <div className="pt-24 pb-20 border-b border-slate-100 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  Platform Genesis
                </div>
                <div className="h-px w-12 bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Est. 2026
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-10">
                About the Proposal <br />
                <span className="relative">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                    Activity Review System
                  </span>
                  <div className="absolute -bottom-2 left-0 w-full h-3 bg-emerald-100/50 -z-10 rounded-full blur-sm" />
                </span>
              </h1>
            </div>

            <div className="hidden lg:block pb-2">
              <div className="flex items-center gap-3 text-slate-300 font-mono text-xs">
                <Binary size={14} />
                <span>SYSTEM_MANIFESTO_V2</span>
              </div>
            </div>
          </div>
        </div>

        {/* The Purpose: Two-Tone Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start mb-20">
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <h3 className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-emerald-600">
                <span className="w-8 h-[2px] bg-emerald-600 transition-all group-hover:w-12" />
                The Core Objective
              </h3>
              <p className="text-3xl font-bold text-slate-800 leading-tight tracking-tight">
                Streamlining institutional intelligence through{" "}
                <span className="text-slate-400">automated precision.</span>
              </p>
            </div>

            <div className="space-y-8 text-lg text-slate-500 leading-relaxed font-medium">
              <p>
                The{" "}
                <span className="text-slate-950 font-black decoration-emerald-500/30 underline decoration-4 underline-offset-4">
                  Proposal Activity Review System
                </span>{" "}
                is a digital platform designed to automate the lifecycle of
                implementor proposals within the Extension Office.
              </p>
              <p className="bg-slate-50 p-8 rounded-[2rem] border-l-4 border-emerald-500 italic shadow-sm shadow-slate-100">
                "Our mission is to replace the friction of legacy workflows with
                a precision-engineered digital ecosystem that serves the PRMSU
                Graduate School community."
              </p>
            </div>
          </div>

          {/* Feature Card: Glassmorphism Dashboard Peek */}
          <div className="lg:col-span-5 sticky top-12">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-[4rem] blur-2xl group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
              <div className="relative bg-white border border-slate-200 p-2 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 transition-transform duration-700 group-hover:scale-[1.02]">
                <div className="bg-slate-950 rounded-[3rem] p-10 overflow-hidden relative">
                  {/* Decorative Grid */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(#fff 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  <div className="relative z-10 space-y-10">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <p className="text-white font-bold">
                          Verified Workflow
                        </p>
                        <p className="text-emerald-400/60 text-[10px] uppercase tracking-widest font-black">
                          Digital Integrity
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-white/20 to-transparent" />

                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                        <BarChart3 size={24} />
                      </div>
                      <div>
                        <p className="text-slate-300 font-bold">
                          Real-time Analytics
                        </p>
                        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black">
                          Instant Feedback
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Evolution: Adaptive Grid */}
        <div className="space-y-12">
          <div className="max-w-2xl">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-4">
              The Evolution
            </h4>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
              Legacy challenges met with <br />
              <span className="text-emerald-600">modern solutions.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <Leaf />,
                title: "Environmental Impact",
                desc: "Transitioning from high-volume paper dependency to a zero-carbon digital footprint.",
                color: "emerald",
              },
              {
                icon: <Clock />,
                title: "Temporal Velocity",
                desc: "Eliminating manual bottlenecks to accelerate proposal approval by up to 70%.",
                color: "blue",
              },
              {
                icon: <FileText />,
                title: "Data Sovereignty",
                desc: "Centralized version control ensuring institutional memory and revision accuracy.",
                color: "purple",
              },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-2 bg-slate-50 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100" />
                <div className="relative p-8 space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all duration-500">
                    {React.cloneElement(item.icon, {
                      size: 28,
                      strokeWidth: 1.5,
                    })}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn More <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
