import React, { useState, useEffect } from "react";
import { X, User, Briefcase, MapPin, GraduationCap, Save, Loader2, Mail, Fingerprint, Shield } from "lucide-react";
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
    
    // Check if the field belongs to the nested 'profile' object
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

      // Ang 'data' dito ay ang flat response mula sa API
      const data: UpdateProfilePayload = await updateProfile(payload);

      const updatedUser: UserData = {
        ...userData, 
        username: data.username || formData.username,
        email: data.email || formData.email,
        profile: {
          ...userData.profile, 
          // Dito natin kinukuha ang flat fields mula sa API response
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 my-8 outline-none">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Account Settings</h2>
            <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Update your professional identity</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          
          {/* USERNAME & EMAIL ROW */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* NAME & ROLE ROW */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.profile.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Role</label>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <select
                  name="role"
                  value={formData.profile.role}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all appearance-none"
                >
                  <option value="implementor">Implementor</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campus</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="text"
                  name="campus"
                  value={formData.profile.campus}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
              <div className="relative group">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="text"
                  name="department"
                  value={formData.profile.department}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Position</label>
            <div className="relative group">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input
                type="text"
                name="position"
                value={formData.profile.position}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                placeholder="e.g. Instructor I"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;