import React, { useState, useEffect } from "react";
import { X, User, ChevronDown, Save, Loader2, Mail, User2, Shield } from "lucide-react";
import { useToast } from "@/context/toast";
import { updateProfile, type UpdateProfilePayload } from "@/utils/profile-api";

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

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  onSave: (updatedData: UserData) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState<UserData>(userData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setFormData(userData);
  }, [userData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (["name", "campus", "department", "position", "role"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        role: formData.profile.role,
        name: formData.profile.name,
        campus: formData.profile.campus,
        department: formData.profile.department,
        position: formData.profile.position
      };

      const data: UpdateProfilePayload = await updateProfile(payload);

      const updatedUser: UserData = {
        ...userData, 
        username: data.username || formData.username,
        email: data.email || formData.email,
        profile: {
          ...userData.profile, 
          role: data.role || formData.profile.role,
          name: data.name || formData.profile.name,
          campus: data.campus || formData.profile.campus,
          department: data.department || formData.profile.department,
          position: data.position || formData.profile.position,
        }
      };

      onSave(updatedUser);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        showToast(err.message, "error");
      } else {
        console.error("Unexpected error:", err);
        showToast("Failed to update profile", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border border-white/20 my-auto relative overflow-hidden flex flex-col">
        
        {/* COMPACT GREEN HEADER */}
        <div className="relative overflow-hidden bg-emerald-900 px-8 py-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 blur-[50px] rounded-full -mr-16 -mt-16" />
          
          <div className="relative flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-emerald-400/60" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Security Portal</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Account <span className="text-emerald-400">Settings</span>
              </h2>
              <p className="text-emerald-100/60 text-xs font-medium">Manage your institutional identity</p>
            </div>
            
            <button 
              onClick={onClose} 
              className="group p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-all border border-white/10"
            >
              <X size={18} className="text-white transition-transform group-hover:rotate-90" />
            </button>
          </div>
        </div>

        {/* FORM SECTION - Reduced padding and gaps */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 overflow-y-auto">
          
          {/* SECTION: CREDENTIALS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 mb-1">
              <Shield className="text-emerald-600" size={14} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Credentials</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="group space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 ml-1">Username</label>
                <div className="relative">
                  <User2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500" size={18} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-normal text-slate-800 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="group space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-normal text-slate-800 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: PROFESSIONAL PROFILE */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 mb-1">
              <User className="text-emerald-600" size={14} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 ml-1">Legal Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.profile.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-normal text-slate-800 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 ml-1">System Role</label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.profile.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-normal text-slate-800 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="implementor">Implementor</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 ml-1">Campus Location</label>
                <input
                  type="text"
                  name="campus"
                  value={formData.profile.campus}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-normal text-slate-800 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 ml-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.profile.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-normal text-slate-800 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* ACTIONS - Compact footer */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-3.5 rounded-2xl text-[11px] font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 transition-all duration-300 tracking-[0.2em] uppercase"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] relative overflow-hidden group px-4 py-3.5 bg-emerald-500 rounded-2xl text-[11px] font-bold text-white shadow-[0_10px_20px_-5px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] transition-all duration-500 active:scale-[0.96] disabled:opacity-70"
            >
              {/* Animated Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Inner "Glass" Shine */}
              <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
              <span className="relative flex items-center justify-center gap-2.5 tracking-[0.15em] uppercase">
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <Save size={15} className="group-hover:-translate-y-0.5 transition-transform duration-300" /> 
                    <span className="mt-0.5">Save Profile</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;