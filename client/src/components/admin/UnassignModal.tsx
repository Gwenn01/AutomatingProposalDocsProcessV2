import { useState, useEffect } from "react";
import ReactDom from "react-dom";
import { X, Search, Loader2, Trash2 } from "lucide-react";
import {
  getAssignedReviewers,
  unassignReviewer,
  type ReviewerAssignment,
} from "@/utils/admin-api";

interface UnassignModalPropos {
  isOpen: boolean;
  onClose: () => void;
  data: { id: number; title: string } | null;
  onUpdate: () => void;
}

const UnassignModal: React.FC<UnassignModalPropos> = ({
  isOpen,
  onClose,
  data,
  onUpdate,
}) => {
  const [assignedReviewers, setAssignedReviewers] = useState<
    ReviewerAssignment[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingId, setIsSubmittingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isOpen || !data) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // ✅ pass proposal id
        const assignments = await getAssignedReviewers(data.id);

        // backend already filters by proposal
        setAssignedReviewers(assignments);
      } catch (error) {
        console.error("Failed to load assigned reviewers", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, data]);

  // Optional cleanup when closing modal
  useEffect(() => {
    if (!isOpen) {
      setAssignedReviewers([]);
      setSearchQuery("");
      setIsSubmittingId(null);
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const handleUnassign = async (assignmentId: number) => {
    setIsSubmittingId(assignmentId);

    try {
      await unassignReviewer(assignmentId);
      setAssignedReviewers((prev) => prev.filter((a) => a.id !== assignmentId));
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error(error.message || "Failed to unassign reviewer");
    } finally {
      setIsSubmittingId(null);
    }
  };

  const filteredAssignments = assignedReviewers.filter(
    (a) =>
      a.reviewer &&
      a.reviewer.profile &&
      a.reviewer.profile.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return ReactDom.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-[480px] rounded-[32px] shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Unassign Reviewer</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-600">{data.title}</p>
        </div>

        <div className="relative mb-6">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search reviewer by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-2xl outline-none"
          />
        </div>

        <div className="max-h-[220px] overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin" />
            </div>
          ) : filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="w-full flex items-center justify-between p-4 rounded-2xl border bg-white border-slate-200"
              >
                <div className="text-left">
                  <p className="font-semibold text-sm">
                    {assignment.reviewer?.profile?.name || "Unknown Reviewer"}
                  </p>

                  <p className="text-xs text-slate-400">
                    {assignment.reviewer?.profile?.department ||
                      "No Department"}
                  </p>

                  <p className="text-xs text-slate-300 mt-1">
                    Assigned at:{" "}
                    {new Date(assignment.assigned_at).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => handleUnassign(assignment.id)}
                  disabled={isSubmittingId === assignment.id}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {isSubmittingId === assignment.id
                    ? "Removing..."
                    : "Unassign"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-400 py-6">
              No reviewers assigned.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default UnassignModal;
