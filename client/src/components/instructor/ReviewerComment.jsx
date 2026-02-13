import React from "react";
import { MessageSquare, User } from "lucide-react"; // Optional icons

const ReviewerComment = ({
  title = "Reviewer’s Comment",
  comment = "",
  reviewerName = "Reviewer",
  date = "Just now", // Added for a more modern feel
}) => {
  const hasComment = comment && comment.trim().length > 0;

  return (
    <div className="w-full mt-8">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-green-600" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
          {title}
        </h2>
      </div>

      {/* Main Card */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Subtle Accent Bar */}
        <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />

        <div className="p-6">
          {/* Comment Content */}
          <div className="relative">
            <p
              className={`text-base leading-relaxed ${
                hasComment ? "text-slate-700" : "text-slate-400 italic"
              }`}
            >
              {hasComment ? comment : "No specific feedback provided for this section."}
            </p>
          </div>

          {/* Footer / Attribution */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar Placeholder */}
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                <User size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-none">
                  {reviewerName}
                </p>
              </div>
            </div>
            
            {/* Status Badge (Optional) */}
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-slate-800">
              Verified Reviewer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerComment;