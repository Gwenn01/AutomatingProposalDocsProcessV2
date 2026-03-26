import { useState, useEffect } from "react";
import { setYearConfig, getYearConfig } from "@/api/admin-api";
import type { Proposal, YearConfig } from "./types";
import ProposalsBudgetTable from "./BudgetTabs/ProposalsBudgetTable";
import YearConfigPanel from "./BudgetTabs/YearConfigPannel";

// ── Main BudgetTab ────────────────────────────────────────────────────────────
type Props = {
  proposals: Proposal[];
  selectedYear: number;
};

const BudgetTab = ({ proposals, selectedYear }: Props) => {
  const [config, setConfig] = useState<YearConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Derive used_budget from approved proposals (don't trust API value)
  const usedBudget = proposals.reduce(
    (sum, p) => sum + Number(p.budget_requested ?? 0),
    0,
  );
  // Fetch config whenever year changes
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
        // No config yet for this year — create a blank one
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

  const handleSetBudget = (id: number, val: number) => {
    // Wire to your API: e.g. patchProposalBudget(id, val)
    console.log("Set budget", id, val);
  };

  const handleApproveBudget = (id: number) => {
    // Wire to your API: e.g. approveProposal(id)
    console.log("Approve proposal", id);
  };

  if (loading) {
    return (
      <div className="space-y-6 w-full animate-pulse">
        {/* Placeholder for YearConfigPanel */}
        <div className="h-24 md:h-32 bg-slate-100 rounded-xl border border-slate-200 w-full" />

        {/* Placeholder for ProposalsBudgetTable */}
        <div className="h-[400px] bg-slate-100 rounded-xl border border-slate-200 w-full flex flex-col p-4 space-y-4">
          <div className="h-8 bg-slate-200 rounded-md w-1/3" />
          <div className="h-12 bg-slate-200 rounded-md w-full" />
          <div className="h-12 bg-slate-200 rounded-md w-full" />
          <div className="h-12 bg-slate-200 rounded-md w-full" />
        </div>
      </div>
    );
  }

  return (
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
        onView={(id) => console.log("view", id)}
        onApproveBudget={handleApproveBudget}
        onSetBudget={handleSetBudget}
      />
    </div>
  );
};

export default BudgetTab;
