import React from "react";
import { Cpu, Fingerprint, Layers, ArrowUpRight } from "lucide-react";

const FeaturesOverview: React.FC = () => {
  return (
    <section className="relative py-8 lg:py-16 bg-[#FBFBFD] overflow-hidden selection:bg-emerald-100">
      {/* Ambient Glows, Grid Pattern & Noise */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-emerald-50/80 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50/30 rounded-full blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        {/* Premium Noise Texture */}
        <div className="absolute inset-0 opacity-[0.01] brightness-100 contrast-150"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Dramatic Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 mb-40">
          <div className="max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50/80 backdrop-blur-md border border-emerald-100/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-700">System Features</span>
            </div>
            <h2 className="text-6xl md:text-8xl lg:text-[110px] font-semibold text-[#1d1d1f] tracking-[-0.04em] leading-[0.95]">
              Work faster<br />
              <span className="text-emerald-600 font-bold font-serif italic lowercase tracking-tight">and better.</span>
            </h2>
          </div>

          <div className="lg:max-w-sm pb-6">
            <p className="text-xl text-[#86868b] font-normal leading-relaxed border-l-3 border-emerald-500/20 pl-10 tracking-tight">
              We've built a simple way to manage the review process. Our tools help you handle every proposal with
              <span className="text-emerald-600 italic font-medium"> speed and clarity.</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {[
            {
              icon: <Cpu size={24} />,
              title: "Smart Routing",
              tag: "Logic",
              desc: "Proposals are sent to the right people automatically. No more manual sorting or long wait times.",
            },
            {
              icon: <Fingerprint size={24} />,
              title: "Secure History",
              tag: "Security",
              desc: "Every action is saved safely. It creates a clear record that cannot be changed, keeping everything honest.",
            },
            {
              icon: <Layers size={24} />,
              title: "Live Tracking",
              tag: "Workflow",
              desc: "See everything in one place. Reviewers and authors can check the status at any time without asking.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative bg-white/40 backdrop-blur-3xl border border-white/60 p-12 lg:p-14 rounded-[56px] transition-all duration-700 hover:bg-white/80 hover:scale-[1.02] hover:border-emerald-500/30 hover:shadow-[0_48px_96px_-32px_rgba(16,185,129,0.12)] overflow-hidden"
            >
              {/* Sophisticated Glow Decor */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-50/80 to-transparent rounded-bl-[5rem] -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />

              <div className="relative z-10 flex flex-col h-full items-start">
                <div className="flex justify-between items-start w-full mb-14">
                  <div className="w-16 h-16 rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 bg-white/50 border border-slate-100/50 px-4 py-1.5 rounded-full group-hover:text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all">
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-5 flex-grow">
                  <h3 className="text-3xl font-bold tracking-tight text-[#1d1d1f] group-hover:text-emerald-600 transition-colors flex items-center gap-3">
                    {item.title}
                    <ArrowUpRight size={22} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-500" />
                  </h3>
                  <p className="text-[#86868b] text-lg leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Visual Progress Bar Decoration */}
                <div className="mt-16 h-1 w-16 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-emerald-500 group-hover:w-full transition-all duration-1000" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesOverview;