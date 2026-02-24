import React, {
  useState,
  type ChangeEvent,
  type FormEvent,
  useEffect,
} from "react";
import {
  X,
  User,
  ShieldCheck,
  Loader2,
  ChevronDown,
  Briefcase,
  MapPin,
} from "lucide-react";
import { type ApiUser, updateAdminAccount } from "@/utils/admin-api";

export type UserRole = "reviewer" | "admin" | "implementor";

export interface UpdateAdminUserPayload {
  name?: string;
  campus?: string;
  department?: string;
  position?: string;
  role?: UserRole;
}

interface EditProfileAdminProps {
  isOpen: boolean;
  onClose: () => void;
  data: ApiUser | null;
  onSuccess: (updatedUser: ApiUser) => void;
}

const EditProfileAdmin: React.FC<EditProfileAdminProps> = ({
  isOpen,
  onClose,
  data,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateAdminUserPayload>({
    name: "",
    campus: "",
    department: "",
    position: "",
    role: "reviewer",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.profile.name,
        campus: data.profile.campus,
        department: data.profile.department,
        position: data.profile.position,
        role: data.profile.role as UserRole,
      });
    }
  }, [data]);

  if (!isOpen || !data) return null;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await updateAdminAccount(data.id, formData);
      onSuccess(updatedUser);
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl h-[70vh] bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* 1. Header Section */}
        <div className="p-10 pb-6 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Profile Management
                </span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Edit User Account
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 2. Form Content Area */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="px-10 pb-6 flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pod: Personal Identity */}
              <div className="space-y-6 p-8 bg-slate-50/50 rounded-[32px] border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <User size={18} className="text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Personal Information
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <label className="text-[11px] font-bold text-slate-500 ml-2 mb-1.5 block uppercase">
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm outline-none focus:border-emerald-500/30 transition-all"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="group">
                    <label className="text-[11px] font-bold text-slate-500 ml-2 mb-1.5 block uppercase">
                      Campus Location
                    </label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        name="campus"
                        value={formData.campus}
                        onChange={handleChange}
                        className="w-full px-11 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm outline-none focus:border-emerald-500/30 transition-all"
                        placeholder="Assign campus"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pod: Organization */}
              <div className="space-y-6 p-8 bg-slate-50/50 rounded-[32px] border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={18} className="text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Work Details
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <label className="text-[11px] font-bold text-slate-500 ml-2 mb-1.5 block uppercase">
                      Department
                    </label>
                    <input
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm outline-none focus:border-emerald-500/30 transition-all"
                      placeholder="e.g. Computer Studies"
                    />
                  </div>
                  <div className="group">
                    <label className="text-[11px] font-bold text-slate-500 ml-2 mb-1.5 block uppercase">
                      Job Position
                    </label>
                    <input
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm outline-none focus:border-emerald-500/30 transition-all"
                      placeholder="e.g. Faculty / Dean"
                    />
                  </div>
                </div>
              </div>

              {/* Pod: Access Control (Full Width) */}
              <div className="md:col-span-2 relative group p-8 bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl">
                <ShieldCheck
                  size={160}
                  className="absolute -right-10 -bottom-10 text-white/[0.03] -rotate-12 group-hover:text-emerald-500/[0.05] transition-all duration-700"
                />

                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-6 block">
                    Permissions & Authorization
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="relative">
                      <label className="text-[11px] font-bold text-slate-500 ml-2 mb-1.5 block uppercase">
                        User Role
                      </label>
                      <div className="relative">
                        <ShieldCheck
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                          size={18}
                        />
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-3.5 pl-12 pr-10 outline-none focus:border-emerald-500 focus:bg-white/10 transition-all text-white appearance-none cursor-pointer text-sm"
                        >
                          <option value="reviewer" className="bg-slate-900">
                            Reviewer
                          </option>
                          <option value="implementor" className="bg-slate-900">
                            Implementor
                          </option>
                          <option value="admin" className="bg-slate-900">
                            System Admin
                          </option>
                        </select>
                        <ChevronDown
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                          size={18}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 italic leading-relaxed">
                        Updating the user role will immediately change their
                        access permissions across the Document Suite.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Footer Actions */}
          <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-600 shadow-xl transition-all duration-500 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ShieldCheck size={16} className="text-emerald-400" />
              )}
              <span>{loading ? "Updating..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileAdmin;
