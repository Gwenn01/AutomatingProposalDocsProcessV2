import React from "react";
import {
  Search,
  MessageSquarePlus,
  Activity,
  Zap,
  LogIn,
  ArrowUpRight,
  Target,
} from "lucide-react";

const ReviewerGuidelines: React.FC = () => {
  const statusLogic = [
    {
      state: "New",
      trigger: "Ready for first look",
      color: "bg-slate-300",
    },
    {
      state: "Ongoing",
      trigger: "Review is in progress",
      color: "bg-amber-400",
    },
    {
      state: "Updates Needed",
      trigger: "Waiting for implementor changes",
      color: "bg-blue-500",
    },
    {
      state: "Final Check",
      trigger: "Ready for final sign-off",
      color: "bg-emerald-400",
    },
  ];

  return (
    <section className="relative py-16 bg-white overflow-hidden selection:bg-emerald-100">
      {/* Premium Architectural Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-50/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[5%] left-[-5%] w-[40%] h-[40%] bg-slate-50 rounded-full blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header: Identity Section */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700">
                Reviewer Protocol
              </span>
            </div>
            <h2 className="text-6xl lg:text-8xl font-black text-slate-950 tracking-tight leading-[0.85] uppercase">
              Reviewer <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 italic font-serif lowercase tracking-normal font-light">
                Evaluation.
              </span>
            </h2>
          </div>

          <div className="lg:max-w-xs border-l-2 border-emerald-500 pl-8 pb-2">
            <p className="text-lg text-slate-500 font-medium leading-relaxed tracking-tight">
              Guide researchers with <span className="text-slate-950 font-bold">clarity</span>.
              Follow this sequence to maintain institutional quality.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Action Pipeline (Left) */}
          <div className="lg:col-span-7">
            <div className="relative">
              {/* Decorative Timeline Line */}
              <div className="absolute left-[47px] top-0 w-px h-full bg-gradient-to-b from-emerald-100 via-slate-100 to-transparent hidden md:block" />

              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    icon: <LogIn size={22} />,
                    title: "Access Dashboard",
                    desc: "Enter your account and navigate to the 'Queue' to see proposals assigned to you.",
                  },
                  {
                    step: "02",
                    icon: <Search size={22} />,
                    title: "Review Content",
                    desc: "Examine the submission thoroughly to ensure all institutional requirements are satisfied.",
                  },
                  {
                    step: "03",
                    icon: <MessageSquarePlus size={22} />,
                    title: "Share Insights",
                    desc: "Provide actionable feedback to help the researcher improve and align their document.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group relative flex items-start gap-8 p-10 rounded-[3.5rem] transition-all duration-500 hover:bg-white hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-transparent hover:border-slate-100"
                  >
                    {/* Floating Step Number */}
                    <div className="absolute -left-4 top-10 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                      <span className="text-8xl font-black text-slate-900 leading-none">
                        {item.step}
                      </span>
                    </div>

                    {/* Step Icon Container */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-200/50 transition-all duration-500">
                        {item.icon}
                      </div>
                      <span className="mt-4 text-[9px] font-black tracking-widest text-slate-300 group-hover:text-emerald-500 transition-colors uppercase">
                        Step {item.step}
                      </span>
                    </div>

                    {/* Instruction Content */}
                    <div className="flex-1 pt-4">
                      <h4 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium group-hover:text-slate-600">
                        {item.desc}
                      </p>
                    </div>

                    <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2">
                      <ArrowUpRight size={20} className="text-emerald-500/40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-8">
              {/* System Note: Automation Alert */}
              <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-2 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-white">
                <div className="bg-slate-950 rounded-[2.5rem] p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                      <Activity size={18} className="text-emerald-400" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Lifecycle Tracking
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {statusLogic.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-200">
                                {item.state}
                              </p>
                            </div>
                          </div>
                          <p className="text-[9px] text-slate-500 font-medium">{item.trigger}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 p-6 rounded-3xl bg-white/5 border border-white/10 flex gap-4 items-start">
                      <Zap size={16} className="text-emerald-400 shrink-0 mt-1" />
                      <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                        System statuses update automatically when feedback is committed. No manual overrides required.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advice Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div className="p-10 rounded-[3rem] bg-emerald-50/50 border border-emerald-100/50 flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                    <Target size={22} />
                  </div>
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">
                      Objective Review
                    </h5>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Ensure evaluations are based on institutional rubrics. Concise notes accelerate the approval loop.
                    </p>
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
