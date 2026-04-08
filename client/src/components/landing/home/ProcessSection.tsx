import React, { useState } from "react";
import {
  FileUp,
  UserPlus,
  MessageSquare,
  Activity,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  XCircle,
} from "lucide-react";

const ProcessSection: React.FC = () => {
  const steps = [
    { id: "01", title: "Submit Proposal", desc: "Implementors upload documents to the secure portal. Initial validation starts here.", icon: <FileUp size={20} />, glow: "from-blue-500/20 to-blue-300/10" },
    { id: "02", title: "Assign Reviewers", desc: "Advisers designate specialized experts to ensure rigorous evaluation standards.", icon: <UserPlus size={20} />, glow: "from-indigo-500/20 to-indigo-300/10" },
    { id: "03", title: "Digital Review", desc: "Reviewers annotate in real-time. If flagged, implementors can re-edit instantly.", icon: <MessageSquare size={20} />, glow: "from-amber-400/20 to-amber-200/10", hasAction: true },
    { id: "04", title: "Track Progress", desc: "Unified dashboard for students and advisers to monitor every milestone live.", icon: <Activity size={20} />, glow: "from-emerald-500/20 to-emerald-300/10" },
    { id: "05", title: "Final Verdict", desc: "Automated alerts for Approval or Rejection once the final audit is concluded.", icon: <CheckCircle size={20} />, glow: "from-slate-500/20 to-slate-300/10" },
  ];

  // Track mouse position relative to center
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30; // max tilt X
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;  // max tilt Y
    setMousePos({ x, y });
  };

  return (
    <section
      className="relative py-16 lg:py-24 bg-gradient-to-b from-[#f8fafc] to-[#eef2f7] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Ambient Glow Background with Parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] bg-emerald-400/10 blur-[120px] rounded-full"
          style={{
            transform: `translate(${mousePos.x * 1}px, ${mousePos.y * 1}px)`,
            transition: "transform 0.1s",
            top: -100,
            left: -100,
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] bg-blue-400/10 blur-[120px] rounded-full"
          style={{
            transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)`,
            transition: "transform 0.1s",
            bottom: -100,
            right: -100,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-24 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.95] mb-6 relative">
            Simple. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r 
                     from-emerald-500 via-emerald-400 to-slate-400
                     italic font-serif drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              Streamlined.
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl relative z-10">
            A frictionless path designed to eliminate bureaucratic delays and maximize research throughput.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* Glass Card with Parallax Tilt */}
              <div
                className="relative h-full p-6 rounded-[2rem]
                  bg-white/40 backdrop-blur-xl
                  border border-white/30 ring-1 ring-white/20
                  transition-all duration-500 hover:bg-white/60"
                style={{
                  transform: `rotateY(${mousePos.x / 2}deg) rotateX(${-mousePos.y / 2}deg) translateZ(0)`,
                  perspective: "1000px",
                }}
              >
                {/* Glow Layer */}
                <div className={`absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition bg-gradient-to-br ${step.glow}`} />
                {/* ID */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[10px] font-bold text-slate-400 tracking-widest">
                    {step.id}
                  </span>
                  <div className="flex-1 h-px bg-white/40" />
                </div>
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur flex items-center justify-center mb-5 shadow-sm">
                  {step.icon}
                </div>
                {/* Content */}
                <h4 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                {/* Step 3 Actions */}
                {step.hasAction && (
                  <div className="mt-5 flex gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/60 text-emerald-600 text-[9px] font-bold backdrop-blur">
                      <RefreshCw size={10} /> Revision
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/60 text-red-500 text-[9px] font-bold backdrop-blur">
                      <XCircle size={10} /> Reject
                    </div>
                  </div>
                )}
              </div>

              {/* Arrow */}
              {i !== steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 text-slate-300">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-28 flex flex-col items-center gap-6">
          <button className="relative px-10 py-4 rounded-2xl 
            bg-white/50 backdrop-blur-xl border border-white/40 shadow-lg hover:bg-white/70 transition-all group">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-800 tracking-wide">Explore Detailed Guidelines</span>
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center group-hover:rotate-45 transition">
                <ArrowRight size={14} className="text-white" />
              </div>
            </div>
          </button>
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
            System Compliance: ISO 27001 Certified
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;