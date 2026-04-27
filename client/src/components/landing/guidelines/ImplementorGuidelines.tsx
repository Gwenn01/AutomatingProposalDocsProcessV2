import React from "react";
import {
  UserPlus,
  Key,
  FileEdit,
  Send,
  MessageCircle,
  History,
  CheckSquare,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity,
} from "lucide-react";

const ImplementorGuidelines: React.FC = () => {
  const steps = [
    {
      id: "01",
      title: "Join the System",
      action: "Create your account by filling in your basic school details.",
      icon: <UserPlus size={22} />,
    },
    {
      id: "02",
      title: "Sign In",
      action: "Use your new account to enter your private workspace.",
      icon: <Key size={22} />,
    },
    {
      id: "03",
      title: "Write your Proposal",
      action: "Fill out the simple form. Make sure all required boxes are checked.",
      icon: <FileEdit size={22} />,
    },
    {
      id: "04",
      title: "Send for Review",
      action: "Submit your work; the system will notify the reviewers for you.",
      icon: <Send size={22} />,
    },
    {
      id: "05",
      title: "Track Progress",
      action: "Watch for notifications if a reviewer leaves a helpful comment.",
      icon: <MessageCircle size={22} />,
    },
    {
      id: "06",
      title: "Make Updates",
      action: "Improve your work based on the feedback and send it back.",
      icon: <History size={22} />,
    },
    {
      id: "07",
      title: "Final Result",
      action: "See your final status once the review is fully finished.",
      icon: <CheckSquare size={22} />,
    },
  ];

  return (
    <section className="relative py-16 bg-white overflow-hidden selection:bg-emerald-100">
      {/* Premium Architectural Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-50/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[40%] bg-slate-50 rounded-full blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
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
                Implementor Guide
              </span>
            </div>
            <h2 className="text-6xl lg:text-8xl font-black text-slate-950 tracking-tight leading-[0.85] uppercase">
              Implementor <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 italic font-serif lowercase tracking-normal font-light">
                Process.
              </span>
            </h2>
          </div>

          <div className="lg:max-w-xs border-l-2 border-emerald-500 pl-8 pb-2">
            <p className="text-lg text-slate-500 font-medium leading-relaxed tracking-tight">
              Streamlined for those who <span className="text-slate-950 font-bold">originate</span> proposals.
              Follow this sequence to ensure institutional alignment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Main Action Path (Left) */}
          <div className="lg:col-span-7">
            <div className="relative">
              {/* Decorative Timeline Line */}
              <div className="absolute left-[47px] top-0 w-px h-full bg-gradient-to-b from-emerald-100 via-slate-100 to-transparent hidden md:block" />

              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="group relative flex items-start gap-8 p-10 rounded-[3.5rem] transition-all duration-500 hover:bg-white hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-transparent hover:border-slate-100"
                  >
                    {/* Floating Step Number */}
                    <div className="absolute -left-4 top-10 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                      <span className="text-8xl font-black text-slate-900 leading-none">
                        {step.id}
                      </span>
                    </div>

                    {/* Step Icon Container */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-200/50 transition-all duration-500">
                        {step.icon}
                      </div>
                      <span className="mt-4 text-[9px] font-black tracking-widest text-slate-300 group-hover:text-emerald-500 transition-colors uppercase">
                        Phase {step.id}
                      </span>
                    </div>

                    {/* Instruction Content */}
                    <div className="flex-1 pt-4">
                      <h4 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                        {step.title}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium group-hover:text-slate-600">
                        {step.action}
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

          {/* Tactical Sidebar (Right) */}
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
                        Status Management
                      </h4>
                    </div>
                    <div className="space-y-8">
                      <p className="text-lg text-white font-medium leading-snug tracking-tight">
                        Lifecycle tracking is <span className="text-emerald-400 italic font-serif">fully automated</span>.
                      </p>
                      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex gap-4 items-start">
                        <Zap size={16} className="text-emerald-400 shrink-0 mt-1" />
                        <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                          Real-time updates trigger whenever a reviewer interacts with your submission. Check your dashboard daily.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro-Tips Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div className="p-10 rounded-[3rem] bg-emerald-50/50 border border-emerald-100/50 flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-2">
                      Quality Standards
                    </h5>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Comprehensive documentation minimizes feedback cycles. Ensure all metadata is verified before submission.
                    </p>
                  </div>
                </div>

                <button className="w-full flex items-center justify-between p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-100/20 transition-all group">
                  <div className="flex items-center gap-6 text-left">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                      <MessageCircle size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Support
                      </p>
                      <p className="text-base font-bold text-slate-900 tracking-tight">
                        Technical Support
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImplementorGuidelines;
