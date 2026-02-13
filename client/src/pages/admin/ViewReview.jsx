import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  FileText, 
} from 'lucide-react';

const ViewReview = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data patterned after your registry
  const documents = [
    { id: 1, name: "Dr. Ricardo Cruz", title: "Design of a Smart Monitoring System for Academic Environments", status: "Completed" },
    { id: 2, name: "Kian Fontillas", title: "Solar-Powered Irrigation System with IoT Integration", status: "Under Review" },
    { id: 3, name: "Peter Jamed", title: "Automated Waste Management for PRMSU Campus", status: "Revision" },
    { id: 6, name: "John Doe", title: "Development of a Gesture-Based Interface for Remote Learning", status: "Under Review" },
    { id: 9, name: "Sarah Lopez", title: "Smart Traffic Management System using Machine Learning", status: "Rejected" },
    { id: 11, name: "Elena Gilbert", title: "Psychological Impact of Hybrid Learning on Student Performance", status: "Under Review" },
  ];

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-10 space-y-10 bg-[#fbfcfb] min-h-screen animate-in fade-in duration-500">
      
      {/* Header Section - Clean & Iconless */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
            View Reviews
          </h1>
          <p className="text-slate-500 text-sm font-semibold">
            Monitor and evaluate the status of pending research and documents.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden relative">

        {/* Action Row - Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 relative z-10">
            <div className="relative w-full max-w-md group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Search className="text-slate-400 group-focus-within:text-[#1cb35a] transition-all duration-300" size={18} />
                </div>
                <input 
                    type="text" 
                    placeholder="Search by name or document..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 h-14 rounded-[20px] border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#1cb35a]/10 focus:border-[#1cb35a]/30 transition-all outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400/80 shadow-sm"
                />
            </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto pb-4 custom-scrollbar">
            <table className="w-full border-separate border-spacing-y-[18px]">
                <thead>
                    <tr className="text-slate-400 uppercase text-[11px] tracking-[0.2em] font-black">
                        <th className="pb-2 px-8 text-center font-bold">ID</th>
                        <th className="pb-2 px-6 text-left font-bold">Full Name</th>
                        <th className="pb-2 px-6 text-left font-bold">Document Title</th>
                        <th className="pb-2 px-6 text-center font-bold">Status</th>
                        <th className="pb-2 px-6 text-center font-bold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="group">
                            
                            {/* Enhanced ID Column */}
                            <td className="py-7 px-8 bg-white first:rounded-l-[24px] border-y border-l border-slate-100/50 shadow-[0_4px_15px_rgba(0,0,0,0.02)] group-hover:border-emerald-100 group-hover:bg-emerald-50/40 transition-all duration-500 relative overflow-hidden">
                                
                                {/* Animated Vertical Indicator */}
                                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center" />
                                
                                {/* Decorative Background Glow (Lilitaw lang sa hover) */}
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-400/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="flex flex-col items-center justify-center gap-1.5 relative z-10">
                                    {/* ID Badge Container */}
                                    <div className="relative group/id">
                                        {/* Soft Glow behind the badge */}
                                        <div className="absolute inset-0 bg-emerald-500/15 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        
                                        <span className="relative flex items-center justify-center min-w-[56px] h-[30px] bg-slate-50 text-slate-400 group-hover:text-emerald-700 group-hover:bg-white text-[10px] font-black tracking-tighter rounded-full border border-slate-100 group-hover:border-emerald-200 transition-all duration-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] group-hover:shadow-md">
                                            <span className="opacity-30 text-[8px] mr-0.5 mt-0.5">#</span>
                                            {doc.id.toString().padStart(3, '0')}
                                        </span>
                                    </div>
                                    
                                    {/* Subtle "Serial" Label - lilitaw at aangat sa hover */}
                                    <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
                                        Registry No.
                                    </span>
                                </div>
                            </td>

                            {/* Ultra-Premium Author Column - Fixed Single Line */}
                            <td className="py-7 px-6 bg-white border-y border-slate-100/50 group-hover:border-emerald-100 group-hover:bg-emerald-50/40 transition-all duration-500">
                              <div className="flex items-center gap-5">
                                
                                {/* Multi-Layered Animated Avatar */}
                                <div className="relative flex-shrink-0 group/avatar">
                                  {/* 1. Outer Pulse Ring */}
                                  <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 scale-0 group-hover:scale-150 opacity-0 transition-all duration-1000" />
                                  
                                  {/* 2. Secondary Animated Border */}
                                  <div className="absolute -inset-1 rounded-[20px] border-2 border-emerald-500/0 group-hover:border-emerald-500/30 group-hover:rotate-6 transition-all duration-500" />

                                  {/* 3. Main Avatar Box */}
                                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-emerald-500/20 group-hover:shadow-2xl group-hover:bg-emerald-600 group-hover:border-emerald-400 group-hover:-translate-y-1 transition-all duration-500">
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:4px_4px]" />
                                    
                                    <span className="relative z-10 text-[16px] font-black text-slate-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all duration-500 tracking-tighter">
                                      {doc.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                    </span>
                                  </div>
                                  
                                  {/* 4. The "Power-On" Badge */}
                                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-0 group-hover:opacity-40 transition-opacity" />
                                    <div className="relative w-5 h-5 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center transition-all duration-500 group-hover:bg-emerald-500 group-hover:border-white group-hover:scale-110">
                                      <svg className="w-3 h-3 text-slate-300 group-hover:text-white transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>

                                {/* Text Content - Fixed to Single Line */}
                                <div className="flex flex-col min-w-0 flex-shrink-0">
                                  <div className="relative inline-block whitespace-nowrap">
                                    <span className="text-[16px] font-black text-slate-800 tracking-tight leading-none group-hover:text-emerald-800 transition-colors duration-500">
                                      {doc.name}
                                    </span>
                                    {/* Animated Underline */}
                                    <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-500/40 group-hover:w-full transition-all duration-500 rounded-full" />
                                  </div>
                                  
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center px-2 py-0.5 rounded-md bg-slate-100 group-hover:bg-emerald-100 transition-colors duration-500 w-fit">
                                      <span className="text-[8.5px] font-black text-slate-400 group-hover:text-emerald-600 uppercase tracking-[0.18em] whitespace-nowrap">
                                        Implementor
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Premium Document Title Column */}
                            <td className="py-7 px-6 bg-white border-y border-slate-100/50 group-hover:border-emerald-100 group-hover:bg-emerald-50/40 transition-all duration-500">
                              <div className="flex items-start gap-4 max-w-[500px] group/doc">
                                
                                {/* Animated File Icon Box */}
                                <div className="relative flex-shrink-0 mt-1">
                                  <div className="w-12 h-14 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover/doc:bg-white group-hover/doc:border-emerald-200 group-hover/doc:shadow-lg group-hover/doc:shadow-emerald-500/10 group-hover/doc:-rotate-2">
                                    {/* Decorative corner fold */}
                                    <div className="absolute top-0 right-0 w-4 h-4 bg-slate-200/50 rounded-bl-lg transition-colors group-hover/doc:bg-emerald-100" />
                                    
                                    <FileText size={22} className="text-slate-400 group-hover/doc:text-emerald-500 transition-all duration-500 group-hover/doc:scale-110" />
                                  </div>
                                  
                                  {/* File Format Badge */}
                                  <div className="absolute -bottom-1 -right-2 px-1.5 py-0.5 rounded-md bg-white border border-slate-100 shadow-sm transition-all duration-500 group-hover/doc:bg-emerald-500 group-hover/doc:border-emerald-400">
                                    <span className="text-[7px] font-black text-slate-400 group-hover/doc:text-white uppercase tracking-tighter">PDF</span>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                  {/* Document Title with Quoted Design */}
                                  <div className="relative">
                                    <p className="text-[14px] font-bold text-slate-700 leading-[1.6] transition-all duration-500 group-hover/doc:text-slate-900 line-clamp-2">
                                      <span className="text-emerald-500/40 mr-1 text-lg leading-none font-serif group-hover/doc:text-emerald-500 transition-colors">“</span>
                                      {doc.title}
                                      <span className="text-emerald-500/40 ml-1 text-lg leading-none font-serif group-hover/doc:text-emerald-500 transition-colors">”</span>
                                    </p>
                                  </div>

                                  {/* Document Metadata Tags */}
                                  <div className="flex items-center gap-3">
                                    {/* Topic Tag */}
                                    <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-50 border border-slate-100 group-hover/doc:bg-white group-hover/doc:border-emerald-100 transition-all">
                                      <div className="w-1 h-1 rounded-full bg-emerald-400 group-hover/doc:animate-pulse" />
                                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover/doc:text-emerald-600 transition-colors">
                                        Research Paper
                                      </span>
                                    </div>
                                    
                                    {/* Date/Year Tag (Placeholder) */}
                                    <span className="text-[10px] font-semibold text-slate-300 italic group-hover/doc:text-emerald-400 transition-colors">
                                      Published 2024
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Premium Status Column - Fixed Single Line */}
                            <td className="py-7 px-6 bg-white border-y border-slate-100/50 group-hover:border-emerald-100 group-hover:bg-emerald-50/40 transition-all duration-500 text-center">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <div className={`
                                  relative overflow-hidden inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.12em] whitespace-nowrap transition-all duration-500
                                  ${doc.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50 shadow-[0_2px_10px_rgba(16,185,129,0.08)] group-hover:bg-emerald-500 group-hover:text-white' :
                                    doc.status === 'Under Review' ? 'bg-blue-50 text-blue-600 border border-blue-200/50 shadow-[0_2px_10px_rgba(59,130,246,0.08)] group-hover:bg-blue-500 group-hover:text-white' :
                                    doc.status === 'Revision' ? 'bg-amber-50 text-amber-600 border border-amber-200/50 shadow-[0_2px_10px_rgba(245,158,11,0.08)] group-hover:bg-amber-500 group-hover:text-white' :
                                    'bg-rose-50 text-rose-600 border border-rose-200/50 shadow-[0_2px_10px_rgba(244,63,94,0.08)] group-hover:bg-rose-500 group-hover:text-white'}
                                `}>
                                  
                                  {/* Dynamic Status Dot / Icon */}
                                  <div className="relative flex items-center justify-center mr-2.5">
                                    <span className={`absolute w-2 h-2 rounded-full animate-ping opacity-40 ${
                                      doc.status === 'Completed' ? 'bg-emerald-400 group-hover:bg-white' :
                                      doc.status === 'Under Review' ? 'bg-blue-400 group-hover:bg-white' :
                                      doc.status === 'Revision' ? 'bg-amber-400 group-hover:bg-white' : 'bg-rose-400 group-hover:bg-white'
                                    }`} />
                                    <span className={`relative w-2 h-2 rounded-full border-2 border-white/50 ${
                                      doc.status === 'Completed' ? 'bg-emerald-500 group-hover:bg-white' :
                                      doc.status === 'Under Review' ? 'bg-blue-500 group-hover:bg-white' :
                                      doc.status === 'Revision' ? 'bg-amber-500 group-hover:bg-white' : 'bg-rose-500 group-hover:bg-white'
                                    }`} />
                                  </div>

                                  <span className="relative z-10 transition-colors duration-500">
                                    {doc.status}
                                  </span>

                                  {/* Subtle Shine Effect on hover */}
                                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                                </div>

                                {/* Secondary Info Label (Subtle) */}
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-1 group-hover:translate-y-0">
                                    Current Phase
                                </span>
                              </div>
                            </td>

                            {/* Premium Compact Action Column - No Expanding Text */}
                            <td className="py-7 px-6 bg-white last:rounded-r-[32px] border-y border-r border-slate-100/50 group-hover:border-emerald-100 group-hover:bg-emerald-50/40 transition-all duration-500">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="relative group/btn">
                                        {/* 1. External Orbit Glow (Lilitaw lang sa hover) */}
                                        <div className="absolute -inset-2 bg-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all duration-500" />
                                        
                                        {/* 2. Main Button */}
                                        <button className="
                                            relative flex items-center justify-center w-12 h-12 
                                            bg-slate-50 text-slate-400 rounded-[18px] 
                                            border border-slate-100 transition-all duration-500
                                            hover:bg-emerald-500 hover:text-white hover:border-emerald-400
                                            hover:-translate-y-1.5 active:scale-90 hover:shadow-xl hover:shadow-emerald-500/30
                                        ">
                                            {/* Floating Icon Animation */}
                                            <div className="transition-transform duration-500 group-hover/btn:scale-110 group-active:scale-95">
                                                <Eye size={20} strokeWidth={2.5} />
                                            </div>

                                            {/* Internal Shine Overlay */}
                                            <div className="absolute inset-0 rounded-[18px] overflow-hidden">
                                                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-[shine_1.5s_ease-in-out_infinite]" />
                                            </div>
                                        </button>

                                        {/* 3. Small Bottom Indicator Dot */}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-y-1 transition-all duration-500" />
                                    </div>

                                    {/* Static Sub-label (No reveal animation) */}
                                    <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-emerald-500/60 transition-colors duration-500">
                                        View
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
            <div className="py-24 text-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100 mt-4">
                <Search className="text-slate-300 mx-auto mb-4" size={32} />
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">No records found</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ViewReview;