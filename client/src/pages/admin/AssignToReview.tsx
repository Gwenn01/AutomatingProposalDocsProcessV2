import { useState, useEffect } from "react";
import { Search, FileText, Grid, Table } from "lucide-react";
import { getProposals, getAssignedReviewers, type ProgramProposal } from "@/utils/admin-api";
import { getStatusStyle, type ProposalStatus } from "@/utils/statusStyles";
import AssignModal from "@/components/admin/AssignModal";
import UnassignModal from "@/components/admin/UnassignModal";

const AssignToReview = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [allDocs, setAllDocs] = useState<ProgramProposal[]>([]);
    const [viewMode, setViewMode] = useState<"table" | "card">("table");
    const [progress, setProgress] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState<{ id: number; title: string; } | null>(null);
    const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);
    const [selectedForUnassign, setSelectedForUnassign] = useState<{ id: number; title: string; } | null>(null);
    const [assignedMap, setAssignedMap] = useState<Record<number, number>>({});

    useEffect(() => {
        if (!loading) return
        setProgress(0);
        let value = 0;

        const interval = setInterval(() => {
            value += Math.random() * 10;
            setProgress(Math.min(value, 95));
        }, 300);

        return () => clearInterval(interval)
    }, [loading]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const data = await getProposals();
                console.log("Fetched data:", data);
                setAllDocs(data)
            } catch (error) {
                console.error("Error fetching Proposals", error)
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, [])

    useEffect(() => {
      const fetchAssigned = async () => {
        try {
          const assignments = await getAssignedReviewers();
          const map: Record<number, number> = {};
          assignments.forEach(a => {
            map[a.proposal] = (map[a.proposal] || 0) + 1;
          });
          setAssignedMap(map);
        } catch (error) {
          console.error("Failed to fetch assigned reviewers", error);
        }
      };

      fetchAssigned();
    }, [allDocs])

    const openAssignModal = (doc: ProgramProposal) => {
      setSelectedProposal({ id: doc.id, title: doc.title });
      setIsModalOpen(true);
    }

    const filteredDocs = allDocs.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    if (loading) {
        return (
            <div className="w-full h-full bg-white inset-0 z-[60] flex items-center justify-center backdrop-blur-md animate-fade-in">
                <div className="relative bg-white px-14 py-10 flex flex-col items-center animate-pop-out w-[450px]">
                    <p className="text-lg font-semibold shimmer-text mb-2 text-center">
                        Synchronizing Registry
                    </p>
                    <p className="text-xs w-full text-gray-500 mb-4 text-center">
                        Preparing the latest Proposals and reviewer data for you
                    </p>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-700 transition-all duration-500 ease-out relative" style={{ width: `${progress}%`  }}>
                            <div className="absolute inset-0 bg-white/20 animate-pulse"/>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-gray-500 font-medium">{Math.round(progress)}%</p>
                </div>
            </div>
        )
    }

    return (
      <>
      <div className="p-8 lg:p-10 space-y-10 bg-[#fbfcfb] h-full animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2 mb-10">
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Assign to Review
            </h1>
            <p className="text-slate-500 text-sm">
              Select a proposal from the registry.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search
                  className="text-slate-400 group-focus-within:text-[#1cb35a] transition-all duration-300"
                  size={16}
                />
              </div>
              <input
                type="text"
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-[#1cb35a]/10 focus:border-[#1cb35a]/30 transition-all outline-none text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* View Switch */}
            <div className="flex items-center bg-slate-100 p-1 rounded-[16px] border border-slate-200/50 shadow-inner w-full md:w-auto justify-center">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-[12px] transition-all duration-300 flex-1 md:flex-none flex items-center justify-center ${
                  viewMode === "table"
                    ? "bg-white text-[#1cb35a] shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Table size={16} />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-[12px] transition-all duration-300 flex-1 md:flex-none flex items-center justify-center ${
                  viewMode === "card"
                    ? "bg-white text-[#1cb35a] shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden relative">
          {filteredDocs.length === 0 ? (
            <div className="py-24 text-center bg-slate-50/50 rounded-[24px] border-2 border-dashed border-slate-100 mt-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                <FileText size={28} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                No matches found in the archive
              </p>
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] tracking-[0.15em] font-bold">
                    <th className="pb-4 px-8 text-left font-bold">Proposal Title</th>
                    <th className="pb-4 px-6 text-center font-bold">Status</th>
                    <th className="pb-4 px-6 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => {
                    const status = getStatusStyle(doc.status as ProposalStatus);
                    return (
                      <tr key={doc.id} className="group transition-all duration-500">
                        <td className="py-6 px-8 bg-white border-y border-l border-slate-50">
                          {doc.title}
                        </td>
                        <td className="py-6 px-6 bg-white border-y border-slate-50 text-center">
                          <span
                            className={`${status.className} px-3 py-1 rounded-full text-xs font-bold`}
                          >
                            {status.label}
                          </span>
                        </td>
                        {/* ✅ NEW ACTION COLUMN */}
                        <td className="py-6 px-6 bg-white border-y border-r border-slate-50 text-center space-x-2">
                          {assignedMap[doc.id] > 0 ? (
                            <>
                              <button
                                onClick={() => openAssignModal(doc)}
                                className="px-3 py-1 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all duration-300"
                              >
                                Assign
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedForUnassign({ id: doc.id, title: doc.title });
                                  setIsUnassignModalOpen(true);
                                }}
                                className="px-3 py-1 text-xs font-bold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300"
                              >
                                Unassign
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => openAssignModal(doc)}
                              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all duration-300"
                            >
                              Assign
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredDocs.map((doc) => {
                const status = getStatusStyle(doc.status as ProposalStatus);
                const hasReviewer = assignedMap[doc.id] > 0;
                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-[38px] p-6 border border-slate-200 shadow-sm"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">{doc.title}</span>
                      <span
                        className={`${status.className} px-2 py-1 rounded-full text-xs font-bold`}
                      >
                        {status.label}
                      </span>
                      {hasReviewer && (
                        <span className="text-xs text-slate-400 mt-1">
                          {assignedMap[doc.id]} Reviewer(s) Assigned
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      {hasReviewer ? (
                        <>
                          <button
                            onClick={() => openAssignModal(doc)}
                            className="flex-1 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all duration-300"
                          >
                            Assign
                          </button>

                          <button
                            onClick={() => {
                              setSelectedForUnassign({ id: doc.id, title: doc.title });
                              setIsUnassignModalOpen(true);
                            }}
                            className="flex-1 px-3 py-2 text-xs font-bold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300"
                          >
                            Unassign
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openAssignModal(doc)}
                          className="w-full px-4 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all duration-300"
                        >
                          Assign Reviewer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <AssignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedProposal}
        onUpdate={async () => {
          const refreshed = await getProposals();
          setAllDocs(refreshed);
        }}
      />

      <UnassignModal
        isOpen={isUnassignModalOpen}
        onClose={() => setIsUnassignModalOpen(false)}
        data={selectedForUnassign}
        onUpdate={async () => {
          const refreshed = await getProposals();
          setAllDocs(refreshed);
          const assignments = await getAssignedReviewers();
          const map: Record<number, number> = {};
          assignments.forEach(a => {
            map[a.proposal] = (map[a.proposal] || 0) + 1;
          });
          setAssignedMap(map)
        }}  
      />
      </>
    )
}

export default AssignToReview;