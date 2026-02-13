import React from 'react';
import { ArrowRight, Leaf, Zap, ShieldCheck, Sparkles, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeatureConclusion = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-12 bg-[#fafafa] overflow-hidden">
      {/* Background Continuity: Radial Grid & Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="bg-slate-950 rounded-[4rem] p-1 shadow-2xl overflow-hidden group">
          <div className="bg-slate-900 rounded-[3.8rem] relative overflow-hidden px-8 py-20 lg:p-24">
            
            {/* Animated Background Stream */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent -rotate-12 animate-pulse" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left Content: The Manifest */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Sparkles size={14} className="text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">System Synthesis Complete</span>
                </div>

                <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase">
                  Fast. Organized. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 italic font-serif lowercase tracking-normal font-light">Transparent.</span>
                </h2>

                <p className="max-w-xl text-slate-400 text-lg font-medium leading-relaxed">
                  These features converge to bridge the gap between institutional policy and digital efficiency. 
                  By digitizing the review lifecycle, we don’t just save time—we <span className="text-emerald-400">eliminate friction</span> and secure a paperless legacy.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4">
                  {[
                    { icon: <Zap size={18} />, label: "Zero Lag" },
                    { icon: <ShieldCheck size={18} />, label: "Error Free" },
                    { icon: <Leaf size={18} />, label: "Paperless" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                      <span className="text-emerald-500">{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Content: Magnetic Interaction */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Decorative Outer Ring */}
                  <div className="absolute -inset-10 border border-emerald-500/10 rounded-full animate-spin-slow pointer-events-none" />
                  
                  <button 
                    onClick={() => navigate('/auth')}
                    className="relative w-64 h-64 bg-emerald-500 rounded-full flex flex-col items-center justify-center p-8 text-slate-950 transition-all duration-700 hover:scale-110 hover:shadow-[0_0_80px_-10px_rgba(16,185,129,0.6)] active:scale-95 group/btn"
                  >
                    <Command className="mb-4 opacity-40 group-hover:rotate-90 transition-transform duration-700" size={32} />
                    <span className="text-center font-black uppercase tracking-tighter leading-none text-2xl">
                      Initialize <br /> Dashboard
                    </span>
                    <div className="mt-4 flex items-center justify-center w-10 h-10 bg-slate-950 rounded-full text-white group-hover:translate-x-2 transition-transform">
                        <ArrowRight size={20} />
                    </div>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Technical Footer Metadata */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.5em]">
            Institutional Standard // Digital Infrastructure v2.0
          </p>
          <div className="h-px flex-grow bg-slate-200 mx-8 hidden md:block" />
          <div className="flex gap-8">
            <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest cursor-pointer hover:text-emerald-600 transition-colors">Privacy Protocol</span>
            <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest cursor-pointer hover:text-emerald-600 transition-colors">Service Terms</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default FeatureConclusion;