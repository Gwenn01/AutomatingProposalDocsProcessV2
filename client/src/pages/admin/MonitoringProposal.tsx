import { useEffect, useMemo, useState, useCallback } from "react";
import Loading from "@/components/Loading";
import { getProposalsBaseType } from "@/api/admin-api";
import { getNotifications } from "@/api/get-notification-api";
import { type Notification } from "@/components/NotificationBell";

import type {
  Proposal,
  ActiveTab,
} from "@/components/admin/MonitoringProposal/types";

import MonitoringHeader from "@/components/admin/MonitoringProposal/MonitoringHeader";
import MonitoringTabs from "@/components/admin/MonitoringProposal/MonitoringTabs";
import ProposalsTab from "@/components/admin/MonitoringProposal/ProposalTabs";
import BudgetTab from "@/components/admin/MonitoringProposal/BudgetTabs";
import { useProposals } from "@/hooks/useViewProposal";

// ─────────────────────────────────────────────────────────────────────────────

const MonitoringProposals = () => {
  const currentYear = new Date().getFullYear();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeTab, setActiveTab] = useState<ActiveTab>("proposals");

  // ── Search ────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");

  // ── View mode ─────────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<"table" | "card">("table");


  const [showNotifications, setShowNotifications] = useState(false);

  const { markNotifRead, notifications, unreadCount } = useProposals();

  // ── Derive unique years from proposals' created_at ────────────────────────
  const yearKeys = useMemo(() => {
    const years = proposals
      .filter((p) => !!p.created_at)
      .map((p) => new Date(p.created_at!).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
  }, [proposals]);

  // Auto-select most recent year if current selection isn't in the list
  useEffect(() => {
    if (yearKeys.length > 0 && !yearKeys.includes(selectedYear)) {
      setSelectedYear(yearKeys[0]);
    }
  }, [yearKeys]);

  // ── Loading progress bar ──────────────────────────────────────────────────
  useEffect(() => {
    if (!loading) return;
    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(Math.min(value, 95));
    }, 300);
    return () => clearInterval(interval);
  }, [loading]);

  // ── Fetch proposals ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProposalsBaseType("Program");
        setProposals(data);
      } catch (err) {
        console.error("Failed to fetch proposals", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshData = async () => {
    try {
      const data = await getProposalsBaseType("Program");
      setProposals(data);
    } catch (err) {
      console.error(err);
    }
  };




  // ── Filter + search proposals for selected year ───────────────────────────
  const proposalsForYear = useMemo(
    () =>
      proposals.filter(
        (p) =>
          p.created_at &&
          new Date(p.created_at).getFullYear() === selectedYear &&
          p.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [proposals, selectedYear, searchQuery],
  );

  // ── Reset search when year or tab changes ─────────────────────────────────
  useEffect(() => {
    setSearchQuery("");
  }, [selectedYear, activeTab]);

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
        yearKeys={yearKeys}
        onYearChange={setSelectedYear}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        notifications={notifications}
        unreadCount={unreadCount}
        showNotifications={showNotifications}
        onToggleNotifications={() => setShowNotifications((prev) => !prev)}
        onCloseNotifications={() => setShowNotifications(false)}
        onReadNotification={markNotifRead}
      />

      <MonitoringTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "proposals" && (
        <ProposalsTab
          proposals={proposalsForYear}
          // viewMode={viewMode}        // ← pass down so tab respects the switch
        />
      )}

      {activeTab === "budget" && (
        <BudgetTab
          proposals={proposalsForYear}
          selectedYear={selectedYear}
          onRefresh={refreshData}
        />
      )}
    </div>
  );
};

export default MonitoringProposals;
