import { useEffect, useState } from "react";
import { getUsersOverview, getProposalsOverview } from "@/api/admin-api";
import Loading from "@/components/Loading";
import OverviewHeader from "@/components/admin/Overview/OverviewHeader";
import KpiTopRow from "@/components/admin/Overview/KpiTopRow";
import KpiBottomRow from "@/components/admin/Overview/KpiBottomRow";
import UsersPieChart from "@/components/admin/Overview/UserPieChart";
import ProposalBarChart from "@/components/admin/Overview/ProposalBarChart";
import StatusBarChart from "@/components/admin/Overview/StatusBarChart";
import WorkflowBreakdown from "@/components/admin/Overview/WorkflowBreakdown";

const AdminOverview = () => {
  const [users, setUsers] = useState<any>(null);
  const [proposals, setProposals] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Progress bar animation while loading
  useEffect(() => {
    let intervalId: number;
    if (loading) {
      setProgress(0);
      let value = 0;
      intervalId = window.setInterval(() => {
        value += 5;
        if (value >= 95) value = 95;
        setProgress(value);
      }, 200);
    }
    return () => window.clearInterval(intervalId);
  }, [loading]);

  // Fetch data
  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const [usersData, proposalsData] = await Promise.all([
          getUsersOverview(),
          getProposalsOverview(),
        ]);
        setUsers(usersData);
        setProposals(proposalsData);
        setProgress(100);
        setTimeout(() => setLoading(false), 200);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch overview data");
        setUsers([]);
        setProposals([]);
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <Loading
        title="Loading System Analytics"
        subtitle="System performance at a glance."
        progress={progress}
      />
    );
  }

  if (error) return <p className="p-8">{error}</p>;

  // ── Derived values ──────────────────────────────────────────────
  const totalUsers = users.total_user;
  const totalProposals = proposals.proposal.total_proposals;
  const totalProgram = proposals.proposal.total_program;
  const totalProject = proposals.proposal.total_project;
  const totalActivity = proposals.proposal.total_activity;

  const approvalRate =
    totalProposals > 0
      ? Math.round((proposals.status.total_approved / totalProposals) * 100)
      : 0;

  const pendingTotal =
    proposals.status.total_under_review +
    proposals.status.total_for_review +
    proposals.status.total_for_revision +
    proposals.status.total_for_approval;

  const statusBarData = [
    { key: "under_review", value: proposals.status.total_under_review },
    { key: "for_review", value: proposals.status.total_for_review },
    { key: "for_revision", value: proposals.status.total_for_revision },
    { key: "for_approval", value: proposals.status.total_for_approval },
    { key: "approved", value: proposals.status.total_approved },
    { key: "rejected", value: proposals.status.total_rejected },
  ];

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="relative h-auto bg-slate-50 p-8 lg:p-12 space-y-16">
      <OverviewHeader />

      <KpiTopRow
        totalUsers={totalUsers}
        totalProposals={totalProposals}
        approvalRate={approvalRate}
        pendingTotal={pendingTotal}
      />

      <KpiBottomRow
        totalProgram={totalProgram}
        totalProject={totalProject}
        totalActivity={totalActivity}
      />

      {/* Analytics: Pie + Bar side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-8">
        <UsersPieChart
          admin={users.admin}
          reviewer={users.reviewer}
          implementor={users.implementor}
          totalUsers={totalUsers}
        />
        <ProposalBarChart
          totalProgram={totalProgram}
          totalProject={totalProject}
          totalActivity={totalActivity}
        />
      </div>

      <StatusBarChart statusBarData={statusBarData} />

      <WorkflowBreakdown statusBarData={statusBarData} />
    </div>
  );
};

export default AdminOverview;
