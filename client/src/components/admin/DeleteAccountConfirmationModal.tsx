import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { deleteAdminAccount } from "@/utils/admin-api";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: number | null;
  userName: string | null;
}

const DeleteAccountConfirmationModal = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
  userName,
}: DeleteModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !userId) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await deleteAdminAccount(userId);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 z-10 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full text-red-600">
            <AlertTriangle size={32} />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Account</h2>
        <p className="text-gray-500 text-sm mb-6">
          Are you sure you want to delete <span className="font-bold text-gray-700">{userName}</span>? 
          This action cannot be undone.
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-500 text-xs rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountConfirmationModal;