import {
  ArrowRight,
  FileText,
  Zap,
  Shield,
  CheckCircle2,
  Globe,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-[#fafafa]">
      {/* Premium Background Architecture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-slate-200/50 rounded-full blur-[100px]" />
        {/* Subtle Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left Content: Textual Authority */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-[0.2em]">
                Next-Gen GS-GDEO Ecosystem
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-8">
              Automate <span className="text-emerald-600">Proposal</span> <br />
              Activity Reviews
            </h1>

            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
              Transform your workflow with a paperless ecosystem. Submit,
              review, and track activities with{" "}
              <span className="text-slate-900">unmatched precision</span> and
              speed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <button
                onClick={() => navigate("/auth")}
                className="group relative overflow-hidden w-full sm:w-auto bg-[#064e3b] text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:shadow-[0_20px_40px_-10px_rgba(6,78,59,0.3)] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started Now
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-[#064e3b] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => navigate("/about")}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                Learn More
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2">
                <Shield size={20} />
                <span className="text-sm font-bold uppercase tracking-widest">
                  ISO Certified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={20} />
                <span className="text-sm font-bold uppercase tracking-widest">
                  Cloud Ready
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual: The "Glass" Mockup */}
          <div className="flex-1 relative w-full lg:max-w-xl xl:max-w-2xl">
            <div className="relative z-20 group">
              {/* Animated Glow Backdrop */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-400/20 to-cyan-400/0 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

              {/* Main Dashboard Card */}
              <div className="relative bg-white/40 backdrop-blur-2xl rounded-[3rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white/60 transform transition-all duration-700 hover:scale-[1.02] hover:-rotate-1">
                <div className="bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-200/50 shadow-inner">
                  {/* Mock App Header */}
                  <div className="h-14 bg-white/80 border-b border-slate-100 flex items-center px-8 justify-between">
                    <div className="flex gap-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-full bg-slate-200"
                        />
                      ))}
                    </div>
                    <div className="h-6 w-32 bg-slate-100 rounded-full animate-pulse" />
                  </div>

                  <div className="p-10 space-y-8">
                    {/* Active Proposal Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="h-5 w-48 bg-slate-900 rounded-lg" />
                          <div className="h-3 w-32 bg-slate-200 rounded-md" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                          Active
                        </div>
                      </div>
                      {/* Visual Progress Bar */}
                      <div className="pt-2">
                        <div className="flex justify-between mb-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                            Review Velocity
                          </span>
                          <span className="text-[9px] font-bold text-emerald-500 font-mono">
                            92%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 w-[92%] rounded-full group-hover:animate-shimmer"
                            style={{
                              backgroundSize: "200% 100%",
                              backgroundImage:
                                "linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%)",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Metric Grid */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="group/item bg-white rounded-[2rem] border border-slate-100 p-6 transition-all hover:border-emerald-200 hover:shadow-lg">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors duration-500">
                          <CheckCircle2 size={24} />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 w-12 bg-slate-200 rounded" />
                          <div className="h-2 w-20 bg-slate-100 rounded" />
                        </div>
                      </div>

                      <div className="bg-slate-950 rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                          <Zap size={40} className="text-emerald-400" />
                        </div>
                        <div className="relative z-10">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-8">
                            <Activity size={20} />
                          </div>
                          <div className="h-2 w-16 bg-emerald-400 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Floating "Reviewer" Tag */}
              <div className="absolute -top-6 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 animate-float pointer-events-none">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
                    />
                  ))}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  3 Reviewers <br />{" "}
                  <span className="text-emerald-500">Online</span>
                </span>
              </div>

              {/* Floating Success Indicator */}
              <div className="absolute -bottom-10 -right-10 p-6 bg-white rounded-[2rem] shadow-2xl border border-slate-50 flex items-center gap-5 animate-bounce-slow">
                <div className="w-14 h-14 bg-emerald-500 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <FileText size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">
                    Recent Activity
                  </p>
                  <p className="text-sm font-bold text-slate-950">
                    Proposal Finalized
                  </p>
                </div>
              </div>
            </div>

            {/* Modern Radial Background Shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-emerald-50/50 via-transparent to-slate-100/50 rounded-full -z-10 rotate-12" />
          </div>

          <style>{`
            @keyframes shimmer {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
            .animate-shimmer {
              animation: shimmer 3s infinite linear;
            }
            .animate-float {
              animation: float 5s ease-in-out infinite;
            }
            @keyframes float {
              0%,
              100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-15px);
              }
            }
          `}</style>
        </div>
      </div>

      {/* Visual Bottom Border Fade */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </section>
  );
};

export default HeroSection;
