import React from "react";
import {
  Clock,
  Leaf,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  XCircle,
} from "lucide-react";

const AboutSection: React.FC = () => {
  const workflowStatuses = [
    { status: "For Review", sub: "Assigned Reviewers", color: "#3b82f6", icon: <Clock size={14} />, detail: "Pending Queue" },
    { status: "Under Review", sub: "In Process", color: "#f59e0b", icon: <RotateCcw size={14} className="animate-spin-slow" />, detail: "Active" },
    { status: "For Revisions", sub: "Action Required", color: "#ea580c", icon: <AlertCircle size={14} />, detail: "Implementor" },
    { status: "For Approval", sub: "Finalizing", color: "#6366f1", icon: <ShieldCheck size={14} />, detail: "Official" },
    { status: "Approved", sub: "Ready for Execution", color: "#10b981", icon: <CheckCircle2 size={14} />, detail: "Final" },
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-[#fafafa] overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-25%] left-[-15%] w-[60%] h-[60%] bg-emerald-50/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-slate-200/20 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-16">
          {/* Left Side: Timeline Mockup */}
          {/* Left Side: Enhanced Apple Glass Timeline */}
          <div className="flex-1 w-full perspective-1000">
            <div className="relative transform-gpu transition-all duration-700 hover:rotate-y-[-2deg]">
              {/* Timeline Container */}
              <div className="bg-white/30 backdrop-blur-2xl rounded-[3rem] p-2 border border-white/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] relative z-10 overflow-hidden">
                <div className="bg-white/50 backdrop-blur-lg rounded-[2.5rem] border border-white/30 overflow-hidden">

                  {/* Header */}
                  <div className="px-8 py-6 flex justify-between items-center border-b border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400/25 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-amber-400/25 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400/25 shadow-sm" />
                      </div>
                      <div className="h-4 w-px bg-white/30 mx-2" />
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Pipeline Explorer
                      </span>
                    </div>
                  </div>

                  {/* Timeline Steps */}
                  <div className="p-8 space-y-6">
                    {workflowStatuses.map((item, i) => (
                      <div key={i} className="relative flex items-start gap-6">
                        {/* Connecting Line */}
                        {i !== workflowStatuses.length - 1 && (
                          <div className="absolute left-[19px] top-10 w-[2px] h-full bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-sm" />
                        )}

                        {/* Icon Node */}
                        <div
                          className="flex-shrink-0 w-12 h-12 rounded-3xl bg-white/60 backdrop-blur-xl flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-white/30 text-slate-900 transition-transform duration-500"
                          style={{ color: item.color }}
                        >
                          {item.icon}
                        </div>

                        {/* Status Card */}
                        <div className="flex-grow flex justify-between items-center bg-white/40 backdrop-blur-xl p-4 rounded-3xl border border-white/30 shadow-lg transition-all duration-500">
                          <div>
                            <p className="text-xs font-black text-slate-900 mb-1">{item.status}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{item.sub}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-black uppercase text-slate-300">{item.detail}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Rejection Node */}
                    <div className="pt-6 border-t border-white/20">
                      <div className="flex items-center justify-between px-4 py-3 bg-red-50/40 rounded-3xl border border-red-100/40 shadow-inner">
                        <div className="flex items-center gap-3">
                          <XCircle size={14} className="text-red-500" />
                          <span className="text-xs font-bold text-red-900">Rejected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Enhanced Editorial Content */}
          <div className="flex-1 text-center lg:text-left space-y-10 relative z-10">
            {/* Main Title */}
            <h2 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter">
              Smart <br />
              <span className="text-emerald-600 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-slate-400 italic drop-shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                Automation.
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg relative z-10">
              Stop chasing paper trails. Our digital system provides
              <span className="text-slate-900 font-bold"> end-to-end visibility </span>
              on every proposal, from draft to final approval.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 mt-4">
              {[
                { icon: <Leaf />, title: "Eco-Archive", desc: "No more printing. Fully digital proposal vault." },
                { icon: <Clock />, title: "Live Sync", desc: "Real-time updates as reviewers sign off." },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="space-y-3 relative bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-sm hover:shadow-lg transition-all duration-500"
                >
                  {/* Icon with Glow */}
                  <div className="w-12 h-12 flex items-center justify-center mb-2 rounded-xl bg-white/50 backdrop-blur shadow-md text-emerald-600">
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                    {feature.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button className="group relative px-12 py-6 bg-emerald-600 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] overflow-hidden shadow-lg hover:brightness-110 active:scale-95 transition-all duration-300">
                <span className="relative z-10 flex items-center gap-3">
                  Start Submission Flow
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                </span>
                {/* Light Sweep Effect */}
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;