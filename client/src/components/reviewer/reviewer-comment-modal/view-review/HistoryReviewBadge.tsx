import React from "react";
import type { HistoryReviewEntry } from "@/constants/reviewer/mappers";
import { MessageSquare, User } from "lucide-react";

export const HistoryReviewBadge: React.FC<{
  label: string;
  entries: HistoryReviewEntry[];
}> = ({ label, entries }) => {
  if (entries.length === 0) return null;

  return (
    <div className="my-5 mx-1 rounded-lg border border-amber-200/80 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-amber-100 bg-amber-50/70">
        <div className="p-2 rounded-xl bg-amber-100 shadow-sm">
          <MessageSquare className="w-4 h-4 text-amber-700" />
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
            {label}
          </span>
          <span className="text-xs text-amber-600">
            Reviewer Feedback
          </span>
        </div>

        {entries.length > 1 && (
          <span className="ml-auto text-[10px] font-semibold bg-amber-100 text-amber-700 rounded-full px-3 py-0.5">
            {entries.length}
          </span>
        )}
      </div>

      {/* Thread-style comments */}
      <div className="px-4 py-3 space-y-4">
        {entries.map((entry, i) => (
          <div key={i} className="flex gap-3 group">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center ring-2 ring-white shadow-sm">
                <User className="w-4 h-4 text-amber-700" />
              </div>

              {/* Connector line (timeline feel) */}
              {i !== entries.length - 1 && (
                <div className="absolute left-1/2 top-10 -translate-x-1/2 w-px h-full bg-amber-100" />
              )}
            </div>

            {/* Message bubble */}
            <div className="flex-1 min-w-0">
              <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 shadow-sm group-hover:shadow-md transition-all duration-150">
                <p className="text-xs font-semibold text-amber-800 mb-1">
                  {entry.reviewer_name}
                </p>

                <p className="text-sm text-amber-900/90 leading-relaxed whitespace-pre-wrap">
                  {entry.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};