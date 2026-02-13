import React from 'react';
import { LayoutGrid, Cpu, Fingerprint, Layers, ChevronRight } from 'lucide-react';

const FeaturesOverview = () => {
  return (
    <section className="relative pt-32 pb-32 bg-white overflow-hidden selection:bg-emerald-100">
      {/* Background Technical Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 translate-x-32 pointer-events-none" />
      <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-50 blur-[120px] rounded-full opacity-60" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block: Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-end mb-32">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-slate-950">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400/80">Capabilities v2.0</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-[ -0.05em] uppercase leading-[0.8] mb-0">
              System<br />
              <span className="text-emerald-500 font-serif lowercase italic tracking-normal font-light">features.</span>
            </h1>
          </div>

          <div className="lg:col-span-5 pb-2">
            <div className="relative pl-8 border-l-2 border-emerald-500/20">
              <p className="text-xl text-slate-500 font-medium leading-relaxed italic">
                Digitizing the institutional review lifecycle through <span className="text-slate-950">high-precision tools</span> that make submission, tracking, and approval 
                <span className="relative inline-block ml-2">
                   fully paperless.
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-emerald-100 -z-10" />
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Feature Logic Pillars: Module Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Cpu size={28} />,
              title: "Automated Logic",
              tag: "Routing",
              desc: "Smart routing ensures proposals reach the right reviewers instantly, eliminating manual sorting."
            },
            {
              icon: <Fingerprint size={28} />,
              title: "Immutable Audit",
              tag: "Security",
              desc: "Every action is cryptographically logged, creating a transparent trail for institutional compliance."
            },
            {
              icon: <Layers size={28} />,
              title: "Unified Pipeline",
              tag: "Workflow",
              desc: "A single source of truth for all stakeholders—from students to the highest administration."
            }
          ].map((item, i) => (
            <div key={i} className="group relative bg-white border border-slate-100 p-10 rounded-[2.5rem] transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-3">
              {/* Card Decoration */}
              <div className="absolute top-8 right-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-emerald-500 transition-colors">
                {item.tag}
              </div>

              <div className="space-y-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-emerald-900/10">
                  {item.icon}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                  Detailed Specs <ChevronRight size={12} />
                </div>
              </div>

              {/* Hover Bottom Border */}
              <div className="absolute bottom-0 left-10 right-10 h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-full" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Visual Footer Tag */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
        <span className="text-[10px] font-mono text-slate-300 uppercase tracking-[0.5em]">
          Protocol 01 // Structural Foundation
        </span>
      </div>
    </section>
  );
};

export default FeaturesOverview;