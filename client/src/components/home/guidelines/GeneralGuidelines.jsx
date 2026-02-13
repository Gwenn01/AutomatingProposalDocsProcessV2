import React from 'react';
import { 
  Save, 
  MessageSquare, 
  Bell, 
  GitMerge, 
  LifeBuoy, 
  ChevronRight, 
  ShieldCheck,
  Zap,
  Globe,
  ExternalLink
} from 'lucide-react';

const GeneralGuidelines = () => {
  const practices = [
    {
      title: "Data Persistence",
      desc: "State changes are not permanent until manually committed. Always execute 'Save' after editing.",
      icon: <Save size={20} className="text-blue-600" />,
      tag: "Critical",
      bg: "hover:bg-blue-50/50"
    },
    {
      title: "Semantic Clarity",
      desc: "Utilize concise language. Avoid ambiguous phrasing to streamline the revision loop.",
      icon: <MessageSquare size={20} className="text-emerald-600" />,
      tag: "Efficiency",
      bg: "hover:bg-emerald-50/50"
    },
    {
      title: "Real-time Awareness",
      desc: "The system triggers automated alerts. Audit your notification center daily.",
      icon: <Bell size={20} className="text-amber-600" />,
      tag: "Activity",
      bg: "hover:bg-amber-50/50"
    },
    {
      title: "Protocol Adherence",
      desc: "The lifecycle is linear. Do not attempt to bypass status gates (Submission → Audit).",
      icon: <GitMerge size={20} className="text-purple-600" />,
      tag: "Security",
      bg: "hover:bg-purple-50/50"
    }
  ];

  return (
    <section className="relative py-12 bg-white overflow-hidden border-t border-slate-100">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header: Global Standard */}
        <div className="flex flex-col items-center text-center mb-32">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-6">
            <Globe size={14} className="text-slate-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Global Standard v1.0</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-slate-950 uppercase tracking-tighter leading-none mb-8">
            Universal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-emerald-600 to-slate-400 font-light italic">Practices.</span>
          </h2>
          <p className="max-w-xl text-slate-500 font-medium">
            Operational mandates to ensure data integrity and institutional alignment across all user tiers.
          </p>
        </div>

        {/* Floating Card Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {practices.map((item, i) => (
            <div key={i} className={`group relative p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-slate-200 ${item.bg}`}>
              <div className="w-14 h-14 rounded-2xl bg-white shadow-inner border border-slate-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="inline-block px-2 py-0.5 rounded-md bg-slate-950 text-[8px] font-black uppercase tracking-widest text-white mb-4">
                {item.tag}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {item.desc}
              </p>
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
                  <LifeBuoy className="text-emerald-400" size={32} />
                </div>
                <div className="text-center md:text-left">
                  <h5 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Technical Assistance Hub</h5>
                  <p className="text-slate-500 font-medium italic">Graduate School Extension Office | Institutional Support</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="px-10 py-5 bg-slate-950 text-white rounded-3xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200 flex items-center gap-3">
                  Contact Office
                  <ExternalLink size={16} />
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