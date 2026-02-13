import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, MapPin, Briefcase, GraduationCap, LogOut, Edit3, Shield, Calendar, Info } from "lucide-react";
import EditProfileModal from "../components/EditProfileModal";

const ProfileOverview = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched) return;
    const fetchProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) throw new Error("No user logged in");
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser?.user_id || parsedUser?.id;
        const res = await axios.get(`http://127.0.0.1:5000/api/get-profile/${userId}`);
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        if (data) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setUser(null);
      } finally {
        setLoading(false);
        setFetched(true);
      }
    };
    fetchProfile();
  }, [fetched]);

  const handleUpdateUser = (updatedData) => {
    setUser(updatedData);
    localStorage.setItem("user", JSON.stringify(updatedData));
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        window.location.href = "/";
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  if (loading) return (
    <div className="h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <div className="h-screen flex items-center justify-center font-medium">No Profile Found.</div>;

  const hasAcademicInfo = user.role === "implementor" || user.role === "instructor";

  return (
    <div className="h-screen bg-[#FBFBFD] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(16,185,129,0.05)] border border-slate-100 overflow-hidden">
        <EditProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userData={user}
          onSave={handleUpdateUser}
        />

        {/* Enhanced Apple-Style Ambient Banner */}
        <div className="h-40 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-600" />
          <div className="absolute -top-32 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-green-400/15 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '15s', animationDelay: '2s' }} />
          <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        </div>

        <div className="px-10 pb-10">
          {/* Header Section */}
          <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-24 mb-10 px-4 md:px-0 gap-8">
            
            {/* Avatar Container: Squircle with Glass Effect */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-[2.5rem] bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform duration-500 hover:scale-[1.02]">
                <div className="w-full h-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center border border-emerald-100/50">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-bold tracking-tighter text-emerald-50">
                        {getInitials(user.fullname)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Optional: Subtle Online Status Ring */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Info Section: Refined Typography */}
            <div className="flex-1 text-center md:text-left pb-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 drop-shadow-sm">
                    {user.fullname}
                  </h1>
                  {/* Verification Badge */}
                  <div className="flex items-center justify-center w-5 h-5 bg-emerald-500 rounded-full text-white shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3">
                      <path d="M20 6L9 17L4 12" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/[0.08] text-emerald-700 rounded-full border border-emerald-500/10">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-[0.05em]">{user.role}</span>
                  </div>
                  
                  <span className="hidden md:block w-1 h-1 bg-slate-300 rounded-full" />
                  
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[15px]">
                    <Briefcase size={16} className="text-emerald-500/70" strokeWidth={2.5} />
                    {user.position || "External Reviewer"}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Integrated Buttons */}
            <div className="flex items-center gap-3 pb-2">
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="group relative flex items-center gap-2 px-7 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold transition-all hover:bg-emerald-600 hover:shadow-[0_15px_30px_rgba(16,185,129,0.3)] active:scale-95"
              >
                <Edit3 size={16} className="group-hover:rotate-12 transition-transform" />
                <span>Update Profile</span>
              </button>
              
              <button 
                onClick={handleLogout} 
                className="p-3 text-slate-400 hover:text-red-500 bg-white border border-slate-100 rounded-2xl transition-all shadow-sm hover:shadow-md hover:bg-red-50 active:scale-90"
                title="Logout Account"
              >
                <LogOut size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 border-t border-slate-100/60 pt-12">
            
            {/* Left Column: Identity & Access */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.2em]">Identity & Access</h3>
              </div>
              
              <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-50/50 border border-slate-100 p-2 space-y-1">
                {/* Background Decorative Gradient for the container */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-emerald-500/5 blur-[50px] pointer-events-none" />
                
                <AppleItem icon={<Mail />} label="Primary Email" value={user.email} color="emerald" />
                <AppleItem icon={<User />} label="Legal Name" value={user.fullname} color="emerald" />
                <AppleItem icon={<Shield />} label="System Role" value={user.role} isBadge color="emerald" />
              </div>
            </div>

            {/* Right Column: Institutional Context */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className="w-1.5 h-4 bg-emerald-400 rounded-full" />
                <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.2em]">Institutional Context</h3>
              </div>

              {hasAcademicInfo ? (
                <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-50/50 border border-slate-100 p-2 space-y-1">
                  <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-emerald-500/5 blur-[50px] pointer-events-none" />
                  
                  <AppleItem icon={<GraduationCap />} label="Department" value={user.department} color="green" />
                  <AppleItem icon={<MapPin />} label="Campus Node" value={user.campus} color="green" />
                  <AppleItem icon={<Calendar />} label="Registered Since" value={user.created_at ? new Date(user.created_at).getFullYear() : "2024"} color="green" />
                </div>
              ) : (
                /* Enhanced Reviewer Notice Card */
                <div className="group relative h-full flex flex-col justify-center p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 via-emerald-50/30 to-white border border-emerald-100/50 overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <div className="absolute top-4 right-4 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
                    <Info size={40} strokeWidth={1.5} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-emerald-100 flex items-center justify-center mb-4">
                      <Shield className="text-emerald-600" size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-emerald-900 mb-2 tracking-tight">External Reviewer Status</h4>
                    <p className="text-[13px] text-emerald-800/70 leading-relaxed font-medium">
                      Your account is optimized for <span className="text-emerald-600 font-bold underline decoration-emerald-200 decoration-2 underline-offset-2">External Quality Assurance</span>. Institutional nodes are managed by the campus administrator.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppleItem = ({ icon, label, value, isBadge, color }) => (
  <div className="flex items-center gap-4 px-4 py-3 rounded-[1.5rem] bg-white border border-transparent hover:border-emerald-100 hover:bg-emerald-50/30 hover:shadow-[0_8px_20px_-12px_rgba(16,185,129,0.2)] transition-all duration-300 group cursor-default">
    {/* Icon Container: Neumorphic Glass Effect */}
    <div className={`w-12 h-12 rounded-[1.1rem] flex items-center justify-center shrink-0 
      ${color === 'emerald' 
        ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' 
        : 'bg-slate-50 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700'} 
      transition-all duration-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] border border-slate-100 group-hover:border-transparent`}
    >
      {React.cloneElement(icon, { 
        size: 20, 
        strokeWidth: 2.2,
        className: "transition-transform duration-500 group-hover:scale-110" 
      })}
    </div>

    <div className="flex flex-col min-w-0">
      {/* Label: Tighter, slightly more spaced */}
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.08em] leading-none mb-1.5 transition-colors group-hover:text-emerald-600/70">
        {label}
      </span>

      {/* Value: Crisp typography */}
      {isBadge ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
             <span className="text-[11px] font-extrabold text-emerald-700 group-hover:text-white uppercase tracking-tight">
               {value}
             </span>
          </div>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
      ) : (
        <span className="text-[15px] font-bold text-slate-800 tracking-tight truncate group-hover:text-slate-900 transition-colors">
          {value || "Not specified"}
        </span>
      )}
    </div>
    
    {/* Decorative Subtle Arrow (Only visible on hover) */}
    <div className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-600">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </div>
  </div>
);

export default ProfileOverview;