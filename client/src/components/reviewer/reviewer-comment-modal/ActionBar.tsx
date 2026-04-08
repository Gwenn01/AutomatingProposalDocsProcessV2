import type { TabType } from "@/types/reviewer-comment-types";
import { Send } from "lucide-react";

export const ActionBar: React.FC<{
  activeTab: TabType;
  isSubmitting: boolean;
  isApproving: boolean;
  hasAnyComment: boolean;
  onSubmit: () => void;
  onApprove: () => void;
  onCancel: () => void;
}> = ({
  activeTab,
  isSubmitting,
  isApproving,
  hasAnyComment,
  onSubmit,
  onApprove,
  onCancel,
}) => {
  const positionClass =
    activeTab === "project" || activeTab === "activity"
      ? "left-1/4 -translate-x-1/4"
      : "left-0";

  return (
    <div className={`fixed z-50 bottom-2 ${positionClass} px-5`}>
      <div className="flex justify-end gap-3 p-3 rounded-2xl bg-gray-100">
        {/* Submit revision */}
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !hasAnyComment}
          title={!hasAnyComment ? "Add at least one comment to submit a revision request" : ""}
          className="px-6 py-2.5 rounded-xl bg-primaryGreen text-white text-xs font-semibold flex items-center gap-2 shadow-sm hover:bg-green-700 hover:shadow-md active:scale-[0.97] transition-all duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Submit Review
            </>
          )}
        </button>

        {/* Approve */}
        <button
          onClick={onApprove}
          disabled={hasAnyComment || isApproving}
          title={hasAnyComment ? "Clear all comments before approving" : ""}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 shadow-sm hover:bg-emerald-700 hover:shadow-md active:scale-[0.97] transition-all duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isApproving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Approving...
            </>
          ) : (
            "Approve"
          )}
        </button>

        {/* Cancel */}
        <button
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 hover:border-gray-400 active:scale-[0.97] transition-all duration-200 shadow-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};