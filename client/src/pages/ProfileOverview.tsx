import React, { useEffect, useState, useRef } from "react";
import { User, Mail, MapPin, Briefcase, GraduationCap, LogOut, Edit3, Shield, Calendar } from "lucide-react";
import EditProfileModal from "@/components/EditProfileModal";
import { fetchProfile } from "@/utils/profile-api";
import { useToast } from "@/context/toast";

// 1. Interfaces matching your API response
interface Profile {
  role: string;
  name: string;
  campus: string;
  department: string;
  position: string;
  created_at: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  profile: Profile;
}

interface AppleItemProps {
  icon: React.ReactElement;
  label: string;
  value: string | number | undefined;
  isBadge?: boolean;
  color: 'emerald' | 'green';
}

const ProfileOverview: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { showToast } = useToast();

  const toastRef = useRef(showToast);
  useEffect(() => {
    toastRef.current = showToast;
  }, [showToast]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        if (err instanceof Error) {
          console.error(err);
          toastRef.current(err.message, "error"); // use ref
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleUpdateUser = (updatedData: UserData) => {
    const safeData = {
      ...updatedData,
      profile: {
        role: updatedData.profile?.role || "Staff",
        name: updatedData.profile?.name || "",
        campus: updatedData.profile?.campus || "",
        department: updatedData.profile?.department || "",
        position: updatedData.profile?.position || "",
        created_at: updatedData.profile?.created_at || new Date().toISOString(),
      },
    }
    setUser(safeData);
    localStorage.setItem("user", JSON.stringify(updatedData));
    setIsModalOpen(false);
    showToast("Profile updated successfully!", "success");
  };

  const handleLogout = (): void => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const getInitials = (name: string): string => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  if (loading) return (
    <div className="h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <div className="h-screen flex items-center justify-center font-medium">No Profile Found.</div>;

  return (
    <div className="h-screen bg-[#FBFBFD] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(16,185,129,0.05)] border border-slate-100 overflow-hidden">
        
        {/* Modal */}
        <EditProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userData={user}
          onSave={handleUpdateUser}
        />

        {/* Ambient Banner */}
        <div className="h-40 bg-emerald-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        <div className="px-10 pb-10">
          {/* Header Section */}
          <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-24 mb-10 gap-8">
            <div className="relative group">
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-[2.5rem] bg-white p-2 shadow-xl transition-transform hover:scale-[1.02]">
                <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                   <span className="text-4xl font-bold text-emerald-50">
                     {getInitials(user.profile.name)}
                   </span>
                </div>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left pb-2">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                {user.profile.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-700 rounded-full border border-emerald-500/10 text-[11px] font-black uppercase">
                  {user.profile.role}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Briefcase size={16} className="text-emerald-500/70" />
                  {user.profile.position || "Staff Member"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-2">
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-7 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-emerald-600 transition-all">
                <Edit3 size={16} /> Update Profile
              </button>
              <button onClick={handleLogout} className="p-3 text-slate-400 hover:text-red-500 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-red-50 transition-all">
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Info Grid - No role conditions applied here */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 border-t border-slate-100/60 pt-12">
            
            {/* Left Column */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Account Details</h3>
              </div>
              <div className="rounded-[2.5rem] bg-slate-50/50 border border-slate-100 p-2 space-y-1">
                <AppleItem icon={<Mail />} label="Email Address" value={user.email} color="emerald" />
                <AppleItem icon={<User />} label="Username" value={user.username} color="emerald" />
                <AppleItem icon={<Shield />} label="Access Level" value={user.profile.role} isBadge color="emerald" />
              </div>
            </div>

            {/* Right Column - Now always visible */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-4 bg-emerald-400 rounded-full" />
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Institutional Context</h3>
              </div>
              <div className="rounded-[2.5rem] bg-slate-50/50 border border-slate-100 p-2 space-y-1">
                <AppleItem icon={<GraduationCap />} label="Department" value={user.profile.department} color="green" />
                <AppleItem icon={<MapPin />} label="Campus Node" value={user.profile.campus} color="green" />
                <AppleItem icon={<Calendar />} label="Joined System" value={new Date(user.profile.created_at).toLocaleDateString()} color="green" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const AppleItem: React.FC<AppleItemProps> = ({ icon, label, value, isBadge, color }) => (
  <div className="flex items-center gap-4 px-4 py-3 rounded-[1.5rem] bg-white border border-transparent hover:border-emerald-100 hover:bg-emerald-50/30 transition-all group">
    <div className={`w-12 h-12 rounded-[1.1rem] flex items-center justify-center shrink-0 
      ${color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'} 
      transition-colors duration-300 border border-slate-100 group-hover:bg-emerald-500 group-hover:text-white`}
    >
      {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 20 })}
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1 leading-none">
        {label}
      </span>
      {isBadge ? (
        <span className="text-[11px] font-extrabold text-emerald-700 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-md w-max">
          {value}
        </span>
      ) : (
        <span className="text-[15px] font-bold text-slate-800 truncate">
          {value || "Not specified"}
        </span>
      )}
    </div>
  </div>
);

export default ProfileOverview;