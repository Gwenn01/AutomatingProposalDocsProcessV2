import React from "react";
import {
  ShieldCheck,
  Users,
  Lock,
  UserPlus,
  UserMinus,
  RefreshCcw,
  ChevronRight,
  Eye,
  Cpu,
  Layers,
  UserCog,
  FileSearch,
  ArrowUpRight,
  CheckCircle,
  BarChart3,
} from "lucide-react";

const AdminGuidelines: React.FC = () => {
  const accountActions = [
    {
      title: "Add",
      desc: "Set up new accounts for researchers or reviewers.",
      icon: <UserPlus size={18} />,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "View",
      desc: "Check account details and activity logs.",
      icon: <Eye size={18} />,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Edit",
      desc: "Change user roles or reset access passwords.",
      icon: <RefreshCcw size={18} />,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Remove",
      desc: "Delete profiles and stop account access.",
      icon: <UserMinus size={18} />,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <section className="relative py-16 bg-white overflow-hidden selection:bg-emerald-100">
      {/* Premium Architectural Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-slate-50 rounded-full blur-[140px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[40%] bg-emerald-50/40 rounded-full blur-[120px]" />

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
                Administrative Oversight
              </span>
            </div>
            <h2 className="text-6xl lg:text-8xl font-black text-slate-950 tracking-tight leading-[0.85] uppercase">
              Admin <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 italic font-serif lowercase tracking-normal font-light">
                Management.
              </span>
            </h2>
          </div>

          <div className="lg:max-w-xs border-l-2 border-slate-900 pl-8 pb-2">
            <p className="text-lg text-slate-500 font-medium leading-relaxed tracking-tight">
              The <span className="text-slate-950 font-bold">system lead</span> handles top-level decisions.
              Manage the workflow and users with simple, centralized tools.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Admin Workflow Pipeline (Left) */}
          <div className="lg:col-span-6">
            <div className="relative">
              {/* Decorative Timeline Line */}
              <div className="absolute left-[47px] top-0 w-px h-full bg-gradient-to-b from-slate-200 via-slate-100 to-transparent hidden md:block" />

              <div className="space-y-6">
                {[
                  {
                    id: "01",
                    title: "Admin Sign In",
                    task: "Log in using the secure management portal.",
                    icon: <Lock size={22} />,
                  },
                  {
                    title: "Proposal Review",
                    id: "02",
                    task: "See every proposal waiting in the master list.",
                    icon: <FileSearch size={22} />,
                  },
                  {
                    title: "Assign Tasks",
                    id: "03",
                    task: "Hand out proposals to the right reviewers.",
                    icon: <Users size={22} />,
                  },
                  {
                    title: "Check Progress",
                    id: "04",
                    task: "Monitor how fast reviews are being finished.",
                    icon: <BarChart3 size={22} />,
                  },
                  {
                    title: "Final Decision",
                    id: "05",
                    task: "Give the final approval or send back for fixes.",
                    icon: <CheckCircle size={22} />,
                  },
                ].map((op, i) => (
                  <div
                    key={i}
                    className="group relative flex items-start gap-8 p-10 rounded-[3.5rem] transition-all duration-500 hover:bg-white hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-transparent hover:border-slate-100"
                  >
                    {/* Floating Step Number */}
                    <div className="absolute -left-4 top-10 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                      <span className="text-8xl font-black text-slate-900 leading-none">
                        {op.id}
                      </span>
                    </div>

                    {/* Step Icon Container */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-200/50 transition-all duration-500">
                        {op.icon}
                      </div>
                      <span className="mt-4 text-[9px] font-black tracking-widest text-slate-300 group-hover:text-emerald-500 transition-colors uppercase">
                        Stage {op.id}
                      </span>
                    </div>

                    {/* Instruction Content */}
                    <div className="flex-1 pt-4">
                      <h4 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                        {op.title}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium group-hover:text-slate-600">
                        {op.task}
                      </p>
                    </div>

                    <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2">
                      <ArrowUpRight size={20} className="text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Control & Policies (Right) */}
          <div className="lg:col-span-6">
            <div className="bg-slate-950 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-16">
                  <div className="flex items-center gap-4">
                    <Cpu size={20} className="text-emerald-400" />
                    <h4 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
                      Member Management
                    </h4>
                  </div>
                  <div className="px-4 py-1 rounded-full border border-white/10 text-[9px] font-mono text-slate-500 bg-white/5">
                    ROOT_ACCESS_01
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                  {accountActions.map((action, i) => (
                    <div
                      key={i}
                      className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all group cursor-pointer"
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl ${action.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                      >
                        <div className={action.color}>{action.icon}</div>
                      </div>
                      <h5 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                        {action.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        {action.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <Layers size={18} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1">
                        Fair Workload
                      </p>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        Spread tasks evenly across reviewers to keep the process
                        moving fast.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <ShieldCheck
                      size={18}
                      className="text-emerald-400 shrink-0"
                    />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1">
                        Secure Roles
                      </p>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        Always double-check user roles when setting up new
                        member accounts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between p-10 rounded-[3rem] bg-slate-50 border border-slate-100 group hover:bg-slate-900 transition-all duration-500 cursor-pointer">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform duration-500">
                  <UserCog size={24} className="text-slate-900" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Security
                  </p>
                  <p className="text-lg font-bold text-slate-900 group-hover:text-white transition-colors tracking-tight">
                    Safety Protocol
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-white/20 transition-all">
                <ChevronRight size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminGuidelines;
