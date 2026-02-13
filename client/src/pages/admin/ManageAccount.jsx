import { useState, useEffect } from "react";
import { Edit, Trash2, Search, UserPlus, CheckCircle2, Table, Grid } from "lucide-react";
import EditModal from "../../components/Admin/EditModal";
import DeleteConfirmationModal from "../../components/Admin/DeleteConfirmationModal";
import AddAccountModal from "../../components/Admin/AddAccountModal";
import axios from "axios";
import ReactDOM from 'react-dom'

const ManageAccount = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loadingAction, setLoadingAction] = useState("");
  const [toast, setToast] = useState({ show: false, visible: false, message: "", type: "success" })
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    if (!loading) return;

    setProgress(0);
    let value = 0;

    const interval = setInterval(() => {
      value += Math.random() * 10;
      setProgress(Math.min(value, 95)); 
    }, 300);

    return () => clearInterval(interval);
  }, [loading]);

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      visible: false,
      message,
      type,
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToast(prev => ({ ...prev, visible: true }));
      });
    });

    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);

    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3700);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting user:", selectedUser.id);
    setIsDeleteModalOpen(false);
  };

  const handleUserAdded = () => {
    showToast("Account created successfully", "add");
    setTimeout(() => {
      setLoadingAction("add");
      setLoading(true);
      fetchUsers();
    }, 400);
    };

  const handleUserUpdated = () => {
    showToast("Account updated successfully", "edit");

    setTimeout(() => {
      setLoadingAction("edit");
      setLoading(true);
      fetchUsers();
    }, 400);
  };

  const handleUserDeleted = () => {
    showToast("Account deleted successfully", "delete");

    setTimeout(() => {
      setLoadingAction("delete");
      setLoading(true);
      fetchUsers();
    }, 400);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:5000/api/get-all-accounts");

      const data = res.data;

      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        console.warn("Unexpected API response:", data);
        setUsers([]); // fallback to prevent crash
      }

    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
      setUsers([]); // prevent filter crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const name = (user?.name ?? "").toString().toLowerCase();
    const email = (user?.email ?? "").toString().toLowerCase();
    const query = searchQuery.toLowerCase();

    return name.includes(query) || email.includes(query);
  });

  if (error) return <p>{error}</p>;

  return (
    <>
    {toast.show && ReactDOM.createPortal(
      <div
        className={`
          fixed top-8 right-8 z-[10001] pointer-events-none
          transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${toast.visible
            ? "translate-x-0 translate-y-0 opacity-100 scale-100"
            : "translate-x-6 -translate-y-2 opacity-0 scale-95"}
        `}
      >
        <div className="relative flex items-center gap-4 px-6 py-4 rounded-[28px]
                        bg-white/70 backdrop-blur-2xl border border-white/40
                        shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] pointer-events-auto">

          {/* Dynamic Accent Color */}
          <div className={`absolute left-2 w-1.5 h-8 rounded-full blur-[1px]
            ${toast.type === "delete" ? "bg-red-500/60" : 
              toast.type === "edit" ? "bg-amber-500/60" : "bg-emerald-500/60"}`} />

          {/* Dynamic Icon & Background Color */}
          <div className={`flex items-center justify-center w-11 h-11 rounded-2xl
            ${toast.type === "delete" ? "bg-red-500/10 text-red-600 ring-4 ring-red-500/5" :
              toast.type === "edit" ? "bg-amber-500/10 text-amber-600 ring-4 ring-amber-500/5" :
              "bg-emerald-500/10 text-emerald-600 ring-4 ring-emerald-500/5"}`}>
            
            {toast.type === "delete" && <Trash2 size={20} strokeWidth={2.5} />}
            {toast.type === "edit" && <Edit size={20} strokeWidth={2.5} />}
            {toast.type === "add" && <CheckCircle2 size={20} strokeWidth={2.5} />}
            {!["delete", "edit", "add"].includes(toast.type) && <CheckCircle2 size={20} strokeWidth={2.5} />}
          </div>

          {/* Text */}
          <div className="flex flex-col gap-0.5 pr-2">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
              System Core
            </span>
            <span className="text-[14px] font-bold text-slate-800">
              {toast.message}
            </span>
          </div>

          {/* Dynamic Progress Bar Color */}
          <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-slate-100/50 rounded-full overflow-hidden">
            <div className={`h-full animate-[progressOut_3s_linear_forwards]
              ${toast.type === "delete" ? "bg-red-500" : 
                toast.type === "edit" ? "bg-amber-500" : "bg-emerald-500"}`} />
          </div>
        </div>

        <style jsx>{`
          @keyframes progressOut {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>,
      document.body
    )}

    <div className="relative h-auto p-8 lg:p-10 bg-[#fbfcfb] animate-in fade-in duration-700">

      {loading && (
        <div className="fixed inset-0 lg:left-72 z-[999] flex items-center justify-center bg-[#fbfcfb]">
        <div className="relative px-14 py-12 flex flex-col items-center animate-pop-out w-full max-w-[480px] rounded-[40px]">
          
          {/* Dynamic Title */}
          <p className="text-lg font-semibold shimmer-text mb-2 text-center">
            {loadingAction === "add" && "Adding Account..."}
            {loadingAction === "edit" && "Updating Account..."}
            {loadingAction === "delete" && "Deleting Account..."}
            {!loadingAction && "Synchronizing Records..."}
          </p>

          {/* Dynamic Subtitle */}
          <p className="text-xs w-full text-gray-500 mb-4 text-center">
            {loadingAction === "add" && "Saving the new user."}
            {loadingAction === "edit" && "Saving the updated user info."}
            {loadingAction === "delete" && "Erasing the selected user."}
            {!loadingAction && "Preparing the latest user and reviewer data."}
          </p>

          {/* Progress Bar Style */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-700 transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Progress Percent */}
          <p className="mt-3 text-xs text-gray-500 font-medium">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
      )}
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2 mb-10">
        {/* Left Side: Titles */}
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Manage Accounts
          </h1>
          <p className="text-gray-500 text-sm">
            View and manage all registered users in the system.
          </p>
        </div>

        {/* Right Side: Tools (Search, Button, View Switcher) */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
          
          {/* 1. Modern Search Bar (Now in Header) */}
          <div className="relative w-full md:w-72 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1cb35a] transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-[#1cb35a]/10 focus:border-[#1cb35a]/30 transition-all outline-none text-xs font-bold text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* 2. View Mode Switcher (Smaller/Compact) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-[16px] border border-slate-200/50">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-[12px] transition-all duration-300 ${
                viewMode === "table" ? "bg-white text-[#1cb35a] shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Table size={16} />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-[12px] transition-all duration-300 ${
                viewMode === "card" ? "bg-white text-[#1cb35a] shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Grid size={16} />
            </button>
          </div>

          {/* 3. Create Account Button - Compact & Premium */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="group relative flex items-center justify-center gap-2 bg-[#00923f] text-white px-5 h-11 rounded-[16px] font-black transition-all duration-300 hover:-translate-y-0.5 active:scale-95 w-full md:w-auto overflow-hidden shadow-lg shadow-emerald-900/10"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <UserPlus size={14} strokeWidth={3} />
            <span className="text-[10px] uppercase tracking-widest">Create</span>
          </button>
        </div>
      </div>

      {/* Main Content Card - Matching Chart Card Style */}
      <div className="bg-white p-8 mt-12 rounded-[32px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 overflow-hidden">
        {/* Table Section */}
        {viewMode === "table" ? (
        <div className="overflow-x-hidden">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-[0.2em] font-black">
                <th className="pb-2 px-8 text-left">ID</th>
                <th className="pb-2 px-6 text-left">User Details</th>
                <th className="pb-2 px-6 text-left">Role</th>
                <th className="pb-2 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="group transition-all duration-300 hover:translate-x-1"
                >
                  {/* ID Column - Modern Badge Style */}
                  <td className="py-5 px-8 group-hover:bg-white first:rounded-l-[32px] border-y border-l border-transparent group-hover:border-slate-100 transition-all duration-300 relative overflow-hidden">
                    {/* Monospace ID with Badge Effect */}
                    <div className="flex items-center">
                      <span className="relative z-10 font-mono text-[11px] font-black tracking-tighter px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-green-50 group-hover:text-green-600 transition-colors duration-300">
                        #{user?.id ? String(user.id).padStart(2, "0") : "00"}
                      </span>

                      {/* Subtle Vertical Indicator on Hover */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-green-500 group-hover:h-1/2 transition-all duration-500 rounded-r-full" />
                    </div>
                  </td>

                  {/* User Details - Enhanced Identity Style */}
                  <td className="py-5 px-6 group-hover:bg-white border-y border-transparent group-hover:border-slate-100 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      {/* Avatar Circle with Initials */}
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border border-slate-200 group-hover:from-green-50 group-hover:to-green-100 group-hover:border-green-200 transition-all duration-500">
                          <span className="text-[12px] font-black text-slate-500 group-hover:text-green-600 tracking-tighter">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                        {/* Online Status Dot (Optional Aesthetic) */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full group-hover:ring-4 group-hover:ring-green-500/20 transition-all" />
                      </div>

                      {/* Text Details */}
                      <div className="flex flex-col min-w-0">
                        <span className="font-black text-slate-800 text-[14px] tracking-tight leading-none mb-1 group-hover:text-green-700 transition-colors">
                          {user.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-green-400 transition-colors" />
                          <span className="text-[11px] text-slate-400 font-bold tracking-tight truncate max-w-[180px]">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge - Modern Glossy Style */}
                  <td className="py-5 px-6 group-hover:bg-white border-y border-transparent group-hover:border-slate-100 transition-all duration-300">
                    <div className="flex items-center">
                      <span
                        className={`
                                                inline-flex items-center px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500
                                                ${
                                                  user.role === "implementor"
                                                    ? "bg-emerald-50/50 text-emerald-700 ring-2 ring-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)]"
                                                    : "bg-amber-50/50 text-amber-700 ring-2 ring-amber-500/10 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-[0_8px_20px_-6px_rgba(245,158,11,0.4)]"
                                                }
                                            `}
                      >
                        {/* Pulsing Indicator Icon */}
                        <div className="relative mr-2.5 flex items-center justify-center">
                          <span
                            className={`absolute w-2 h-2 rounded-full animate-ping opacity-75 ${
                              user.role === "implementor"
                                ? "bg-emerald-400"
                                : "bg-amber-400"
                            }`}
                          />
                          <span
                            className={`relative w-1.5 h-1.5 rounded-full ${
                              user.role === "implementor"
                                ? "bg-emerald-500 group-hover:bg-white"
                                : "bg-amber-500 group-hover:bg-white"
                            } transition-colors duration-300`}
                          />
                        </div>

                        {user.role}
                      </span>
                    </div>
                  </td>

                  {/* Actions - Modern Soft-UI Style */}
                  <td className="py-5 px-6 group-hover:bg-white last:rounded-r-[32px] border-y border-r border-transparent group-hover:border-slate-100 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2">
                      {/* Edit Action */}
                      <button
                        onClick={() => handleEditClick(user)}
                        title="Edit User"
                        className="group/edit relative p-2.5 bg-slate-100/50 text-slate-500 rounded-xl hover:bg-emerald-500 hover:text-white hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)] transition-all duration-300 active:scale-90"
                      >
                        <Edit
                          size={18}
                          strokeWidth={2.5}
                          className="transition-transform duration-300 group-hover/edit:rotate-12 group-hover/edit:scale-110"
                        />
                      </button>

                      {/* Delete Action */}
                      <button
                        onClick={() => handleDeleteClick(user)}
                        title="Delete Account"
                        className="group/delete relative p-2.5 bg-slate-100/50 text-slate-500 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-[0_8px_20px_-6px_rgba(239,68,68,0.5)] transition-all duration-300 active:scale-90"
                      >
                        <Trash2
                          size={18}
                          strokeWidth={2.5}
                          className="transition-transform duration-300 group-hover/delete:translate-y-[-1px] group-hover/delete:scale-110"
                        />
                      </button>

                      {/* Separator Line (Optional Decorative) */}
                      <div className="w-[1px] h-4 bg-slate-200 mx-1 group-hover:bg-slate-100 transition-colors" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="group relative bg-white rounded-[38px] p-2 border border-slate-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-slate-300 transition-all duration-500 flex flex-col h-full overflow-hidden"
              >
                {/* Premium Glass Background Effect (Visible on Hover) */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-50/30 to-emerald-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 p-6 flex flex-col h-full">
                  {/* Top Header: ID & Role */}
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        ID-{String(user.id).padStart(3, "0")}
                      </span>
                    </div>
                    
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-sm border ${
                      user.role === "implementor" 
                        ? "bg-emerald-50/50 text-emerald-600 border-emerald-100" 
                        : "bg-amber-50/50 text-amber-600 border-amber-100"
                    }`}>
                      {user.role}
                    </span>
                  </div>

                  {/* User Identity Section */}
                  <div className="flex flex-col items-center text-center mb-10">
                    <div className="relative mb-5">
                      {/* Multi-layered Avatar Container */}
                      <div className="w-20 h-20 rounded-[28px] bg-[#f5f5f7] flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden">
                        <span className="text-xl font-black text-slate-400 group-hover:text-[#1cb35a] transition-colors duration-500 tracking-tighter">
                          {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </span>
                      </div>
                      {/* Subtle Reflection Effect */}
                      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none" />
                    </div>

                    <h3 className="font-bold text-[#1d1d1f] text-xl tracking-tight mb-1 group-hover:text-[#1cb35a] transition-colors duration-300">
                      {user.name}
                    </h3>
                    <p className="text-slate-400 text-[13px] font-medium tracking-tight">
                      {user.email}
                    </p>
                  </div>

                  {/* Apple-Style Action Buttons */}
                  <div className="mt-auto grid grid-cols-2 gap-3 pt-6 border-t border-slate-50">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="group/btn relative flex items-center justify-center gap-2 h-12 rounded-[18px] bg-emerald-50 text-emerald-600 font-black text-[11px] uppercase tracking-widest transition-all duration-300 hover:bg-emerald-600 hover:text-white hover:shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)] active:scale-95 overflow-hidden"
                    >
                      <Edit size={14} strokeWidth={2.5} className="group-hover/btn:rotate-12 transition-transform" />
                      <span>Edit</span>
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="group/btn relative flex items-center justify-center gap-2 h-12 rounded-[18px] bg-red-50 text-red-500 font-black text-[11px] uppercase tracking-widest transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-[0_10px_20px_-5px_rgba(239,68,68,0.4)] active:scale-95 overflow-hidden"
                    >
                      <Trash2 size={14} strokeWidth={2.5} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Modern High-End Detail: Glass Light Reflection at the top */}
                <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            ))}
          </div>
        )}

        {/* Optional Empty State */}
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              No accounts found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleUserAdded}
      />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={selectedUser}
        onSuccess={handleUserUpdated}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        data={selectedUser}
        onSuccess={handleUserDeleted}
      />
    </div>
    </>
  );
};

export default ManageAccount;
