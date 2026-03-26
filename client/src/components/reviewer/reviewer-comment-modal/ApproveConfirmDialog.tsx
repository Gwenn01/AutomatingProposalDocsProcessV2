export const ApproveConfirmDialog: React.FC<{
  proposalTitle: string;
  isApproving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ proposalTitle, isApproving, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-xl w-[420px] p-6 shadow-2xl">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Confirm Approval</h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        Do you want to approve the proposal entitled{" "}
        <span className="font-semibold text-gray-800">"{proposalTitle}"</span>?
      </p>
      <p className="text-sm text-red-500 mt-2">
        Are you sure there are no comments to add?
      </p>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isApproving}
          className="px-6 py-2 bg-primaryGreen text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          {isApproving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Approving...
            </>
          ) : (
            "Yes, Approve"
          )}
        </button>
      </div>
    </div>
  </div>
);