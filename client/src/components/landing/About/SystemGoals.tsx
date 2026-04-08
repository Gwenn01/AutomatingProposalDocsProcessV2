import React from "react";
import { Zap, ShieldCheck, Eye, ArrowUpRight } from "lucide-react";

const SystemGoals: React.FC = () => {
  const secondaryGoals = [
    {
      id: "DIR-02",
      title: "Data Integrity",
      desc: "Secure digital storage ensuring feedback is never lost or overlooked.",
      icon: <ShieldCheck size={20} />,
    },
    {
      id: "DIR-03",
      title: "Process Clarity",
      desc: "Real-time visibility into workflows for seamless coordination.",
      icon: <Eye size={20} />,
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-white to-emerald-50 overflow-hidden">
      {/* subtle glass background */}
      <div className="absolute inset-0 backdrop-blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-emerald-500 mb-4">
            Core Mission
          </p>
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 leading-tight">
            System
            <span className="block text-emerald-400">Objectives</span>
          </h2>
          <p className="mt-6 text-slate-500 text-lg leading-relaxed">
            Designed to eliminate inefficiencies and create a seamless digital
            workflow environment.
          </p>
        </div>

        {/* Primary Glass Card */}
        <div className="relative rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl p-8 md:p-12 mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
              <Zap size={26} />
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-slate-900">
                Architectural Velocity
              </h3>
              <p className="text-slate-500 mt-2 max-w-xl">
                Accelerating workflows by eliminating manual bottlenecks and
                enabling automated routing systems.
              </p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Ecosystem Card */}
          <div className="group relative rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/30 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-200/40">

            {/* subtle gradient glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-emerald-100/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

            <div className="relative z-10">
              <h4 className="text-xs uppercase tracking-[0.3em] text-emerald-500 mb-4">
                Users
              </h4>
              <p className="text-xl font-semibold text-slate-900 leading-tight">
                Unified Ecosystem
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-10">
              <div className="flex -space-x-2">
                {["I", "B", "A"].map((l, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-emerald-500/90 text-white flex items-center justify-center text-xs font-bold border border-white/40 backdrop-blur-md shadow-sm hover:scale-105 transition"
                  >
                    {l}
                  </div>
                ))}
              </div>

              <div className="w-10 h-10 rounded-full border border-white/40 bg-white/30 backdrop-blur-md flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition">
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>

          {/* Secondary Cards */}
          {secondaryGoals.map((goal, idx) => (
            <div
              key={idx}
              className="group relative rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/30 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-200/40"
            >
              {/* subtle gradient glow */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-emerald-100/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                  {goal.icon}
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    {goal.id}
                  </span>
                  <h4 className="text-lg font-semibold text-slate-900">
                    {goal.title}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {goal.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemGoals;
