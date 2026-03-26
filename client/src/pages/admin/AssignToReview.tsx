import { useState, useEffect } from "react";
import { Search, Table, Grid, FileText } from "lucide-react";
import { getProposals, getAllReviewerAssignments, type ProgramProposal } from "@/api/admin-api";
import { useToast } from "@/context/toast";
import Loading from "@/components/Loading";
import AssignModal from "@/components/admin/AssignModal";
import UnassignModal from "@/components/admin/UnassignModal";

// ── Sub-components ─────────────────────────────────
import ProposalTableView from "@/components/admin/AssignToReview/ProposalTableView";
import ProposalCardView from "@/components/admin/AssignToReview/ProposalCardView";
import EmptyState from "@/components/admin/EmptyState";
import AdminPagination from "@/components/admin/Pagination";

const AssignToReview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allDocs, setAllDocs] = useState<ProgramProposal[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefetching, setIsRefetching] = useState(false);
  const { showToast } = useToast();
  const itemsPerPage = viewMode === "table" ? 10 : 12;

  // ── Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<{ id: number; title: string } | null>(null);
  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);
  const [selectedForUnassign, setSelectedForUnassign] = useState<{ id: number; title: string } | null>(null);

  // ── Assigned reviewer map
  const [assignedMap, setAssignedMap] = useState<Record<number, number>>({});

  // ── Page loading animation
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

  // ── Fetch proposals and reviewer assignments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const proposals = await getProposals();
        setAllDocs(proposals);

        const assignments = await getAllReviewerAssignments();
        const counts: Record<number, number> = {};
        assignments.forEach(a => {
          counts[a.proposal] = (counts[a.proposal] || 0) + 1;
        });
        setAssignedMap(counts);
      } catch (error) {
        console.error("Failed to fetch proposals or assignments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Reset page on search / view change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, viewMode]);

  // ── Filter and paginate
  const filteredDocs = allDocs.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredDocs.slice(startIndex, endIndex);

  const openAssignModal = (doc: ProgramProposal) => {
    setSelectedProposal({ id: doc.id, title: doc.title });
    setIsAssignModalOpen(true);
  };

  const openUnassignModal = (doc: ProgramProposal) => {
    setSelectedForUnassign({ id: doc.id, title: doc.title });
    setIsUnassignModalOpen(true);
  };

  const handleAssignUpdate = async () => {
    showToast("Reviewer assigned successfully!", "success");
    setIsRefetching(true);
    const [proposals, assignments] = await Promise.all([
      getProposals(),
      getAllReviewerAssignments(),
    ])
    setAllDocs(proposals);
    const counts: Record<number, number> = {};
    assignments.forEach(a => {
      counts[a.proposal] = (counts[a.proposal] || 0) + 1;
    });
    setAssignedMap(counts);
    setIsRefetching(false);
  };

  const handleUnassignUpdate = async () => {
    showToast("Reviewer unassigned successfully!", "success");
    setIsRefetching(true);
    const [proposals, assignments] = await Promise.all([
      getProposals(),
      getAllReviewerAssignments(),
    ])
    setAllDocs(proposals);
    const counts: Record<number, number> = {};
    assignments.forEach(a => {
      counts[a.proposal] = (counts[a.proposal] || 0) + 1;
    });
    setAssignedMap(counts);
    setIsRefetching(false);
  }

  if (loading) {
    return (
      <Loading
        title="Synchronizing Proposal Data"
        subtitle="Loading proposals and reviewer assignments."
        progress={progress}
      />
    );
  }

  return (
    <div className="p-8 lg:p-10 bg-[#fbfcfb] min-h-screen flex flex-col animate-in fade-in duration-500">

      {/* Header + Search + View */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Assign to Review
          </h1>
          <p className="text-slate-500 text-sm">Select a proposal from the registry.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none text-[13px] font-semibold"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-[16px] border border-slate-200">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-[12px] ${viewMode === "table" ? "bg-white text-[#1cb35a] shadow-sm" : "text-slate-400"}`}
            >
              <Table size={16} />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-[12px] ${viewMode === "card" ? "bg-white text-[#1cb35a] shadow-sm" : "text-slate-400"}`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {currentData.length === 0 ? (
          <EmptyState icon={FileText} message="No proposals to be assigned" />
        ) : viewMode === "table" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ProposalTableView
              data={currentData}
              assignedMap={assignedMap}
              onOpenAssign={openAssignModal}
              onOpenUnassign={openUnassignModal}
              isRefetching={isRefetching}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <ProposalCardView
              data={currentData}
              assignedMap={assignedMap}
              onOpenAssign={openAssignModal}
              onOpenUnassign={openUnassignModal}
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-auto pt-6">
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredDocs.length}
          itemsPerPage={itemsPerPage}
          onPrev={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          onNext={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          onPageChange={page => setCurrentPage(page)}
          itemName="proposals"
        />
      </div>

      {/* Modals */}
      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        data={selectedProposal}
        onUpdate={handleAssignUpdate}
      />
      <UnassignModal
        isOpen={isUnassignModalOpen}
        onClose={() => setIsUnassignModalOpen(false)}
        data={selectedForUnassign}
        onUpdate={handleUnassignUpdate}
      />
    </div>
  );
};

export default AssignToReview;