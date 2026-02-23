import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Grid,
  Table,
  ChevronRight,
  ChevronLeft,
  Users,
  Eye,
} from "lucide-react";
import { getProposals, type ProgramProposal } from "@/utils/admin-api";
import { getStatusStyleAdmin, type ProposalStatus } from "@/utils/statusStyles";
import Loading from "@/components/Loading";

const ManageDocuments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allDocs, setAllDocs] = useState<ProgramProposal[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = viewMode === "table" ? 10 : 12;

  // Loading animation
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

  // Fetch proposals ONLY
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const proposals = await getProposals();
        setAllDocs(proposals);
      } catch (error) {
        console.error("Failed to fetch proposals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        title="Synchronizing Proposal Data"
        subtitle="Loading proposals and related statistics."
        progress={progress}
      />
    );
  }

  return (
    <div className="p-8 lg:p-10 space-y-10 bg-[#fbfcfb] h-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Manage Documents
          </h1>
          <p className="text-slate-500 text-sm">
            View proposals and reviewer statistics.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none text-[13px] font-semibold"
            />
          </div>

          {/* View Switch */}
          <div className="flex items-center bg-slate-100 p-1 rounded-[16px] border border-slate-200">
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
      <div className="bg-white p-8 rounded-[32px] shadow border border-slate-100 overflow-hidden">
        {currentData.length === 0 ? (
          <div className="py-24 text-center">
            <FileText size={40} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 uppercase text-xs font-bold tracking-widest">
              No proposals found
            </p>
          </div>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                  <th className="text-left px-6 pb-3">Proposal</th>
                  <th className="text-center px-6 pb-3">Status</th>
                  <th className="text-center px-6 pb-3">Reviewers</th>
                  <th className="text-right px-6 pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((doc) => {
                  const status = getStatusStyleAdmin(
                    doc.status as ProposalStatus,
                  );

                  return (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 bg-white rounded-l-xl border-y border-l">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-slate-400" />
                          <div>
                            <div className="font-bold text-sm">{doc.title}</div>
                            <div className="text-xs text-slate-400">
                              ID #{doc.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center border-y">
                        <span
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* Reviewer Count Column */}
                      <td className="px-6 py-4 text-center border-y">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600">
                          <Users size={14} />
                          {doc.reviewer_count}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right rounded-r-xl border-y border-r">
                        <div className="flex justify-end gap-2">
                          <button className="inline-flex items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase rounded-lg bg-slate-100 hover:bg-slate-200 transition">
                            <Eye size={14} />
                            View Docs
                          </button>

                          <button className="inline-flex items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
                            <Users size={14} />
                            View Reviewer
                          </button>
                        </div>
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
                  className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-sm">{doc.title}</h3>
                      <p className="text-xs text-slate-400">ID #{doc.id}</p>
                    </div>

                    <span
                      className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full border ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t pt-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                      <Users size={14} />
                      {doc.reviewer_count} Reviewer
                      {doc.reviewer_count !== 1 && "s"}
                    </span>

                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-[10px] font-bold uppercase bg-slate-100 rounded-lg">
                        View Docs
                      </button>
                      <button className="px-3 py-1 text-[10px] font-bold uppercase bg-indigo-600 text-white rounded-lg">
                        View Reviewer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-4 py-6 bg-slate-50/50 rounded-[24px] border border-slate-100/80">
        {/* Stats Section */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1 overflow-hidden">
            {/* Subtle visual indicator of data density */}
            <div className="h-2 w-8 rounded-full bg-indigo-500/20" />
          </div>
          <span className="text-[13px] text-slate-500 font-medium tracking-tight">
            Showing{" "}
            <span className="text-slate-900 font-bold">{startIndex + 1}</span>
            <span className="mx-1 opacity-40">—</span>
            <span className="text-slate-900 font-bold">
              {Math.min(endIndex, filteredDocs.length)}
            </span>{" "}
            of{" "}
            <span className="text-slate-900 font-bold">
              {filteredDocs.length}
            </span>{" "}
            items
          </span>
        </div>

        <div className="flex items-center gap-8">
          {/* Minimalist Page Counter */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200/60 shadow-sm">
            <span className="text-[11px] uppercase font-black tracking-widest text-slate-400 ml-1">
              Page
            </span>
            <span className="text-sm font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full">
              {currentPage}
            </span>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mr-1">
              of {totalPages}
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="group flex items-center gap-2.5 pl-3.5 pr-5 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-sm"
              title="Previous Page"
            >
              <ChevronLeft
                size={16}
                className="group-hover:-translate-x-0.5 transition-transform duration-300"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Prev
              </span>
            </button>

            {/* Next Button */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="group flex items-center gap-2.5 pl-5 pr-3.5 h-10 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md shadow-slate-900/5 hover:shadow-indigo-500/20"
              title="Next Page"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Next
              </span>
              <ChevronRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform duration-300"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDocuments;
