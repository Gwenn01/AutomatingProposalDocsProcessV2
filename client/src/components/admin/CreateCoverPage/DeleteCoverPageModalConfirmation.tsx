type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    isLoading?: boolean;
};

const DeleteCoverPageConfirmationModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    Delete Cover Page
                </h2>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this cover page? This action cannot be
                    undone.
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCoverPageConfirmationModal;