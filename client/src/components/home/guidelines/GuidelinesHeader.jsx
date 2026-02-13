import React from 'react';
import { BookOpen, Info, ChevronRight, FileSearch, HelpCircle, ArrowDown, Hash } from 'lucide-react';

const GuidelinesHeader = () => {
  return (
    <section className="relative pt-20 pb-12 bg-[#fafafa] overflow-hidden">
      {/* Premium Background Architecture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-emerald-100/30 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-[-5%] w-[30%] h-[40%] bg-slate-200/40 rounded-full blur-[100px]" />
        
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        {/* Subtle Horizontal Scanline */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Breadcrumb / Metadata Bar */}
        <div className="flex items-center gap-4 mb-12 opacity-60">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
            <Hash size={10} className="text-emerald-500" />
            <span>Root</span>
            <ChevronRight size={10} />
            <span className="text-slate-900">Guidelines_v2.0.4</span>
          </div>
          <div className="h-px w-12 bg-slate-200" />
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Auth: PRMSU_CORE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          {/* Left Column: The Identity */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Official Protocol</span>
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-black text-slate-950 tracking-tight leading-[0.85] uppercase">
                User <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 italic font-serif lowercase tracking-normal font-light">Guidelines.</span>
              </h1>
            </div>

            <div className="relative group max-w-xl">
              {/* Decorative accent line */}
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-emerald-500 rounded-full opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
              
              <p className="text-xl lg:text-2xl font-medium text-slate-500 leading-tight tracking-tight">
                This central repository provides <span className="text-slate-950 font-bold">surgical instructions</span> for navigating the ecosystem—ensuring speed, organization, and a strictly paperless workflow.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Navigation Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-2 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-white">
              <div className="bg-slate-50/50 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Jump to Module</h3>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm text-emerald-500">
                    <BookOpen size={14} />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Implementor Guide", icon: <ChevronRight size={14} />, color: "emerald" },
                    { label: "Reviewer Protocols", icon: <FileSearch size={14} />, color: "slate" },
                    { label: "Admin Operations", icon: <HelpCircle size={14} />, color: "slate" }
                  ].map((link, i) => (
                    <button 
                      key={i} 
                      className="w-full flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.1)] transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          {link.icon}
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-950 transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <ArrowDown size={14} className="text-slate-200 group-hover:text-emerald-400 -rotate-45 group-hover:rotate-0 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Indicator Footnote */}
        <div className="mt-24 flex items-center gap-6">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#fafafa] bg-white flex items-center justify-center text-[10px] font-black text-slate-300">
                0{i}
              </div>
            ))}
          </div>
          <div className="h-px flex-grow bg-gradient-to-r from-slate-200 to-transparent" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
            Ready for Operation
          </p>
        </div>
      </div>
    </section>
  );
};

export default GuidelinesHeader;