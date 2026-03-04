import React from "react";

interface PreviousCommentProps {
  comment: string;
  reviewerName?: string;
}

const PreviousComment: React.FC<PreviousCommentProps> = ({ comment, reviewerName }) => {
  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      {/* Avatar */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold shrink-0">
        {reviewerName?.charAt(0) ?? "R"}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">
            {reviewerName ?? "Reviewer"}
          </p>
          <span className="text-xs text-gray-400">Reviewer</span>
        </div>
        <p className="mt-1 text-sm text-gray-600 leading-relaxed">
          {comment}
        </p>
      </div>
    </div>
  );
};

export default PreviousComment;