import { useState, useEffect } from "react";
import { Edit, Trash2, Search, UserPlus, Table, Grid } from "lucide-react";
import EditProfileAdmin from "@/components/admin/EditProfileAdminModal";
import AddAccountModal from "@/components/admin/AddAccountModal";
import { getAllAccounts, type ApiUser } from "@/utils/admin-api";

/* =========================
   Types
========================= */

type ViewMode = "table" | "card";

/* ========================= */

const ManageAccount = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  /* =========================
     Fetch Users
  ========================= */

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


  const handleUserAdded = async (): Promise<void> => {
    await fetchUsers();
  };

  const handleUserUpdated = async (): Promise<void> => {
    await fetchUsers();
  };


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
      {viewMode === "table" ? (
        <div className="bg-white p-8 rounded-[32px] shadow">
          <table className="w-full">
            <thead>
              <tr className="text-slate-400 text-xs uppercase">
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="text-center border-t">
                  <td>{user.id}</td>
                  <td>{user.profile.name}</td>
                  <td>{user.email}</td>
                  <td>{user.profile.role}</td>
                  <td className="flex justify-center gap-2 py-3">
                    <button onClick={() => handleEditClick(user)}>
                      <Edit size={18} />
                    </button>
                    <button>
                      <Trash2 size={18} />
                    </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white p-6 rounded-2xl shadow border"
            >
              <h3 className="font-bold text-lg">
                {user.profile.name}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="mt-2 text-xs uppercase">
                {user.profile.role}
              </p>

              <div className="flex gap-3 mt-4">
                <button onClick={() => handleEditClick(user)}>
                  <Edit size={16} />
                </button>
                <button>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
};

export default ManageAccount;
