import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  X,
  UserPlus,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Briefcase,
  UserCircle,
} from "lucide-react";
import {
  createAdminAccount,
  type CreateAdminUserPayload,
} from "@/utils/admin-api";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAccountModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddAccountModalProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateAdminUserPayload>({
    username: "",
    email: "",
    password: "",
    role: "reviewer",
    name: "",
    campus: "Iba Campus",
    department: "",
    position: "",
  });

  if (!isOpen) return null;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createAdminAccount(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      {/* 70% Height Container */}
      <div className="relative w-full max-w-5xl h-[80vh] bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* 1. Header */}
        <div className="p-10 pb-6 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  System Administration
                </span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Add New Account
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

        {/* 2. Form Content - 2 Column Layout */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="px-10 pb-6 flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pod: Identity (Left Column) */}
              <div className="space-y-6 p-8 bg-slate-50/50 rounded-[32px] border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <UserCircle size={18} className="text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Identity Details
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <label className="text-[11px] font-bold text-slate-500 ml-2 mb-1.5 block uppercase tracking-tight">
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      type="text"
                      className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm outline-none focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      placeholder="e.g. Jane Smith"
                    />
                  </div>
                  <div className="group">
                    <label className="text-[11px] font-bold text-slate-500 ml-2 mb-1.5 block uppercase tracking-tight">
                      Username
                    </label>
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      type="text"
                      className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm outline-none focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      placeholder="janesmith_01"
                    />
                  </div>
                  <div className="group">
                    <label className="text-[11px] font-bold text-slate-500 ml-2 mb-1.5 block uppercase tracking-tight">
                      Email Address
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      type="email"
                      className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm outline-none focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      placeholder="jane@university.edu.ph"
                    />
                  </div>
                </div>
              </div>

              {/* Pod: Professional (Right Column) */}
              <div className="space-y-6 p-8 bg-slate-50/50 rounded-[32px] border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={18} className="text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Professional Assignment
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <label className="text-[11px] font-bold text-slate-500 ml-2 mb-1.5 block uppercase tracking-tight">
                      Account Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm outline-none focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                    >
                      <option value="admin">Administrator</option>
                      <option value="reviewer">Reviewer</option>
                      <option value="implementor">Implementor</option>
                    </select>
                  </div>
                  <div className="group">
                    <label className="text-[11px] font-bold text-slate-500 ml-2 mb-1.5 block uppercase tracking-tight">
                      Department
                    </label>
                    <input
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm outline-none focus:border-emerald-500/30 transition-all"
                      placeholder="e.g. College of Computing"
                    />
                  </div>
                  <div className="group">
                    <label className="text-[11px] font-bold text-slate-500 ml-2 mb-1.5 block uppercase tracking-tight">
                      Position
                    </label>
                    <input
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm outline-none focus:border-emerald-500/30 transition-all"
                      placeholder="e.g. Department Head"
                    />
                  </div>
                </div>
              </div>

              {/* Pod: Security Initialization (Full Width Bento) */}
              <div className="md:col-span-2 relative group p-8 bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200">
                {/* Decorative Background Icon */}
                <ShieldCheck
                  size={160}
                  className="absolute -right-10 -bottom-10 text-white/[0.03] -rotate-12 group-hover:scale-110 group-hover:text-emerald-500/[0.05] transition-all duration-700"
                />

                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-6 block">
                    Security Credentials
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                      <label className="text-[11px] font-bold text-slate-500 ml-2 mb-1.5 block uppercase">
                        Initial Password
                      </label>
                      <div className="relative">
                        <input
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          type={showPassword ? "text" : "password"}
                          className="w-full px-5 py-3.5 bg-white/5 border-2 border-white/10 rounded-2xl text-sm outline-none focus:border-emerald-500 focus:bg-white/10 transition-all text-white placeholder:text-slate-600"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <p className="text-[11px] text-slate-500 leading-relaxed italic">
                        Password should be at least 8 characters long and
                        include a mix of letters and numbers for enhanced
                        security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[12px] font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                {error}
              </div>
            )}
          </div>

          {/* 3. Footer */}
          <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel Process
            </button>

            <button
              disabled={loading}
              className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-600 shadow-xl shadow-slate-200 transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <UserPlus
                  size={16}
                  className="text-emerald-400 group-hover:text-white"
                />
              )}
              <span>{loading ? "Creating..." : "Create Account"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;
