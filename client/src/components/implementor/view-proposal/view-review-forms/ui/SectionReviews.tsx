import type { Comments } from "../../view-reviewed-document";
import { Clock, MessageSquare, User } from "lucide-react";

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
}> = ({ reviews, showCommentInputs, sectionName, hasAnyReviewAcrossSections }) => {
  if (reviews.length === 0 && !showCommentInputs) return null;

  return (
    <div className="my-5 mx-1 rounded-md border border-gray-200/80 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-200">
        <div className="p-2 rounded-xl bg-gray-100 shadow-sm">
          <MessageSquare className="w-4 h-4 text-gray-700" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            {sectionName}
          </span>
          <span className="text-xs text-gray-600">Reviewer Feedback</span>
        </div>
        {reviews.length > 1 && (
          <span className="ml-auto text-sm font-serif bg-white text-gray-700 rounded-full px-3 py-0.5">
            {reviews.length}
          </span>
        )}
      </div>

      {/* Thread-style comments */}
      {reviews.length > 0 && (
        <div className="px-4 py-3 space-y-4">
          {reviews.map((r, i) => {
            // null  → reviewer hasn't submitted yet → "Not reviewed yet"
            // ""    → reviewer submitted but left no comment → "No comment provided"
            // text  → actual comment
            const isNotReviewed = r.comment === null || r.comment === undefined;
            const hasNoComment  = !isNotReviewed && r.comment.trim() === "";
            const commentText   = !isNotReviewed && !hasNoComment ? r.comment.trim() : null;

            return (
              <div key={`${r.reviewer_name}-${i}`} className="flex gap-3 group">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center ring-2 ring-white shadow-sm">
                    <User className="w-4 h-4 text-gray-700" />
                  </div>
                  {i !== reviews.length - 1 && (
                    <div className="absolute left-1/2 top-10 -translate-x-1/2 w-px h-full bg-gray-100" />
                  )}
                </div>

                {/* Message bubble */}
                <div className="flex-1 min-w-0">
                  <div className="rounded-xl bg-gray-100 border border-gray-100 px-4 py-3 shadow-sm group-hover:shadow-md transition-all duration-150">
                    <p className="text-xs font-semibold text-gray-800 mb-1">
                      {r.reviewer_name ?? "Reviewer"}
                    </p>
                    {commentText ? (
                      <p className="text-sm text-gray-700/90 leading-relaxed whitespace-pre-wrap">
                        {commentText}
                      </p>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        {isNotReviewed
                          ? <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          : <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                            </svg>
                        }
                        <p className="text-sm text-gray-700">
                          {isNotReviewed ? "Not reviewed yet." : "No comment provided."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state — no reviewer entries at all */}
      {showCommentInputs && reviews.length === 0 && (
        <div className="px-4 py-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-white shadow-sm">
              {hasAnyReviewAcrossSections
                ? <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                  </svg>
                : <Clock className="w-4 h-4 text-gray-700" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold text-gray-800 mb-1">
                  {hasAnyReviewAcrossSections ? "No Comment Provided" : "Not Reviewed Yet"}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {hasAnyReviewAcrossSections
                    ? "The reviewer did not leave a comment for this section."
                    : "This proposal is still pending review."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};