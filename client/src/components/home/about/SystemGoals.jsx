import React from 'react';
import { Target, Zap, ShieldCheck, Eye, ArrowUpRight } from 'lucide-react';

const SystemGoals = () => {
  const secondaryGoals = [
    {
      id: "DIR-02",
      title: "Data Integrity",
      desc: "Establishing a secure digital vault for submissions, ensuring no feedback is ever lost or overlooked.",
      icon: <ShieldCheck size={24} />,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      id: "DIR-03",
      title: "Process Clarity",
      desc: "Real-time visibility into the review pipeline for seamless coordination across all administrative levels.",
      icon: <Eye size={24} />,
      color: "text-purple-500",
      bg: "bg-purple-50"
    }
  ];

  return (
    <section className="relative py-32 bg-white overflow-hidden border-t border-slate-100">
      {/* Background Micro-Accents */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-slate-50 hidden lg:block" />
      
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Tier: Heading & Primary Goal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Core Mission</span>
            </div>
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85]">
              System <br />
              <span className="text-slate-200">Objectives.</span>
            </h2>
          </div>

          <div className="lg:col-span-8">
            <div className="group relative bg-slate-950 rounded-[3rem] p-10 md:p-16 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <Target size={180} className="text-white" />
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start md:items-center">
                <div className="w-20 h-20 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0 shadow-2xl shadow-emerald-500/20">
                  <Zap size={32} fill="currentColor" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-400 font-mono text-xs tracking-widest font-bold">DIR-01</span>
                    <div className="h-px w-8 bg-white/20" />
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Velocity Protocol</span>
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">Architectural Velocity</h3>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                    Accelerating proposal lifecycles by neutralizing physical logistics and implementing an 
                    <span className="text-white italic"> automated routing protocol.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Secondary Tiles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* User Ecosystem Tile */}
          <div className="lg:col-span-4 bg-[#fafafa] border border-slate-100 rounded-[3rem] p-10 flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-500">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Target Users</h4>
              <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                Synchronized <br /> Ecosystem.
              </p>
            </div>
            
            <div className="flex items-end justify-between mt-12">
              <div className="flex -space-x-3">
                {['I', 'R', 'A'].map((l, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-[10px] font-black text-white group-hover:bg-emerald-500 transition-colors">
                    {l}
                  </div>
                ))}
              </div>
              <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>

          {/* Goals Detail Tiles */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {secondaryGoals.map((goal, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-[3rem] p-10 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
                <div className={`w-14 h-14 rounded-2xl ${goal.bg} ${goal.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {goal.icon}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-300">{goal.id}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-100 group-hover:bg-emerald-500 transition-colors" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{goal.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {goal.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemGoals;