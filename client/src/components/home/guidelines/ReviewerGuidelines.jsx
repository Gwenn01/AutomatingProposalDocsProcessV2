import React from 'react';
import { 
  ClipboardCheck, 
  Search, 
  MessageSquarePlus, 
  Activity, 
  Clock, 
  Zap,
  Fingerprint,
  Box,
  LogIn,
  ChevronRight,
  Target
} from 'lucide-react';

const ReviewerGuidelines = () => {
  const statusLogic = [
    { state: "For Review", trigger: "Newly created by implementor", color: "bg-slate-300" },
    { state: "Under Review", trigger: "Admin assigned a reviewer", color: "bg-amber-400" },
    { state: "For Revisions", trigger: "Reviewer submitted comments", color: "bg-blue-500" },
    { state: "For Approval", trigger: "Admin reviews revisions", color: "bg-emerald-400" },
    { state: "Terminal", trigger: "Approved or Rejected", color: "bg-slate-950" }
  ];

  return (
    <section className="relative py-24 bg-[#FAFAFA] overflow-hidden border-t border-slate-100">
      {/* Background Architectural Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-slate-100 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header: Reviewer Identity */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm flex items-center gap-2">
              <Target size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Reviewer Protocol v2.0</span>
            </div>
          </div>
          
          <h2 className="text-6xl lg:text-8xl font-black text-slate-950 tracking-tighter leading-none mb-8">
            REVIEWER <br />
            <span className="text-emerald-500 italic font-serif lowercase tracking-normal font-light">Workflow.</span>
          </h2>
          
          <div className="max-w-xl">
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Assigned users who evaluate proposals. Follow the standard <span className="text-slate-900 font-bold underline decoration-emerald-500/30 text-nowrap">Step-by-Step</span> review process to maintain system efficiency.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main: Step-by-Step Instructions */}
          <div className="lg:col-span-7 space-y-4">
            {[
              { 
                step: "01",
                icon: <LogIn size={22} />, 
                title: "Login & Triage", 
                desc: "Access your account and check the 'Assigned Proposals' section in your dashboard." 
              },
              { 
                step: "02",
                icon: <Search size={22} />, 
                title: "Thorough Review", 
                desc: "Analyze the proposal details carefully to ensure all requirements are met." 
              },
              { 
                step: "03",
                icon: <MessageSquarePlus size={22} />, 
                title: "Submit Comments", 
                desc: "Log your review. Clearly indicate suggestions, questions, or specific corrections for the implementor." 
              }
            ].map((item, i) => (
              <div key={i} className="group flex gap-8 p-10 rounded-[3.5rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-emerald-400 transition-all duration-500 shadow-inner">
                    {item.icon}
                  </div>
                  {i !== 2 && <div className="w-px h-full bg-slate-100 mt-4" />}
                </div>
                <div className="flex-1 pt-2">
                  <span className="text-[10px] font-mono font-bold text-slate-300 group-hover:text-emerald-500 mb-2 block tracking-widest transition-colors">STEP {item.step}</span>
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">{item.title}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Status Engine & Tips */}
          <div className="lg:col-span-5">
            <div className="sticky top-12 space-y-8">
              
              {/* Automated Status Logic Card */}
              <div className="bg-slate-950 rounded-[3.5rem] p-12 text-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <Activity size={18} className="text-emerald-400" />
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">System Status Engine</h4>
                  </div>

                  <div className="space-y-3">
                    {statusLogic.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] transition-all group">
                        <div className="flex items-center gap-4">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.color} shadow-[0_0_10px_currentColor]`} />
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-white">{item.state}</p>
                            <p className="text-[9px] text-slate-500 font-medium mt-0.5">{item.trigger}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-800 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex gap-4 items-center">
                    <Zap size={18} className="text-emerald-400 shrink-0" />
                    <p className="text-[10px] font-medium text-slate-300 leading-relaxed italic">
                      Reviewers do <span className="text-white font-bold uppercase underline decoration-emerald-500/50">not</span> manually change status. The system updates based on your submitted review.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 flex items-start gap-6 group hover:border-emerald-200 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <MessageSquarePlus size={20} />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-1">Clear Feedback</h5>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Be clear and constructive in comments to help implementors improve.</p>
                  </div>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 flex items-start gap-6 group hover:border-emerald-200 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-slate-950 group-hover:text-emerald-400 transition-all">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-1">Contextual Review</h5>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Check previous revisions to avoid repeating feedback cycles.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ReviewerGuidelines;