import { useState, useEffect } from "react";
import { Search, Table, Grid, UserPlus, User2 } from "lucide-react";
import { getAllAccounts, type ApiUser } from "@/api/admin-api";
import { useToast } from "@/context/toast";
import Loading from "@/components/Loading";

// Components
import AccountsTableView from "@/components/admin/ManageAccounts/AccountsTableView";
import AccountsCardView from "@/components/admin/ManageAccounts/AccountsCardView";
import AdminPagination from "@/components/admin/Pagination";
import EmptyState from "@/components/admin/EmptyState";

// Modals
import EditProfileAdmin from "@/components/admin/EditProfileAdminModal";
import AddAccountModal from "@/components/admin/AddAccountModal";
import DeleteAccountConfirmationModal from "@/components/admin/DeleteAccountConfirmationModal";

const ManageAccounts = () => {
  const { showToast } = useToast();

  // ── State ─────────────────────────────────────────────
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "table" ? 5 : 6;

  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ── Loading animation ─────────────────────────────────
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

  // ── Fetch users ───────────────────────────────────────
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllAccounts();
      setUsers(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ── Reset page on filter/view change ──────────────────
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, viewMode]);

  // ── Handlers ─────────────────────────────────────────
  const handleEditClick = (user: ApiUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user: ApiUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleUserAdded = async () => {
    showToast("Creating account...", "info");
    setIsAddModalOpen(false);
    showToast("New account created!", "success");
    await fetchUsers();
  };

  const handleUserUpdated = async () => {
    showToast("Updating profile...", "info");
    setIsEditModalOpen(false);
    showToast("User updated!", "success");
    await fetchUsers();
  };

  const handleUserDeleted = async () => {
    showToast("Deleting account...", "info");
    showToast("Account deleted.", "success");
    await fetchUsers();
  };

  // ── Derived Data ─────────────────────────────────────
  const filteredUsers = users.filter((user) => {
    const name = user.profile.name.toLowerCase();
    const email = user.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredUsers.slice(startIndex, endIndex);

  // ── Loading State ────────────────────────────────────
  if (loading) {
    return (
      <Loading
        title="Loading Accounts"
        subtitle="Fetching registered users..."
        progress={progress}
      />
    );
  }

  // ── UI ──────────────────────────────────────────────
  return (
    <>
      <div className="p-8 lg:p-10 bg-[#fbfcfb] min-h-screen flex flex-col animate-in fade-in duration-500">

        {/* Main Wrapper */}
        <div className="flex-1 flex flex-col space-y-10">

          {/* Header */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2">

            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Manage Accounts
              </h1>
              <p className="text-slate-500 text-sm">
                View and manage all registered users.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">

              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none text-[13px] font-semibold"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-[16px] border border-slate-200">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-[12px] ${viewMode === "table"
                    ? "bg-white text-[#1cb35a] shadow-sm"
                    : "text-slate-400"
                    }`}
                >
                  <Table size={16} />
                </button>

                <button
                  onClick={() => setViewMode("card")}
                  className={`p-2 rounded-[12px] ${viewMode === "card"
                    ? "bg-white text-[#1cb35a] shadow-sm"
                    : "text-slate-400"
                    }`}
                >
                  <Grid size={16} />
                </button>
              </div>

              {/* Create Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-[#00923f] text-white px-5 h-11 rounded-[16px] font-semibold shadow-sm hover:bg-[#007a35] transition"
              >
                <UserPlus size={14} />
                Create
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {currentData.length === 0 ? (
              <EmptyState icon={User2} message="No accounts found" />
            ) : viewMode === "table" ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <AccountsTableView
                  data={currentData}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AccountsCardView
                  data={currentData}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-auto pt-6">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            onPageChange={(page) => setCurrentPage(page)}
            itemName="accounts"
          />
        </div>
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
    </>
  );
};

export default ManageAccounts;