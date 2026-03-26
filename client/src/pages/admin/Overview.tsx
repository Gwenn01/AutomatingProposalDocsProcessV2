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
  const [usersYear, setUsersYear] = useState(new Date().getFullYear());
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

  // fetch data
  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const [usersData, proposalsData] = await Promise.all([
        getUsersOverview(),
        getProposalsOverview(usersYear),
      ]);
      setUsers(usersData);
      console.log(proposalsData);
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

  useEffect(() => {
    fetchOverviewData();
  }, [usersYear]);

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

  // ── pending and approve ──────────────────────────────────────────────
  const totalApprove = proposals.total.total_approve;
  const totalPending = proposals.total.total_pending;

  // proposals
  const totalProgram = proposals.proposal.total_program;
  const totalProject = proposals.proposal.total_project;
  const totalActivity = proposals.proposal.total_activity;

  // workflow
  const statusBarData = [
    { key: "draft", value: proposals.status.total_draft },
    { key: "under_review", value: proposals.status.total_under_review },
    { key: "for_review", value: proposals.status.total_for_review },
    { key: "for_revision", value: proposals.status.total_for_revision },
    { key: "for_approval", value: proposals.status.total_for_approval },
    { key: "approved", value: proposals.status.total_approved },
  ];

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="relative h-auto bg-slate-50 p-8 lg:p-12 space-y-16">
      <OverviewHeader usersYear={usersYear} setUsersYear={setUsersYear} />

      <KpiTopRow totalApprove={totalApprove} totalPending={totalPending} />

      <KpiBottomRow
        totalProgram={totalProgram}
        totalProject={totalProject}
        totalActivity={totalActivity}
      />

      <WorkflowBreakdown statusBarData={statusBarData} />
      <StatusBarChart statusBarData={statusBarData} />
      {/* Analytics: Pie + Bar side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-8">
        <UsersPieChart
          admin={users.admin}
          reviewer={users.reviewer}
          implementor={users.implementor}
          totalUsers={users.total_user}
        />
        <ProposalBarChart
          totalProgram={totalProgram}
          totalProject={totalProject}
          totalActivity={totalActivity}
        />
      </div>
    </div>
  );
};

export default AdminOverview;
