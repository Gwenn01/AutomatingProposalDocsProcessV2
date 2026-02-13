import React from 'react';
import { Clock, Leaf, ShieldCheck, Zap, ArrowRight, FileSearch, CheckCircle2, RotateCcw, AlertCircle, XCircle, ChevronRight } from 'lucide-react';

const AboutSection = () => {
  const workflowStatuses = [
    { status: 'For Review', sub: 'Assigned Reviewers', color: '#3b82f6', icon: <Clock size={14} />, detail: 'Pending Queue' },
    { status: 'Under Review', sub: 'In Process', color: '#f59e0b', icon: <RotateCcw size={14} className="animate-spin-slow" />, detail: 'Active' },
    { status: 'For Revisions', sub: 'Action Required', color: '#ea580c', icon: <AlertCircle size={14} />, detail: 'Implementor' },
    { status: 'For Approval', sub: 'Finalizing', color: '#6366f1', icon: <ShieldCheck size={14} />, detail: 'Official' },
    { status: 'Approved', sub: 'Ready for Execution', color: '#10b981', icon: <CheckCircle2 size={14} />, detail: 'Final' },
  ];

  return (
    <section id="about" className="relative py-12 lg:py-20 bg-[#fafafa] overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-100/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-200/30 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-16">
          
          {/* Left Side: Modern SaaS Mockup */}
          <div className="flex-1 w-full perspective-1000">
            <div className="relative transform-gpu transition-all duration-700 hover:rotate-y-[-5deg]">
              
              {/* Main Dashboard Window */}
              <div className="bg-white rounded-[3rem] p-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-white relative z-10 overflow-hidden">
                <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 overflow-hidden">
                  
                  {/* Mockup Header */}
                  <div className="px-8 py-6 bg-white border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400/20" />
                        <div className="w-3 h-3 rounded-full bg-amber-400/20" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400/20" />
                      </div>
                      <div className="h-4 w-px bg-slate-200 mx-2" />
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Pipeline Explorer</span>
                    </div>
                    <div className="px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 text-[10px] font-bold tracking-tighter">Live v2.4</div>
                  </div>

                  {/* The Timeline Flow */}
                  <div className="p-8 space-y-4">
                    {workflowStatuses.map((item, i) => (
                      <div key={i} className="group/step relative flex items-center gap-6">
                        {/* Connecting Line */}
                        {i !== workflowStatuses.length - 1 && (
                          <div className="absolute left-[19px] top-10 w-[2px] h-6 bg-gradient-to-b from-slate-200 to-transparent" />
                        )}
                        
                        {/* Icon Node */}
                        <div className="relative flex-shrink-0 w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-all duration-500 group-hover/step:scale-110 group-hover/step:border-emerald-200" style={{ color: item.color }}>
                          {item.icon}
                        </div>

                        {/* Content Card */}
                        <div className="flex-grow bg-white/60 p-4 rounded-2xl border border-white group-hover/step:border-emerald-100 group-hover/step:bg-white transition-all duration-300 flex justify-between items-center shadow-sm hover:shadow-md">
                          <div>
                            <p className="text-xs font-black text-slate-900 leading-none mb-1">{item.status}</p>
                            <p className="text-[10px] text-slate-400 font-medium tracking-tight">{item.sub}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-black uppercase text-slate-300 group-hover/step:text-emerald-500 transition-colors tracking-widest">{item.detail}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Rejection Node (Separate for design) */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between px-4 py-3 bg-red-50/50 rounded-2xl border border-red-100/50 group hover:bg-red-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <XCircle size={14} className="text-red-500" />
                                <span className="text-xs font-bold text-red-900">Rejected</span>
                            </div>
                            <span className="text-[10px] text-red-400 font-medium italic underline underline-offset-2">View Reason</span>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Glass Accent */}
              <div className="absolute -bottom-10 -right-10 bg-white/80 backdrop-blur-xl border border-white p-6 rounded-[2rem] shadow-2xl z-20 hidden lg:block animate-bounce-slow">
                 <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-200">
                        <ShieldCheck size={24} />
                    </div>
                    <p className="text-xs font-black text-slate-900 tracking-tighter mt-2">Verified Process</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Side: Editorial Content */}
          <div className="flex-1 text-center lg:text-left space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 border border-emerald-100">
                <Zap size={14} className="fill-emerald-700" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Efficiency Reimagined</span>
              </div>
              
              <h2 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter">
                Smart <br />
                <span className="text-emerald-600">Automation.</span>
              </h2>
              
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                Stop chasing paper trails. Our digital system provides 
                <span className="text-slate-900 font-bold"> end-to-end visibility </span> 
                on every proposal, from draft to final approval.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
              {[
                { icon: <Leaf />, title: "Eco-Archive", desc: "No more printing. Fully digital proposal vault." },
                { icon: <Clock />, title: "Live Sync", desc: "Real-time updates as reviewers sign off." }
              ].map((feature, i) => (
                <div key={i} className="space-y-3 relative">
                  <div className="w-10 h-10 text-emerald-600 mb-4">{feature.icon}</div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{feature.title}</h4>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button className="group relative px-10 py-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all hover:pr-14 active:scale-95">
                <span className="relative z-10 flex items-center gap-3">
                  Start Submission Flow
                  <ArrowRight size={18} className="transition-all group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;