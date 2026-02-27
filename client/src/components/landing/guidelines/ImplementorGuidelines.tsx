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
  ChevronRight,
} from "lucide-react";

const ImplementorGuidelines: React.FC = () => {
  const steps = [
    {
      id: "01",
      title: "Account Registration",
      action:
        "Click 'Register' and provide your institutional information to instantiate your profile.",
      icon: <UserPlus size={22} />,
    },
    {
      id: "02",
      title: "Secure Login",
      action:
        "Access the system using your verified credentials to enter the workspace.",
      icon: <Key size={22} />,
    },
    {
      id: "03",
      title: "Draft Proposal",
      action:
        "Fill out the proposal form completely. Ensure all mandatory fields are accurately populated.",
      icon: <FileEdit size={22} />,
    },
    {
      id: "04",
      title: "Initial Submission",
      action:
        "Submit for audit; the system automatically transitions the status to 'For Review'.",
      icon: <Send size={22} />,
    },
    {
      id: "05",
      title: "Monitor Feedback",
      action:
        "Check notifications for reviewer comments or administrative directives.",
      icon: <MessageCircle size={22} />,
    },
    {
      id: "06",
      title: "Iterative Revision",
      action:
        "Apply necessary changes based on feedback and resubmit. Status updates to 'For Revisions'.",
      icon: <History size={22} />,
    },
    {
      id: "07",
      title: "Final Determination",
      action:
        "Track the terminal state of your proposal: 'Approved' or 'Rejected'.",
      icon: <CheckSquare size={22} />,
    },
  ];

  return (
    <section className="relative py-28 bg-white overflow-hidden selection:bg-emerald-100 border-t border-slate-100">
      {/* Subtle Architectural Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header: Implementor Identity */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-10 bg-emerald-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-600">
                Implementor Protocol v2.0
              </span>
            </div>
            <h2 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.8]">
              IMPLEMENTOR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-400 font-light italic">
                Workflow.
              </span>
            </h2>
          </div>

          <div className="lg:max-w-xs border-l-2 border-slate-100 pl-8 pb-2">
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              For users who{" "}
              <span className="text-slate-950 font-bold">
                originate and refine
              </span>{" "}
              proposals. Follow this linear path to ensure successful
              institutional processing.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Main Action Path (Left) */}
          <div className="lg:col-span-7">
            <div className="relative">
              {/* Decorative Timeline Line */}
              <div className="absolute left-[31px] top-0 w-px h-full bg-slate-100 hidden md:block" />

              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="group relative flex items-start gap-8 p-8 rounded-[2.5rem] transition-all duration-500 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                  >
                    {/* Step Icon Container */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-emerald-400 group-hover:shadow-xl transition-all duration-500">
                        {step.icon}
                      </div>
                      <span className="mt-4 text-[10px] font-black font-mono text-slate-300 group-hover:text-emerald-500">
                        {step.id}
                      </span>
                    </div>

                    {/* Instruction Content */}
                    <div className="flex-1 pt-2">
                      <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
                        {step.title}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium group-hover:text-slate-600">
                        {step.action}
                      </p>
                    </div>

                    <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2">
                      <ChevronRight size={20} className="text-emerald-500/40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tactical Sidebar (Right) */}
          <div className="lg:col-span-5">
            <div className="sticky top-12 space-y-8">
              {/* System Note: Automation Alert */}
              <div className="bg-slate-950 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-12">
                    <Activity size={20} className="text-emerald-400" />
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                      Status Management
                    </h4>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">
                        Automated Transitions
                      </h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Statuses like{" "}
                        <span className="text-white font-bold tracking-tight">
                          For Review
                        </span>{" "}
                        and{" "}
                        <span className="text-white font-bold tracking-tight">
                          For Revisions
                        </span>{" "}
                        are triggered by system actions.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                      <div className="flex gap-4 items-start">
                        <Zap
                          size={18}
                          className="text-emerald-400 shrink-0 mt-1"
                        />
                        <p className="text-[11px] font-medium text-slate-300 leading-relaxed italic">
                          Always check your dashboard notifications to respond
                          to reviewer comments promptly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro-Tips Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div className="p-8 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 group transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} />
                  </div>
                  <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-2">
                    Precision Entry
                  </h5>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    Fill out all fields carefully. Incomplete data is the
                    primary cause of submission delays.
                  </p>
                </div>

                <button className="w-full flex items-center justify-between p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                      <ArrowUpRight
                        size={20}
                        className="text-slate-400 group-hover:text-emerald-500"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Need Help?
                      </p>
                      <p className="text-sm font-bold text-slate-900">
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
