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
    {
      id: "01",
      title: "Submit Proposal",
      desc: "Implementors upload documents to the secure portal. Initial validation starts here.",
      icon: <FileUp size={20} />,
      glow: "from-blue-500/20 to-blue-300/10",
    },
    {
      id: "02",
      title: "Assign Reviewers",
      desc: "Advisers designate specialized experts to ensure rigorous evaluation standards.",
      icon: <UserPlus size={20} />,
      glow: "from-indigo-500/20 to-indigo-300/10",
    },
    {
      id: "03",
      title: "Digital Review",
      desc: "Reviewers annotate in real-time. If flagged, implementors can re-edit instantly.",
      icon: <MessageSquare size={20} />,
      glow: "from-amber-400/20 to-amber-200/10",
      hasAction: true,
    },
    {
      id: "04",
      title: "Track Progress",
      desc: "Unified dashboard for students and advisers to monitor every milestone live.",
      icon: <Activity size={20} />,
      glow: "from-emerald-500/20 to-emerald-300/10",
    },
    {
      id: "05",
      title: "Final Verdict",
      desc: "Automated alerts for Approval or Rejection once the final audit is concluded.",
      icon: <CheckCircle size={20} />,
      glow: "from-slate-500/20 to-slate-300/10",
    },
  ];

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
    setMousePos({ x, y });
  };

  return (
    <section
      className="relative py-20 lg:py-28 bg-[#fafafa] overflow-hidden"
      onMouseMove={handleMouseMove}
    >

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-28 text-center lg:text-left">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.95] mb-6">
            Simple. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-slate-400 italic font-serif">
              Streamlined.
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto lg:mx-0">
            A frictionless path designed to eliminate bureaucratic delays and
            maximize research throughput.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* Apple Glass Card */}
              <div
                className="relative h-full p-6 rounded-[2rem]
              bg-white/60 backdrop-blur-2xl
              border border-white/40
              shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)]
              transition-all duration-500
              hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.12)]
              hover:-translate-y-1"
                style={{
                  transform: `rotateY(${mousePos.x * 0.6}deg) rotateX(${-mousePos.y * 0.6}deg)`,
                }}
              >
                {/* Soft Inner Glow */}
                <div className={`absolute -inset-10 rounded-[2.5rem] blur-[60px] opacity-30 group-hover:opacity-60 transition-all duration-500 bg-gradient-to-br ${step.glow}`} />

                {/* ID */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[10px] font-bold text-slate-400 tracking-widest">
                    {step.id}
                  </span>
                  <div className="flex-1 h-px bg-slate-200/60" />
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white/70 backdrop-blur flex items-center justify-center mb-5 shadow-sm border border-white/40">
                  {step.icon}
                </div>

                {/* Content */}
                <h4 className="text-base font-semibold text-slate-900 mb-2">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {step.desc}
                </p>

                {/* Step 3 Actions */}
                {step.hasAction && (
                  <div className="mt-5 flex gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/70 text-emerald-600 text-[9px] font-bold backdrop-blur border border-white/40">
                      <RefreshCw size={10} /> Revision
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/70 text-red-500 text-[9px] font-bold backdrop-blur border border-white/40">
                      <XCircle size={10} /> Reject
                    </div>
                  </div>
                )}
              </div>

              {/* Connector */}
              {i !== steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-6 -translate-y-1/2 text-slate-300">
                  <ArrowRight size={22} className="opacity-40" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-32 flex flex-col items-center gap-6">
          <button className="group relative px-10 py-4 rounded-3xl 
        bg-white/70 backdrop-blur-xl 
        border border-white/50 
        shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]
        hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)]
        transition-all flex items-center gap-3">

            <span className="text-sm font-semibold text-slate-800 tracking-wide">
              Explore Detailed Guidelines
            </span>

            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center group-hover:rotate-45 transition-transform">
              <ArrowRight size={16} className="text-white" />
            </div>

            {/* Light Sweep */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute w-1/3 h-full bg-white/40 blur-xl opacity-0 group-hover:opacity-100 group-hover:translate-x-[250%] transition duration-1000" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;