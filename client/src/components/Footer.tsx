import React from "react";
import {
  Mail,
  MapPin,
  Github,
  ArrowUpRight,
  Code2,
  Terminal,
  ShieldCheck,
} from "lucide-react";
import { extensionLogo } from "@/assets";

const Footer: React.FC = () => {
  const currentYear = 2026;

  const developers = [
    { name: "Arnel Gwen Nuqui", github: "https://github.com/Gwenn01" },
    {
      name: "Christian Pantilon",
      github: "https://github.com/itschristianpantilon",
    },
    { name: "Kian Fontillas", github: "https://github.com/meuorii" },
    { name: "Melbhen Louie Nery", github: "https://github.com/AgentLouie" },
    { name: "Peterjames Angelo Marteja", github: "https://github.com/PjMone" },
  ];

  return (
    <footer className="relative bg-[#fafafa] pt-24 pb-12 overflow-hidden border-t border-slate-200/60">
      {/* Absolute Background Accent */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-50/30 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 mb-20">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-8">
              <div className="flex items-center gap-5 group cursor-default">
                <div className="relative">
                  <div className="w-14 h-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-emerald-400 shadow-xl group-hover:rotate-[10deg] transition-all duration-700">
                    <img
                      src={extensionLogo}
                      alt="extension office"
                      className="w-7 h-7"
                    />
                  </div>
                  <div className="absolute -inset-2 border border-emerald-500/20 rounded-[2rem] scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
                    PRMSU{" "}
                    <span className="text-emerald-500 text-xs font-black align-top bg-emerald-50 px-1.5 py-0.5 rounded ml-1">
                      GS
                    </span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="h-px w-4 bg-emerald-500/50" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 group-hover:text-emerald-600 transition-colors">
                      Extension Office
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-sm border-l-2 border-emerald-100 pl-6 italic">
                "Revolutionizing research management through a unified,
                paperless ecosystem designed for{" "}
                <span className="text-slate-900 font-bold not-italic underline decoration-emerald-500/30">
                  institutional precision
                </span>
                ."
              </p>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex flex-wrap gap-3">
                <div className="group flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:border-emerald-200 transition-all cursor-default">
                  <MapPin size={14} className="text-emerald-500" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                    Iba, Zambales
                  </span>
                </div>

                <a
                  href="mailto:office@prmsu.edu.ph"
                  className="group flex items-center gap-3 px-4 py-2.5 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200 hover:shadow-emerald-500/20 hover:bg-emerald-600 transition-all duration-300"
                >
                  <Mail
                    size={14}
                    className="text-emerald-400 group-hover:text-white transition-colors"
                  />
                  <span className="text-[11px] font-black uppercase tracking-widest text-white">
                    Contact Office
                  </span>
                </a>
              </div>
              <p className="text-[10px] font-bold text-slate-300 ml-2 uppercase tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                Available Mon–Fri · 8AM – 5PM
              </p>
            </div>
          </div>

          {/* Navigation Directory */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                Directory
              </h4>
              <div className="h-px flex-grow bg-gradient-to-r from-slate-200 to-transparent" />
            </div>

            <nav className="flex flex-col gap-1">
              {["Home", "About", "Features", "Guidelines"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="group flex items-center justify-between p-3 -ml-3 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-emerald-500 group-hover:scale-150 transition-all" />
                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-all tracking-tight">
                      {item}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </a>
              ))}
            </nav>
          </div>

          {/* Development Core Card */}
          <div className="lg:col-span-4 h-full">
            <div className="relative group/card h-full transition-transform duration-500 hover:translate-y-[-4px]">
              <div className="absolute -inset-1 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-[2.6rem] blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

              <div className="relative h-full p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col">
                <Terminal className="absolute -right-10 -bottom-10 h-32 w-32 text-slate-50 -rotate-12 group-hover/card:text-emerald-50/40 transition-colors duration-700" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 flex items-center gap-3">
                    <Code2 size={16} className="text-emerald-500" /> System
                    Architects
                  </h4>
                  <ShieldCheck size={16} className="text-emerald-500/30" />
                </div>

                <div className="space-y-1 relative z-10 flex-grow">
                  {developers.map((dev, i) => (
                    <div
                      key={i}
                      className="group/dev flex items-center justify-between p-2 rounded-xl transition-all hover:bg-slate-50"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-500 group-hover/dev:text-slate-900 transition-colors line-clamp-1">
                          {dev.name}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-tighter text-slate-300 group-hover/dev:text-emerald-500 transition-colors">
                          Core Contributor
                        </span>
                      </div>

                      <a
                        href={dev.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-900 hover:border-slate-900 transition-all duration-300 shadow-sm group/git"
                        title={`View ${dev.name}`}
                      >
                        <Github
                          size={16}
                          className="group-hover/git:scale-110 transition-transform"
                        />
                      </a>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-slate-50 flex justify-between items-center text-[9px] font-mono text-slate-300 relative z-10">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                    v2.0.26_STABLE
                  </span>
                  <span className="bg-slate-50 px-2 py-0.5 rounded">
                    BUILD: SUCCESS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Compliance Footer */}
        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              © {currentYear} Proposal Review System
            </p>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
              <div className="w-4 h-px bg-slate-200" /> PRMSU Research
              Innovation & Development
            </p>
          </div>

          <div className="flex items-center gap-5 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            {["Privacy", "Terms", "Security"].map((label, idx) => (
              <React.Fragment key={label}>
                <a
                  href="#"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {label}
                </a>
                {idx < 2 && (
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
