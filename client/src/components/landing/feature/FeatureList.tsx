import React from "react";
import {
  FileEdit,
  MessageSquare,
  Activity,
  ShieldAlert,
  RefreshCw,
  UserPlus,
  Bell,
  Database,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const FeatureList: React.FC = () => {
  const categories = [
    {
      group: "Protocol 01 / Core Interface",
      features: [
        {
          title: "Native Proposal Authoring",
          desc: "Dynamic, structured authoring environment. Eliminates external file dependency through standardized JSON-schema forms.",
          icon: <FileEdit size={20} />,
          status: "System Standard",
        },
        {
          title: "In-Line Reviewer Dialogue",
          desc: "Surgical precision feedback. Reviewers inject comments directly into proposal nodes for absolute clarity.",
          icon: <MessageSquare size={20} />,
          status: "Bi-Directional",
        },
        {
          title: "Smart Revision Cycles",
          desc: "Automated versioning and change-tracking. Syncs reviewer mandates with implementor resubmissions in real-time.",
          icon: <RefreshCw size={20} />,
          status: "Versioned",
        },
      ],
    },
    {
      group: "Protocol 02 / Workflow Logic",
      features: [
        {
          title: "Live Pipeline Tracking",
          desc: "Real-time telemetry of the review status. Instant visibility for both implementors and high-level administration.",
          icon: <Activity size={20} />,
          status: "Live Stream",
        },
        {
          title: "Automated Push Updates",
          desc: "Event-driven architecture. Triggers instantaneous notifications across the ecosystem upon any status mutation.",
          icon: <Bell size={20} />,
          status: "Push Active",
        },
        {
          title: "Reviewer Load Balancing",
          desc: "Strategic delegation tools for Administrators to ensure fair distribution and expertise-based assignment.",
          icon: <UserPlus size={20} />,
          status: "Admin Only",
        },
      ],
    },
  ];

  return (
    <section className="py-12 bg-white relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* The Review Lifecycle: Industrial "Command Center" Design */}
        <div className="mb-40 relative">
          <div className="absolute -top-10 left-0 text-[10px] font-mono text-slate-300 tracking-[0.5em] uppercase">
            Status Engine v2.0
          </div>

          <div className="bg-slate-950 rounded-[3rem] p-1 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)]">
            <div className="bg-slate-900/50 rounded-[2.8rem] border border-white/5 p-10 lg:p-20 overflow-hidden relative">
              {/* Radial Glow */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                  <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                    Review <br />
                    <span className="text-emerald-500 font-serif italic lowercase tracking-normal font-light">
                      Lifecycle.
                    </span>
                  </h2>
                  <p className="max-w-sm text-slate-400 text-sm font-medium leading-relaxed">
                    A multi-stage progression engine ensuring every proposal
                    meets the PRMSU standard of excellence.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    "For Review",
                    "Under Review",
                    "For Revisions",
                    "For Approval",
                    "Approved",
                    "Rejected",
                  ].map((status, i) => (
                    <div
                      key={i}
                      className="group/status relative cursor-default"
                    >
                      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl transition-all duration-500 group-hover/status:bg-emerald-500 group-hover/status:scale-[1.05] group-hover/status:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)]">
                        <span className="block text-[9px] font-black text-emerald-400 group-hover/status:text-white/60 mb-3 tracking-widest">
                          STEP 0{i + 1}
                        </span>
                        <span className="text-[11px] font-black text-slate-200 group-hover/status:text-white uppercase tracking-widest leading-tight">
                          {status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modular Feature Matrix */}
        <div className="space-y-40">
          {categories.map((cat, idx) => (
            <div key={idx} className="relative">
              <div className="flex items-center gap-8 mb-16">
                <span className="text-[11px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded">
                  0{idx + 1}
                </span>
                <h3 className="text-xs font-black uppercase tracking-[0.6em] text-slate-900 whitespace-nowrap">
                  {cat.group}
                </h3>
                <div className="h-px w-full bg-slate-100" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {cat.features.map((feature, fIdx) => (
                  <div key={fIdx} className="group relative">
                    <div className="flex flex-col h-full">
                      <div className="mb-8 flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500">
                          {feature.icon}
                        </div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 px-2 py-1 rounded-full group-hover:border-emerald-200 group-hover:text-emerald-500 transition-colors">
                          {feature.status}
                        </span>
                      </div>

                      <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4 flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                        {feature.title}
                        <ArrowUpRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium flex-grow">
                        {feature.desc}
                      </p>

                      {/* Interactive Underline */}
                      <div className="mt-8 h-0.5 w-8 bg-slate-200 group-hover:w-full group-hover:bg-emerald-500 transition-all duration-700" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Infrastructure & Governance Grid */}
        <div className="mt-40 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Access Control - 7 columns */}
          <div className="lg:col-span-7 bg-slate-50 rounded-[3rem] p-12 lg:p-16 border border-slate-100 relative overflow-hidden group">
            <ShieldAlert
              className="absolute -right-10 -bottom-10 text-slate-200/50 group-hover:text-emerald-500/10 transition-colors duration-1000"
              size={300}
            />
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 rounded-full bg-white shadow-sm border border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-8">
                Role-Based Access (RBAC)
              </div>
              <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tighter mb-10">
                Governance Matrix
              </h3>

              <div className="space-y-4">
                {[
                  {
                    role: "Implementor",
                    access: "Full Authoring & Revision Resubmission",
                  },
                  {
                    role: "Reviewer",
                    access: "Contextual Commenting & Evaluation",
                  },
                  {
                    role: "Administrator",
                    access: "Total Ecosystem Management & Audit",
                  },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center p-4 bg-white rounded-2xl border border-slate-100 group/item hover:border-emerald-500/30 transition-all"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-4 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <p className="text-[11px] font-medium text-slate-500">
                      <span className="text-slate-950 font-black uppercase tracking-widest mr-2">
                        {r.role}:
                      </span>{" "}
                      {r.access}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secure Storage - 5 columns */}
          <div className="lg:col-span-5 bg-slate-950 rounded-[3rem] p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Database size={120} />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 leading-none">
                Data <br /> Sovereignty.
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium mb-12">
                All records are archived within our{" "}
                <span className="text-white">encrypted central vault</span>,
                ensuring audit compliance and zero-loss recovery.
              </p>
            </div>

            <div className="relative z-10 bg-emerald-500 p-6 rounded-2xl flex items-center justify-between group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative z-10 flex items-center gap-3">
                <CheckCircle2
                  size={20}
                  className="text-white group-hover:text-emerald-600 transition-colors"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-emerald-600 transition-colors">
                  Institutional Shield Active
                </span>
              </div>
              <ArrowUpRight
                size={18}
                className="relative z-10 text-white group-hover:text-emerald-600 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureList;
