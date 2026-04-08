import React from "react";
import {
  ArrowRight,
  Zap,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-[#FBFBFD] selection:bg-emerald-100">
      {/* 1. Ambient Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-emerald-50/60 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute top-[20%] -right-[5%] w-[40%] h-[50%] bg-blue-50/50 rounded-full blur-[120px]" />

        {/* Apple-style Noise Texture */}
        <div className="absolute inset-0 opacity-[0.015] brightness-100 contrast-150"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">

            <h1 className="text-5xl md:text-[80px] font-semibold text-[#1d1d1f] leading-[1.02] tracking-[-0.03em] mb-8">
              Automate <span className="text-emerald-600 font-bold">Proposal</span> <br />
              <span className="inline-block">Activity Reviews</span>
            </h1>

            <p className="text-lg md:text-xl text-[#86868b] font-normal max-w-lg mx-auto lg:mx-0 leading-relaxed mb-10 tracking-tight">
              Transform your workflow with a <span className="text-slate-900 font-medium">paperless ecosystem</span>.
              Precision and speed, designed for the modern enterprise.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigate("/auth")}
                className="group relative h-[58px] px-10 rounded-full bg-[#1d1d1f] text-white font-medium text-lg transition-all hover:bg-black hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/about")}
                className="h-[58px] px-10 rounded-full font-medium text-lg text-slate-700 bg-white/40 backdrop-blur-md border border-slate-200/60 hover:bg-white/80 transition-all active:scale-95 shadow-sm"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Visual: Glassmorphism Refinement */}
          <div className="flex-1 relative w-full lg:max-w-xl">
            <div className="relative z-20">

              {/* Main Container with "Apple Glass" effect */}
              <div className="relative bg-white/30 backdrop-blur-[32px] rounded-[40px] p-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white/50 overflow-hidden transform transition-all duration-1000 hover:rotate-1">

                {/* Internal Canvas */}
                <div className="bg-[#F5F5F7]/80 rounded-[34px] overflow-hidden border border-white/20 shadow-inner">
                  {/* Browser Bar */}
                  <div className="h-12 bg-white/40 flex items-center px-6 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-100" />
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    {/* Minimalist Data Card */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white shadow-sm">
                      <div className="flex justify-between mb-4">
                        <div className="h-4 w-32 bg-slate-900/10 rounded-full animate-pulse" />
                        <div className="h-4 w-12 bg-emerald-500/10 rounded-full" />
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[75%] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
                        </div>
                        <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/70 rounded-3xl p-5 border border-white text-center">
                        <Activity className="mx-auto mb-2 text-emerald-500" size={20} />
                        <div className="h-2 w-12 bg-slate-200 mx-auto rounded-full" />
                      </div>
                      <div className="bg-slate-900 rounded-3xl p-5 flex flex-col items-center justify-center shadow-lg">
                        <Zap className="text-emerald-400 mb-2" size={20} />
                        <div className="h-2 w-12 bg-white/20 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Reviewer Badge */}
              <div className="absolute -top-6 -left-8 bg-white/80 backdrop-blur-2xl p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-white/60 animate-float">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                  </div>
                  <div className="pr-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Reviewers</p>
                    <p className="text-xs font-bold text-emerald-600">Active Now</p>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-3xl p-4 shadow-2xl border border-white/50 flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Process</p>
                  <p className="text-sm font-semibold text-slate-900">Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
        .animate-float {
          animation: float 6s infinite ease-in-out;
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-10px, -20px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;