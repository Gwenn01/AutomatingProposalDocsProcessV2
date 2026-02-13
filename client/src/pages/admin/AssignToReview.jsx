import { useState, useEffect } from "react";
import { Search, UserPlus2, FileText, RefreshCcw, Grid, Table } from "lucide-react";
import AssignModal from "../../components/Admin/AssignModal";
import axios from "axios";
import ReactDOM from "react-dom"

const AssignToReview = () => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allDocs, setAllDocs] = useState([]);
  const [modalMode, setModalMode] = useState("assign")
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState({ show: false, visible: false,  message: "" });
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    if (!loading) return;

    setProgress(0);
    let value = 0;

    const interval = setInterval(() => {
      value += Math.random() * 10;
      setProgress(Math.min(value, 95)); // stop at 95% visually
    }, 300);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
      const fetchDocuments = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:5000/api/get-docs-user");
          
          // DEBUG: Tingnan ang original response mula sa backend
          console.log("RAW BACKEND RESPONSE:", response.data);

          const updatedDocs = response.data.map((doc) => {
            const hasReviewer = doc.is_assigned === 1 || doc.is_assigned === "1";
            
            return {
              ...doc,
              reviewer: hasReviewer ? "Assigned" : null, 
            };
          });
          console.log("PROCESSED DOCS FOR UI:", updatedDocs);
          
          setAllDocs(updatedDocs);
        } catch (error) {
          console.error("Error fetching documents:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDocuments();
    }, []);

    const handleAssignClick = (doc, forcedMode = null) => {
      setSelectedDoc(doc);
      setModalMode(forcedMode || (doc.reviewer ? "reassign" : "assign"));
      setIsAssignModalOpen(true);
    };

  if (loading) {
    return (
      <div className="w-full h-full bg-white inset-0 z-[60] flex items-center justify-center backdrop-blur-md animate-fade-in">
        <div
          key={selectedDoc?.proposal_id}
          className="relative bg-white px-14 py-10 flex flex-col items-center animate-pop-out w-[450px]"
        >
          {/* Floating Spinner */}
          {/* <div className="relative animate-float mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-700 animate-spin" />
            <div className="absolute inset-2 bg-white rounded-full" />
          </div> */}

          <p className="text-lg font-semibold shimmer-text mb-2 text-center">
          Synchronizing Registry
          </p>

          <p className="text-xs w-full text-gray-500 mb-4 text-center">
            Preparing the latest proposals and reviewer data for you.
          </p>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-700 transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500 font-medium">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    );
  }

  const showToast = (message, type = "success") => {
    setToast({ show: true, visible: false, message, type });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToast(prev => ({ ...prev, visible: true }));
      });
    });

    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);

    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3700);
};

  const handleUpdateReviewer = (proposalId, newReviewerNames, actionMode) => {
    setIsAssignModalOpen(false);

    // 2. I-update ang local state ng documents
    setAllDocs((prevDocs) =>
      prevDocs.map((doc) => {
        const currentId = doc.proposal_id || doc.id;
        if (currentId === proposalId) {
          return { ...doc, reviewer: newReviewerNames };
        }
        return doc;
      })
    );

    // 3. Maghintay ng sandali (approx 300ms para sa modal fade out) bago ipakita ang toast
    setTimeout(() => {
      const toastMessage = actionMode === "reassign" 
        ? "Reviewer reassigned successfully!" 
        : "New reviewer(s) assigned successfully!";
      showToast(toastMessage, "success");
    }, 300);
  };

  const filteredDocs = allDocs.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    
    <div className="p-8 lg:p-10 space-y-10 bg-[#fbfcfb] h-full animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2 mb-10">
        {/* Left Side: Titles */}
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Assign to Review
          </h1>
          <p className="text-slate-500 text-sm ">
            Select a proposal and assign it to an available reviewer.
          </p>
        </div>

        {/* Right Side: Header Tools (Integrated Search, Metric, and Switcher) */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
          
          {/* 1. Search Bar - Integrated in Header */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search
                className="text-slate-400 group-focus-within:text-[#1cb35a] transition-all duration-300"
                size={16}
              />
            </div>
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-[#1cb35a]/10 focus:border-[#1cb35a]/30 transition-all outline-none text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 shadow-sm"
            />
          </div>

          {/* 2. Professional Metric Badge - Now in Header */}
          <div className="flex items-center gap-3 px-4 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md group/metric w-full md:w-auto">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-25" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-[14px] font-bold text-slate-800 tabular-nums">
                {filteredDocs.length}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Total
              </span>
            </div>
            
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Live
            </span>
          </div>

          {/* 3. Layout Switcher - Compact Style */}
          <div className="flex items-center bg-slate-100 p-1 rounded-[16px] border border-slate-200/50 shadow-inner w-full md:w-auto justify-center">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-[12px] transition-all duration-300 flex-1 md:flex-none flex items-center justify-center ${
                viewMode === "table" ? "bg-white text-[#1cb35a] shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Table size={16} />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-[12px] transition-all duration-300 flex-1 md:flex-none flex items-center justify-center ${
                viewMode === "card" ? "bg-white text-[#1cb35a] shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Card - Enhanced Professional Look */}
      <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden relative">
        {/* Table Section - Clean Aesthetic */}
        <div className="relative z-10">
          {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] tracking-[0.15em] font-bold">
                  <th className="pb-4 px-8 text-left font-bold">
                    Author Details
                  </th>
                  <th className="pb-4 px-6 text-left font-bold">
                    Proposal Title
                  </th>
                  <th className="pb-4 px-6 text-center font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc, index) => (
                  <tr key={doc.proposal_id || index} className="group transition-all duration-500">
                    {/* Author Details - Enhanced Glass & Interaction Design */}
                    <td className="py-6 px-8 bg-white group-hover:bg-gradient-to-r group-hover:from-slate-50/50 group-hover:to-transparent first:rounded-l-[32px] border-y border-l border-slate-50 group-hover:border-[#1cb35a]/30 transition-all duration-500 relative overflow-hidden">
                      {/* Subtle Glow Effect on Hover */}
                      <div className="absolute inset-0 bg-[#1cb35a]/0 group-hover:bg-[#1cb35a]/[0.02] transition-colors duration-500" />

                      <div className="flex items-center gap-4 relative z-10">
                        {/* Avatar Container with Glassmorphism and Ring Offset */}
                        <div className="relative group/avatar">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-white to-slate-100 flex items-center justify-center text-[11px] font-black text-slate-500 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(28,179,90,0.15)] group-hover:border-[#1cb35a]/20 transition-all duration-500">
                            {/* Dynamic Initials with improved spacing */}
                            <span className="tracking-tighter group-hover:text-[#1cb35a] transition-colors uppercase">
                              {doc.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>

                          {/* Online Status Indicator (Optional but Professional) */}
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-0.5">
                          {/* Primary Name with Kerning Adjustments */}
                          <span className="text-[14px] font-bold text-slate-800 tracking-tight leading-none group-hover:text-[#1cb35a] transition-colors duration-300">
                            {doc.name}
                          </span>

                          {/* Status Badge - Subtle and Clean */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-[#1cb35a] uppercase tracking-widest bg-[#1cb35a]/5 px-2 py-0.5 rounded-md border border-[#1cb35a]/10">
                              Implementor
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tight">
                              Active User
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Document Title - Enhanced Professional Typography & Iconography */}
                    <td className="py-6 px-6 bg-white group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:to-slate-50/30 border-y border-slate-50 group-hover:border-[#1cb35a]/20 transition-all duration-500">
                      <div className="flex items-start gap-4">
                        {/* Document Icon Graphic */}
                        <div className="mt-1 flex-shrink-0">
                          <div className="relative">
                            <FileText
                              size={20}
                              className="text-slate-300 group-hover:text-[#1cb35a]/40 transition-colors duration-500"
                            />
                            {/* Subtle highlight dot for unread or important status */}
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#1cb35a] rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-sm" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          {/* The Main Title with Optimized Reading Flow */}
                          <p className="text-[13.5px] font-bold text-slate-700 leading-[1.6] max-w-lg group-hover:text-slate-900 transition-colors duration-300">
                            {doc.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Actions Column - Dynamic Assign/Reassign Logic */}
                    <td className="py-6 px-6 bg-white group-hover:bg-gradient-to-l group-hover:from-slate-50/50 group-hover:to-transparent last:rounded-r-[32px] border-y border-r border-slate-50 transition-all duration-500 text-center relative overflow-hidden">
                      <div className="relative z-10 flex flex-col justify-center items-center gap-2">
                        {doc.reviewer ? (
                          /* --- PAG MAY NAKA-ASSIGN NA: DALAWA ANG BUTTONS --- */
                          <div className="flex flex-col gap-2 w-full items-center">
                            <div className="flex gap-2">
                              {/* REASSIGN BUTTON (Blue Premium) */}
                              <button
                                onClick={() => handleAssignClick(doc, "reassign")}
                                className="group/reassign relative overflow-hidden flex items-center justify-center gap-2 bg-blue-50 text-blue-600 w-[110px] py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.1em] transition-all duration-300 border border-blue-100/50 hover:bg-blue-600 hover:text-white hover:shadow-[0_8px_25px_-6px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:scale-95"
                              >
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover/reassign:translate-x-full transition-transform duration-1000 ease-in-out" />
                                <RefreshCcw
                                  size={12}
                                  strokeWidth={3}
                                  className="transition-transform duration-700 group-hover/reassign:rotate-180"
                                />
                                <span className="relative">Reassign</span>
                              </button>

                              {/* ADD MORE BUTTON (Green Premium) */}
                              <button
                                onClick={() => handleAssignClick(doc, "assign")}
                                className="group/assign relative overflow-hidden flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 min-w-[125px] px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.1em] transition-all duration-300 border border-emerald-100/50 hover:bg-emerald-600 hover:text-white hover:shadow-[0_8px_25px_-6px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:scale-95"
                              >
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover/assign:translate-x-full transition-transform duration-1000 ease-in-out" />
                                <UserPlus2
                                  size={12}
                                  strokeWidth={3}
                                  className="transition-transform duration-300 group-hover/assign:scale-110"
                                />
                                <span className="relative">Add Reviewer</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAssignClick(doc, "assign")}
                            className="group/assign relative overflow-hidden flex items-center justify-center gap-2.5 bg-emerald-50 text-emerald-600 min-w-[180px] px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all duration-300 border border-emerald-100/50 hover:bg-emerald-600 hover:text-white hover:shadow-[0_8px_25px_-6px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:scale-95"
                          >
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover/assign:translate-x-full transition-transform duration-1000 ease-in-out" />
                            <UserPlus2
                              size={14}
                              strokeWidth={3}
                              className="transition-transform duration-300 group-hover/assign:scale-110"
                            />
                            <span className="relative">Assign Reviewer</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              {filteredDocs.map((doc, index) => (
                <div
                  key={doc.proposal_id || index}
                  className="group bg-white rounded-[38px] p-2 border border-slate-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:border-slate-300 transition-all duration-500 flex flex-col h-full relative"
                >
                  {/* Premium Content Wrapper */}
                  <div className="flex flex-col h-full p-6 relative z-10">
                    
                    {/* Top Header: Author Info */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3.5">
                        {/* Squircle Avatar */}
                        <div className="w-12 h-12 rounded-[18px] bg-[#f5f5f7] flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-500">
                          <span className="text-[11px] font-black text-slate-500 tracking-tight">
                            {doc.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight group-hover:text-[#1cb35a] transition-colors duration-300">
                            {doc.name}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1cb35a] animate-pulse" />
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.1em]">
                              Implementor
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Subtle Menu or Icon (Optional) */}
                      <div className="text-slate-300 group-hover:text-slate-400 transition-colors">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                          <div className="w-1 h-1 rounded-full bg-current shadow-[0_3px_0_0,0_-3px_0_0]" />
                        </div>
                      </div>
                    </div>

                    {/* Title Section - Minimalist & Spacious */}
                    <div className="flex-grow flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Proposal Title</span>
                      <p className="text-[16px] font-medium text-[#1d1d1f] leading-[1.5] tracking-tight line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                        {doc.title}
                      </p>
                    </div>

                    {/* Action Footer - Card Layout Premium Upgrade */}
                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-3 relative z-10">
                      {doc.reviewer ? (
                        <>
                          {/* REASSIGN BUTTON (Blue Premium) */}
                          <button
                            onClick={() => handleAssignClick(doc, "reassign")}
                            className="group/reassign relative overflow-hidden flex-1 h-11 rounded-[14px] bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 border border-blue-100/50 hover:bg-blue-600 hover:text-white hover:shadow-[0_8px_25px_-6px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:scale-95"
                          >
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover/reassign:translate-x-full transition-transform duration-1000 ease-in-out" />
                            
                            <RefreshCcw
                              size={14}
                              strokeWidth={3}
                              className="relative z-10 transition-transform duration-700 group-hover/reassign:rotate-180"
                            />
                            <span className="relative z-10">Reassign</span>
                          </button>

                          {/* ADD MORE BUTTON (Green Premium) */}
                          <button
                            onClick={() => handleAssignClick(doc, "assign")}
                            className="group/assign relative overflow-hidden flex-[1.2] h-11 rounded-[14px] bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 border border-emerald-100/50 hover:bg-emerald-600 hover:text-white hover:shadow-[0_8px_25px_-6px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:scale-95"
                          >
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover/assign:translate-x-full transition-transform duration-1000 ease-in-out" />
                            
                            <UserPlus2
                              size={14}
                              strokeWidth={3}
                              className="relative z-10 transition-transform duration-300 group-hover/assign:scale-110"
                            />
                            <span className="relative z-10">Add Reviewer</span>
                          </button>
                        </>
                      ) : (
                        /* MAIN ASSIGN BUTTON (Full Width Premium) */
                        <button
                          onClick={() => handleAssignClick(doc, "assign")}
                          className="group/assign relative overflow-hidden w-full h-12 rounded-[16px] bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all duration-300 border border-emerald-100/50 hover:bg-emerald-600 hover:text-white hover:shadow-[0_12px_30px_-8px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:scale-95"
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover/assign:translate-x-full transition-transform duration-1000 ease-in-out" />
                          
                          <UserPlus2 
                            size={16} 
                            strokeWidth={3} 
                            className="relative z-10 transition-transform duration-300 group-hover/assign:scale-110"
                          />
                          <span className="relative z-10">Assign Reviewer</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Modern High-End Detail: Glass Light Reflection */}
                  <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State - Modern Minimalist */}
        {filteredDocs.length === 0 && (
          <div className="py-24 text-center bg-slate-50/50 rounded-[24px] border-2 border-dashed border-slate-100 mt-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
              No matches found in the archive
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AssignModal
        key={selectedDoc?.proposal_id || "new"}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        data={selectedDoc}
        mode={modalMode}
        onUpdate={handleUpdateReviewer}
        showToast={showToast}
      />

      {toast.show && ReactDOM.createPortal(
        <div
          className={`
            fixed top-8 right-8 z-[10000] pointer-events-none
            transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
            ${toast.visible
              ? 'translate-x-0 translate-y-0 opacity-100 scale-100'
              : 'translate-x-6 -translate-y-2 opacity-0 scale-95'}
          `}
        >
          {/* TOAST CARD */}
          <div className={`
            relative flex items-center gap-4 px-6 py-4 rounded-[28px]
            bg-white/70 backdrop-blur-2xl
            border border-white/40
            shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]
            pointer-events-auto group
          `}>

            {/* Accent Pill */}
            <div
              className={`absolute left-2 w-1.5 h-8 rounded-full blur-[1px]
              ${toast.message.toLowerCase().includes("reassign")
                ? "bg-blue-500/60"
                : "bg-emerald-500/60"}`}
            />

            {/* Icon */}
            <div
              className={`relative flex items-center justify-center w-11 h-11 rounded-2xl
              ${toast.message.toLowerCase().includes("reassign")
                ? "bg-blue-500/10 text-blue-600 ring-4 ring-blue-500/5"
                : "bg-emerald-500/10 text-emerald-600 ring-4 ring-emerald-500/5"}`}
            >
              {toast.message.toLowerCase().includes("reassign")
                ? <RefreshCcw size={20} strokeWidth={2.5} className="animate-[spin_4s_linear_infinite]" />
                : <UserCheck size={20} strokeWidth={2.5} className="animate-[bounce_2s_infinite]" />
              }
            </div>

            {/* Text */}
            <div className="flex flex-col gap-0.5 pr-2">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                System Core
              </span>
              <span className="text-[14px] font-bold text-slate-800 tracking-tight">
                {toast.message}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-slate-100/50 rounded-full overflow-hidden">
              <div
                className={`h-full animate-[progressOut_3s_linear_forwards]
                ${toast.message.toLowerCase().includes("reassign")
                  ? "bg-blue-500"
                  : "bg-emerald-500"}`}
              />
            </div>
          </div>

          <style jsx>{`
            @keyframes progressOut {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AssignToReview;
