import React, { useEffect, useState, useRef } from "react";
import {
  User, Mail, MapPin, Briefcase, GraduationCap, LogOut,
  Edit3, Shield, Calendar, Fingerprint, Globe, ChevronRight, Award
} from "lucide-react";
import { type LucideProps } from "lucide-react";
import EditProfileModal from "@/components/EditProfileModal";
import { fetchProfile } from "@/api/profile-api";
import { useToast } from "@/context/toast";

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

const ProfileOverview: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { showToast } = useToast();

  const toastRef = useRef(showToast);
  useEffect(() => { toastRef.current = showToast; }, [showToast]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setUser(data);
      } catch (err) {
        if (err instanceof Error) toastRef.current(err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleUpdateUser = (updatedData: UserData) => {
    setUser(updatedData);
    setIsModalOpen(false);
    showToast("Profile updated successfully!", "success");
  };

  const handleLogout = (): void => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  if (loading) return (
    <div className="h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-[3px] border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="h-auto  bg-[#FAFAFA] p-4 md:p-8 lg:p-12 font-sans selection:bg-emerald-100">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header / Hero Section */}
        <div className="relative bg-white rounded-[2rem] overflow-hidden border border-slate-200/60 shadow-sm">
          {/* Animated Mesh Gradient Background */}
          <div className="h-40 md:h-56 bg-emerald-50 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[5%] w-96 h-96 bg-teal-100/50 rounded-full blur-3xl"></div>
          </div>

          <div className="px-6 md:px-12 pb-10">
            <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20 gap-6">

              {/* Profile Image with Ring Effect */}
              <div className="relative group">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl bg-white p-1.5 shadow-xl shadow-slate-200/50">
                  <div className="w-full h-full rounded-[1.25rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white ring-4 ring-white">
                    <span className="text-4xl md:text-5xl font-bold tracking-tight">
                      {user.profile.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                  <Shield size={18} />
                </div>
              </div>

              {/* Name & Title */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wider rounded-full">
                    {user.profile.role}
                  </span>
                  <span className="text-slate-400 text-xs font-medium px-2 py-0.5 border border-slate-200 rounded-full">
                    ID: #{user.id.toString().padStart(4, '0')}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {user.profile.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 text-sm">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Briefcase size={16} className="text-slate-400" /> {user.profile.position || "Member"}
                  </div>
                  <div className="hidden md:block w-1 h-1 rounded-full bg-slate-300"></div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <GraduationCap size={16} className="text-slate-400" /> {user.profile.department}
                  </div>
                </div>
              </div>

              {/* Action Group */}
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:scale-95"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="p-3 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-xl transition-all border border-slate-200"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6 h-auto">

          {/* Security & Access (Span 8) */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Fingerprint size={20} />
                </div>
                <h3 className="font-bold text-slate-800">Account Credentials</h3>
              </div>
              <button className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                Security Settings <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CredentialCard icon={<Mail />} label="Email Address" value={user.email} />
              <CredentialCard icon={<User />} label="User Handle" value={`@${user.username}`} />
              <CredentialCard icon={<Award />} label="System Privilege" value={user.profile.role} />
              <CredentialCard icon={<Calendar />} label="Account Age" value={`Joined ${new Date(user.profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`} />
            </div>
          </div>

          {/* Location / Workspace (Span 4) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-900/10 h-full relative overflow-hidden group">
              <Globe className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:rotate-12 transition-transform duration-700" />

              <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
                <MapPin size={20} className="text-emerald-300" /> Workspace
              </h3>

              <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-emerald-200/70 text-[10px] font-bold uppercase tracking-widest mb-1">Current Campus</p>
                  <p className="text-xl font-semibold tracking-tight">{user.profile.campus || "Global Office"}</p>
                </div>
                <div>
                  <p className="text-emerald-200/70 text-[10px] font-bold uppercase tracking-widest mb-1">Division</p>
                  <p className="text-xl font-semibold tracking-tight">{user.profile.department}</p>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-200">Active Status</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={user}
        onSave={handleUpdateUser}
      />
    </div>
  );
};

/* Internal Refined Component for Information Tiles */
const CredentialCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center gap-4 transition-all hover:bg-white hover:border-emerald-100 hover:shadow-md hover:shadow-emerald-500/5 group">
    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-100 transition-all shadow-sm">
      {React.isValidElement(icon) &&
        React.cloneElement(icon as React.ReactElement<LucideProps>, {
          size: 18
        })
      }
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-slate-700 font-semibold truncate text-sm">{value || "Not set"}</p>
    </div>
  </div>
);

export default ProfileOverview;