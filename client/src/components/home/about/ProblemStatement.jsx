import React from 'react';
import { Layers, Fingerprint, Activity, ArrowRight, XCircle, ShieldAlert, Zap } from 'lucide-react';

const ProblemStatement = () => {
  const challenges = [
    {
      id: "01",
      icon: <Layers size={20} strokeWidth={1.5} />,
      title: "Paper-Intensive",
      problem: "Large volumes of paper used for submissions, physical comments, and redundant revisions.",
      impact: "Institutional Overhead",
    },
    {
      id: "02",
      icon: <ShieldAlert size={20} strokeWidth={1.5} />,
      title: "Error-Prone",
      problem: "Misplaced documents or overlooked handwritten feedback leading to critical mistakes.",
      impact: "Integrity Risk",
    },
    {
      id: "03",
      icon: <Activity size={20} strokeWidth={1.5} />,
      title: "Difficult Tracking",
      problem: "Monitoring the status of proposals is slow, opaque, and highly inefficient.",
      impact: "Workflow Stagnation",
    }
  ];

  return (
    <section className="relative bg-white py-12 overflow-hidden">
      {/* Ultra-subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Section 1: The Narrative */}
          <div className="lg:w-1/3 sticky top-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">The Friction</span>
              </div>
              <h2 className="text-6xl font-black text-slate-900 tracking-[ -0.05em] leading-[0.9]">
                Legacy <br /> 
                <span className="text-slate-200 group-hover:text-slate-900 transition-colors duration-700">Obstacles.</span>
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                Traditional workflows are no longer sustainable for modern institutional research. We have identified the core pillars of administrative friction.
              </p>
            </div>
          </div>

          {/* Section 2: The List (Clean Editorial Style) */}
          <div className="lg:w-2/3 space-y-12">
            
            {/* Primary Diagnostic (Time) */}
            <div className="relative group">
               <div className="flex flex-col md:flex-row gap-8 md:items-center">
                  <div className="text-8xl font-black text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute -left-20 -top-4 pointer-events-none">00</div>
                  <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-emerald-400 shrink-0">
                    <Fingerprint size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Time-Consuming Workflow</h3>
                    <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
                       Manual reviews require physical presence and logistical handling, creating a 
                       <span className="text-slate-900 font-bold italic"> "Latency Trap" </span> 
                       that delays institutional progress.
                    </p>
                  </div>
               </div>
            </div>

            {/* The Grid for secondary challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 border-t border-slate-100 pt-12">
              {challenges.map((item) => (
                <div key={item.id} className="group flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-500 transition-all duration-300">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-widest italic">{item.impact}</span>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium group-hover:text-slate-700 transition-colors">
                      {item.problem}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Section 3: The "Digital Pivot" Section Break */}
            <div className="pt-12">
              <div className="relative h-[400px] w-full bg-slate-950 rounded-[3rem] overflow-hidden group cursor-pointer">
                {/* Background Video or Abstract Pattern Placeholder */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-transparent" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                  <div className="mb-6 w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white animate-bounce">
                    <Zap size={24} fill="white" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4 leading-tight">
                    Enough with the friction. <br />
                    <span className="text-emerald-400 font-serif italic">Meet the future.</span>
                  </h3>
                  <div className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.5em] mt-4 group-hover:text-emerald-400 transition-colors">
                    Initialize Solution <ArrowRight size={14} />
                  </div>
                </div>

                {/* Decorative Tech Elements */}
                <div className="absolute bottom-10 left-10 flex gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <div className="w-12 h-1 rounded-full bg-white/20" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;