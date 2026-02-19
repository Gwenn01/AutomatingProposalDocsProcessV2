import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, Search, Check, User, Loader2, ChevronRight } from "lucide-react";
import { getAllReviewers, getAssignedReviewers, assignReviewer, type ApiUser, type ReviewerAssignment } from "@/utils/admin-api";

interface AssignModalProps {
    isOpen: boolean,
    onClose: () => void;
    data: { id: number; title: string; } | null;
    onUpdate: (proposalId: number) => void;  
}

const AssignModal: React.FC<AssignModalProps> = ({ isOpen, onClose, data, onUpdate }) => {
    const [assignSearch, setAssignSearch] = useState("");
    const [reviewers, setReviewers] = useState<ApiUser[]>([]);
    const [assigned, setAssigned] = useState<ReviewerAssignment[]>([]);
    const [selectedReviewers, setSelectedReviewers] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingReviewers, setIsLoadingReviewers] = useState(true);

    useEffect(() => {
        if (!isOpen || !data) return;

        const fetchData = async () => {
            setIsLoadingReviewers(true);

            try {
                const [reviewerList, assignments] = await Promise.all([
                    getAllReviewers(),
                    getAssignedReviewers(),
                ])

                setReviewers(reviewerList)
                setAssigned(assignments)

                const alreadyAssigned = assignments 
                    .filter((a) => a.proposal === data.id) 
                    .map((a) => a.reviewer);

                setSelectedReviewers(alreadyAssigned)
            } catch (error) {
                console.error("Failed to load reviewers");
            } finally {
                setIsLoadingReviewers(false);
            }
        };

        fetchData();
    }, [isOpen, data])

    if (!isOpen || !data) return null;

    const toggleReviewer = (id: number) => {
        setSelectedReviewers((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleConfirm = async () => {
        if (!data) return;
        setIsSubmitting(true);
        try {
            const currentAssigned = assigned
                .filter((a) => a.proposal === data.id)
                .map((a) => a.reviewer);

            const newSelections = selectedReviewers.filter(
                (id) => !currentAssigned.includes(id)
            );

            if (newSelections.length === 0) {
                setIsSubmitting(false);
                return;
            }

            for (const reviewerId of newSelections) {
                await assignReviewer({ proposal: data.id, reviewer: reviewerId });
            }

            onUpdate(data.id);
            onClose();
        } catch (error) {
            console.error("Assignment failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredReviewers = reviewers.filter((reviewer) =>
        reviewer.profile.name
            .toLowerCase()
            .includes(assignSearch.toLowerCase())
    )

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">

      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-[480px] rounded-[32px] shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Assign Reviewer</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-600">
            {data.title}
          </p>
        </div>

        <div className="relative mb-6">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search reviewer..."
            value={assignSearch}
            onChange={(e) => setAssignSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-2xl outline-none"
          />
        </div>

        <div className="max-h-[200px] overflow-y-auto space-y-3">
          {isLoadingReviewers ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin" />
            </div>
          ) : filteredReviewers.length > 0 ? (
            filteredReviewers.map((reviewer) => {
              const isSelected = selectedReviewers.includes(reviewer.id);

              return (
                <button
                  key={reviewer.id}
                  onClick={() => toggleReviewer(reviewer.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-500"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User size={20} />
                    <div className="text-left">
                      <p className="font-semibold text-sm">
                        {reviewer.profile.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {reviewer.profile.department}
                      </p>
                    </div>
                  </div>

                  {isSelected && <Check size={16} />}
                </button>
              );
            })
          ) : (
            <p className="text-center text-slate-400 py-6">
              No reviewers found.
            </p>
          )}
        </div>

        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="mt-6 w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Assigning...
            </>
          ) : (
            <>
              Confirm Assignment
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>,
    document.body
    )
}

export default AssignModal;