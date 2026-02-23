import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Grid,
  Table,
  ChevronRight,
  ChevronLeft,
  FilePlus,
} from "lucide-react";
import { getProposals, type ProgramProposal } from "@/utils/admin-api";
import { getStatusStyleAdmin, type ProposalStatus } from "@/utils/statusStyles";
import Loading from "@/components/Loading";

const CreateCoverPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allDocs, setAllDocs] = useState<ProgramProposal[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = viewMode === "table" ? 10 : 12;

  // Loading animation (clean deterministic version)
  useEffect(() => {
    if (!loading) return;
    setProgress(20);
    const timeout = setTimeout(() => setProgress(90), 400);
    return () => clearTimeout(timeout);
  }, [loading]);

  // Fetch proposals only
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const proposals = await getProposals();
        const staticProposals: ProgramProposal = {
          id: 9999,
          child_id: 0,
          reviewer_count: 0,
          title: "Sample Proposal for Approval",
          file_path: null,
          proposal_type: "Program",
          status: "for_approval",
          version_no: 1,
          created_at: new Date().toISOString(),
          user: 0,
        };
        setAllDocs([...proposals, staticProposals]);
      } catch (error) {
        console.error("Failed to fetch proposals", error);
      } finally {
        setLoading(false);
        setProgress(100);
      }
    };

    fetchDocs();
  }, []);

  const filteredDocs = allDocs.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredDocs.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, viewMode]);

  if (loading) {
    return (
      <Loading
        title="Loading Proposals"
        subtitle="Fetching proposal registry data."
        progress={progress}
      />
    );
  }

  return (
    <div className="p-8 lg:p-10 space-y-10 bg-[#fbfcfb] animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Create Cover Page
          </h1>
          <p className="text-slate-500 text-sm">
            Generate cover pages for submitted proposals.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search
                className="text-slate-400 group-focus-within:text-[#1cb35a] transition-all"
                size={16}
              />
            </div>
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-[#1cb35a]/10 focus:border-[#1cb35a]/30 outline-none text-[13px] font-semibold"
            />
          </div>

          {/* View Switch */}
          <div className="flex items-center bg-slate-100 p-1 rounded-[16px] border border-slate-200/50">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-[12px] ${
                viewMode === "table"
                  ? "bg-white text-[#1cb35a] shadow-sm"
                  : "text-slate-400"
              }`}
            >
              <Table size={16} />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-[12px] ${
                viewMode === "card"
                  ? "bg-white text-[#1cb35a] shadow-sm"
                  : "text-slate-400"
              }`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
        {currentData.length === 0 ? (
          <div className="py-20 text-center">
            <FileText size={30} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase text-xs">
              No proposals found
            </p>
          </div>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto rounded-2xl border bg-slate-50/30 p-4">
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                  <th className="px-6 text-left">Proposal</th>
                  <th className="px-6 text-center">Status</th>
                  <th className="px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((doc) => {
                  const status = getStatusStyleAdmin(
                    doc.status as ProposalStatus,
                  );

                  return (
                    <tr key={doc.id} className="group">
                      <td className="px-6 py-4 bg-white rounded-l-xl border-y border-l">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-slate-400" />
                          <span className="font-bold text-slate-800 text-sm">
                            {doc.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 bg-white text-center border-y">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 bg-white rounded-r-xl border-y border-r text-right">
                        <button className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all">
                          <FilePlus size={14} />
                          Create Cover Page
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentData.map((doc) => {
              const status = getStatusStyleAdmin(doc.status as ProposalStatus);

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-[28px] border p-6 shadow-sm hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-slate-800 mb-2">{doc.title}</h3>

                  <span
                    className={`inline-block mb-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${status.className}`}
                  >
                    {status.label}
                  </span>

                  <button className="w-full inline-flex items-center justify-center gap-2 h-10 text-[11px] font-bold uppercase tracking-widest rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition">
                    <FilePlus size={14} />
                    Create Cover Page
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <span className="text-sm text-slate-500">
          Showing {startIndex + 1} – {Math.min(endIndex, filteredDocs.length)}{" "}
          of {filteredDocs.length}
        </span>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCoverPage;
