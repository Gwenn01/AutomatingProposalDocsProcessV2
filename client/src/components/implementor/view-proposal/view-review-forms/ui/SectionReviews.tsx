import PreviousComment from "@/components/reviewer/PreviousComment";
import type { Comments } from "../../view-reviewed-document";
import { Clock } from "lucide-react";

export const validReviews = (reviews: any): any[] => {
  if (!Array.isArray(reviews)) return [];
  return reviews;
};

export const SectionReviews: React.FC<{
  reviews: any[];
  showCommentInputs: boolean;
  sectionName: string;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  hasAnyReviewAcrossSections: boolean;
}> = ({ reviews, showCommentInputs, hasAnyReviewAcrossSections }) => (
  <>
    {reviews.map((r, i) => (
      <PreviousComment
        key={`${r.reviewer_name}-${i}`}
        comment={r.comment?.trim() || "No Comment Provided"}
        reviewerName={r.reviewer_name ?? "Reviewer"}
      />
    ))}

    {showCommentInputs && reviews.length === 0 && (
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm">
        {hasAnyReviewAcrossSections ? (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">No Comment Provided</p>
              <p className="text-xs text-gray-500">The reviewer did not leave a comment for this section.</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Not Reviewed Yet</p>
              <p className="text-xs text-gray-500">This proposal is still pending review.</p>
            </div>
          </>
        )}
      </div>
    )}
  </>
);