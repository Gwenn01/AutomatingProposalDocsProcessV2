import React, { useEffect, useState } from "react";
import { X, User } from "lucide-react";
import axios from "axios";

const SkeletonRow = () => (
  <div className="flex items-center justify-between p-4 border rounded-xl animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="space-y-2">
        <div className="h-3 w-32 bg-gray-200 rounded" />
        <div className="h-2 w-40 bg-gray-100 rounded" />
      </div>
    </div>
    <div className="h-6 w-20 bg-gray-200 rounded-full" />
  </div>
);

const ReviewerList = ({ isOpen, onClose, proposalId, user_id }) => {
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !proposalId) return;

    const fetchReviewers = async () => {
      try {
        setLoading(true);

        const res = await axios.post(
          "http://127.0.0.1:5000/api/get-reviewer-per-docs",
          { proposal_id: proposalId, user_id },
          { headers: { "Content-Type": "application/json" } },
        );
        console.log(res.data);
        setReviewers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch reviewers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewers();
  }, [isOpen, proposalId, user_id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-md flex items-center justify-center px-8 py-4">
      <div className="relative w-full max-w-md rounded-md bg-white/90 backdrop-blur-xl shadow-2xl animate-pop-out">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              List of other Reviewers
            </h2>
            <p className="text-xs text-gray-500">
              People evaluating this proposal
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 flex items-center justify-center rounded-full hover:bg-gray-100 transition gap-2"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : reviewers.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No reviewers assigned
            </div>
          ) : (
            reviewers.map((rev) => {
              const initials = rev.fullname
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={rev.user_id}
                  className="group flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">
                      {initials || <User size={16} />}
                    </div>

                    {/* Info */}
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                        {rev.fullname}
                      </p>
                      <p className="text-xs text-gray-500">{rev.email}</p>
                    </div>
                  </div>

                  {/* Badge */}
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    Reviewer
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {/* <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-sm transition"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ReviewerList;
