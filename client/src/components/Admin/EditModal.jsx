import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, User, Mail, ShieldCheck, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const EditModal = ({ isOpen, onClose, data, onSuccess }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    fullname: '',
    email: '',
    password: '',
    role: 'Implementor'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync data props to local state when modal opens
  useEffect(() => {
    if (data) {
      setFormData({
        user_id: data.id || data.user_id || '',
        fullname: data.name || data.fullname || '',
        email: data.email || '',
        role: data.role || 'implementor',
        password: '' 
      });
    }
  }, [data, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log(formData);
      const response = await fetch('http://127.0.0.1:5000/api/update-account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        const updateUser = {
          id: formData.user_id,
          name: formData.fullname,
          email: formData.email,
          role: formData.role
        };

        onSuccess(updateUser);
        onClose();
      } else {
        alert(result.message || "Error updating account");
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop with enhanced blur */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-500" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">

        <div className="p-8 md:p-12">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-90"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Edit Profile</h2>
            <p className="text-gray-500 mt-1 font-medium">Modify account details and administrative privileges.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Full Name Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-2 ml-1 transition-colors group-within:text-[#00923f]">
                <User size={14} /> Full Name
              </label>
              <input 
                required
                type="text" 
                value={formData.fullname}
                onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-[#00923f] focus:bg-white transition-all font-bold text-gray-700 placeholder:text-gray-300"
                placeholder="Enter full name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Field */}
              <div className="group">
                <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-2 ml-1 transition-colors group-within:text-[#00923f]">
                  <Mail size={14} /> Email Address
                </label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-[#00923f] focus:bg-white transition-all font-bold text-gray-700 placeholder:text-gray-300"
                  placeholder="name@example.com"
                />
              </div>

              {/* Role Select - Updated with Implementor and Reviewer */}
              <div className="group">
                <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-2 ml-1 transition-colors group-within:text-[#00923f]">
                  <ShieldCheck size={14} /> System Role
                </label>
                <div className="relative">
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-[#00923f] focus:bg-white transition-all font-black text-gray-700 appearance-none cursor-pointer"
                  >
                    <option value="implementor">Implementor</option>
                    <option value="reviewer">Reviewer</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-2 ml-1 transition-colors group-within:text-[#00923f]">
                <Lock size={14} /> Security Key
              </label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-[#00923f] focus:bg-white transition-all font-bold text-gray-700 placeholder:text-gray-300"
                  placeholder="Enter new password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00923f] transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-2 text-[10px] text-gray-400 font-medium ml-1 italic">
                * Note: Password is re-hashed upon saving for security.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 flex flex-col sm:flex-row justify-end gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all order-2 sm:order-1"
              >
                Discard
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-[#00923f] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#007a35] transition-all active:scale-[0.98] shadow-[0_10px_20px_rgba(0,146,63,0.2)] flex items-center justify-center gap-3 disabled:opacity-70 order-1 sm:order-2"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                {isLoading ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;