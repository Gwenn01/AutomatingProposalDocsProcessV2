import React from "react";
import {
  Leaf,
  Clock,
  FileText,
  ShieldCheck,
  BarChart3,
  ChevronRight,
} from "lucide-react";

const AboutContent: React.FC = () => {
  return (
    <section className="relative bg-[#fafafa] pb-16 overflow-hidden">
      {/* Ambient Light */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-emerald-200/30 rounded-full blur-[140px] -z-10 translate-x-1/3 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-200/40 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="pt-24 pb-16 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">

              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1]">
                About the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-slate-500">
                  Automating Proposal Docs Process System
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">
                The Core Objective
              </h3>

              <p className="text-3xl font-bold text-slate-800 leading-snug">
                Streamlining institutional intelligence through{" "}
                <span className="text-slate-400">
                  automated precision.
                </span>
              </p>
            </div>

            <div className="space-y-6 text-lg text-slate-500 leading-relaxed font-medium">
              <p>
                The{" "}
                <span className="text-slate-900 font-bold">
                  Automating Proposal Docs Process System
                </span>{" "}
                is a digital platform designed to automate workflows and
                modernize proposal management.
              </p>

              {/* Glass Quote */}
              <div className="relative p-8 rounded-[2rem] bg-white/50 backdrop-blur-xl border border-white/40 shadow-sm">
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                <p className="relative italic text-slate-600">
                  "Our mission is to replace the friction of legacy workflows
                  with a precision-engineered digital ecosystem."
                </p>
              </div>
            </div>
          </div>

          {/* Right Glass Card */}
          <div className="lg:col-span-5">
            <div className="relative group">
              {/* Glow */}
              <div className="absolute -inset-6 bg-emerald-300/20 blur-[80px] opacity-40 group-hover:opacity-70 transition" />

              {/* Glass Card */}
              <div className="relative p-8 rounded-[2.5rem] bg-white/50 backdrop-blur-2xl border border-white/40 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)]">

                {/* Inner Light */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

                <div className="relative space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <p className="text-slate-900 font-semibold">
                        Verified Workflow
                      </p>
                      <p className="text-emerald-500 text-[10px] uppercase tracking-widest font-bold">
                        Digital Integrity
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-200/60" />

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/60 border border-white/40 flex items-center justify-center text-slate-500">
                      <BarChart3 size={22} />
                    </div>
                    <div>
                      <p className="text-slate-800 font-semibold">
                        Real-time Analytics
                      </p>
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                        Instant Feedback
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <div className="max-w-2xl mb-12">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-3">
              The Evolution
            </h4>
            <h2 className="text-4xl font-black text-slate-900">
              Legacy challenges met with{" "}
              <span className="text-emerald-600">
                modern solutions.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf />,
                title: "Environmental Impact",
                desc: "Paperless workflow with sustainable digital infrastructure.",
              },
              {
                icon: <Clock />,
                title: "Temporal Velocity",
                desc: "Faster approvals through streamlined automation.",
              },
              {
                icon: <FileText />,
                title: "Data Sovereignty",
                desc: "Centralized version control and secure records.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-[2rem] bg-white/50 backdrop-blur-xl border border-white/40 hover:shadow-lg transition-all"
              >
                {/* Inner light */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/40 to-transparent opacity-60" />

                <div className="relative space-y-5">
                  <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center border border-white/40 text-emerald-600">
                    {React.cloneElement(item.icon, { size: 24 })}
                  </div>

                  <h4 className="text-lg font-bold text-slate-900">
                    {item.title}
                  </h4>

                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 opacity-0 group-hover:opacity-100 transition">
                    Learn More <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;