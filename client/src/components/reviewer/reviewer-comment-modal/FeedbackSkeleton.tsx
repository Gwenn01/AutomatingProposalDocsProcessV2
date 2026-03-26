
export const FeedbackSkeleton: React.FC = () => (
  <div className="my-2 mx-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center gap-3">
    <div className="w-5 h-5 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500">
        Loading feedback...
      </span>
      <span className="text-xs text-gray-400">
        Please wait while comments are being fetched
      </span>
    </div>
  </div>
);