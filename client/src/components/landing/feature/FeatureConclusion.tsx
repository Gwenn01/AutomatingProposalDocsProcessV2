import React from "react";
import {
  ArrowRight,
  Sparkles,
  Command,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FeatureConclusion: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-8 lg:py-12 bg-[#FBFBFD] overflow-hidden selection:bg-emerald-100">
      {/* Ambient Glows & Grid Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-emerald-50/80 rounded-full blur-[120px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50/30 rounded-full blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Glassmorphic Card Container */}
        <div className="bg-white/40 backdrop-blur-3xl rounded-[56px] p-2 border border-white/60 shadow-[0_48px_96px_-32px_rgba(0,0,0,0.04)] overflow-hidden group">
          <div className="bg-white/10 rounded-[50px] relative overflow-hidden px-10 py-24 lg:p-32 border border-white/20">
            {/* Animated Background Stream */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent" />
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent -rotate-12 animate-pulse" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-50/80 backdrop-blur-md border border-emerald-100/50">
                  <Sparkles size={16} className="text-emerald-500" />
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-700">
                    Ready to start?
                  </span>
                </div>

                <h2 className="text-6xl md:text-8xl lg:text-[100px] font-semibold text-[#1d1d1f] tracking-[-0.04em] leading-[0.95]">
                  Simple tools for<br />
                  <span className="text-emerald-600 font-bold font-serif italic lowercase tracking-tight">
                    better results.
                  </span>
                </h2>

                <p className="max-w-2xl text-[#86868b] text-xl font-normal leading-relaxed border-l-3 border-emerald-500/20 pl-10 tracking-tight">
                  We combine simple tools with smart rules to make your work easier.
                  No more paper, no more waiting—just a
                  <span className="text-emerald-600 italic font-medium"> better way </span>
                  to manage your proposals.
                </p>
              </div>

              {/* Right Content */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Decorative Spinning Ring */}
                  <div className="absolute -inset-12 border border-emerald-500/10 rounded-full animate-spin-slow pointer-events-none" />

                  <button
                    onClick={() => navigate("/auth")}
                    className="relative w-72 h-72 bg-emerald-500 rounded-full flex flex-col items-center justify-center p-10 text-white transition-all duration-700 hover:scale-105 hover:shadow-[0_48px_96px_-24px_rgba(16,185,129,0.4)] active:scale-95 group/btn"
                  >
                    <Command
                      className="mb-4 opacity-50 group-hover:rotate-90 transition-transform duration-700"
                      size={40}
                    />
                    <span className="text-center font-black uppercase tracking-widest leading-none text-3xl">
                      Go to <br /> Dashboard
                    </span>
                    <div className="mt-6 flex items-center justify-center w-12 h-12 bg-white rounded-full text-emerald-600 group-hover:translate-x-2 transition-transform shadow-lg">
                      <ArrowRight size={24} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default FeatureConclusion;