import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  FileText,
  Calendar,
  ShieldCheck,
  Grid,
  Table
} from "lucide-react";
import axios from "axios";
import NotificationBell from "../../components/NotificationBell";
import DocumentViewerModal from "../../components/instructor/DocumentViewerModal";
import ReviewerModal from "../../components/instructor/ReviewerModal";

const ManageDocuments = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isReviewerOpen, setIsReviewerOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [loadingViewer, setLoadingViewer] = useState(false);
  const [loadingReviewer, setLoadingReviewer] = useState(false);
  const [viewerProgress, setViewerProgress] = useState(0);
  const [reviewerProgress, setReviewerProgress] = useState(0);
  const [viewMode, setIsViewMode] = useState("table");


    useEffect(() => {
      // Get user from localStorage
      const storedUser = localStorage.getItem("user");
  
      if (!storedUser) {
        console.log("No user found, would redirect to login");
        setLoading(false);
        return;
      }
  
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    let interval;

    const fetchDocuments = async () => {
      try {
        interval = setInterval(() => {
          setProgress((prev) => (prev < 90 ? prev + 5 : prev));
        }, 300);

        const res = await axios.get("http://127.0.0.1:5000/api/get-all-docs");
        setDocuments(res.data || []);

        setProgress(100);
      } catch (err) {
        console.error(err);
        setError("Failed to load documents");
      } finally {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 400); // smooth exit
      }
    };

    fetchDocuments();

    return () => clearInterval(interval);
  }, []);

    // fetch notifications
    useEffect(() => {
      if (!user) return;
  
      const fetchNotifications = async () => {
        try {
          const response = await fetch(
            "http://127.0.0.1:5000/api/get-notifications",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: user.user_id,
              }),
            },
          );
  
          if (!response.ok) {
            throw new Error("Failed to fetch notifications");
          }
  
          const data = await response.json();
          setNotifications(data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
  
      fetchNotifications();
    }, [user]); // X

    const unreadCount = notifications.filter((n) => n.is_read === 0).length;

  const handleRead = async (id) => {
    if (!user) return;

    // Avoid duplicate requests
    const target = notifications.find((n) => n.id === id);
    if (!target || target.is_read === 1) return;

    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, is_read: 1 } : notif)),
    );

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/update-read-notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
            notification_id: id,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update notification");
      }
    } catch (error) {
      console.error(error);

      // Rollback UI if request fails
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: 0 } : notif,
        ),
      );
    }
  };

  // Inside your component
  const handleOpenViewer = async (doc) => {
    setLoadingViewer(true);
    setViewerProgress(0);

    let interval;
    try {

      interval = setInterval(() => {
        setViewerProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 200);
      // Fetch cover page
      const coverRes = await axios.get(`http://127.0.0.1:5000/api/my-coverpage-proposals/${doc.proposal_id}`);
      const contentRes = await axios.get(`http://127.0.0.1:5000/api/my-content-proposals/${doc.proposal_id}`);

      setSelectedProposal({
        ...doc,
        cover_page: coverRes.data,  
        full_content: contentRes.data 
      });

      setIsViewerOpen(true);
      setViewerProgress(100);
    } catch (error) {
      console.error("Error opening viewer:", error);
    } finally {
      clearInterval(interval);
      setTimeout(() => setLoadingViewer(false), 400);
    }
};

  const handleOpenReviewer = async (doc) => {
    setLoadingReviewer(true);
    setReviewerProgress(0);

    let interval;
    try {
      interval = setInterval(() => {
        setReviewerProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 200);

      setSelectedProposal(doc);
      setIsReviewerOpen(true);
      
    } catch (err) {
      console.error(err);
      setLoadingReviewer(false);
      clearInterval(interval);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white inset-0 z-[60] flex items-center justify-center backdrop-blur-md animate-fade-in">
        <div className="relative bg-white px-14 py-10 flex flex-col items-center animate-pop-out w-[450px] rounded-2xl">
          <p className="text-lg font-semibold shimmer-text mb-2 text-center">
            Indexing Registry
          </p>

          <p className="text-xs w-full text-gray-500 mb-4 text-center">
            Preparing official records and submission statuses.
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

  if (error) return <p>{error}</p>;

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const STATUS_MAP = {
    for_review: { label: "For Review", color: "blue" },
    under_review: { label: "Under Review", color: "indigo" },
    for_revision: { label: "For Revision", color: "amber" },
    for_approval: { label: "For Approval", color: "purple" },
    approved: { label: "Approved", color: "emerald" },
    rejected: { label: "Rejected", color: "rose" },
  };

  return (
    <div className="p-8 lg:p-10 space-y-10 bg-[#fbfcfb] h-auto animate-in fade-in duration-500">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight leading-tight">
            Manage Documents
          </h1>
          <p className="text-gray-500 text-sm">
            Audit, track, and manage all intellectual property submissions.
          </p>
        </div>

        <div className="flex items-center justify-center gap-5">
          <div className="">
            <div className="relative w-full max-w-2xl">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search
                  className="text-slate-400 group-focus-within:text-[#1cb35a] transition-all duration-300"
                  size={18}
                />
              </div>
              <input
                type="text"
                placeholder="Search by author or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 h-14 rounded-[20px] border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#1cb35a]/10 focus:border-[#1cb35a]/30 transition-all outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400/80 shadow-sm"
              />
            </div>
          </div>

           <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setIsViewMode("table")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "table" 
                    ? "bg-white shadow-sm text-emerald-600" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Table size={20} />
              </button>
              <button
                onClick={() => setIsViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid" 
                    ? "bg-white shadow-sm text-emerald-600" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Grid size={20} />
              </button>
            </div>

          {/* Notification Bell */}
            <NotificationBell
              notifications={notifications}
              unreadCount={unreadCount}
              show={showNotif}
              onToggle={() => setShowNotif((prev) => !prev)}
              onClose={() => setShowNotif(false)}
              onRead={handleRead}
            />
        </div>


      </div>

      {/* Main Content Container - Soft-UI matching Manage Accounts */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden relative">
        {/* Table Section - Professional & Modern Layout */}
        {viewMode === "table" ? (
          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <table className="w-full border-separate border-spacing-y-4 table-fixed">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] tracking-[0.2em] font-black">
                  {/* Defined widths for absolute consistency */}
                  <th className="w-[45%] pb-2 px-8 text-left">
                    Document Details
                  </th>
                  <th className="w-[18%] pb-2 px-6 text-center">Status</th>
                  <th className="w-[17%] pb-2 px-6 text-center">Registry Date</th>
                  <th className="w-[20%] pb-2 px-6 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.proposal_id} className="group">
                    {/* COLUMN 1: DOCUMENT DETAILS - Premium Glass Edition */}
                    <td className="w-[45%] py-6 px-8 relative overflow-hidden bg-white/70 backdrop-blur-xl first:rounded-l-[32px] border-y border-l border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.03)] group-hover:bg-white/90 transition-all duration-700 ease-in-out">
                      {/* Subsurface Light Effect - Only visible on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      <div className="relative z-10 flex items-center gap-6">
                        {/* Enhanced Squircle Icon Container */}
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-[24px] bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),0_10px_20px_rgba(0,0,0,0.04)] flex items-center justify-center group-hover:scale-105 group-hover:-rotate-3 transition-all duration-500">
                            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-tr from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <FileText
                              size={24}
                              strokeWidth={1.2}
                              className="text-slate-400 group-hover:text-emerald-600 transition-colors duration-500"
                            />
                          </div>

                          {/* Floating Status Ring */}
                          <div className="absolute -top-1 -right-1 flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
                            <div className="relative inline-flex rounded-full h-5 w-5 bg-white border border-slate-100 items-center justify-center shadow-sm">
                              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </div>
                          </div>
                        </div>

                        {/* Typography - Editorial Layout */}
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-[18px] font-bold text-slate-900 truncate tracking-tight group-hover:text-emerald-950 transition-colors">
                              {doc.name}
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-500 text-[8px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md uppercase tracking-widest shadow-lg shadow-emerald-200/50">
                              Official
                            </span>
                          </div>

                          <div className="relative">
                            <p className="text-[13px] font-medium text-slate-500 truncate leading-relaxed group-hover:text-slate-700 transition-colors">
                              <span className="text-emerald-500/40 font-serif italic mr-0.5 text-base">
                                “
                              </span>
                              {doc.title}
                              <span className="text-emerald-500/40 font-serif italic ml-0.5 text-base">
                                ”
                              </span>
                            </p>
                          </div>

                          {/* Meta Footer - Centered & Refined */}
                          <div className="flex items-center gap-3 mt-3">
                            {/* Proposal Tag - Forced Centering */}
                            <div className="flex items-center justify-center px-2 py-1 rounded-md bg-slate-100 group-hover:bg-emerald-100 transition-colors duration-300">
                              <span className="text-[9px] font-black text-slate-400 group-hover:text-emerald-700 uppercase tracking-[0.1em] leading-none">
                                Proposal
                              </span>
                            </div>

                            {/* Separator */}
                            <div className="w-1 h-1 rounded-full bg-slate-200 group-hover:bg-emerald-300 transition-colors" />

                            {/* Institutional Label */}
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-slate-500 transition-colors duration-300 leading-none">
                              Institutional File
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* COLUMN 2: STATUS BADGE - Premium Jewel Style */}
                    <td className="w-[18%] py-5 px-4 bg-white/70 backdrop-blur-xl border-y border-white/40 group-hover:bg-white/90 transition-all duration-700 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        {(() => {
                          const config = STATUS_MAP[doc.status] || {
                            label: doc.status,
                            color: "slate",
                          };

                          // Premium Color Mapping with Translucent Glows
                          const colors = {
                            emerald:
                              "text-emerald-600 bg-emerald-500/5 border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white shadow-[0_2px_10px_rgba(16,185,129,0.1)]",
                            amber:
                              "text-amber-600 bg-amber-500/5 border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white shadow-[0_2px_10px_rgba(245,158,11,0.1)]",
                            rose: "text-rose-600 bg-rose-500/5 border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white shadow-[0_2px_10px_rgba(244,63,94,0.1)]",
                            blue: "text-blue-600 bg-blue-500/5 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white shadow-[0_2px_10px_rgba(59,130,246,0.1)]",
                            slate:
                              "text-slate-600 bg-slate-500/5 border-slate-500/20 group-hover:bg-slate-500 group-hover:text-white shadow-[0_2px_10px_rgba(100,116,139,0.1)]",
                          };

                          const activeColor =
                            colors[config.color] || colors.slate;

                          return (
                            <div
                              className={`
                              relative overflow-hidden
                              inline-flex items-center justify-center 
                              px-4 py-2 rounded-xl border
                              min-w-[130px] 
                              transition-all duration-500 ease-out
                              ${activeColor}
                            `}
                            >
                              {/* Internal Shine Effect */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                              {/* Status Pulse Dot */}
                              <div className="relative flex h-2 w-2 mr-2.5">
                                <span
                                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 bg-current`}
                                ></span>
                                <span
                                  className={`relative inline-flex rounded-full h-2 w-2 bg-current border border-white/20`}
                                ></span>
                              </div>

                              <span className="relative text-[10px] font-black uppercase tracking-[0.12em] leading-none">
                                {config.label}
                              </span>
                            </div>
                          );
                        })()}

                        {/* Metadata Label - Perfectly Centered */}
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-emerald-600/60 transition-colors duration-500">
                          Workflow State
                        </span>
                      </div>
                    </td>

                    {/* COLUMN 3: REGISTRY DATE - High-Fidelity Timestamp */}
                    <td className="w-[17%] py-5 px-4 bg-white/70 backdrop-blur-xl border-y border-white/40 group-hover:bg-white/90 transition-all duration-700 text-center">
                      <div className="inline-flex flex-col items-center justify-center gap-2.5">
                        {/* Minimalist Date Capsule */}
                        <div className="group/date relative flex items-center gap-2.5 px-4 py-2 bg-slate-50/50 rounded-xl border border-slate-100 group-hover:border-emerald-200/60 group-hover:bg-white group-hover:shadow-[0_4px_12px_rgba(16,185,129,0.05)] transition-all duration-500">
                          {/* Soft Icon Glow */}
                          <div className="flex-shrink-0 flex items-center justify-center">
                            <Calendar
                              size={14}
                              strokeWidth={2.2}
                              className="text-slate-400 group-hover:text-emerald-500 transition-colors duration-500"
                            />
                          </div>

                          {/* Date Text */}
                          <span className="text-[12px] font-black text-slate-700 tracking-tight leading-none group-hover:text-slate-900 transition-colors">
                            {formatDate(doc.submissionDate)}
                          </span>

                          {/* Hover Background Shine */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/date:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                        </div>

                        {/* Verification Badge - Editorial Style */}
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-500 delay-75">
                          <div className="flex items-center justify-center w-3 h-3 rounded-full bg-emerald-100/50">
                            <ShieldCheck size={9} className="text-emerald-600" />
                          </div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                            Registry Verified
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* COLUMN 4: ACTIONS - Premium Command Center */}
                    <td className="w-[20%] py-5 px-6 bg-white/70 backdrop-blur-xl last:rounded-r-[32px] border-y border-r border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.03)] group-hover:bg-white/90 transition-all duration-700">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex items-center justify-center gap-3">
                          {/* View Docs Button with Dynamic Quote */}
                          <div className="group/action relative flex flex-col items-center">
                            {/* The Quote Tooltip - Appears on hover or focus-within */}
                            <div className="absolute -top-10 scale-90 opacity-0 group-hover/action:opacity-100 group-hover/action:scale-100 group-focus-within/action:opacity-100 group-focus-within/action:scale-100 transition-all duration-300 pointer-events-none">
                              <div className="bg-slate-900 text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg shadow-xl uppercase tracking-[0.15em] whitespace-nowrap relative">
                                View Docs
                                {/* Tooltip Arrow */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                              </div>
                            </div>

                            <button onClick={() => handleOpenViewer(doc)} className="p-3 bg-white text-slate-400 rounded-xl border border-slate-100 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:text-emerald-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-95" disabled={loadingViewer}>
                              <FileText size={18} strokeWidth={2} />
                            </button>
                          </div>

                          {/* Quick View Button with Dynamic Quote */}
                          <div className="group/action relative flex flex-col items-center">
                            {/* The Quote Tooltip */}
                            <div className="absolute -top-10 scale-90 opacity-0 group-hover/action:opacity-100 group-hover/action:scale-100 group-focus-within/action:opacity-100 group-focus-within/action:scale-100 transition-all duration-300 pointer-events-none">
                              <div className="bg-indigo-600 text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg shadow-xl uppercase tracking-[0.15em] whitespace-nowrap relative">
                                View Reviews
                                {/* Tooltip Arrow */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-600 rotate-45" />
                              </div>
                            </div>

                            <button onClick={() => handleOpenReviewer(doc)} className="p-3 bg-white text-slate-400 rounded-xl border border-slate-100 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:text-indigo-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-95" disabled={loadingReviewer}>
                              <Eye size={18} strokeWidth={2} />
                            </button>
                          </div>
                        </div>

                        {/* Decision Tier stays clean to avoid clutter */}
                        {doc.status === "for_approval" && (
                          <div className="w-full max-w-[160px] flex flex-col gap-2 animate-in fade-in slide-in-from-top-3 duration-500">
                            <div className="flex items-center gap-2">
                              <button className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-emerald-700 transition-all focus:ring-2 focus:ring-emerald-500/40">
                                Approve
                              </button>
                              <button className="flex-1 py-2 bg-white text-rose-500 rounded-lg border border-rose-100 text-[9px] font-black uppercase tracking-wider hover:bg-rose-50 transition-all focus:ring-2 focus:ring-rose-500/20">
                                Reject
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in duration-700 py-4">
          {filteredDocuments.map((doc) => {
            const config = STATUS_MAP[doc.status] || { label: doc.status, color: "slate" };
            const statusColorClass = 
              config.color === 'emerald' ? 'bg-emerald-500' : 
              config.color === 'amber' ? 'bg-amber-500' : 
              config.color === 'rose' ? 'bg-rose-500' : 'bg-blue-500';

            return (
              <div 
                key={doc.proposal_id} 
                className="group relative bg-white border border-slate-100/80 rounded-[2.5rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 overflow-visible"
              >
                {/* Subtle Background Glow on Hover */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-slate-50/0 to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-8 pb-6"> {/* Increased padding for 'breathability' */}
                  
                  {/* Header Area - More Spaced Out */}
                  <div className="flex justify-between items-start mb-10">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-500">
                        <FileText size={28} strokeWidth={1.2} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-[3px] border-white ${statusColorClass} shadow-sm animate-pulse`} />
                    </div>

                    <div className="flex flex-col items-end">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${
                        config.color === 'emerald' ? 'bg-emerald-50/30 text-emerald-600 border-emerald-100/50' : 
                        config.color === 'amber' ? 'bg-amber-50/30 text-amber-600 border-amber-100/50' : 
                        'bg-blue-50/30 text-blue-600 border-blue-100/50'
                      }`}>
                        {config.label}
                      </div>
                    </div>
                  </div>

                  {/* Content Area - Focus on Typography Hierarchy */}
                  <div className="space-y-4 mb-10">
                    <div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] block mb-1">Document Name</span>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug group-hover:text-emerald-600 transition-colors">
                        {doc.name}
                      </h3>
                    </div>
                    
                    <div className="relative pt-2">
                      <p className="text-[15px] text-slate-500 leading-relaxed font-medium line-clamp-2 italic">
                        "{doc.title}"
                      </p>
                    </div>
                  </div>

                  {/* Footer Area - Refined Spacing & Action placement */}
                  <div className="pt-6 border-t border-slate-50 flex items-end justify-between">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Submitted Date</p>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} className="opacity-40" />
                        <span className="text-sm font-bold tracking-tight">{formatDate(doc.submissionDate)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2.5">
                      {/* Tooltip Wrapper - VIEW DOCS */}
                      <div className="relative group/tooltip">
                        <button 
                          onClick={() => handleOpenViewer(doc)}
                          className="p-3.5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-500 hover:text-white hover:shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)] transition-all duration-300 active:scale-90"
                        >
                          <FileText size={20} strokeWidth={2} />
                        </button>
                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 scale-75 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 pointer-events-none">
                          <div className="bg-slate-900 text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-xl whitespace-nowrap">
                            VIEW DOCUMENT
                          </div>
                        </div>
                      </div>

                      {/* Tooltip Wrapper - VIEW REVIEWS */}
                      <div className="relative group/tooltip">
                        <button 
                          onClick={() => handleOpenReviewer(doc)}
                          className="p-3.5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-500 hover:text-white hover:shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)] transition-all duration-300 active:scale-90"
                        >
                          <Eye size={20} strokeWidth={2} />
                        </button>
                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 scale-75 opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 pointer-events-none">
                          <div className="bg-indigo-600 text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-xl whitespace-nowrap">
                            VIEW FEEDBACK
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Premium Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="py-24 text-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100 mt-4">
            <div className="inline-flex p-5 rounded-full bg-white shadow-sm border border-slate-100 mb-4">
              <Search className="text-slate-300" size={28} />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
              Registry entry not found
            </p>
            <p className="text-slate-300 text-xs mt-2 font-medium italic">
              Try adjusting your search filters
            </p>
          </div>
        )}
      </div>
      <div>
        <DocumentViewerModal 
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        proposalData={selectedProposal}
      />

      <ReviewerModal 
        isOpen={isReviewerOpen}
        onClose={() => setIsReviewerOpen(false)}
        proposalData={selectedProposal}
        onOpen={() => setLoadingReviewer(false)}
      />
      {/* Viewer Loading Overlay */}
        {loadingViewer && (
          <div className="absolute inset-0 z-[50] flex items-center justify-center bg-white/70 backdrop-blur-md animate-fade-in">
            <div className="relative bg-white px-14 py-10 flex flex-col items-center animate-pop-out w-[450px] rounded-2xl shadow-lg">
              <p className="text-lg font-semibold shimmer-text mb-2 text-center">
                Opening Document
              </p>
              <p className="text-xs w-full text-gray-500 mb-4 text-center">
                Loading cover page and content...
              </p>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-700 transition-all duration-500 ease-out relative"
                  style={{ width: `${viewerProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500 font-medium">
                {Math.round(viewerProgress)}%
              </p>
            </div>
          </div>
        )}

        {/* Reviewer Loading Overlay */}
        {loadingReviewer && (
          <div className="absolute inset-0 z-[50] flex items-center justify-center bg-white/30 backdrop-blur-md animate-fade-in">
            <div className="relative bg-white px-14 py-10 flex flex-col items-center animate-pop-out w-[450px] rounded-2xl shadow-lg">
              <p className="text-lg font-semibold shimmer-text mb-2 text-center">
                Opening Reviews
              </p>
              <p className="text-xs w-full text-gray-500 mb-4 text-center">
                Preparing reviewer feedback...
              </p>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-700 transition-all duration-500 ease-out relative"
                  style={{ width: `${reviewerProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500 font-medium">
                {Math.round(reviewerProgress)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    
    
  );
};

export default ManageDocuments;
