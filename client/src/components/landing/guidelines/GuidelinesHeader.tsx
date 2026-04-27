import React from "react";
import {
  BookOpen,
  ChevronRight,
  FileSearch,
  HelpCircle,
  ArrowDown,
} from "lucide-react";

const GuidelinesHeader: React.FC = () => {
  return (
    <section className="relative pt-24 pb-16 bg-white overflow-hidden">
      {/* Premium Background Architecture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-emerald-50/60 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-[-5%] w-[35%] h-[40%] bg-emerald-50/40 rounded-full blur-[110px]" />

        {/* Technical Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Subtle Horizontal Scanline */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-100 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Left Column: The Identity */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50/50 border border-emerald-100/50 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">
                  Official Help Center
                </span>
              </div>

              <h1 className="text-6xl lg:text-8xl font-black text-slate-950 tracking-tight leading-[0.85] uppercase">
                User <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 italic font-serif lowercase tracking-normal font-light">
                  Guidelines.
                </span>
              </h1>
            </div>

            <div className="relative group max-w-xl">
              {/* Decorative accent line */}
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-emerald-500 rounded-full opacity-20 group-hover:opacity-100 transition-opacity duration-500" />

              <p className="text-xl lg:text-2xl font-medium text-slate-500 leading-tight tracking-tight">
                Learn how to use the system with these{" "}
                <span className="text-slate-950 font-bold">simple guides</span>.
                Everything you need to work fast and stay
                organized in one place.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Navigation Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-2 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-white">
              <div className="bg-emerald-50/30 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Quick Access
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-emerald-50 shadow-sm text-emerald-500">
                    <BookOpen size={14} />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      label: "Implementors",
                      icon: <ChevronRight size={14} />,
                      color: "emerald",
                    },
                    {
                      label: "Reviewers",
                      icon: <FileSearch size={14} />,
                      color: "slate",
                    },
                    {
                      label: "Admins",
                      icon: <HelpCircle size={14} />,
                      color: "slate",
                    },
                  ].map((link, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center justify-between p-5 rounded-2xl bg-white border border-emerald-100/20 hover:border-emerald-500/30 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.1)] transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50/50 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                          {link.icon}
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-700 transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <ArrowDown
                        size={14}
                        className="text-slate-200 group-hover:text-emerald-400 -rotate-45 group-hover:rotate-0 transition-transform"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidelinesHeader;
