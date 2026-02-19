import { useState, useEffect } from "react";
import { Edit, Trash2, Search, UserPlus, Table, Grid, User2 } from "lucide-react";
import EditProfileAdmin from "@/components/admin/EditProfileAdminModal";
import AddAccountModal from "@/components/admin/AddAccountModal";
import DeleteAccountConfirmationModal from "@/components/admin/DeleteAccountConfirmationModal";
import { getAllAccounts, type ApiUser } from "@/utils/admin-api";
import { useToast } from "@/context/toast";

type ViewMode = "table" | "card";

const ManageAccount = () => {
  const { showToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getAllAccounts();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =========================
     Handlers
  ========================= */

  const handleEditClick = (user: ApiUser): void => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user: ApiUser): void => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleUserAdded = async (): Promise<void> => {
    showToast("Creating account...", "info");
    setIsAddModalOpen(false);
    showToast("New account created successfully!", "success");
    await fetchUsers();
  };

  const handleUserUpdated = async (): Promise<void> => {
    showToast("Updating profile...", "info");
    setIsEditModalOpen(false);
    showToast("User profile updated!", "success");
    await fetchUsers();
  };

  const handleUserDeleted = async (): Promise<void> => {
    showToast("Processing request...", "info");
    showToast("Account permanently deleted.", "success");
    await fetchUsers();
  }


  /* =========================
     Filter Logic (Nested profile)
  ========================= */

  const filteredUsers = users.filter((user) => {
    const name = user.profile.name.toLowerCase();
    const email = user.email.toLowerCase();
    const query = searchQuery.toLowerCase();

    return name.includes(query) || email.includes(query);
  });

  if (error) return <p className="p-8">{error}</p>;

  return (
    <div className="relative h-auto p-8 lg:p-10 bg-[#fbfcfb]">

      {loading && (
        <div className="fixed inset-0 lg:left-72 z-[999] flex items-center justify-center bg-[#fbfcfb]">
          <p className="text-gray-500 font-semibold">Loading Accounts...</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Accounts
          </h1>
          <p className="text-gray-500 text-sm">
            View and manage all registered users in the system.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white outline-none text-xs font-bold text-slate-700"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-[16px]">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-[12px] ${
                viewMode === "table" ? "bg-white text-[#1cb35a]" : ""
              }`}
            >
              <Table size={16} />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-[12px] ${
                viewMode === "card" ? "bg-white text-[#1cb35a]" : ""
              }`}
            >
              <Grid size={16} />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-[#00923f] text-white px-5 h-11 rounded-[16px] font-bold"
          >
            <UserPlus size={14} />
            Create
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-8 mt-12 rounded-[32px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 overflow-hidden">
        {viewMode === "table" ? (
          <div className="overflow-x-hidden">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] tracking-[0.2em] font-black">
                  <th className="pb-2 px-8 text-left">ID</th>
                  <th className="pb-2 px-6 text-left">User Details</th>
                  <th className="pb-2 px-6 text-left">Role</th>
                  <th className="pb-2 px-6 text-center">Actions</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group transition-all duration-300 hover:translate-x-1">
                    {/* User ID Column */}
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
                        {/* Icon Container */}
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:scale-105 group-hover:bg-green-50 group-hover:border-green-200 transition-all duration-500 shadow-sm">
                            <User2 
                              size={20} 
                              strokeWidth={2.5} 
                              className="text-slate-500 group-hover:text-green-600 transition-colors duration-500" 
                            />
                          </div>
                          
                          {/* Online Status Indicator */}
                          <div className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20 group-hover:opacity-75 transition-opacity" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white" />
                          </div>
                        </div>

                        {/* Text Details */}
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-800 text-[14px] tracking-tight leading-none mb-1 group-hover:text-green-700 transition-colors">
                            {user.profile.name}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-400 font-medium tracking-tight truncate max-w-[180px]">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-5 px-6 transition-all duration-300">
                      <div className="flex items-center">
                        <span
                          className={`
                            inline-flex items-center px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] 
                            transition-all duration-500 cursor-default border backdrop-blur-sm
                            ${
                              user.profile.role === "admin"
                                ? "bg-blue-50/50 text-blue-700 border-blue-100/50 ring-1 ring-blue-500/5 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-blue-400 group-hover:shadow-[0_10px_20px_-10px_rgba(59,130,246,0.5)]"
                                : user.profile.role === "implementor"
                                ? "bg-emerald-50/50 text-emerald-700 border-emerald-100/50 ring-1 ring-emerald-500/5 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-600 group-hover:text-white group-hover:border-emerald-400 group-hover:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)]"
                                : "bg-amber-50/50 text-amber-700 border-amber-100/50 ring-1 ring-amber-500/5 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-600 group-hover:text-white group-hover:border-amber-400 group-hover:shadow-[0_10px_20px_-10px_rgba(245,158,11,0.5)]"
                            }
                          `}
                        >
                          {/* Premium Status Dot */}
                          <div className="relative mr-3 flex items-center justify-center">
                            {/* The "Glow" Layer */}
                            <span
                              className={`absolute w-2.5 h-2.5 rounded-full animate-pulse opacity-60 ${
                                user.profile.role === "admin"
                                  ? "bg-blue-400"
                                  : user.profile.role === "implementor"
                                  ? "bg-emerald-400"
                                  : "bg-amber-400"
                              }`}
                            />
                            {/* The "Core" Layer */}
                            <span
                              className={`relative w-1.5 h-1.5 rounded-full shadow-inner ${
                                user.profile.role === "admin"
                                  ? "bg-blue-500 group-hover:bg-white"
                                  : user.profile.role === "implementor"
                                  ? "bg-emerald-500 group-hover:bg-white"
                                  : "bg-amber-500 group-hover:bg-white"
                              } transition-colors duration-300`}
                            />
                          </div>

                          <span className="relative top-[0.5px]">
                            {user.profile.role}
                          </span>
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

            {filteredUsers.length === 0 && (
              <div className="py-10 text-center text-slate-400">
                No accounts found.
              </div>
            )}
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
                      user.profile.role === "implementor" 
                        ? "bg-emerald-50/50 text-emerald-600 border-emerald-100" 
                        : "bg-amber-50/50 text-amber-600 border-amber-100"
                    }`}>
                      {user.profile.role}
                    </span>
                  </div>

                  {/* User Identity Section */}
                  <div className="flex flex-col items-center text-center mb-10">
                    <div className="relative mb-5">
                      {/* Multi-layered Avatar Container */}
                      <div className="w-20 h-20 rounded-[28px] bg-[#f5f5f7] flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden">
                        <span className="text-xl font-black text-slate-400 group-hover:text-[#1cb35a] transition-colors duration-500 tracking-tighter">
                          {user.profile.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </span>
                      </div>
                      {/* Subtle Reflection Effect */}
                      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none" />
                    </div>

                    <h3 className="font-bold text-[#1d1d1f] text-xl tracking-tight mb-1 group-hover:text-[#1cb35a] transition-colors duration-300">
                      {user.profile.name}
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
      </div>

      {/* Modals */}
      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleUserAdded}
      />
      <EditProfileAdmin
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={selectedUser}
        onSuccess={handleUserUpdated}
      />

      <DeleteAccountConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleUserDeleted}
        userId={selectedUser?.id || null}
        userName={selectedUser?.profile.name || null}
      />
    </div>
  );
};

export default ManageAccount;
