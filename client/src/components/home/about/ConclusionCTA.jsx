import React from 'react';
import { ArrowRight, Cpu, Globe, ShieldCheck, Zap, Terminal } from 'lucide-react';

const ConclusionCTA = () => {
  return (
    <section className="relative py-32 bg-white overflow-hidden selection:bg-emerald-100">
      {/* Structural Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-slate-50 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-stretch min-h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
          
          {/* Left: The Manifesto (The "Why") */}
          <div className="lg:w-3/5 bg-white p-12 lg:p-20 flex flex-col justify-between relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
                <Terminal size={300} strokeWidth={1}/>
            </div>

            <div className="space-y-10 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Final Protocol</span>
              </div>

              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase">
                Modernizing <br />
                <span className="text-emerald-500 italic font-serif lowercase tracking-normal font-light">proposal</span> <br />
                Management.
              </h2>

              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">
                This system digitizes the review lifecycle, supporting both <span className="text-slate-900 font-bold underline decoration-emerald-500/30 underline-offset-4">students and staff</span> in achieving a high-velocity, synchronized workflow.
              </p>
            </div>

            <div className="flex gap-8 pt-12">
               {[
                 { icon: <ShieldCheck size={18}/>, label: 'Secure' },
                 { icon: <Zap size={18}/>, label: 'Fast' },
                 { icon: <Globe size={18}/>, label: 'Global' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-2 group cursor-default">
                   <div className="text-emerald-500 group-hover:scale-110 transition-transform">{item.icon}</div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-slate-900 transition-colors">{item.label}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Right: The Portal (The "Action") */}
          <div className="lg:w-2/5 bg-slate-950 p-12 lg:p-20 flex flex-col items-center justify-center relative overflow-hidden group/portal">
            {/* High-End Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 blur-[100px] group-hover/portal:bg-emerald-500/40 transition-all duration-700" />
            
            <div className="relative z-10 text-center space-y-8">
              <div className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
                <Cpu className="text-emerald-400 animate-spin-slow" size={32} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-white text-2xl font-black uppercase tracking-tighter">Initialize Platform</h3>
                <p className="text-emerald-400/50 font-mono text-[10px] uppercase tracking-widest">Ready for deployment</p>
              </div>

              <button className="group/btn relative inline-flex items-center gap-4 bg-emerald-500 hover:bg-white text-slate-950 px-10 py-5 rounded-full transition-all duration-500 font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20">
                Enter Dashboard
                <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>

            {/* Bottom Status Bar */}
            <div className="absolute bottom-8 left-0 w-full px-12 flex justify-between items-center opacity-40 group-hover/portal:opacity-100 transition-opacity duration-700">
               <span className="text-[8px] font-mono text-white uppercase tracking-[0.3em]">System_Status: Stable</span>
               <div className="flex gap-1">
                 {[...Array(4)].map((_, i) => (
                   <div key={i} className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Brand/Institutional Footer Tag */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-none">
            PRMSU Graduate School // Extension Office Digital Matrix
          </p>
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-slate-100" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Build 2026.4</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default ConclusionCTA;