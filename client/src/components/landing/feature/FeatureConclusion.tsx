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
    <section className="relative py-32 bg-[#fafafa] overflow-hidden selection:bg-emerald-100">
      {/* Ambient Glows & Grid Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-[140px]" />
        <div className="absolute top-0 right-[-10%] w-[35%] h-[35%] bg-emerald-500/10 rounded-full blur-[180px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Glassmorphic Card Container */}
        <div className="bg-white/30 backdrop-blur-xl rounded-[4rem] p-1 shadow-2xl overflow-hidden group">
          <div className="bg-white/10 backdrop-blur-lg rounded-[3.8rem] relative overflow-hidden px-8 py-20 lg:p-24 border border-white/10 shadow-xl">
            {/* Animated Background Stream */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent" />
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent -rotate-12 animate-pulse" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* Left Content: Feature Manifest */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Sparkles size={16} className="text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">
                    System Synthesis Complete
                  </span>
                </div>

                <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase">
                  Fast. Organized. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 italic font-serif lowercase tracking-normal font-light">
                    Transparent.
                  </span>
                </h2>

                <p className="max-w-xl text-slate-700 text-lg font-medium leading-relaxed">
                  These features converge to bridge the gap between institutional
                  policy and digital efficiency. By digitizing the review lifecycle,
                  we don’t just save time—we{" "}
                  <span className="text-emerald-400 font-semibold">eliminate friction</span>{" "}
                  and create a secure, paperless legacy.
                </p>
              </div>

              {/* Right Content: Interactive CTA */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Decorative Spinning Ring */}
                  <div className="absolute -inset-10 border border-emerald-500/10 rounded-full animate-spin-slow pointer-events-none" />

                  <button
                    onClick={() => navigate("/auth")}
                    className="relative w-64 h-64 bg-emerald-500 rounded-full flex flex-col items-center justify-center p-8 text-slate-950 transition-all duration-700 hover:scale-110 hover:shadow-[0_0_80px_-10px_rgba(16,185,129,0.6)] active:scale-95 group/btn"
                  >
                    <Command
                      className="mb-4 opacity-50 group-hover:rotate-90 transition-transform duration-700"
                      size={32}
                    />
                    <span className="text-center font-black uppercase tracking-tighter leading-none text-2xl">
                      Initialize <br /> Dashboard
                    </span>
                    <div className="mt-4 flex items-center justify-center w-10 h-10 bg-slate-950 rounded-full text-white group-hover:translate-x-2 transition-transform">
                      <ArrowRight size={20} />
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