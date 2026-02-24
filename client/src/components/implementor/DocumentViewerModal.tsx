import React, { useEffect, useState, useCallback } from "react";
import { ChevronRight, X, FileText, FolderOpen, Activity } from "lucide-react";
import { getStatusStyle } from "../../utils/statusStyles";
import {
  fetchProjectList,
  fetchActivityList,
  fetchProgramProposalDetail,
  fetchProjectProposalDetail,
  fetchActivityProposalDetail,
  type ApiProjectListResponse,
  type ApiActivityListResponse,
  type ApiProject,
  type ApiActivity,
} from "@/utils/implementor-api";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

// ================= TYPE DEFINITIONS =================

interface MethodologyPhase {
  phase: string;
  activities: string[];
}

interface OrgStaffingItem {
  name: string;
  role: string;
}

interface WorkplanItem {
  month: string;
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

// Re-export for local use with clearer names
type ProjectItem = ApiProject;
type ActivityItem = ApiActivity;

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalData: ApiProposalDetail | null;
  proposalStatus: string;
  proposalTitle: string;
}

// ================= HELPERS =================

const NA = "N/A";
const val = (v: any) => (v !== undefined && v !== null && v !== "" ? v : NA);
const arrVal = (arr: string[] | undefined) =>
  arr && arr.length > 0 ? arr.join(", ") : NA;

const SIX_PS_LABELS = [
  "Publications", "Patents/IP", "Products", "People Services",
  "Places and Partnerships", "Policy", "Social Impact", "Economic Impact",
];

const QUARTERS = [
  "Year 1 Q1","Year 1 Q2","Year 1 Q3","Year 1 Q4",
  "Year 2 Q1","Year 2 Q2","Year 2 Q3","Year 2 Q4",
  "Year 3 Q1","Year 3 Q2","Year 3 Q3","Year 3 Q4",
];

type TabType = "program" | "project" | "activity";

// ================= SHARED PROFILE FIELDS (Project & Activity) =================

const CheckboxList = ({ items, checked }: { items: string[]; checked: (item: string) => boolean }) => (
  <div className="space-y-1">
    {items.map((label) => (
      <div key={label} className="flex items-start gap-2 py-0.5">
        <span className="mt-0.5 text-sm shrink-0">{checked(label) ? "☑" : "☐"}</span>
        <span className="text-sm">{label}</span>
      </div>
    ))}
  </div>
);

// ================= PROGRAM FORM =================

const ProgramForm: React.FC<{ proposalData: ApiProposalDetail }> = ({ proposalData }) => {
  const workplanMap: Record<string, string> = {};
  (proposalData.workplan || []).forEach(({ month, activity }) => { workplanMap[month] = activity; });

  return (
    <section className="max-w-5xl mx-auto px-5 py-5 border border-gray-200 shadow-sm font-sans text-gray-900 leading-relaxed">
      <div className="text-center mb-8 space-y-1">
        <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
        <p className="font-bold">Iba, Zambales</p>
        <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Program Proposal</p>
      </div>

      <div className="border border-black">
        <div className="p-2">
          <h2 className="text-base font-bold ">I. PROFILE</h2>

          <div className="my-2">
            <p className="font-bold">Program Title 1: <span className="font-normal">{val(proposalData.program_title)}</span></p>
            <p className="font-bold">Program Leader: <span className="font-normal">{val(proposalData.program_leader)}</span></p>
          </div>

          <div>
            <p className="font-bold">Project Title 1: <span className="font-normal">{val(proposalData.program_title)}</span></p>
            <p className="font-bold">Project Leader: <span className="font-normal">{val(proposalData.program_leader)}</span></p>
            <p className="font-bold">Project Members: <span className="font-normal">{val(proposalData.program_leader)}</span></p>
            <br />
            <p className="font-bold">Project Duration: <span className="font-normal">{val(proposalData.program_title)}</span></p>
            <p className="font-bold">Project Start Date: <span className="font-normal">{val(proposalData.program_leader)}</span></p>
            <p className="font-bold">Project End Date: <span className="font-normal">{val(proposalData.program_leader)}</span></p>
          </div>
        </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <tbody>

                {(proposalData.projects_list || []).map((proj: any, i: number) => (
                  <React.Fragment key={i}>
                    <tr className="border-b border-black">
                      <td className="w-1/4 border-r border-black px-4 py-3 font-bold">Project Title {i + 1}:</td>
                      <td className="px-4 py-3 font-medium">{val(proj.title)}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="w-1/4 border-r border-black px-4 py-3 font-bold">Project Leader {i + 1}:</td>
                      <td className="px-4 py-3">{val(proj.leader)}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="w-1/4 border-r border-black px-4 py-3 font-bold">Project Members:</td>
                      <td className="px-4 py-3">{val(proj.members)}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="w-1/4 border-r border-black px-4 py-3 font-bold">Project Duration (months):</td>
                      <td className="px-4 py-3">{val(proj.duration_months)}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="w-1/4 border-r border-black px-4 py-3 font-bold">Project Start Date:</td>
                      <td className="px-4 py-3">{val(proj.start_date)}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="w-1/4 border-r border-black px-4 py-3 font-bold">Project End Date:</td>
                      <td className="px-4 py-3">{val(proj.end_date)}</td>
                    </tr>
                  </React.Fragment>
                ))}
                <tr className="border-b border-t border-black">
                  <p className="px-3 py-2 font-bold">IMPLEMENTING AGENCY <span className="font-normal">/ College / Mandated Program:</span></p>
                  <p className="px-3 mb-2">{arrVal(proposalData.implementing_agency)}</p>
                  {/* <td className="px-4 py-3">{arrVal(proposalData.implementing_agency)}</td> */}
                </tr>
                <tr className="border-b border-black">
                  <p className="  px-3 py-2 font-bold">COOPERATING AGENCY/IES /Program/College <span className="font-normal">(Name/s and Address/es)</span></p>
                  <p className="   px-3 mb-2 font-normal">{arrVal(proposalData.cooperating_agencies)}</p>
                  {/* <td className="px-4 py-3"></td> */}
                </tr>
              </tbody>
            </table>
          </div>

          <p className="font-bold p-2 text-base">EXTENSION SITE/S OR VENUE/S</p>
          <div className="overflow-x-auto">
            <table className="w-full border-t border-black text-sm">
              <tbody>
                <tr className="border-b border-black">
                  <td className="border-r border-black px-4 py-3 font-bold text-center w-12">#</td>
                  <td className="px-4 py-3 font-bold">Site / Venue</td>
                </tr>
                {(proposalData.extension_sites?.length ? proposalData.extension_sites : ["—", "—"]).map((site, i) => (
                  <tr key={i} className="border-b border-black">
                    <td className="border-r border-black px-4 py-3 text-center">{i + 1}</td>
                    <td className="px-4 py-3">{site || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


        <div className="overflow-x-auto">
          <table className="w-full border-b border-black text-sm">
            <tbody>
              <tr className="border-b border-black">
                <td className="border-r border-black px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3 text-base">TAGGING</p>
                  <CheckboxList
                    items={["General","Environment and Climate Change (for CECC)","Gender and Development (for GAD)","Mango-Related (for RMC)"]}
                    checked={(label) => proposalData.tags?.some((t) => t.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                  <p className="font-bold mt-5 mb-3 text-base">CLUSTER</p>
                  <CheckboxList
                    items={["Health, Education, and Social Sciences","Engineering, Industry, Information Technology","Environment and Natural Resources","Tourism, Hospitality Management, Entrepreneurship, Criminal Justice","Graduate Studies","Fisheries","Agriculture, Forestry"]}
                    checked={(label) => proposalData.clusters?.some((c) => c.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                </td>
                <td className="px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3 text-base">EXTENSION AGENDA</p>
                  <CheckboxList
                    items={["Business Management and Livelihood Skills Development","Accountability, Good Governance, and Peace and Order","Youth and Adult Functional Literacy and Education","Accessibility, Inclusivity, and Gender and Development","Nutrition, Health, and Wellness","Indigenous People's Rights and Cultural Heritage Preservation","Human Capital Development","Adoption and Commercialization of Appropriate Technologies","Natural Resources, Climate Change, and Disaster Risk Reduction Management"]}
                    checked={(label) => proposalData.agendas?.some((a) => a.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black px-4 py-3 font-bold">Sustainable Development Goal (SDG) Addressed</td>
                <td className="border-r border-black px-4 py-3 font-bold">College/Campus/Mandated Academic Program:</td>
              </tr>
              <tr>
                <td className="px-4 py-3 border-r border-black">{val(proposalData.sdg_addressed)}</td> 
                <td className="px-4 py-3">{val(proposalData.mandated_academic_program)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-gray-700 leading-relaxed">
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">II. RATIONALE <span className="text-base italic font-normal">(Include a brief result of the conducted needs assessment.)</span></h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(proposalData.rationale)}</p>
          </div>
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">III. SIGNIFICANCE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(proposalData.significance)}</p>
          </div>
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">IV. OBJECTIVES</h3>
            <p className="text-base font-semibold mb-2 mt-3">General:</p>
            <p className="p-5 bg-gray-100">{val(proposalData.general_objectives)}</p>
            <p className="text-base font-semibold mb-2 mt-3">Specific:</p>
            <p className="p-5 bg-gray-100">{val(proposalData.specific_objectives)}</p>
          </div>
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">V. METHODOLOGY</h3>
            {(proposalData.methodology || []).length > 0 ? (
              proposalData.methodology.map((phase, pi) => (
                <div key={pi} className="mb-4">
                  <p className="font-semibold text-gray-800 mb-2">{phase.phase}</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    {(phase.activities || []).map((act, ai) => <li key={ai} className="text-base">{act}</li>)}
                  </ul>
                </div>
              ))
            ) : <p className="text-base">{NA}</p>}
          </div>
          <div className="">
            <h3 className="font-bold text-gray-900 text-base p-2">VI. EXPECTED OUTPUT/OUTCOME</h3>
            <table className="w-full border-t border-black text-sm">
              <tbody>
                <tr className="border-b border-black">
                  <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-center">6P's and 2 I's</td>
                  <td className="px-4 py-3 text-center font-bold">OUTPUT</td>
                </tr>
                {SIX_PS_LABELS.map((label, idx) => (
                  <tr key={label} className="border-b border-black">
                    <td className="border-r border-black px-4 py-3 font-bold">{label}</td>
                    <td className="px-4 py-3">{val(proposalData.expected_output_6ps?.[idx])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">VII. SUSTAINABILITY PLAN</h3>
            <p className="text-base whitespace-pre-line">{val(proposalData.sustainability_plan)}</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 p-2 text-base">VIII. ORGANIZATION AND STAFFING <span className="text-base italic font-normal">(Persons involved and responsibility)</span></h3>
            <table className="w-full border-t border-black text-sm">
              <tbody>
                <tr className="border-b border-black">
                  <td className="w-1/2 border-r border-black px-4 py-3 text-center font-bold">Name</td>
                  <td className="px-4 py-3 text-center font-bold">Role / Responsibility</td>
                </tr>
                {(proposalData.org_and_staffing || []).length > 0 ? (
                  proposalData.org_and_staffing.map((item, index) => (
                    <tr key={index} className="border-b border-black">
                      <td className="border-r border-black px-4 py-3">{val(item.name)}</td>
                      <td className="px-4 py-3 whitespace-pre-line">{val(item.role)}</td>
                    </tr>
                  ))
                ) : Array.from({ length: 7 }).map((_, i) => (
                  <tr key={i} className="border-b border-black">
                    <td className="border-r border-black px-4 py-3 text-gray-400 italic">Name here</td>
                    <td className="px-4 py-3"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 p-2 text-base">IX. WORKPLAN</h3>
            <div className="overflow-x-auto">
              <table className="border-t border-black text-sm" style={{ minWidth: "900px", width: "100%" }}>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="border-r border-black px-4 py-3 font-bold text-center" colSpan={4}>Year 1</td>
                    <td className="border-r border-black px-4 py-3 font-bold text-center" colSpan={4}>Year 2</td>
                    <td className="px-4 py-3 font-bold text-center" colSpan={4}>Year 3</td>
                  </tr>
                  <tr className="border-b border-black">
                    {QUARTERS.map((q, i) => (
                      <td key={q} className={`px-2 py-2 font-bold text-center text-xs ${i < 11 ? "border-r border-black" : ""}`}>
                        {q.split(" ").slice(-1)[0]}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-black">
                    {QUARTERS.map((q, i) => (
                      <td key={q} className={`px-2 py-3 text-center text-xs align-top ${i < 11 ? "border-r border-black" : ""}`}>
                        {workplanMap[q] || ""}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base p-2">X. BUDGETARY REQUIREMENT</h3>
            <table className="w-full border-t border-black text-sm">
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
                  <tr><td colSpan={2} className="text-center px-4 py-3 text-gray-500">No budget data available</td></tr>
                )}
                <tr className="font-bold bg-gray-100">
                  <td className="border-r border-black px-4 py-3 text-right font-bold">Total</td>
                  <td className="px-4 py-3 text-right">
                    ₱ {(proposalData.budget_requirements || []).reduce((sum, r) => sum + Number(r.amount || 0), 0).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>
          {/* Signatories */}
          <div className="py-4 px-5">
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

    </section>
  );
};

// ================= PROJECT FORM =================

const ProjectForm: React.FC<{ projectData: any; programTitle: string }> = ({ projectData, programTitle }) => {
  if (!projectData) return <div className="flex items-center justify-center h-64 text-gray-400">Loading project data...</div>;

  const workplanMap: Record<string, string> = {};
  (projectData.workplan || []).forEach(({ month, activity }: WorkplanItem) => { workplanMap[month] = activity; });

  return (
    <section className="max-w-5xl mx-auto border border-gray-200 py-5 shadow-sm font-sans text-gray-900 leading-relaxed">
      <div className="text-center mb-8 space-y-1">
        <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
        <p className="font-bold">Iba, Zambales</p>
        <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Project Proposal</p>
      </div>

      <div className="border border-black">
        <div className="p-5">
            <h2 className="text-base font-bold my-2">I. PROFILE</h2>

            <div className="my-4">
              <p className="font-bold">Program Title 1: <span className="font-normal">{val(programTitle)}</span></p>
              <p className="font-bold">Program Leader: <span className="font-normal">{val(projectData.program_leader)}</span></p>
            </div>

            <div>
              <p className="font-bold">Project Title: <span className="font-normal">{val(projectData.project_title)}</span></p>
              <p className="font-bold">Project Leader: <span className="font-normal">{val(projectData.project_leader)}</span></p>
              <p className="font-bold">Project Members: <span className="font-normal">{val(projectData.members)}</span></p>
              <br />
              <p className="font-bold">Project Duration: <span className="font-normal">{val(projectData.duration_months)}</span></p>
              <p className="font-bold">Project Start Date: <span className="font-normal">{val(projectData.start_date)}</span></p>
              <p className="font-bold">Project End Date: <span className="font-normal">{val(projectData.end_date)}</span></p>
            </div>

        </div>

            <div className="overflow-x-auto mt-6">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-t border-black p-5">
                      <p className="px-3 py-2 font-bold">IMPLEMENTING AGENCY <span className="font-normal">/ College / Mandated Program:</span></p>
                      <p className="px-3 mb-2">{arrVal(projectData.implementing_agency)}</p>
                      {/* <td className="px-4 py-3">{arrVal(proposalData.implementing_agency)}</td> */}
                    </tr>
                    <tr className="border-b border-black">
                      <p className="  px-3 py-2 font-bold">COOPERATING AGENCY/IES /Program/College <span className="font-normal">(Name/s and Address/es)</span></p>
                      <p className="   px-3 mb-2 font-normal">{arrVal(projectData.cooperating_agencies)}</p>
                      {/* <td className="px-4 py-3"></td> */}
                    </tr>
                  {/* <tr className="border-b border-black">
                    <td className="w-1/4 border-r border-black px-4 py-3 font-bold">Implementing Agency / College / Mandated Program:</td>
                    <td className="px-4 py-3">{arrVal(projectData.implementing_agency)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-1/4 border-r border-black px-4 py-3 font-bold">Address / Telephone / Email:</td>
                    <td className="px-4 py-3">{val(projectData.address)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-1/4 border-r border-black px-4 py-3 font-bold">Cooperating Agency/ies / Program / College:</td>
                    <td className="px-4 py-3">{arrVal(projectData.cooperating_agencies)}</td>
                  </tr> */}
                </tbody>
              </table>
            </div>


        <p className="font-bold mt-2 mb-2 px-2">Extension Site/s or Venue/s</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-t border-black">
                <td className="border-r border-black px-4 py-3 font-bold text-center w-12">#</td>
                <td className="px-4 py-3 font-bold">Site / Venue</td>
              </tr>
              {(projectData.extension_sites?.length ? projectData.extension_sites : ["—", "—"]).map((site: string, i: number) => (
                <tr key={i} className="border-b border-black">
                  <td className="border-r border-black px-4 py-3 text-center">{i + 1}</td>
                  <td className="px-4 py-3">{site || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full  text-sm">
            <tbody>
              <tr className="border-b border-black">
                <td className="border-r border-black px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3">TAGGING</p>
                  <CheckboxList
                    items={["general","Environment and Climate Change (for CECC)","Gender and Development (for GAD)","Mango-Related (for RMC)"]}
                    checked={(label) => projectData.tags?.some((t: string) => t.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                  <p className="font-bold mt-5 mb-3">CLUSTER</p>
                  <CheckboxList
                    items={["Health, Education, and Social Sciences","Engineering, Industry, Information Technology","Environment and Natural Resources","Tourism, Hospitality Management, Entrepreneurship, Criminal Justice","Graduate Studies","Fisheries","Agriculture, Forestry"]}
                    checked={(label) => projectData.clusters?.some((c: string) => c.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                </td>
                <td className="px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3">EXTENSION AGENDA</p>
                  <CheckboxList
                    items={["Business Management and Livelihood Skills Development","Accountability, Good Governance, and Peace and Order","Youth and Adult Functional Literacy and Education","Accessibility, Inclusivity, and Gender and Development","Nutrition, Health, and Wellness","Indigenous People's Rights and Cultural Heritage Preservation","Human Capital Development","Adoption and Commercialization of Appropriate Technologies","Natural Resources, Climate Change, and Disaster Risk Reduction Management"]}
                    checked={(label) => projectData.agendas?.some((a: string) => a.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black px-4 py-3 font-bold">Sustainable Development Goal (SDG) Addressed:</td>
                <td className=" px-4 py-3 font-bold">College / Campus / Mandated Academic Program:</td>
                {/* <td className="px-4 py-3">{val(projectData.sdg_addressed)}</td> */}
              </tr>
              <tr className="border-b border-black">
                {/* <td className="border-r border-black px-4 py-3 font-bold">College / Campus / Mandated Academic Program:</td> */}
                <td className="px-4 py-3 border-r border-black">{val(projectData.sdg_addressed)}</td>
                <td className="px-4 py-3">{val(projectData.mandated_academic_program)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className=" text-gray-700 leading-relaxed">
          <div className="px-2 py-2 border-b border-black">
            <h3 className="font-bold text-gray-900  text-base">II. RATIONALE <span className="text-base italic font-normal">(Include a brief result of the conducted needs assessment.)</span></h3>
            <p className="text-base mt-3 whitespace-pre-line text-wrap">{val(projectData.rationale)}</p>
          </div>
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">III. SIGNIFICANCE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(projectData.significance)}</p>
          </div>

          <div className="border-b border-black p-2">
            <h3 className="font-bold text-gray-900 text-base">IV. OBJECTIVES</h3>
            <p className="text-base font-semibold mb-2 mt-3 ml-2">General:</p>
            <p className="p-5 bg-gray-100">{val(projectData.general_objectives)}</p>
            <p className="text-base font-semibold mb-2 mt-3 ml-2">Specific:</p>
            <p className="p-5 bg-gray-100">{val(projectData.specific_objectives)}</p>
          </div>

          <div className="border-b border-black p-2">
            <h3 className="font-bold text-gray-900 text-base mb-5">V. METHODOLOGY</h3>
            {(projectData.methodology || []).length > 0 ? (
              projectData.methodology.map((phase: MethodologyPhase, pi: number) => (
                <div key={pi} className="mb-4">
                  <p className="font-semibold text-gray-800 mb-2">{phase.phase}</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    {(phase.activities || []).map((act, ai) => <li key={ai} className="text-base">{act}</li>)}
                  </ul>
                </div>
              ))
            ) : <p className="text-base">{NA}</p>}
          </div>

          <div className="">
            <h3 className="font-bold text-gray-900 p-2 text-base my-2">VI. EXPECTED OUTPUT/OUTCOME</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-t border-black">
                  <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-center">6P's and 2 I's</td>
                  <td className="px-4 py-3 text-center font-bold">OUTPUT</td>
                </tr>
                {SIX_PS_LABELS.map((label, idx) => (
                  <tr key={label} className="border-b border-black">
                    <td className="border-r border-black px-4 py-3 font-bold">{label}</td>
                    <td className="px-4 py-3">{val(projectData.expected_output_6ps?.[idx])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">VII. SUSTAINABILITY PLAN</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(projectData.sustainability_plan)}</p>
          </div>
          <div className="">
            <h3 className="font-bold text-gray-900 text-base p-2">VIII. ORGANIZATION AND STAFFING</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-t border-black">
                  <td className="w-1/2 border-r border-black px-4 py-3 text-center font-bold">Name</td>
                  <td className="px-4 py-3 text-center font-bold">Role / Responsibility</td>
                </tr>
                {(projectData.org_and_staffing || []).length > 0 ? (
                  projectData.org_and_staffing.map((item: OrgStaffingItem, index: number) => (
                    <tr key={index} className="border-b border-black">
                      <td className="border-r border-black px-4 py-3">{val(item.name)}</td>
                      <td className="px-4 py-3 whitespace-pre-line">{val(item.role)}</td>
                    </tr>
                  ))
                ) : Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-black">
                    <td className="border-r border-black px-4 py-3 text-gray-400 italic">Name here</td>
                    <td className="px-4 py-3"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base p-2">IX. WORKPLAN</h3>
            <div className="overflow-x-auto">
              <table className="text-sm" style={{ minWidth: "900px", width: "100%" }}>
                <tbody>
                  <tr className="border-b border-t border-black">
                    <td className="border-r border-black px-4 py-3 font-bold text-center" colSpan={4}>Year 1</td>
                    <td className="border-r border-black px-4 py-3 font-bold text-center" colSpan={4}>Year 2</td>
                    <td className="px-4 py-3 font-bold text-center" colSpan={4}>Year 3</td>
                  </tr>
                  <tr className="border-b border-black">
                    {QUARTERS.map((q, i) => (
                      <td key={q} className={`px-2 py-2 font-bold text-center text-xs ${i < 11 ? "border-r border-black" : ""}`}>
                        {q.split(" ").slice(-1)[0]}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-black">
                    {QUARTERS.map((q, i) => (
                      <td key={q} className={`px-2 py-3 text-center text-xs align-top ${i < 11 ? "border-r border-black" : ""}`}>
                        {workplanMap[q] || ""}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base p-2">X. BUDGETARY REQUIREMENT</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-t border-black bg-gray-100">
                  <td className="border-r border-black px-4 py-3 font-bold text-center">Item</td>
                  <td className="px-4 py-3 font-bold text-center">Amount (PhP)</td>
                </tr>
                {(projectData.budget_requirements || []).length > 0 ? (
                  projectData.budget_requirements.map((row: BudgetItem, i: number) => (
                    <tr key={i} className="border-b border-black">
                      <td className="border-r border-black px-4 py-3">{val(row.item)}</td>
                      <td className="px-4 py-3 text-right">₱ {row.amount}</td>
                    </tr>
                  ))
                ) : <tr><td colSpan={2} className="text-center px-4 py-3 text-gray-500">No budget data available</td></tr>}
                <tr className="font-bold bg-gray-100 border-t border-b border-black">
                  <td className="border-r
                   border-black px-4 py-3 text-right font-bold">Total</td>
                  <td className="px-4 py-3 text-right">
                    ₱ {(projectData.budget_requirements || []).reduce((sum: number, r: BudgetItem) => sum + Number(r.amount || 0), 0).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatories */}
          <div className="py-2 px-6">
            <p className="italic my-3">Prepared by:</p>
            <p className="py-1 mb-2">Proponent / Project Leader</p>
            <p className="italic">Noted by:</p>
            <div className="grid grid-cols-2">
              <div>
                <p className="pt-4">Dean, College of Industrial Technology</p>
                <p className="pt-4 italic">Endorsed by:</p>
                <p className="pt-6"></p>
                <p className="pt-1">Campus Director, Sta. Cruz</p>
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

      </div>
    </section>
  );
};

// ================= ACTIVITY FORM =================

const ActivityForm: React.FC<{ activityData: any; programTitle: string; projectTitle: string }> = ({ activityData, programTitle, projectTitle }) => {
  if (!activityData) return <div className="flex items-center justify-center h-64 text-gray-400">Loading activity data...</div>;

  return (
    <section className="max-w-5xl mx-auto px-5 rounded-sm shadow-sm font-serif text-gray-900 leading-relaxed">
      <div className="text-center mb-8 space-y-1">
        <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
        <p className="font-bold">Iba, Zambales</p>
        <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Activity Proposal</p>
      </div>

      <div className="border border-black">

          <div className="p-5">
            <h2 className="text-base font-bold my-2">I. PROFILE</h2>

            <div className="my-4">
              <p className="font-bold">Program Title: <span className="font-normal">{val(programTitle)}</span></p>
              <p className="font-bold">Project Title: <span className="font-normal">{val(projectTitle)}</span></p>
              <p className="font-bold">Activity Title: <span className="font-normal">{val(activityData.activity_title)}</span></p>
              <p className="font-normal">Project Leader: <span className="font-normal">{val(activityData.project_leader)}</span></p>
              <p className="font-normal">Members: <span className="font-normal">{val(activityData.members?.join(", ") || NA)}</span></p>
              <br />
            </div>

            <div>
              <p className="font-bold">Activity Duration <span className="font-normal italic">( 8 hours ): </span> <span className="font-normal">{val(activityData.activity_duration_hours)}</span></p>
              <p className="font-normal">Date:<span className="font-normal">{val(activityData.activity_date)}</span></p>
              <br />

            </div>

        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-t border-black text-sm">
            <tbody>
              <tr className="border-b border-t border-black p-5">
                <p className="px-3 py-2 font-bold">IMPLEMENTING AGENCY <span className="font-normal">/ College / Mandated Program:</span></p>
                <p className="px-3 mb-4">Address/Telephone/Email (Barangay, Municipality, District, Province, Region):</p>
                <p className="px-3 mb-2">{arrVal(activityData.implementing_agency)}</p>
                {/* <td className="px-4 py-3">{arrVal(proposalData.implementing_agency)}</td> */}
              </tr>
              <tr className="border-b border-black">
                <p className="  px-3 py-2 font-bold">COOPERATING AGENCY/IES /Program/College <span className="font-normal">(Name/s and Address/es)</span></p>
                <p className="   px-3 mb-2 font-normal">{arrVal(activityData.cooperating_agencies)}</p>
                {/* <td className="px-4 py-3"></td> */}
              </tr>

              {/* <tr className="border-b border-black">
                <td className=" px-4 py-3 font-bold">Implementing Agency / College / Mandated Program:</td>
                <td className="px-4 py-3">{arrVal(activityData.implementing_agency)}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="w-1/4 border-r border-black px-4 py-3 font-bold">Address / Telephone / Email:</td>
                <td className="px-4 py-3">{val(activityData.address)}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="w-1/4 border-r border-black px-4 py-3 font-bold">Cooperating Agency/ies:</td>
                <td className="px-4 py-3">{arrVal(activityData.cooperating_agencies)}</td>
              </tr> */}
            </tbody>
          </table>
        </div>

        <p className="font-bold text-base p-3 mb-2">EXTENSION SITE/S OR VENUE/S</p>
        <div className="overflow-x-auto">
          <table className="w-full border-t border-black text-sm">
            <tbody>
              <tr className="border-b border-black">
                <td className="border-r border-black px-4 py-3 font-bold text-center w-12">#</td>
                <td className="px-4 py-3 font-bold">Site / Venue</td>
              </tr>
              {(activityData.extension_sites?.length ? activityData.extension_sites : ["—", "—"]).map((site: string, i: number) => (
                <tr key={i} className="border-b border-black">
                  <td className="border-r border-black px-4 py-3 text-center">{i + 1}</td>
                  <td className="px-4 py-3">{site || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-b border-black text-sm">
            <tbody>
              <tr className="border-b border-black">
                <td className="border-r border-black px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3">TAGGING</p>
                  <CheckboxList
                    items={["general","Environment and Climate Change (for CECC)","Gender and Development (for GAD)","Mango-Related (for RMC)"]}
                    checked={(label) => activityData.tags?.some((t: string) => t.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                  <p className="font-bold mt-5 mb-3">CLUSTER</p>
                  <CheckboxList
                    items={["Health, Education, and Social Sciences","Engineering, Industry, Information Technology","Environment and Natural Resources","Tourism, Hospitality Management, Entrepreneurship, Criminal Justice","Graduate Studies","Fisheries","Agriculture, Forestry"]}
                    checked={(label) => activityData.clusters?.some((c: string) => c.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                </td>
                <td className="px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3">EXTENSION AGENDA</p>
                  <CheckboxList
                    items={["Business Management and Livelihood Skills Development","Accountability, Good Governance, and Peace and Order","Youth and Adult Functional Literacy and Education","Accessibility, Inclusivity, and Gender and Development","Nutrition, Health, and Wellness","Indigenous People's Rights and Cultural Heritage Preservation","Human Capital Development","Adoption and Commercialization of Appropriate Technologies","Natural Resources, Climate Change, and Disaster Risk Reduction Management"]}
                    checked={(label) => activityData.agendas?.some((a: string) => a.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black px-4 py-3 font-bold">Sustainable Development Goal (SDG) Addressed:</td>
                <td className="border-r border-black px-4 py-3 font-bold">College / Campus / Mandated Academic Program:</td>

              </tr>
              <tr>
                <td className="px-4 py-3 border-r border-black">{val(activityData.sdg_addressed)}</td>
                <td className="px-4 py-3">{val(activityData.mandated_academic_program)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className=" text-gray-700 leading-relaxed">
          <div className="p-4 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">II. RATIONALE <span className="text-base italic font-semibold">(Include a brief result of the conducted needs assessment.)</span></h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.rationale)}</p>
          </div>
          <div className="p-4 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">III. SIGNIFICANCE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.significance)}</p>
          </div>
          <div className="p-4 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">IV. OBJECTIVES OF THE ACTIVITY</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.objectives)}</p>
          </div>
          <div className="p-4 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">V. METHODOLOGY <span className="text-base italic font-normal">(short narrative)</span></h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.methodology)}</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 pt-4 px-4 text-base mb-5">VI. EXPECTED OUTPUT/OUTCOME</h3>
            <table className="w-full border-t border-black text-sm">
              <tbody>
                <tr className="border-b border-black">
                  <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-center">6P's and 2 I's</td>
                  <td className="px-4 py-3 text-center font-bold">OUTPUT</td>
                </tr>
                {SIX_PS_LABELS.map((label, idx) => (
                  <tr key={label} className="border-b border-black">
                    <td className="border-r border-black px-4 py-3 font-bold">{label}</td>
                    <td className="px-4 py-3">{val(activityData.expected_output_6ps?.[idx])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 pt-4 px-4 text-base mb-5">VII. ORGANIZATION AND STAFFING</h3>
            <table className="w-full border-t border-black text-sm">
              <tbody>
                <tr className="border-b border-black">
                  <td className="w-1/2 border-r border-black px-4 py-3 text-center font-bold">Name</td>
                  <td className="px-4 py-3 text-center font-bold">Role / Responsibility</td>
                </tr>
                {(activityData.org_and_staffing || []).length > 0 ? (
                  activityData.org_and_staffing.map((item: OrgStaffingItem, index: number) => (
                    <tr key={index} className="border-b border-black">
                      <td className="border-r border-black px-4 py-3">{val(item.name)}</td>
                      <td className="px-4 py-3 whitespace-pre-line">{val(item.role)}</td>
                    </tr>
                  ))
                ) : Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-black">
                    <td className="border-r border-black px-4 py-3 text-gray-400 italic">Name here</td>
                    <td className="px-4 py-3"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 pt-4 px-4 text-base mb-5">VIII. PLAN OF ACTIVITY</h3>
            <table className="w-full border-t border-black text-sm">
              <tbody>
                <tr className="border-b border-black bg-gray-100">
                  <td className="border-r border-black px-4 py-3 font-bold text-center w-1/4">Time</td>
                  <td className="border-r border-black px-4 py-3 font-bold text-center">Activity</td>
                  <td className="px-4 py-3 font-bold text-center">Person/s Responsible</td>
                </tr>
                {(activityData.plan_of_activity || []).length > 0 ? (
                  activityData.plan_of_activity.map((item: any, i: number) => (
                    <tr key={i} className="border-b border-black">
                      <td className="border-r border-black px-4 py-3 text-xs">{val(item.time)}</td>
                      <td className="border-r border-black px-4 py-3">{val(item.activity)}</td>
                      <td className="px-4 py-3">{val(item.person_responsible)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center px-4 py-6 text-gray-400 italic">No plan of activity data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 pt-4 px-4 text-base">IX. BUDGETARY REQUIREMENT</h3>
            <table className="w-full border-t border-black text-sm mt-6">
              <tbody>
                <tr className="border-b border-black bg-gray-100">
                  <td className="border-r border-black px-4 py-3 font-bold text-center">Item</td>
                  <td className="px-4 py-3 font-bold text-center">Amount (PhP)</td>
                </tr>
                {(activityData.budget_requirements || []).length > 0 ? (
                  activityData.budget_requirements.map((row: BudgetItem, i: number) => (
                    <tr key={i} className="border-b border-black">
                      <td className="border-r border-black px-4 py-3">{val(row.item)}</td>
                      <td className="px-4 py-3 text-right">₱ {row.amount}</td>
                    </tr>
                  ))
                ) : <tr><td colSpan={2} className="text-center px-4 py-3 text-gray-500">No budget data available</td></tr>}
                <tr className="font-bold bg-gray-100 border-t border-black">
                  <td className="border-r border-black px-4 py-3 text-right font-bold">Total</td>
                  <td className="px-4 py-3 text-right">
                    ₱ {(activityData.budget_requirements || []).reduce((sum: number, r: BudgetItem) => sum + Number(r.amount || 0), 0).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
          {/* Signatories */}
          <div className="py-4">
            <p className="italic my-3">Prepared by:</p>
            <p className="py-1 mb-2">Proponent / Project Leader</p>
            <p className="italic">Noted by: <span className="text-gray-500">(for satellite campus)</span></p>
            <div className="grid grid-cols-2">
              <div>
                <p className="pt-4">Dean, College of Industrial Technology</p>
                <p className="pt-4 italic">Endorsed by:</p>
                <p className="pt-6"></p>
                <p className="pt-1">Campus Director, Sta. Cruz</p>
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
    </section>
  );
};

// ================= LOADING SPINNER =================

const Spinner = () => (
  <div className="flex items-center justify-center h-40">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-primaryGreen rounded-full animate-spin"></div>
  </div>
);

// ================= PROJECT TREE NODE =================

interface ProjectTreeNodeProps {
  project: ProjectItem;
  activeTab: TabType;
  selectedProject: ProjectItem | null;
  selectedActivity: ActivityItem | null;
  onSelectProject: (project: ProjectItem) => void;
  onSelectActivity: (project: ProjectItem, activity: ActivityItem) => void;
  activitiesCache: Record<number, ActivityItem[]>;
  loadingCache: Record<number, boolean>;
  onExpandProject: (project: ProjectItem) => void;
}

const ProjectTreeNode: React.FC<ProjectTreeNodeProps> = ({
  project,
  activeTab,
  selectedProject,
  selectedActivity,
  onSelectProject,
  onSelectActivity,
  activitiesCache,
  loadingCache,
  onExpandProject,
}) => {
  const isProjectSelected = selectedProject?.id === project.id;
  const activities = activitiesCache[project.id] ?? [];
  const isLoadingActivities = loadingCache[project.id] ?? false;

  const handleProjectClick = () => {
    if (activeTab === "project") {
      onSelectProject(project);
    } else {
      onExpandProject(project);
    }
  };

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      {/* Project Row */}
      <button
        onClick={handleProjectClick}
        className={`w-full text-left px-4 py-3 transition-colors flex items-start gap-2 border-l-2 ${
          isProjectSelected
            ? "bg-green-50 border-primaryGreen"
            : "border-transparent hover:bg-gray-100 hover:border-gray-300"
        }`}
      >
        <FolderOpen
          size={13}
          className={`mt-0.5 shrink-0 ${isProjectSelected ? "text-primaryGreen" : "text-gray-400"}`}
        />
        <div className="flex-1 min-w-0">
          <p className={`truncate text-xs font-semibold leading-relaxed text-wrap ${
            isProjectSelected ? "text-primaryGreen" : "text-gray-700"
          }`}>
            {project.project_title}
          </p>
          {project.project_leader && (
            <p className="text-[10px] text-gray-400 mt-0.5 truncate">{project.project_leader}</p>
          )}
        </div>
        {activeTab === "activity" && (
          <ChevronRight
            size={12}
            className={`shrink-0 mt-0.5 transition-transform text-gray-400 ${isProjectSelected ? "rotate-90" : ""}`}
          />
        )}
      </button>

      {/* Activities — only in activity tab, only for expanded project */}
      {activeTab === "activity" && isProjectSelected && (
        <div className="bg-white">
          {isLoadingActivities ? (
            <div className="flex items-center justify-center py-4 pl-8">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : activities.length === 0 ? (
            <p className="text-[10px] text-gray-400 py-2 pl-10 italic">No activities</p>
          ) : (
            activities.map((act) => {
              const isActSelected = selectedActivity?.id === act.id;
              return (
                <button
                  key={act.id}
                  onClick={() => onSelectActivity(project, act)}
                  className={`w-full text-left pl-10 pr-4 py-2.5 transition-colors flex items-start gap-2 border-l-2 ${
                    isActSelected
                      ? "bg-blue-50 border-blue-500"
                      : "border-transparent hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <Activity
                    size={11}
                    className={`mt-0.5 shrink-0 ${isActSelected ? "text-blue-500" : "text-gray-300"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`truncate text-[11px] font-medium leading-relaxed text-wrap ${
                      isActSelected ? "text-blue-700" : "text-gray-600"
                    }`}>
                      {act.activity_title}
                    </p>
                    {act.activity_date && (
                      <p className="text-[9px] text-gray-400 mt-0.5">{act.activity_date}</p>
                    )}
                    {act.activity_duration_hours > 0 && (
                      <p className="text-[9px] text-gray-400">{act.activity_duration_hours}h</p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

// ================= MAIN MODAL =================

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen, onClose, proposalData, proposalStatus, proposalTitle,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("program");

  // Project list
  const [projectList, setProjectList] = useState<ProjectItem[]>([]);
  const [projectListLoading, setProjectListLoading] = useState(false);

  // Selected project & its detail
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [projectDetail, setProjectDetail] = useState<any | null>(null);
  const [projectDetailLoading, setProjectDetailLoading] = useState(false);

  // Per-project activity cache
  const [activitiesCache, setActivitiesCache] = useState<Record<number, ActivityItem[]>>({});
  const [activitiesLoadingCache, setActivitiesLoadingCache] = useState<Record<number, boolean>>({});

  // Selected activity & its detail
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [activityDetail, setActivityDetail] = useState<any | null>(null);
  const [activityDetailLoading, setActivityDetailLoading] = useState(false);

  const statusStyle = getStatusStyle(proposalStatus);
  const childId = proposalData?.id;

  // ── Fetch project list when modal opens ──
  useEffect(() => {
    if (!isOpen || !childId) return;
    const load = async () => {
      setProjectListLoading(true);
      try {
        const data: ApiProjectListResponse = await fetchProjectList(childId);
        setProjectList(data.projects || []);
      } catch (err) {
        console.error("[ProjectList] Failed:", err);
      } finally {
        setProjectListLoading(false);
      }
    };
    load();
  }, [isOpen, childId]);

  // ── Reset state when modal closes ──
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("program");
      setSelectedProject(null);
      setProjectDetail(null);
      setActivitiesCache({});
      setActivitiesLoadingCache({});
      setSelectedActivity(null);
      setActivityDetail(null);
    }
  }, [isOpen]);

  // ── Load activities for a project (with cache) ──
  const loadActivitiesForProject = useCallback(async (project: ProjectItem) => {
    if (activitiesCache[project.id] !== undefined) return; // already cached
    setActivitiesLoadingCache((prev) => ({ ...prev, [project.id]: true }));
    try {
      const data: ApiActivityListResponse = await fetchActivityList(project.id);
      setActivitiesCache((prev) => ({ ...prev, [project.id]: data.activities || [] }));
    } catch (err) {
      console.error("[ActivityList] Failed:", err);
      setActivitiesCache((prev) => ({ ...prev, [project.id]: [] }));
    } finally {
      setActivitiesLoadingCache((prev) => ({ ...prev, [project.id]: false }));
    }
  }, [activitiesCache]);

  // ── Select project (project tab) ──
  const handleSelectProject = useCallback(async (project: ProjectItem) => {
    setSelectedProject(project);
    setSelectedActivity(null);
    setActivityDetail(null);
    setProjectDetail(null);
    setProjectDetailLoading(true);
    try {
      const detail = await fetchProjectProposalDetail(project.id);
      setProjectDetail(detail);
    } catch (err) {
      console.error("[ProjectDetail] Failed:", err);
    } finally {
      setProjectDetailLoading(false);
    }
  }, []);

  // ── Expand project in activity tab (toggle + load activities) ──
  const handleExpandProject = useCallback(async (project: ProjectItem) => {
    if (selectedProject?.id === project.id) {
      // Collapse
      setSelectedProject(null);
      setSelectedActivity(null);
      setActivityDetail(null);
      return;
    }
    setSelectedProject(project);
    setSelectedActivity(null);
    setActivityDetail(null);
    await loadActivitiesForProject(project);
  }, [selectedProject, loadActivitiesForProject]);

  // ── Select activity ──
  const handleSelectActivity = useCallback(async (project: ProjectItem, activity: ActivityItem) => {
    setSelectedProject(project);
    setSelectedActivity(activity);
    setActivityDetail(null);
    setActivityDetailLoading(true);
    try {
      const data = await fetchActivityProposalDetail(activity.id);
      setActivityDetail(data);
    } catch (err) {
      console.error("[ActivityDetail] Failed:", err);
    } finally {
      setActivityDetailLoading(false);
    }
  }, []);

  const goToProjectTab = () => {
    setActiveTab("project");
    if (!selectedProject && projectList.length > 0) handleSelectProject(projectList[0]);
  };

  const goToActivityTab = () => {
    setActiveTab("activity");
    setSelectedActivity(null);
    setActivityDetail(null);
  };

  if (!isOpen || !proposalData) return null;

  const showProjectSidebar = activeTab === "project" || activeTab === "activity";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md animate-overlay-enter">
      <div className="bg-white w-full h-[100vh] flex flex-col overflow-hidden animate-modal-enter">

        {/* ── Header ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-10 py-7 bg-primaryGreen border-b border-white/10 relative">

          {/* Left Section */}
          <div className="flex-1 min-w-0">
            
            {/* Breadcrumb + Status */}
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold text-[11px] tracking-[0.15em] uppercase text-white/70">
                Extension Proposal
              </span>

              <ChevronRight size={13} className="text-white/40" />

              <span
                className={`inline-flex items-center px-4 py-[4px] rounded-full text-[12px] uppercase font-semibold backdrop-blur-md border border-white/20 shadow-sm ${statusStyle.className}`}
              >
                {statusStyle.label}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-bold text-[22px] text-white leading-snug truncate pr-10 drop-shadow-sm text-wrap">
              {proposalTitle || val(proposalData.program_title)}
            </h1>
          </div>


          {/* Tabs */}
          <div className="flex items-center gap-2 mr-6 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/15 shadow-inner">

            {/* Program Tab */}
            <button
              onClick={() => setActiveTab("program")}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${
                  activeTab === "program"
                    ? "bg-white text-primaryGreen shadow-md"
                    : "text-white hover:bg-white/20"
                }`}
            >
              <FileText size={15} className="opacity-80 group-hover:opacity-100" />
              Program
            </button>


            {/* Project Tab */}
            <button
              onClick={goToProjectTab}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${
                  activeTab === "project"
                    ? "bg-white text-primaryGreen shadow-md"
                    : "text-white hover:bg-white/20"
                }`}
            >
              <FolderOpen size={15} className="opacity-80 group-hover:opacity-100" />
              Project

              {projectList.length > 0 && (
                <span
                  className={`ml-1 text-[10px] px-2 py-[2px] rounded-full font-bold transition-all
                  ${
                    activeTab === "project"
                      ? "bg-primaryGreen text-white"
                      : "bg-white/30 text-white"
                  }`}
                >
                  {projectList.length}
                </span>
              )}
            </button>


            {/* Activity Tab */}
            <button
              onClick={goToActivityTab}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${
                  activeTab === "activity"
                    ? "bg-white text-primaryGreen shadow-md"
                    : "text-white hover:bg-white/20"
                }`}
            >
              <Activity size={15} className="opacity-80 group-hover:opacity-100" />
              Activity
            </button>

          </div>


          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/90 text-gray-600 shadow-sm border border-white/40
                      hover:bg-red-50 hover:text-red-600 hover:border-red-200
                      transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <X size={17} />
          </button>

        </div>

        {/* ── Body: Sidebar + Content ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Sidebar ── */}
          {showProjectSidebar && (
            <div className="w-72 flex-shrink-0 bg-gray-50/80 backdrop-blur-sm border-r border-gray-200 flex flex-col overflow-hidden">

              {/* Header */}
              <div className="sticky top-0 z-10 px-5 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center gap-2">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-primaryGreen/10">
                  <FolderOpen size={14} className="text-primaryGreen" />
                </div>

                <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">
                  {activeTab === "project" ? "Projects" : "Projects & Activities"}
                </span>
              </div>


              {/* Content */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                {projectListLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-primaryGreen rounded-full animate-spin"></div>
                    <p className="text-xs text-gray-400">Loading projects...</p>
                  </div>

                ) : projectList.length === 0 ? (

                  <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                      <FolderOpen size={18} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">No projects yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Projects will appear here once created.
                    </p>
                  </div>

                ) : (

                  projectList.map((proj) => (
                    <div
                      key={proj.id}
                      className="group rounded-xl transition-all duration-200 hover:bg-white hover:shadow-sm"
                    >
                      <ProjectTreeNode
                        project={proj}
                        activeTab={activeTab}
                        selectedProject={selectedProject}
                        selectedActivity={selectedActivity}
                        onSelectProject={handleSelectProject}
                        onSelectActivity={handleSelectActivity}
                        activitiesCache={activitiesCache}
                        loadingCache={activitiesLoadingCache}
                        onExpandProject={handleExpandProject}
                      />
                    </div>
                  ))

                )}
              </div>

            </div>
          )}

          {/* ── Main Content Area ── */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-10">

              {/* PROGRAM TAB */}
              {activeTab === "program" && (
                <ProgramForm proposalData={proposalData} />
              )}

              {/* PROJECT TAB */}
              {activeTab === "project" && (
                <>
                  {!selectedProject ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                      <FolderOpen size={40} className="text-gray-300" />
                      <p className="font-medium">Select a project from the sidebar</p>
                    </div>
                  ) : projectDetailLoading ? (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <FormSkeleton lines={6} />
                      </div>
                  ) : (
                    <ProjectForm
                      projectData={projectDetail || selectedProject}
                      programTitle={proposalData.program_title}
                    />
                  )}
                </>
              )}

              {/* ACTIVITY TAB */}
              {activeTab === "activity" && (
                <>
                  {!selectedProject ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                      <FolderOpen size={40} className="text-gray-300" />
                      <p className="font-medium">Select a project to expand its activities</p>
                    </div>
                  ) : !selectedActivity ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] w-full text-gray-500 gap-3">
                        <Activity size={40} className="text-gray-300" />
                        <p className="font-medium">Select an activity from the sidebar</p>
                        <p className="text-sm text-gray-400">{selectedProject.project_title}</p>
                    </div>
                  ) : activityDetailLoading ? (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <FormSkeleton lines={6} />
                      </div>
                  ) : (
                    <ActivityForm
                      activityData={activityDetail || selectedActivity}
                      programTitle={proposalData.program_title}
                      projectTitle={selectedProject.project_title}
                    />
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;