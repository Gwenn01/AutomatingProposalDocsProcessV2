import React from 'react';
import { 
  FileUp, 
  UserPlus, 
  MessageSquare, 
  Activity, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  XCircle
} from 'lucide-react';

const ProcessSection = () => {
  const steps = [
    {
      id: "01",
      title: "Submit Proposal",
      desc: "Implementors upload documents to the secure portal. Initial validation starts here.",
      icon: <FileUp size={22} />,
      color: "bg-blue-600",
      light: "bg-blue-50"
    },
    {
      id: "02",
      title: "Assign Reviewers",
      desc: "Advisers designate specialized experts to ensure rigorous evaluation standards.",
      icon: <UserPlus size={22} />,
      color: "bg-indigo-600",
      light: "bg-indigo-50"
    },
    {
      id: "03",
      title: "Digital Review",
      desc: "Reviewers annotate in real-time. If flagged, implementors can re-edit instantly.",
      icon: <MessageSquare size={22} />,
      color: "bg-amber-500",
      light: "bg-amber-50",
      hasAction: true // Shows the 'Revision' sub-path
    },
    {
      id: "04",
      title: "Track Progress",
      desc: "Unified dashboard for students and advisers to monitor every milestone live.",
      icon: <Activity size={22} />,
      color: "bg-emerald-600",
      light: "bg-emerald-50"
    },
    {
      id: "05",
      title: "Final Verdict",
      desc: "Automated alerts for Approval or Rejection once the final audit is concluded.",
      icon: <CheckCircle size={22} />,
      color: "bg-slate-900",
      light: "bg-slate-100"
    }
  ];

  return (
    <section id="process" className="relative py-12 lg:py-20 bg-[#fafafa] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Editorial Header */}
        <div className="max-w-3xl mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 mb-6 shadow-sm">
            <Sparkles size={12} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">The Lifecycle</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.95] mb-8">
            Simple. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-slate-400 italic font-serif">Streamlined.</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-xl">
            A frictionless path designed to eliminate bureaucratic delays and maximize research throughput.
          </p>
        </div>

        {/* Dynamic Process Flow */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-2">
          {steps.map((step, i) => (
            <div key={i} className="group relative">
              
              {/* Step Card */}
              <div className="h-full p-8 rounded-[2.5rem] bg-white border border-slate-100 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2 relative z-10 flex flex-col">
                
                {/* ID & Progress Line */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[10px] font-black text-slate-300 tracking-widest">{step.id}</span>
                  <div className="flex-grow h-[1px] bg-slate-100 group-hover:bg-emerald-200 transition-colors" />
                </div>

                {/* Icon Circle */}
                <div className={`w-12 h-12 rounded-2xl ${step.color} text-white flex items-center justify-center mb-6 shadow-xl shadow-slate-200 transition-transform duration-500 group-hover:rotate-[10deg]`}>
                  {step.icon}
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h4 className="text-lg font-black text-slate-900 mb-3 tracking-tight group-hover:text-emerald-600 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-[13px] text-slate-400 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Contextual Actions (Step 3 Special) */}
                {step.hasAction && (
                  <div className="mt-6 flex gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase">
                      <RefreshCw size={10} /> Revision
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-50 text-red-500 text-[9px] font-bold uppercase">
                      <XCircle size={10} /> Reject
                    </div>
                  </div>
                )}
              </div>

              {/* Connecting Desktop Arrow */}
              {i !== steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 z-20 items-center justify-center text-slate-200 group-hover:text-emerald-400 transition-colors">
                  <ArrowRight size={24} strokeWidth={1} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Premium CTA Anchor */}
        <div className="mt-28 flex flex-col items-center gap-8">
          <button className="group relative py-5 px-12 bg-slate-900 rounded-[2rem] overflow-hidden transition-all hover:shadow-2xl hover:shadow-emerald-900/20 active:scale-95">
             <div className="relative z-10 flex items-center gap-4">
                <span className="text-white font-black text-[11px] uppercase tracking-[0.2em]">
                   Explore Detailed Guidelines
                </span>
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                   <ArrowRight size={16} className="text-white" />
                </div>
             </div>
             {/* Glossy Overlay */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
          
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
            System Compliance: ISO 27001 Certified
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;