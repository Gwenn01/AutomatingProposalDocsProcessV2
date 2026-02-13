import React, { useState, useEffect, useRef } from "react";
import { X, Save, User, Briefcase, MapPin, Building, Camera, Mail } from "lucide-react";

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  // 1. Dito natin sinisiguro na laging updated ang form data base sa props
  const [formData, setFormData] = useState({ ...userData });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // 2. IMPORTANT: Update internal state kapag nag-open ang modal o nagbago ang userData prop
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...userData });
      setPreviewImage(null); // Reset preview pag open ulit
    }
  }, [isOpen, userData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-300">
        <div className="p-8 md:p-10">
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-2">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Settings</span>
              </div>
              <h2 className="text-3xl font-[1000] text-slate-900 tracking-tight">Edit Profile</h2>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all text-slate-400">
              <X size={20} strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <div className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  {(previewImage || formData.avatar) ? (
                    <img src={previewImage || formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white text-3xl font-bold">
                      {formData.fullname?.[0] || formData.name?.[0] || "U"}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl border-2 border-white shadow-lg">
                  <Camera size={14} strokeWidth={3} />
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Siguraduhin na ang value ay hindi undefined (|| "") */}
              <InputField 
                icon={<User />} 
                label="Full Name" 
                name="fullname" 
                value={formData.fullname || formData.name || ""} 
                onChange={handleChange} 
              />
              <InputField 
                icon={<Mail />} 
                label="Email" 
                name="email" 
                value={formData.email || ""} 
                onChange={handleChange} 
              />
              <InputField 
                icon={<Briefcase />} 
                label="Position" 
                name="position" 
                value={formData.position || ""} 
                onChange={handleChange} 
              />
              <InputField 
                icon={<Building />} 
                label="Department" 
                name="department" 
                value={formData.department || ""} 
                onChange={handleChange} 
              />
              <div className="md:col-span-2">
                <InputField 
                  icon={<MapPin />} 
                  label="Campus" 
                  name="campus" 
                  value={formData.campus || ""} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-500 font-bold text-sm uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-emerald-600 shadow-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ icon, label, name, value, onChange }) => (
  <div className="relative group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
        {React.cloneElement(icon, { size: 18, strokeWidth: 2.5 })}
      </div>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-500 transition-all outline-none font-bold text-slate-700 text-sm"
      />
    </div>
  </div>
);

export default EditProfileModal;