import type { ProposalReviewResponse } from "@/types/reviewer-types";
import { MessageSquare } from "lucide-react";

export const ReviewedBanner: React.FC<{
  loading: boolean;
  review: ProposalReviewResponse | null;
}> = ({ loading, review }) => {
  if (loading) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 animate-pulse">
        <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-52 rounded bg-gray-200" />
          <div className="h-2.5 w-36 rounded bg-gray-200" />
        </div>
      </div>
    );
  }
 
  if (!review) return null;
 
  const submittedDate = review.created_at
    ? new Date(review.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
 
  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 shadow-sm">
      <MessageSquare size={18} className="text-amber-500 mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-amber-800">
          You have already reviewed this proposal
        </p>
        <p className="text-xs text-amber-600 mt-0.5">
          Submitted {submittedDate} · Decision:{" "}
          <span className="font-semibold capitalize">
            {review.decision?.replace("_", " ")}
          </span>
        </p>
      </div>
    </div>
  );
};