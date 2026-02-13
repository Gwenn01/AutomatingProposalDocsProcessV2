import React, { useState } from 'react';
import { X, UserPlus, Eye, EyeOff, Loader2, ChevronDown, User, ShieldCheck, Mail, Lock } from 'lucide-react';

const AddAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    role: 'reviewer' 
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newUser = await response.json();
        onSuccess(newUser);
        onClose();
      } else {
        const data = await response.json();
        alert(data.message || "Something went wrong");
      }
    } catch {
      alert("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Premium Glass Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card - Set to max-w-md and reduced padding for standard height */}
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-gray-100 p-8 md:p-10 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
        >
          <X size={18} />
        </button>

        {/* Header - More Compact */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-green-50 text-[#00923f] rounded-2xl mb-3">
            <UserPlus size={28} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Create Account</h2>
          <p className="text-gray-500 text-sm font-medium">Fill in the details to initialize a new user</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00923f] transition-colors" size={16} />
              <input 
                required
                name="fullname"
                onChange={handleChange}
                type="text" 
                placeholder="Juan Dela Cruz"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:bg-white focus:border-[#00923f] transition-all text-gray-700 font-semibold text-sm"
              />
            </div>
          </div>

          {/* Account Role */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Account Role</label>
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00923f] transition-colors" size={16} />
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 pl-11 pr-10 outline-none focus:bg-white focus:border-[#00923f] transition-all text-gray-700 font-semibold text-sm appearance-none cursor-pointer"
              >
                <option value="reviewer">Reviewer Access</option>
                <option value="implementor">Implementor Access</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00923f] transition-colors" size={16} />
              <input 
                required
                name="email"
                onChange={handleChange}
                type="email" 
                placeholder="juan@prmsu.edu.ph"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:bg-white focus:border-[#00923f] transition-all text-gray-700 font-semibold text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00923f] transition-colors" size={16} />
              <input 
                required
                name="password"
                onChange={handleChange}
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 pl-11 pr-11 outline-none focus:bg-white focus:border-[#00923f] transition-all text-gray-700 font-semibold text-sm"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00923f]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Action Button - Standard Padding */}
          <div className="pt-4">
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-[#00923f] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-[#007a35] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <span className="uppercase tracking-widest text-xs">Initialize Account</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;