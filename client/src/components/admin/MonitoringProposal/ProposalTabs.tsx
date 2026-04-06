import { useState, useEffect } from "react";
import { Filter, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import type { Proposal, StatusFilter } from "./types";
import ProposalRow from "./ProposalTabs/ProposalRow";
import DocumentViewerModal from "@/components/implementor/DocumentViewerModal";
import Loading from "@/components/Loading";
import { useProposals } from "@/hooks/useViewProposal";

type Props = { proposals: Proposal[] };

const ITEMS_PER_PAGE = 8;

const ProposalsTab = ({ proposals }: Props) => {
  const [statusFilter, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  // state for the proposal viewer modal
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [selectedProposalData, setSelectedProposalData] = useState<any | null>(
    null,
  );
  const [selectedProposalStatus, setSelectedProposalStatus] = useState("");
  const [selectedProposalTitle, setSelectedProposalTitle] = useState("");

  // hook for the proposal viewer modal (same as in BudgetTab)
  const { fetchProposalDetail, actionLoading: docViewerLoading } =
    useProposals("Program");

  // loading animation
  const [modalProgress, setModalProgress] = useState(0);

  useEffect(() => {
    if (!docViewerLoading) {
      setModalProgress(0);
      return;
    }
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 15;
      setModalProgress(Math.min(value, 90));
    }, 200);
    return () => clearInterval(interval);
  }, [docViewerLoading]);
  // Reset page when filter or incoming proposals change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, proposals]);

  const filtered = proposals.filter(
    (p) => statusFilter === "all" || p.status === statusFilter,
  );
  // helper function to sort proposals by date
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filtered.length);
  const currentData = filtered.slice(startIndex, endIndex);

  // viewer function
  const openDocViewer = async (proposal: Proposal) => {
    const detail = await fetchProposalDetail({
      proposal_id: proposal.id,
      child_id: proposal.child_id ?? 0,
      reviewer_count: proposal.reviewer_count ?? 0,
      reviewed_count: 0,
      review_progress: "",
      title: proposal.title,
      file_path: "",
      status: proposal.status,
      submitted_at: null,
      reviews: 0,
    });

    if (detail) {
      setSelectedProposalData(detail);
      setSelectedProposalStatus(proposal.status);
      setSelectedProposalTitle(proposal.title);
      setIsDocViewerOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status filter — search is now in the header */}
      <div className="flex items-center justify-end gap-2">
        <Filter size={13} className="text-slate-400" />
        <select
          value={statusFilter}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="for_revision">For Revision</option>
          <option value="for_approval">For Approval</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Proposal", "Type", "Status", "Progress", "Action"].map(
                (h, i) => (
                  <th
                    key={h}
                    className={`p-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 ${
                      i === 0
                        ? "text-left"
                        : i === 4
                          ? "text-right"
                          : "text-center"
                    }`}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((doc) => (
              <ProposalRow
                key={doc.id}
                doc={doc}
                onView={() => openDocViewer(doc)}
              />
            ))}
          </tbody>
        </table>

        {/* Modal loading */}
        {docViewerLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <Loading
              title="Fetching Document"
              subtitle="Loading proposal details, please wait…"
              progress={modalProgress}
            />
          </div>
        )}

        {/* Document Viewer */}
        <DocumentViewerModal
          isOpen={isDocViewerOpen}
          onClose={() => {
            setIsDocViewerOpen(false);
            setSelectedProposalData(null);
          }}
          proposalData={selectedProposalData}
          proposalStatus={selectedProposalStatus}
          proposalTitle={selectedProposalTitle}
        />

        {currentData.length === 0 && (
          <div className="p-16 text-center">
            <FileText size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              No proposals found
            </p>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/60">
          <p className="text-xs text-slate-500">
            <strong className="text-slate-700">
              {filtered.length > 0 ? startIndex + 1 : 0}
            </strong>
            –<strong className="text-slate-700">{endIndex}</strong> of{" "}
            <strong className="text-slate-700">{filtered.length}</strong>{" "}
            proposals
          </p>

          <p className="text-xs text-slate-500">
            Page{" "}
            <strong className="text-slate-700">
              {totalPages > 0 ? page : 0}
            </strong>{" "}
            of <strong className="text-slate-700">{totalPages}</strong>
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || totalPages === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold transition-all"
            >
              <ChevronLeft size={13} /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-xs font-semibold transition-all"
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalsTab;
