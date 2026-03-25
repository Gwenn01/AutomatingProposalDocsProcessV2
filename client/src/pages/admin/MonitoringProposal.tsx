import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { getProposals } from "@/api/admin-api";

import type {
  Proposal,
  YearConfig,
  ImplementorLock,
  ActiveTab,
} from "@/components/admin/MonitoringProposal/types";
import {
  MOCK_YEAR_CONFIG,
  MOCK_IMPLEMENTORS,
} from "@/components/admin/MonitoringProposal/helper";

import MonitoringHeader from "@/components/admin/MonitoringProposal/MonitoringHeader";
//import MonitoringStats from "@/components/admin/MonitoringProposal/MonitoringStats";
import MonitoringTabs from "@/components/admin/MonitoringProposal/MonitoringTabs";
import ProposalsTab from "@/components/admin/MonitoringProposal/Proposaltabs";
import BudgetTab from "@/components/admin/MonitoringProposal/BudgetTabs";
import AccessTab from "@/components/admin/MonitoringProposal/AccessTabs";

// ─────────────────────────────────────────────────────────────────────────────

const MonitoringProposals = () => {
  const currentYear = new Date().getFullYear();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [yearConfigs, setYearConfigs] =
    useState<Record<number, YearConfig>>(MOCK_YEAR_CONFIG);
  const [implementors, setImplementors] =
    useState<ImplementorLock[]>(MOCK_IMPLEMENTORS);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeTab, setActiveTab] = useState<ActiveTab>("proposals");

  useEffect(() => {
    if (!loading) return;
    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(Math.min(value, 95));
    }, 300);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProposals();
        const augmented: Proposal[] = data.map((p: Proposal, i: number) => ({
          ...p,
          budget_requested:
            (i + 1) * 120_000 + Math.floor(Math.random() * 80_000),
          budget_approved: i % 3 === 0 ? 0 : (i + 1) * 100_000,
        }));
        setProposals(augmented);
      } catch (err) {
        console.error("Failed to fetch proposals", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const config: YearConfig = yearConfigs[selectedYear] ?? {
    year: selectedYear,
    total_budget: 0,
    used_budget: 0,
    is_locked: false,
  };

  const toggleYearLock = () =>
    setYearConfigs((prev) => ({
      ...prev,
      [selectedYear]: {
        ...prev[selectedYear],
        is_locked: !prev[selectedYear].is_locked,
      },
    }));

  const updateBudget = (val: number) =>
    setYearConfigs((prev) => ({
      ...prev,
      [selectedYear]: { ...prev[selectedYear], total_budget: val },
    }));

  const toggleImplementorLock = (id: number) =>
    setImplementors((prev) =>
      prev.map((imp) =>
        imp.user_id === id ? { ...imp, is_locked: !imp.is_locked } : imp,
      ),
    );

  const approveBudgetRequest = (id: number) =>
    setImplementors((prev) =>
      prev.map((imp) =>
        imp.user_id === id
          ? { ...imp, has_pending_budget_request: false }
          : imp,
      ),
    );

  if (loading) {
    return (
      <Loading
        title="Monitoring Proposals"
        subtitle="Tracking proposal workflow and progress..."
        progress={progress}
      />
    );
  }

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen animate-in fade-in duration-500">
      <MonitoringHeader
        selectedYear={selectedYear}
        yearKeys={Object.keys(yearConfigs).map(Number)}
        config={config}
        onYearChange={setSelectedYear}
      />
      {/* <MonitoringStats
        proposals={proposals}
        config={config}
        implementors={implementors}
      /> */}
      <MonitoringTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "proposals" && <ProposalsTab proposals={proposals} />}

      {activeTab === "budget" && (
        <BudgetTab
          config={config}
          proposals={proposals}
          implementors={implementors}
          onToggleLock={toggleYearLock}
          onBudgetChange={updateBudget}
          onApproveRequest={approveBudgetRequest}
        />
      )}

      {activeTab === "access" && (
        <AccessTab
          config={config}
          selectedYear={selectedYear}
          implementors={implementors}
          onToggleGlobalLock={toggleYearLock}
          onToggleImplementor={toggleImplementorLock}
          onApproveBudget={approveBudgetRequest}
        />
      )}
    </div>
  );
};

export default MonitoringProposals;
