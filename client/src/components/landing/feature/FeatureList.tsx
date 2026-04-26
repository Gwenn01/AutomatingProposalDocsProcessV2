import React from "react";
import {
  FileEdit,
  MessageSquare,
  Activity,
  RefreshCw,
  UserPlus,
  Bell,
  Database,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

const FeatureList: React.FC = () => {
  const categories = [
    {
      group: "Step 01 / Easy Tools",
      features: [
        {
          title: "Simple Writing",
          desc: "Write your proposals directly in the app. Use built-in forms that make it easy to follow the rules.",
          icon: <FileEdit size={20} />,
          status: "Built-in",
        },
        {
          title: "Direct Feedback",
          desc: "Reviewers can leave notes right on your work. This makes it clear exactly what needs to be changed.",
          icon: <MessageSquare size={20} />,
          status: "Two-way",
        },
        {
          title: "Auto Updates",
          desc: "Track every change automatically. The system keeps old versions so you never lose your progress.",
          icon: <RefreshCw size={20} />,
          status: "Saved",
        },
      ],
    },
    {
      group: "Step 02 / Smart Flow",
      features: [
        {
          title: "Real-Time Tracking",
          desc: "See the status of your proposal as it happens. Everyone knows exactly where things stand.",
          icon: <Activity size={20} />,
          status: "Live",
        },
        {
          title: "Quick Alerts",
          desc: "Get notified the moment a change is made. Stay updated without having to check manually.",
          icon: <Bell size={20} />,
          status: "Active",
        },
        {
          title: "Fair Workload",
          desc: "We help managers assign work fairly. This ensures reviews are finished on time by the right people.",
          icon: <UserPlus size={20} />,
          status: "Managed",
        },
      ],
    },
  ];

  return (
    <section className="py-8 lg:py-16 bg-[#FBFBFD] relative overflow-hidden selection:bg-emerald-100">
      {/* Ambient Background Glows, Grid & Noise */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[-5%] w-[45%] h-[45%] bg-emerald-50/80 rounded-full blur-[140px]" />
        <div className="absolute bottom-[15%] right-[-5%] w-[45%] h-[45%] bg-blue-50/40 rounded-full blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute inset-0 opacity-[0.01] brightness-100 contrast-150"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Simplified Header */}
        <div className="mb-40">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 mb-24">
            <div className="max-w-4xl space-y-8">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50/80 backdrop-blur-md border border-emerald-100/50">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-700">The Process</span>
              </div>
              <h2 className="text-6xl md:text-8xl lg:text-[100px] font-semibold text-[#1d1d1f] tracking-[-0.04em] leading-[0.95]">
                The review<br />
                <span className="text-emerald-600 font-bold font-serif italic lowercase tracking-tight">lifecycle.</span>
              </h2>
            </div>
            <div className="lg:max-w-sm pb-6">
              <p className="text-xl text-[#86868b] font-normal leading-relaxed border-l-3 border-emerald-500/20 pl-10 tracking-tight">
                We guide every proposal through a simple path to ensure the
                <span className="text-emerald-600 italic font-medium"> best results </span>
                for your institution.
              </p>
            </div>
          </div>

          {/* Redesigned Status Steps */}
          <div className="bg-white/40 backdrop-blur-3xl rounded-[56px] p-2 border border-white/60 shadow-[0_48px_96px_-32px_rgba(0,0,0,0.04)]">
            <div className="bg-white/10 rounded-[50px] p-10 lg:p-14 border border-white/20">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  "Pending",
                  "Under Review",
                  "Revisions",
                  "For Approval",
                  "Approved",
                  "Rejected",
                ].map((status, i) => (
                  <div key={i} className="group/status">
                    <div className="bg-white/60 backdrop-blur-md border border-white p-7 rounded-[32px] transition-all duration-500 hover:bg-white hover:scale-105 hover:shadow-lg">
                      <span className="block text-[10px] font-black text-slate-400 mb-3 tracking-[0.25em] uppercase">
                        STEP 0{i + 1}
                      </span>
                      <span className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
                        {status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Simplified Feature Matrix */}
        <div className="space-y-24">
          {categories.map((cat, idx) => (
            <div key={idx} className="relative">
              <div className="flex items-center gap-8 mb-16">
                <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest text-nowrap">
                  PART 0{idx + 1}
                </span>
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1d1d1f] whitespace-nowrap">
                  {cat.group.split(' / ')[1]}
                </h3>
                <div className="h-px w-full bg-slate-200/60" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
                {cat.features.map((feature, fIdx) => (
                  <div key={fIdx} className="group">
                    <div className="flex flex-col h-full bg-white/40 backdrop-blur-3xl rounded-[48px] p-12 border border-white/60 transition-all duration-700 hover:bg-white/80 hover:scale-[1.02] hover:border-emerald-500/30 hover:shadow-[0_48px_96px_-32px_rgba(16,185,129,0.12)] overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50/80 to-transparent rounded-bl-[4rem] -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />

                      <div className="mb-10 flex justify-between items-start">
                        <div className="w-14 h-14 rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
                          {feature.icon}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] bg-white/50 border border-slate-100/50 px-4 py-1.5 rounded-full group-hover:text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all">
                          {feature.status}
                        </span>
                      </div>

                      <h4 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mb-5 flex items-center gap-3 group-hover:text-emerald-600 transition-colors">
                        {feature.title}
                        <ArrowUpRight
                          size={22}
                          className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-500"
                        />
                      </h4>
                      <p className="text-[#86868b] text-base leading-relaxed font-normal flex-grow">
                        {feature.desc}
                      </p>

                      <div className="mt-12 h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-0 bg-emerald-500 group-hover:w-full transition-all duration-1000" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Governance & Data Matrix */}
        <div className="mt-12 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Governance Card */}
          <div className="lg:col-span-7 bg-white/40 backdrop-blur-3xl rounded-[56px] p-14 lg:p-20 border border-white/60 relative overflow-hidden group hover:shadow-[0_48px_96px_-32px_rgba(16,185,129,0.12)] transition-all duration-700">
            <ShieldCheck
              className="absolute -right-16 -bottom-16 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors duration-1000 scale-110"
              size={400}
            />
            <div className="relative z-10">
              <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-10">
                Roles
              </div>
              <h3 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-12">
                Who does what?
              </h3>

              <div className="space-y-6">
                {[
                  {
                    role: "Implementors",
                    access: "Can write proposals and make changes.",
                  },
                  {
                    role: "Reviewer",
                    access: "Can read work and leave helpful comments.",
                  },
                  {
                    role: "Admins",
                    access: "Can manage the system and assign work.",
                  },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center p-5 bg-white/20 rounded-3xl border border-white/40 group/item hover:border-emerald-500/40 hover:backdrop-blur-md transition-all duration-500"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-5" />
                    <p className="text-sm font-normal text-[#86868b]">
                      <span className="text-[#1d1d1f] font-bold uppercase tracking-widest mr-2">
                        {r.role}:
                      </span>
                      {r.access}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Data Vault - Premium Emerald Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-950 to-emerald-900 backdrop-blur-xl rounded-[56px] p-14 lg:p-20 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl group transition-all duration-700">
            {/* Ambient Icon */}
            <div className="absolute top-0 right-0 p-10 opacity-10 animate-pulse-slow">
              <Database size={150} />
            </div>

            <div className="relative z-10 mb-12">
              <h3 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                Always <br /> safe.
              </h3>
              <p className="text-emerald-100/70 text-lg leading-relaxed font-normal mb-14 tracking-tight">
                Your work is saved in our <span className="text-white font-semibold">secure digital vault</span>.
                We keep everything organized and protected so you never lose a file.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Animations */}
        <style>{`
  .animate-pulse-slow {
    animation: pulse 2.5s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
  }
`}</style>
      </div>
    </section>
  );
};

export default FeatureList;