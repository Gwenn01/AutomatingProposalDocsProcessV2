import React, { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { X, User, ShieldCheck, Loader2, ChevronDown } from "lucide-react";
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

  // Guard against null data
  const [formData, setFormData] = useState<UpdateAdminUserPayload>({
    name: "",
    campus: "",
    department: "",
    position: "",
    role: "reviewer",
  });

  // Initialize form when modal opens
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.profile.name,
        campus: data.profile.campus,
        department: data.profile.department,
        position: data.profile.position,
        role: data.profile.role as UserRole, // Type assertion
      });
    }
  }, [data]);

  if (!isOpen || !data) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Type guard for role
    if (name === "role" && value !== "reviewer" && value !== "admin" && value !== "implementor") {
      return;
    }

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
        if (err instanceof Error) {
            alert(err.message);
        } else {
            alert("Failed to update user");
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-gray-100 p-8 md:p-10 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-green-50 text-[#00923f] rounded-2xl mb-3">
            <User size={28} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            Edit User Profile
          </h2>
          <p className="text-gray-500 text-sm font-medium">Update user details below</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors" size={16} />
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Full Name"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:bg-white focus:border-[#00923f] transition-all text-gray-700 font-semibold text-sm"
              />
            </div>
          </div>

          {/* Campus */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Campus
            </label>
            <input
              name="campus"
              value={formData.campus}
              onChange={handleChange}
              type="text"
              placeholder="Campus"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-[#00923f] transition-all text-gray-700 font-semibold text-sm"
            />
          </div>

          {/* Department */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Department
            </label>
            <input
              name="department"
              value={formData.department}
              onChange={handleChange}
              type="text"
              placeholder="Department"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-[#00923f] transition-all text-gray-700 font-semibold text-sm"
            />
          </div>

          {/* Position */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Position
            </label>
            <input
              name="position"
              value={formData.position}
              onChange={handleChange}
              type="text"
              placeholder="Position"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-[#00923f] transition-all text-gray-700 font-semibold text-sm"
            />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Role
            </label>
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors" size={16} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 pl-11 pr-10 outline-none focus:bg-white focus:border-[#00923f] transition-all text-gray-700 font-semibold text-sm appearance-none cursor-pointer"
              >
                <option value="reviewer">Reviewer</option>
                <option value="implementor">Implementor</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#00923f] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-[#007a35] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <span className="uppercase tracking-widest text-xs">Update Profile</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileAdmin;
