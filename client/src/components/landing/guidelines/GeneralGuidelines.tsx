import React from "react";
import {
  Save,
  MessageSquare,
  Bell,
  GitMerge,
  LifeBuoy,
  Globe,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";

const GeneralGuidelines: React.FC = () => {
  const practices = [
    {
      title: "Save Progress",
      desc: "Your changes aren't saved automatically. Always click the 'Save' button after making edits.",
      icon: <Save size={22} />,
      tag: "Important",
      color: "text-blue-500",
    },
    {
      title: "Clear Writing",
      desc: "Use simple and short sentences. This helps reviewers understand and approve your work faster.",
      icon: <MessageSquare size={22} />,
      tag: "Writing",
      color: "text-emerald-500",
    },
    {
      title: "Stay Alert",
      desc: "The system sends out automatic alerts. Check your notification center daily for updates.",
      icon: <Bell size={22} />,
      tag: "System",
      color: "text-amber-500",
    },
    {
      title: "Follow Steps",
      desc: "The process moves in a specific order. Make sure to finish one stage before moving to the next.",
      icon: <GitMerge size={22} />,
      tag: "Workflow",
      color: "text-purple-500",
    },
  ];

  return (
    <section className="relative py-16 bg-white overflow-hidden selection:bg-emerald-100">
      {/* Premium Architectural Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-50/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[40%] bg-slate-50 rounded-full blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-32">
          <div className="flex items-center gap-3 mb-8">
            <Globe size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700">
              Global Standards
            </span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-slate-950 tracking-tight leading-[0.85] uppercase mb-8">
            Universal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 italic font-serif lowercase tracking-normal font-light">
              Rules.
            </span>
          </h2>
          <p className="max-w-xl text-lg text-slate-500 font-medium leading-relaxed tracking-tight">
            Essential practices to keep your data safe and ensure
            <span className="text-slate-950 font-bold"> institutional alignment</span> across all levels.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {practices.map((item, i) => (
            <div
              key={i}
              className="group relative p-10 rounded-[3.5rem] bg-white border border-slate-100 transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]"
            >
              <div className={`w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 ${item.color}`}>
                {item.icon}
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-slate-950 text-[8px] font-black uppercase tracking-widest text-white mb-4">
                {item.tag}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-emerald-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {item.desc}
              </p>
              <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                <ArrowUpRight size={20} className="text-emerald-500/40" />
              </div>
            </div>
          ))}
        </div>

        {/* Unified Support Anchor */}
        <div className="relative group">
          <div className="absolute inset-0 bg-emerald-500 rounded-[4rem] blur-2xl opacity-5 group-hover:opacity-10 transition-opacity" />
          <div className="relative p-2 bg-slate-50 border border-slate-100 rounded-[4rem]">
            <div className="bg-white p-12 rounded-[3.5rem] flex flex-col lg:flex-row items-center justify-between gap-12 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 rounded-full bg-slate-950 flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-700">
                  <MessageCircle className="text-emerald-400" size={32} />
                </div>
                <div className="text-center md:text-left">
                  <h5 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                    Need Help?
                  </h5>
                  <p className="text-lg text-slate-500 font-medium leading-relaxed tracking-tight">
                    Our office is here to support you. Get in touch for <span className="text-emerald-600 italic font-serif">technical assistance</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="px-10 py-5 bg-slate-950 text-white rounded-3xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200 flex items-center gap-3">
                  Contact Office
                  <LifeBuoy size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralGuidelines;
