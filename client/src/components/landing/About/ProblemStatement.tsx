import React from "react";
import {
  Layers,
  Fingerprint,
  Activity,
  ArrowRight,
  ShieldAlert,
  Zap,
} from "lucide-react";

const ProblemStatement: React.FC = () => {
  const challenges = [
    {
      id: "01",
      icon: <Layers size={18} strokeWidth={1.5} />,
      title: "Paper-Intensive",
      problem:
        "Large volumes of paper used for submissions, physical comments, and redundant revisions.",
    },
    {
      id: "02",
      icon: <ShieldAlert size={18} strokeWidth={1.5} />,
      title: "Error-Prone",
      problem:
        "Misplaced documents or overlooked handwritten feedback leading to critical mistakes.",
    },
    {
      id: "03",
      icon: <Activity size={18} strokeWidth={1.5} />,
      title: "Difficult Tracking",
      problem:
        "Monitoring proposal status is slow, opaque, and inefficient.",
    },
  ];

  return (
    <section className="relative py-20 bg-[#fafafa] overflow-hidden">
      {/* Soft glass background */}
      <div className="absolute inset-0 backdrop-blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-emerald-500 mb-4">
            The Problem
          </p>
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 leading-tight">
            Friction in
            <span className="block text-emerald-400">Traditional Systems</span>
          </h2>
          <p className="mt-6 text-slate-500 text-lg leading-relaxed">
            Manual, paper-based workflows introduce delays, errors, and lack of
            transparency—hindering institutional efficiency.
          </p>
        </div>

        {/* Main Glass Card */}
        <div className="relative rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl p-8 md:p-12">
          {/* Primary Issue */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <Fingerprint size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">
                Time-Consuming Workflow
              </h3>
              <p className="text-slate-500 mt-2 max-w-xl">
                Physical reviews and manual handling create unnecessary delays
                and slow down decision-making processes.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-200 to-transparent mb-12" />

          {/* Secondary Issues */}
          <div className="grid md:grid-cols-3 gap-6">
            {challenges.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white/50 backdrop-blur-lg border border-white/40 p-6 hover:shadow-lg hover:border-emerald-200 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4">
                  {item.icon}
                </div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.problem}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Glass Panel */}
        <div className="mt-16">
          <div className="relative rounded-[2.5rem] bg-emerald-600/90 backdrop-blur-xl text-white p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

            <div className="relative z-10">
              <div className="mb-6 flex justify-center">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center">
                  <Zap size={22} />
                </div>
              </div>

              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Move beyond friction
              </h3>
              <p className="text-white/80 mt-4">
                Transition to a seamless, digital-first workflow experience.
              </p>

              <button className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-emerald-600 text-sm font-medium hover:scale-105 transition">
                Explore Solution <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;