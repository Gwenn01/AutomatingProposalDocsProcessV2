import React, { useEffect, useState, useMemo } from "react";
import { X, User, CheckCircle2, Clock } from "lucide-react";
import axios from "axios";

const SkeletonRow = () => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="h-3 w-40 bg-gray-200 rounded" />
    </div>
    <div className="h-6 w-24 bg-gray-200 rounded-full" />
  </div>
);

const ReviewerListStatus = ({ isOpen, onClose, proposalId }) => {
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !proposalId) return;

    const fetchReviewerStatus = async () => {
      try {
        setLoading(true);

        const res = await axios.post(
          "http://127.0.0.1:5000/api/get-assigned-reviewers",
          { proposal_id: proposalId }
        );

        setReviewers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch reviewer status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewerStatus();
  }, [isOpen, proposalId]);

  const reviewedCount = useMemo(
    () => reviewers.filter(r => r.is_reviewed === 1).length,
    [reviewers]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-md flex items-center justify-center px-6">
      <div className="relative w-full max-w-lg rounded-2xl bg-white/95 shadow-2xl animate-pop-out">

        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Review Progress
            </h2>
            <p className="text-sm text-gray-500">
              {reviewedCount} of {reviewers.length} reviewers completed
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        {!loading && reviewers.length > 0 && (
          <div className="px-6 pt-4">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-500"
                style={{
                  width: `${(reviewedCount / reviewers.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : reviewers.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No reviewers assigned to this proposal
            </div>
          ) : (
            reviewers.map((rev, idx) => {
              const initials = rev.fullname
                ?.split(" ")
                .map(n => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              const reviewed = rev.is_reviewed === 1;

              return (
                <div
                  key={idx}
                  className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-white
                        ${
                          reviewed
                            ? "bg-gradient-to-br from-green-500 to-emerald-600"
                            : "bg-gradient-to-br from-gray-400 to-gray-500"
                        }`}
                    >
                      {initials || <User size={16} />}
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">
                        {rev.fullname}
                      </p>
                      <p className="text-xs text-gray-500">
                        Reviewer
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        reviewed
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                  >
                    {reviewed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Reviewed
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                      </>
                    )}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewerListStatus;
