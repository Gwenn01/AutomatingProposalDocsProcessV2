import React, { useEffect, useState } from "react";
import { ChevronRight, X } from "lucide-react";

import { getStatusStyle } from "../../utils/statusStyles";
import { fetchProjectList } from "@/utils/implementor-api";

// ================= TYPE DEFINITIONS =================
// Matches the actual API response from /api/program-proposal/{child_id}

interface MethodologyPhase {
  phase: string;
  activities: string[];
}

interface OrgStaffingItem {
  name: string;
  role: string;
}

interface WorkplanItem {
  month: string;   // e.g. "Year 1 Q1"
  activity: string;
}

interface BudgetItem {
  item: string;
  amount: number | string;
}

interface ApiProposalDetail {
  id: number;
  proposal: number;
  program_title: string;
  program_leader: string;
  projects_list: any[];
  implementing_agency: string[];
  cooperating_agencies: string[];
  extension_sites: string[];    
  tags: string[];               
  clusters: string[];          
  agendas: string[];           
  sdg_addressed: string;
  mandated_academic_program: string;
  rationale: string;
  significance: string;
  general_objectives: string;
  specific_objectives: string;
  methodology: MethodologyPhase[];
  expected_output_6ps: string[];
  sustainability_plan: string;
  org_and_staffing: OrgStaffingItem[];
  workplan: WorkplanItem[];
  budget_requirements: BudgetItem[];
  created_at: string;
}

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalData: ApiProposalDetail | null;
  proposalStatus: string;
  proposalTitle: string;
}

interface ProjectList {
  id: number;
  program_title: string;
  projects: [];
}

// ================= HELPERS =================

const NA = "N/A";
const val = (v: any) => (v !== undefined && v !== null && v !== "" ? v : NA);
const arrVal = (arr: string[] | undefined) =>
  arr && arr.length > 0 ? arr.join(", ") : NA;

// The 6Ps labels in order (matches expected_output_6ps array index)
const SIX_PS_LABELS = [
  "Publications",
  "Patents/IP",
  "Products",
  "People Services",
  "Places and Partnerships",
  "Policy",
  "Social Impact",
  "Economic Impact",
];

// All possible quarter keys in order
const QUARTERS = [
  "Year 1 Q1", "Year 1 Q2", "Year 1 Q3", "Year 1 Q4",
  "Year 2 Q1", "Year 2 Q2", "Year 2 Q3", "Year 2 Q4",
  "Year 3 Q1", "Year 3 Q2", "Year 3 Q3", "Year 3 Q4",
];

// ================= COMPONENT =================

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  proposalData,
  proposalStatus,
  proposalTitle,
}) => {
  if (!isOpen || !proposalData) return null;
  const [ projectList, setProjectList ] = useState<ProjectList[]>([]);

  const statusStyle = getStatusStyle(proposalStatus);
  const childId = proposalData?.id;

  // Build a lookup for workplan: { "Year 1 Q1": "activity text", ... }
  const workplanMap: Record<string, string> = {};
  (proposalData.workplan || []).forEach(({ month, activity }) => {
    workplanMap[month] = activity;
  });




  useEffect(() => {
    if(!childId) return;
    

    const load = async () => {
      try {
        const data : any[] = await fetchProjectList(proposalData.id)
        setProjectList(data)
      } catch (error) {
        console.error("[ProjectList] Failed to fetch Project List", error);
      }
    }
   load();
  }, [childId])

  console.log("ProjectList", projectList)


  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-6 animate-overlay-enter">
        <div className="bg-white w-full max-w-6xl h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-modal-enter">

          {/* ── Header ── */}
          <div className="flex-shrink-0 flex items-center justify-between px-10 py-7 border-b border-gray-100 bg-primaryGreen">

            {/* Left Section */}
            <div className="flex-1 min-w-0">

              {/* Top Row */}
              <div className="flex items-center gap-3 mb-2">

                {/* Label */}
                <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-white">
                  Extension Program Proposal
                </span>

                <ChevronRight size={12} className="text-gray-300" />

                {/* Status */}
                <span
                  className={`
                    inline-flex items-center px-2.5 py-1 rounded-full
                    text-[11px] font-medium
                    ${statusStyle.className}
                  `}
                >
                  {statusStyle.label}
                </span>

              </div>

              {/* Title */}
              <h1 className="font-serif text-[22px] font-bold text-white tracking-[-0.02em] leading-snug">
                {proposalTitle || val(proposalData.program_title)}
              </h1>

              {/* Subtitle */}


            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="
                w-9 h-9 ml-4 flex-shrink-0
                flex items-center justify-center
                rounded-lg border border-gray-200
                bg-white text-gray-500
                hover:bg-red-50 hover:border-red-300 hover:text-red-600
                transition-all duration-150
              "
            >
              <X size={16} />
            </button>

          </div>


          {/* ── Main Content ── */}
          <div className="p-14 overflow-auto bg-white">
            <section className="max-w-5xl mx-auto px-5 rounded-sm shadow-sm font-sans text-gray-900 leading-relaxed">

              {/* University Letterhead */}
              <div className="text-center mb-8 space-y-1">
                <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
                <p className="font-bold">Iba, Zambales</p>
                <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Program Proposal</p>
              </div>

              {/* ══════════════════════════════════
                  I. PROFILE
              ══════════════════════════════════ */}
              <h2 className="text-xl font-bold my-8">I. PROFILE</h2>

              <div className="overflow-x-auto">
                <table className="w-full border border-black text-sm">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">Program Title:</td>
                      <td className="px-4 py-3">{val(proposalData.program_title)}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">Program Leader:</td>
                      <td className="px-4 py-3">{val(proposalData.program_leader)}</td>
                    </tr>

                    {/* Projects list */}
                    {(proposalData.projects_list || []).map((proj: any, i: number) => (
                      <React.Fragment key={i}>
                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Project Title {i + 1}:
                          </td>
                          <td className="px-4 py-3 font-medium">{val(proj.title)}</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Project Leader {i + 1}:
                          </td>
                          <td className="px-4 py-3">{val(proj.leader)}</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">Project Members:</td>
                          <td className="px-4 py-3">{val(proj.members)}</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Project Duration (number of months):
                          </td>
                          <td className="px-4 py-3">{val(proj.duration_months)}</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">Project Start Date:</td>
                          <td className="px-4 py-3">{val(proj.start_date)}</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">Project End Date:</td>
                          <td className="px-4 py-3">{val(proj.end_date)}</td>
                        </tr>
                      </React.Fragment>
                    ))}

                    <tr className="border-b border-black">
                      <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                        Implementing Agency / College / Mandated Program:
                      </td>
                      <td className="px-4 py-3">{arrVal(proposalData.implementing_agency)}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                        Cooperating Agency/ies / Program / College:
                      </td>
                      <td className="px-4 py-3">{arrVal(proposalData.cooperating_agencies)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Extension Sites */}
              <p className="font-bold text-gray-900 mt-6 mb-2">Extension Site/s or Venue/s</p>
              <div className="overflow-x-auto">
                <table className="w-full border border-black text-sm">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="border-r border-black px-4 py-3 font-bold text-center w-12">#</td>
                      <td className="px-4 py-3 font-bold">Site / Venue</td>
                    </tr>
                    {(proposalData.extension_sites?.length
                      ? proposalData.extension_sites
                      : ["—", "—"]
                    ).map((site, i) => (
                      <tr key={i} className="border-b border-black">
                        <td className="border-r border-black px-4 py-3 text-center">{i + 1}</td>
                        <td className="px-4 py-3">{site || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tags, Clusters, Agendas */}
              <div className="overflow-x-auto mt-6">
                <table className="w-full border border-black text-sm">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="border-r border-black px-4 py-4 align-top w-1/2">
                        <p className="font-bold mb-3">TAGGING</p>
                        <div className="space-y-1">
                          {[
                            "general",
                            "Environment and Climate Change (for CECC)",
                            "Gender and Development (for GAD)",
                            "Mango-Related (for RMC)",
                          ].map((label) => {
                            const key = label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z_]/g, "");
                            const checked =
                              proposalData.tags?.some(
                                (t) => t.toLowerCase() === label.toLowerCase() || t.toLowerCase() === key
                              ) ?? false;
                            return (
                              <div key={label} className="flex items-start gap-2 py-0.5">
                                <span className="mt-0.5 text-sm shrink-0">{checked ? "☑" : "☐"}</span>
                                <span className="text-sm capitalize">{label}</span>
                              </div>
                            );
                          })}
                        </div>

                        <p className="font-bold mt-5 mb-3">CLUSTER</p>
                        <div className="space-y-1">
                          {[
                            "Health, Education, and Social Sciences",
                            "Engineering, Industry, Information Technology",
                            "Environment and Natural Resources",
                            "Tourism, Hospitality Management, Entrepreneurship, Criminal Justice",
                            "Graduate Studies",
                            "Fisheries",
                            "Agriculture, Forestry",
                          ].map((label) => {
                            const checked = proposalData.clusters?.some(
                              (c) => c.toLowerCase() === label.toLowerCase()
                            ) ?? false;
                            return (
                              <div key={label} className="flex items-start gap-2 py-0.5">
                                <span className="mt-0.5 text-sm shrink-0">{checked ? "☑" : "☐"}</span>
                                <span className="text-sm">{label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top w-1/2">
                        <p className="font-bold mb-3">EXTENSION AGENDA</p>
                        <div className="space-y-1">
                          {[
                            "Business Management and Livelihood Skills Development",
                            "Accountability, Good Governance, and Peace and Order",
                            "Youth and Adult Functional Literacy and Education",
                            "Accessibility, Inclusivity, and Gender and Development",
                            "Nutrition, Health, and Wellness",
                            "Indigenous People's Rights and Cultural Heritage Preservation",
                            "Human Capital Development",
                            "Adoption and Commercialization of Appropriate Technologies",
                            "Natural Resources, Climate Change, and Disaster Risk Reduction Management",
                          ].map((label) => {
                            const checked = proposalData.agendas?.some(
                              (a) => a.toLowerCase() === label.toLowerCase()
                            ) ?? false;
                            return (
                              <div key={label} className="flex items-start gap-2 py-0.5">
                                <span className="mt-0.5 text-sm shrink-0">{checked ? "☑" : "☐"}</span>
                                <span className="text-sm">{label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>

                    <tr className="border-b border-black">
                      <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                        Sustainable Development Goal (SDG) Addressed:
                      </td>
                      <td className="px-4 py-3">{val(proposalData.sdg_addressed)}</td>
                    </tr>
                    <tr>
                      <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                        College / Campus / Mandated Academic Program:
                      </td>
                      <td className="px-4 py-3">{val(proposalData.mandated_academic_program)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ══════════════════════════════════
                  Text Sections II – VII
              ══════════════════════════════════ */}
              <div className="space-y-6 text-gray-700 leading-relaxed">

                <div>
                  <h3 className="font-bold text-gray-900 pt-10 text-xl">
                    II. RATIONALE{" "}
                    <span className="text-base italic font-semibold">
                      (Include a brief result of the conducted needs assessment.)
                    </span>
                  </h3>
                  <p className="text-base mt-3 whitespace-pre-line">{val(proposalData.rationale)}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 pt-5 text-xl">III. SIGNIFICANCE</h3>
                  <p className="text-base mt-3 whitespace-pre-line">{val(proposalData.significance)}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 pt-5 text-xl">IV. OBJECTIVES</h3>
                  <p className="text-base font-semibold mb-2 mt-3">General Objectives</p>
                  <p className="p-5 bg-gray-100">{val(proposalData.general_objectives)}</p>
                  <p className="text-base font-semibold mb-2 mt-3">Specific Objectives</p>
                  <p className="p-5 bg-gray-100">{val(proposalData.specific_objectives)}</p>
                </div>

                {/* ══════════════════════════════════
                    V. METHODOLOGY
                ══════════════════════════════════ */}
                <div>
                  <h3 className="font-bold text-gray-900 pt-10 text-xl mb-5">V. METHODOLOGY</h3>
                  {(proposalData.methodology || []).length > 0 ? (
                    proposalData.methodology.map((phase, pi) => (
                      <div key={pi} className="mb-4">
                        <p className="font-semibold text-gray-800 mb-2">{phase.phase}</p>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                          {(phase.activities || []).map((act, ai) => (
                            <li key={ai} className="text-base">{act}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className="text-base">{NA}</p>
                  )}
                </div>

                {/* ══════════════════════════════════
                    VI. EXPECTED OUTPUT / OUTCOME
                ══════════════════════════════════ */}
                <div>
                  <h3 className="font-bold text-gray-900 pt-10 text-xl mb-5">VI. EXPECTED OUTPUT/OUTCOME</h3>
                  <table className="w-full border border-black text-sm">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900 text-center">
                          6P's and 2 I's
                        </td>
                        <td className="px-4 py-3 text-center font-bold">OUTPUT</td>
                      </tr>
                      {SIX_PS_LABELS.map((label, idx) => (
                        <tr key={label} className="border-b border-black">
                          <td className="border-r border-black px-4 py-3 font-bold text-gray-900">{label}</td>
                          <td className="px-4 py-3">
                            {val(proposalData.expected_output_6ps?.[idx])}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 pt-10 text-xl">VII. SUSTAINABILITY PLAN</h3>
                  <p className="text-base mt-3 whitespace-pre-line">{val(proposalData.sustainability_plan)}</p>
                </div>

                {/* ══════════════════════════════════
                    VIII. ORGANIZATION AND STAFFING
                ══════════════════════════════════ */}
                <div>
                  <h3 className="font-bold text-gray-900 pt-10 text-xl mb-5">
                    VIII. ORGANIZATION AND STAFFING{" "}
                    <span className="text-base italic font-semibold">(Persons involved and responsibility)</span>
                  </h3>
                  <table className="w-full border border-black text-sm">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="w-1/2 border-r border-black px-4 py-3 text-center font-bold">Name</td>
                        <td className="px-4 py-3 text-center font-bold">Role / Responsibility</td>
                      </tr>
                      {(proposalData.org_and_staffing || []).length > 0 ? (
                        proposalData.org_and_staffing.map((item, index) => (
                          <tr key={index} className="border-b border-black">
                            <td className="border-r border-black px-4 py-3 text-gray-900">{val(item.name)}</td>
                            <td className="px-4 py-3 whitespace-pre-line">{val(item.role)}</td>
                          </tr>
                        ))
                      ) : (
                        Array.from({ length: 7 }).map((_, i) => (
                          <tr key={i} className="border-b border-black">
                            <td className="border-r border-black px-4 py-3 text-gray-400 italic">Name here</td>
                            <td className="px-4 py-3"></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* ══════════════════════════════════
                    IX. WORKPLAN
                ══════════════════════════════════ */}
                <div>
                  <h3 className="font-bold text-gray-900 pt-10 text-xl mb-5">IX. WORKPLAN</h3>
                  <div className="overflow-x-auto">
                    <table className="border border-black text-sm" style={{ minWidth: "900px", width: "100%" }}>
                      <tbody>
                        <tr className="border-b border-black">
                          <td className="border-r border-black px-4 py-3 font-bold text-center" colSpan={4}>Year 1</td>
                          <td className="border-r border-black px-4 py-3 font-bold text-center" colSpan={4}>Year 2</td>
                          <td className="px-4 py-3 font-bold text-center" colSpan={4}>Year 3</td>
                        </tr>
                        <tr className="border-b border-black">
                          {QUARTERS.map((q, i) => (
                            <td
                              key={q}
                              className={`px-2 py-2 font-bold text-center text-xs ${i < 11 ? "border-r border-black" : ""}`}
                            >
                              {q.split(" ").slice(-1)[0]} {/* shows Q1, Q2… */}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-black">
                          {QUARTERS.map((q, i) => (
                            <td
                              key={q}
                              className={`px-2 py-3 text-center text-xs align-top ${i < 11 ? "border-r border-black" : ""}`}
                            >
                              {workplanMap[q] || ""}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ══════════════════════════════════
                    X. BUDGETARY REQUIREMENT
                ══════════════════════════════════ */}
                <div>
                  <h3 className="font-bold text-gray-900 pt-10 text-xl">X. BUDGETARY REQUIREMENT</h3>
                  <table className="w-full border border-black text-sm mt-6">
                    <tbody>
                      <tr className="border-b border-black bg-gray-100">
                        <td className="border-r border-black px-4 py-3 font-bold text-center">Item</td>
                        <td className="px-4 py-3 font-bold text-center">Amount (PhP)</td>
                      </tr>
                      {(proposalData.budget_requirements || []).length > 0 ? (
                        proposalData.budget_requirements.map((row, i) => (
                          <tr key={i} className="border-b border-black">
                            <td className="border-r border-black px-4 py-3">{val(row.item)}</td>
                            <td className="px-4 py-3 text-right">₱ {row.amount}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="text-center px-4 py-3 text-gray-500">
                            No budget data available
                          </td>
                        </tr>
                      )}
                      {/* Grand Total */}
                      <tr className="font-bold bg-gray-100">
                        <td className="border-r border-black px-4 py-3 text-right font-bold">Total</td>
                        <td className="px-4 py-3 text-right">
                          ₱{" "}
                          {(proposalData.budget_requirements || [])
                            .reduce((sum, r) => sum + Number(r.amount || 0), 0)
                            .toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* ══════════════════════════════════
                    SIGNATORIES
                ══════════════════════════════════ */}
                <div className="py-4">
                  <p className="italic my-3">Prepared by:</p>
                  <p className="py-1 mb-2">Proponent / Project Leader</p>
                  <p className="italic">Noted by:</p>

                  <div className="grid grid-cols-2">
                    <div>
                      <p className="pt-4">Dean, College</p>
                      <p className="pt-4 italic">Endorsed by:</p>
                      <p className="pt-6"></p>
                      <p className="pt-1">Campus Director</p>
                      <p className="pt-4 italic">Recommending Approval, Certified Funds Available:</p>
                      <p className="pt-7 font-bold text-[16px]">Engr. MARLON JAMES A. DEDICATORIA, Ph.D.</p>
                      <p className="pt-1">Vice-President, Research and Development</p>
                    </div>
                    <div>
                      <p className="pt-6 font-bold text-[16px]">KATHERINE M. UY, MAEd</p>
                      <p className="pt-1">University Director, Extension Services</p>
                      <p className="pt-7 font-bold text-[16px]">ROBERTO C. BRIONES JR., CPA</p>
                      <p className="pt-1">University Accountant IV</p>
                    </div>
                  </div>

                  <p className="pt-10 italic text-center">Approved by:</p>
                  <p className="pt-5 font-bold text-[16px] text-center">ROY N. VILLALOBOS, DPA</p>
                  <p className="pt-1 text-center">University President</p>
                </div>

              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentViewerModal;