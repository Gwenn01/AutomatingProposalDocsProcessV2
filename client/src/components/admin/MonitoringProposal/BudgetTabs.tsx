import { useState, useEffect } from "react";
import {
  setYearConfig,
  getYearConfig,
  setBudgetProposal,
} from "@/api/admin-api";
import type { Proposal, YearConfig } from "./types";
import ProposalsBudgetTable from "./BudgetTabs/ProposalsBudgetTable";
import YearConfigPanel from "./BudgetTabs/YearConfigPannel";
import DocumentViewerModal from "@/components/implementor/DocumentViewerModal";
import Loading from "@/components/Loading";
import { useProposals } from "@/hooks/useViewProposal";

// ── Main BudgetTab ────────────────────────────────────────────────────────────
type Props = {
  proposals: Proposal[];
  selectedYear: number;
  onRefresh: () => Promise<void>;
};

const BudgetTab = ({ proposals, selectedYear, onRefresh }: Props) => {
  const [config, setConfig] = useState<YearConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Doc viewer state ────────────────────────────────────────────────────
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [selectedProposalData, setSelectedProposalData] = useState<any | null>(
    null,
  );
  const [selectedProposalStatus, setSelectedProposalStatus] = useState("");
  const [selectedProposalTitle, setSelectedProposalTitle] = useState("");

  // ── Hook (same as ManageDocuments) ─────────────────────────────────────
  const { fetchProposalDetail, actionLoading: docViewerLoading } =
    useProposals("Program");

  // ── Modal loading progress overlay ──────────────────────────────────────
  const [modalProgress, setModalProgress] = useState(0);
  useEffect(() => {
    if (!docViewerLoading) {
      setModalProgress(0);
      return;
    }
    setModalProgress(0);
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 15;
      setModalProgress(Math.min(value, 90));
    }, 200);
    return () => clearInterval(interval);
  }, [docViewerLoading]);

  // ── Derive used_budget from proposals ───────────────────────────────────
  const usedBudget = proposals.reduce(
    (sum, p) => sum + Number(p.budget_requested ?? 0),
    0,
  );

  // ── Fetch config whenever year changes ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await getYearConfig(selectedYear);
        if (!cancelled)
          setConfig({
            year: response.year,
            total_budget: response.total_budget,
            used_budget: response.used_budget,
            is_locked: response.is_locked,
          });
      } catch {
        if (!cancelled) {
          setConfig({
            year: selectedYear,
            total_budget: 0,
            used_budget: 0,
            is_locked: false,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => {
      cancelled = true;
    };
  }, [selectedYear]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const updateBudget = async (val: number) => {
    if (!config) return;
    setLoading(true);
    try {
      const updated = await setYearConfig({
        year: config.year,
        total_budget: val,
        used_budget: usedBudget,
        is_locked: config.is_locked,
      });
      setConfig({
        year: updated.year,
        total_budget: updated.total_budget,
        used_budget: updated.used_budget,
        is_locked: updated.is_locked,
      });
    } catch (err) {
      console.error("Failed to update budget", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLock = async () => {
    if (!config) return;
    setLoading(true);
    try {
      const updated = await setYearConfig({
        year: config.year,
        total_budget: config.total_budget,
        used_budget: usedBudget,
        is_locked: !config.is_locked,
      });
      setConfig({
        year: updated.year,
        total_budget: updated.total_budget,
        used_budget: updated.used_budget,
        is_locked: updated.is_locked,
      });
    } catch (err) {
      console.error("Failed to toggle lock", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetBudget = async (id: number, val: number) => {
    try {
      setLoading(true);
      await setBudgetProposal(id, val);
      await onRefresh();
    } catch (err) {
      console.error("Failed to set budget", err);
    } finally {
      setLoading(false);
    }
  };

  // ── openDocViewer: identical to ManageDocuments pattern ─────────────────
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

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6 w-full animate-pulse">
        <div className="h-24 md:h-32 bg-slate-100 rounded-xl border border-slate-200 w-full" />
        <div className="h-[400px] bg-slate-100 rounded-xl border border-slate-200 w-full flex flex-col p-4 space-y-4">
          <div className="h-8 bg-slate-200 rounded-md w-1/3" />
          <div className="h-12 bg-slate-200 rounded-md w-full" />
          <div className="h-12 bg-slate-200 rounded-md w-full" />
          <div className="h-12 bg-slate-200 rounded-md w-full" />
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-6">
        {config && (
          <YearConfigPanel
            config={config}
            usedBudget={usedBudget}
            onToggleLock={toggleLock}
            onBudgetChange={updateBudget}
          />
        )}

        <ProposalsBudgetTable
          proposals={proposals}
          totalBudget={config?.total_budget ?? 0}
          onSetBudget={handleSetBudget}
          onViewDocs={(id) => {
            const found = proposals.find((p) => p.id === id);
            if (found) openDocViewer(found);
          }}
        />

        {/* Modal loading overlay — identical to ManageDocuments */}
        {docViewerLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
            <Loading
              title="Fetching Document"
              subtitle="Loading proposal details, please wait…"
              progress={modalProgress}
            />
          </div>
        )}

        {/* Document Viewer Modal */}
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
      </div>
    </>
  );
};

export default BudgetTab;
