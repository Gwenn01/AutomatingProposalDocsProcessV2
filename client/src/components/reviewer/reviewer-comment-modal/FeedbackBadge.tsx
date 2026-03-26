import { MessageSquare } from "lucide-react";
import { FeedbackSkeleton } from "./FeedbackSkeleton";

export const FeedbackBadge: React.FC<{
  label: string;
  value?: string;
  loading?: boolean;
}> = ({ label, value, loading }) => {
  if (loading) return <FeedbackSkeleton />;
 
  const hasComment = value?.trim() !== "";
 
  return (
    <div
      className={[
        "my-4 mx-1 rounded-xl border px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md",
        hasComment
          ? "border-green-200 bg-gradient-to-br from-green-50 to-white"
          : "border-dashed border-gray-200 bg-gray-50",
      ].join(" ")}
    >
      {/* Section label */}
      <h2 className="text-sm font-semibold text-gray-500 mb-3 tracking-wide uppercase">
        Feedback
      </h2>
 
      {/* Icon + field name */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`p-1.5 rounded-lg ${
            hasComment ? "bg-green-100" : "bg-gray-200"
          }`}
        >
          <MessageSquare
            size={16}
            className={hasComment ? "text-green-600" : "text-gray-400"}
          />
        </div>
        <span
          className={`text-sm font-semibold ${
            hasComment ? "text-green-700" : "text-gray-500"
          }`}
        >
          {label}
        </span>
      </div>
 
      {/* Comment body */}
      {hasComment ? (
        <p className="text-sm text-gray-700 leading-relaxed pl-8 text-wrap">
          {value}
        </p>
      ) : (
        <div className="pl-8 flex items-center gap-2">
          <span className="text-gray-300">—</span>
          <p className="text-xs text-gray-400 italic">No comment provided</p>
        </div>
      )}
    </div>
  );
};