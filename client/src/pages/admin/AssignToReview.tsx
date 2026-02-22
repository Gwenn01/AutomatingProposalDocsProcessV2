import { useState, useEffect } from "react";
import { Search, FileText, Grid, Table } from "lucide-react";
import {
  getProposals,
  getAllReviewerAssignments,
  type ProgramProposal,
} from "@/utils/admin-api";
import { getStatusStyle, type ProposalStatus } from "@/utils/statusStyles";
import AssignModal from "@/components/admin/AssignModal";
import UnassignModal from "@/components/admin/UnassignModal";
import Loading from "@/components/Loading";
import { useToast } from "@/context/toast";

const AssignToReview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allDocs, setAllDocs] = useState<ProgramProposal[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [progress, setProgress] = useState(0);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);
  const [selectedForUnassign, setSelectedForUnassign] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const [assignedMap, setAssignedMap] = useState<Record<number, number>>({});

  // Loading progress animation
  useEffect(() => {
    if (!loading) return;
    setProgress(0);
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 10;
      setProgress(Math.min(value, 95));
    }, 300);
    return () => clearInterval(interval);
  }, [loading]);

  // Fetch proposals
  useEffect(() => {
    const fetchProposalsAndAssignments = async () => {
      try {
        setLoading(true);

        // Fetch all proposals
        const proposals = await getProposals();
        setAllDocs(proposals);

        // Fetch all reviewer assignments
        const assignments = await getAllReviewerAssignments();

        // Map proposal ID → number of assigned reviewers
        const counts: Record<number, number> = {};
        assignments.forEach((a) => {
          counts[a.proposal] = (counts[a.proposal] || 0) + 1;
        });

        setAssignedMap(counts);
      } catch (error) {
        console.error("Failed to fetch proposals or assignments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposalsAndAssignments();
  }, []);

  // Open Assign Modal
  const openAssignModal = (doc: ProgramProposal) => {
    setSelectedProposal({ id: doc.id, title: doc.title });
    setIsModalOpen(true);
  };

  // Update assigned reviewers map after assign/unassign
  const handleUpdateAssignments = async (message?: string) => {
    if (message) showToast(message, "success");
    try {
      const proposals = await getProposals();
      setAllDocs(proposals);

      const assignments = await getAllReviewerAssignments();
      const counts: Record<number, number> = {};
      assignments.forEach((a) => {
        counts[a.proposal] = (counts[a.proposal] || 0) + 1;
      });
      setAssignedMap(counts);
    } catch (error) {
      console.error("Failed to update assignments", error);
      showToast("Failed to update assignments", "error");
    }
  };

  // Filter proposals by search
  const filteredDocs = allDocs.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <Loading
        title="Synchronizing Proposal Data"
        subtitle="Loading proposals and related statistics for you."
        progress={progress}
      />
    );
  }

  return (
    <>
      <div className="p-8 lg:p-10 space-y-10 bg-[#fbfcfb] h-auto animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2 mb-10">
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Assign to Review
            </h1>
            <p className="text-slate-500 text-sm">
              Select a proposal from the registry.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search
                  className="text-slate-400 group-focus-within:text-[#1cb35a] transition-all duration-300"
                  size={16}
                />
              </div>
              <input
                type="text"
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-[#1cb35a]/10 focus:border-[#1cb35a]/30 transition-all outline-none text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* View Switch */}
            <div className="flex items-center bg-slate-100 p-1 rounded-[16px] border border-slate-200/50 shadow-inner w-full md:w-auto justify-center">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-[12px] transition-all duration-300 flex-1 md:flex-none flex items-center justify-center ${
                  viewMode === "table"
                    ? "bg-white text-[#1cb35a] shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Table size={16} />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-[12px] transition-all duration-300 flex-1 md:flex-none flex items-center justify-center ${
                  viewMode === "card"
                    ? "bg-white text-[#1cb35a] shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden relative">
          {filteredDocs.length === 0 ? (
            <div className="py-24 text-center bg-slate-50/50 rounded-[24px] border-2 border-dashed border-slate-100 mt-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                <FileText size={28} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                No matches found in the archive
              </p>
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] tracking-[0.15em] font-bold">
                    <th className="pb-4 px-8 text-left font-bold">
                      Proposal Title
                    </th>
                    <th className="pb-4 px-6 text-center font-bold">Status</th>
                    <th className="pb-4 px-6 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => {
                    const status = getStatusStyle(doc.status as ProposalStatus);
                    const hasReviewer = assignedMap[doc.id] > 0;
                    return (
                      <tr
                        key={doc.id}
                        className="group transition-all duration-500"
                      >
                        <td className="py-6 px-8 bg-white border-y border-l border-slate-50">
                          {doc.title}
                        </td>
                        <td className="py-6 px-6 bg-white border-y border-slate-50 text-center">
                          <span
                            className={`${status.className} px-3 py-1 rounded-full text-xs font-bold`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="py-6 px-6 bg-white border-y border-r border-slate-50 text-center space-x-2">
                          {hasReviewer ? (
                            <>
                              <button
                                onClick={() => openAssignModal(doc)}
                                className="px-3 py-1 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all duration-300"
                              >
                                Assign
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedForUnassign({
                                    id: doc.id,
                                    title: doc.title,
                                  });
                                  setIsUnassignModalOpen(true);
                                }}
                                className="px-3 py-1 text-xs font-bold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300"
                              >
                                Unassign
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => openAssignModal(doc)}
                              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all duration-300"
                            >
                              Assign
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredDocs.map((doc) => {
                const status = getStatusStyle(doc.status as ProposalStatus);
                const hasReviewer = assignedMap[doc.id] > 0;
                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-[38px] p-6 border border-slate-200 shadow-sm"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">{doc.title}</span>
                      <span
                        className={`${status.className} px-2 py-1 rounded-full text-xs font-bold`}
                      >
                        {status.label}
                      </span>
                      {hasReviewer && (
                        <span className="text-xs text-slate-400 mt-1">
                          {assignedMap[doc.id]} Reviewer(s) Assigned
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      {hasReviewer ? (
                        <>
                          <button
                            onClick={() => openAssignModal(doc)}
                            className="flex-1 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all duration-300"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => {
                              setSelectedForUnassign({
                                id: doc.id,
                                title: doc.title,
                              });
                              setIsUnassignModalOpen(true);
                            }}
                            className="flex-1 px-3 py-2 text-xs font-bold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300"
                          >
                            Unassign
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openAssignModal(doc)}
                          className="w-full px-4 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all duration-300"
                        >
                          Assign Reviewer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AssignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedProposal}
        onUpdate={() =>
          handleUpdateAssignments("Reviewer assigned successfully!")
        }
      />

      <UnassignModal
        isOpen={isUnassignModalOpen}
        onClose={() => setIsUnassignModalOpen(false)}
        data={selectedForUnassign}
        onUpdate={() =>
          handleUpdateAssignments("Reviewer unassigned successfully!")
        }
      />
    </>
  );
};

export default AssignToReview;
