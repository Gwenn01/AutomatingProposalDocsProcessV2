import React from "react";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { extensionLogo } from "@/assets";

const Footer: React.FC = () => {
  const currentYear = 2026;

  const navLinks = ["Home", "About", "Features", "Guidelines"];
  const legalLinks = ["Privacy", "Terms", "Security"];

  return (
    <footer className="relative bg-[#fafafa] pt-24 pb-12 overflow-hidden border-t border-slate-200/60">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-50/30 rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 mb-20">
          {/* Left Column: Brand & Contact */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-12">
            {/* Logo & Title */}
            <div className="flex items-center gap-5 group cursor-default">
              <div className="relative">
                <div className="w-14 h-14 bg-white/30 backdrop-blur-xl border border-white/20 rounded-[1.5rem] flex items-center justify-center text-emerald-400 shadow-lg transition-all duration-700 group-hover:rotate-[10deg]">
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
                  PRMSU
                </h2>
                <div className="flex items-center gap-2">
                  <div className="h-px w-4 bg-emerald-500/50" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 group-hover:text-emerald-600 transition-colors">
                    Extension Office
                  </p>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md border-l-2 border-emerald-100 pl-6 italic">
              "Revolutionizing research management through a unified, paperless
              ecosystem designed for{" "}
              <span className="text-slate-900 font-bold not-italic underline decoration-emerald-500/30">
                institutional precision
              </span>
              ."
            </p>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-3">
              <div className="group flex items-center gap-3 px-4 py-2.5 bg-white/30 backdrop-blur-xl border border-white/20 rounded-2xl shadow-sm hover:border-emerald-200 transition-all cursor-default">
                <MapPin size={14} className="text-emerald-500" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Iba, Zambales
                </span>
              </div>

              <a
                href="mailto:office@prmsu.edu.ph"
                className="group flex items-center gap-3 px-4 py-2.5 bg-white/30 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:bg-emerald-600 hover:border-emerald-500 transition-all duration-300"
              >
                <Mail
                  size={14}
                  className="text-emerald-400 group-hover:text-white transition-colors"
                />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 group-hover:text-white transition-colors">
                  Contact Office
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Navigation */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">
                Directory
              </h4>
              <nav className="flex flex-col gap-2">
                {navLinks.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/30 hover:backdrop-blur-xl hover:shadow-md transition-all duration-300"
                  >
                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 tracking-tight">
                      {item}
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center md:text-left">
            © {currentYear} Automating Proposal Docs Process System
          </p>

          <div className="flex items-center gap-4 bg-white/30 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/20 shadow-md">
            {legalLinks.map((label, idx) => (
              <React.Fragment key={label}>
                <a
                  href="#"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {label}
                </a>
                {idx < legalLinks.length - 1 && (
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