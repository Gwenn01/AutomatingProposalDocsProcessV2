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
  Activity,
  Terminal,
  Cpu,
  Layers,
  UserCog,
  FileSearch,
  CheckCircle2,
} from "lucide-react";

const AdminGuidelines: React.FC = () => {
  const accountActions = [
    {
      title: "Create",
      desc: "Provision new implementor or reviewer profiles.",
      icon: <UserPlus size={18} />,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Read",
      desc: "Audit and view detailed account metadata.",
      icon: <Eye size={18} />,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Update",
      desc: "Modify roles or execute password resets.",
      icon: <RefreshCcw size={18} />,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Delete",
      desc: "Revoke access and de-provision accounts.",
      icon: <UserMinus size={18} />,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <section className="relative py-28 bg-white overflow-hidden border-t border-slate-100">
      {/* Background Architectural Grid */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header: Executive Command */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-32">
          <div className="lg:w-2/3">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-[1px] bg-slate-900" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                System Admin Tier
              </span>
            </div>
            <h2 className="text-6xl lg:text-8xl font-black text-slate-950 tracking-tighter leading-[0.8]">
              ADMIN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-400 font-light italic">
                Directives.
              </span>
            </h2>
          </div>
          <div className="lg:w-1/3 border-l-2 border-emerald-500 pl-8 pb-2">
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              The{" "}
              <span className="text-slate-950 font-bold tracking-tight">
                System Administrator
              </span>{" "}
              serves as the final arbiter. Governance is executed through
              precise delegation and automated lifecycle management.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Operational Pipeline (Proposal Management) */}
          <div className="lg:col-span-5">
            <div className="sticky top-12 space-y-8">
              <div className="flex items-center gap-4 px-2">
                <Cpu size={18} className="text-emerald-500" />
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">
                  Proposal Lifecycle Management
                </h4>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Admin Authentication",
                    task: "Login via secure administrative gateway",
                    icon: <Lock size={16} />,
                  },
                  {
                    title: "Repository Oversight",
                    task: "View all submitted implementor proposals",
                    icon: <FileSearch size={16} />,
                  },
                  {
                    title: "Strategic Assignment",
                    task: "Delegate to reviewers (Status: Under Review)",
                    icon: <Users size={16} />,
                  },
                  {
                    title: "Velocity Monitoring",
                    task: "Track progress for timely institutional review",
                    icon: <Activity size={16} />,
                  },
                  {
                    title: "Final Adjudication",
                    task: "Approve, Reject, or Commit Admin Comments",
                    icon: <CheckCircle2 size={16} />,
                  },
                ].map((op, i) => (
                  <div
                    key={i}
                    className="group flex items-center justify-between p-7 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-emerald-400 transition-all duration-500 shadow-sm">
                        {op.icon}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                          {op.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {op.task}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-slate-200 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Identity Control & System Health */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-16">
                  <div className="flex items-center gap-4">
                    <Terminal size={20} className="text-emerald-400" />
                    <h4 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
                      User Infrastructure (CRUD)
                    </h4>
                  </div>
                  <div className="px-4 py-1 rounded-full border border-white/10 text-[9px] font-mono text-slate-500 bg-white/5">
                    SYS_AUTH_LEVEL_01
                  </div>
                </div>

                {/* Account Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                  {accountActions.map((action, i) => (
                    <div
                      key={i}
                      className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all group cursor-pointer"
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl ${action.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                      >
                        <div className={action.color}>{action.icon}</div>
                      </div>
                      <h5 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                        {action.title} User
                      </h5>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        {action.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Admin Best Practices Footer */}
                <div className="pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <Layers size={18} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1">
                        Workload Balance
                      </p>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Assign proposals fairly to avoid bandwidth saturation
                        for specific reviewers.
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
                        System Integrity
                      </p>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Ensure proper roles and permissions are maintained
                        during account creation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Policy Link */}
            <div className="mt-8 flex items-center justify-between p-8 rounded-[3rem] bg-emerald-50 border border-emerald-100 group hover:bg-emerald-500 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-emerald-200">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform duration-500">
                  <UserCog size={24} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:text-emerald-100 transition-colors">
                    Access Policy
                  </p>
                  <p className="text-lg font-bold text-slate-900 group-hover:text-white transition-colors">
                    Review Security Protocol
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:text-white group-hover:border-white transition-all">
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
