import { useEffect, useState } from "react";
import { Search, Users, Eye } from "lucide-react";
import Loading from "@/components/Loading";
import { getProposals } from "@/api/admin-api";
import { getStatusStyleAdmin } from "@/utils/statusStyles";

type Proposal = {
  id: number;
  title: string;
  status: string;
  proposal_type: "Program" | "Project" | "Activity";
  reviewer_count: number;
  created_by?: string;
  parent_program?: string;
  parent_project?: string;
};

const MonitoringProposals = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [proposals, setProposals] = useState<Proposal[]>([]);

  // 🔹 Loading animation
  useEffect(() => {
    if (!loading) return;
    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(Math.min(value, 95));
    }, 300);
    return () => clearInterval(interval);
  }, [loading]);

  // 🔥 Fetch ALL proposals (NO YEAR)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProposals(); // ✅ no year
        setProposals(data);
      } catch (err) {
        console.error("Failed to fetch proposals", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Search filter ONLY
  const filtered = proposals.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  //  Progress Logic
  const getProgress = (status: string) => {
    switch (status) {
      case "draft":
        return 10;
      case "submitted":
        return 25;
      case "under_review":
        return 50;
      case "for_revision":
        return 60;
      case "for_approval":
        return 80;
      case "approved":
        return 100;
      default:
        return 0;
    }
  };

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
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Proposal Monitoring
          </h1>
          <p className="text-sm text-slate-500">
            Track proposal lifecycle and user progress
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search proposals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Proposal</th>
              <th className="p-4 text-center">Type</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Progress</th>
              <th className="p-4 text-center">Reviewers</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((doc) => {
              const status = getStatusStyleAdmin(doc.status as any);
              const progress = getProgress(doc.status);

              return (
                <tr key={doc.id} className="border-t">
                  {/* TITLE */}
                  <td className="p-4">
                    <div className="font-semibold">{doc.title}</div>

                    <div className="text-xs text-gray-400 mt-1">
                      {doc.proposal_type === "Activity" &&
                        `${doc.parent_program} → ${doc.parent_project}`}
                    </div>
                  </td>

                  {/* TYPE */}
                  <td className="text-center">{doc.proposal_type}</td>

                  {/* STATUS */}
                  <td className="text-center">
                    <span
                      className={`px-3 py-1 rounded-lg ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  {/* PROGRESS */}
                  <td className="px-4">
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-center mt-1">{progress}%</p>
                  </td>

                  {/* REVIEWERS */}
                  <td className="text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Users size={16} />
                      {doc.reviewer_count}
                    </div>
                  </td>

                  {/* ACTION */}
                  <td className="text-right pr-4">
                    <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No proposals found
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringProposals;
