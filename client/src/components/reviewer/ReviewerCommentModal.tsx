import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Send,
  ChevronRight,
  FileText,
  FolderOpen,
  Activity,
} from "lucide-react";
import { getStatusStyle } from "@/utils/statusStyles";
import CommentInput from "@/components/reviewer/CommentInput";
import PreviousComment from "@/components/reviewer/PreviousComment";
import FormSkeleton from "@/components/skeletons/FormSkeleton";
import { useToast } from "@/context/toast";
import {
  fetchProjectList,
  fetchActivityList,
  fetchProjectProposalDetail,
  fetchActivityProposalDetail,
  type ApiProjectListResponse,
  type ApiActivityListResponse,
  type ApiProject,
  type ApiActivity,
} from "@/utils/reviewer-api";

// ================= TYPES =================

interface User {
  user_id: string;
  fullname: string;
}

interface History {
  history_id: string;
  proposal_id: string;
  status: string;
  version_no: number;
  created_at: string;
}

interface Review {
  id: string;
  comment: string;
  reviewer_name?: string;
  created_at?: string;
}

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

type ProjectItem = ApiProject;
type ActivityItem = ApiActivity;
type TabType = "program" | "project" | "activity";

interface Comments {
  [key: string]: string;
}

interface ReviewerCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalData: any | null;        // Proposal from ReviewProposal (has child_id, title, status)
  proposalDetail: ApiProposalDetail | null; // Full detail already fetched
  reviewe?: string;
  review_id?: string;
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
  "Year 1 Q1", "Year 1 Q2", "Year 1 Q3", "Year 1 Q4",
  "Year 2 Q1", "Year 2 Q2", "Year 2 Q3", "Year 2 Q4",
  "Year 3 Q1", "Year 3 Q2", "Year 3 Q3", "Year 3 Q4",
];

// ================= CHECKBOX LIST =================

const CheckboxList = ({
  items,
  checked,
}: {
  items: string[];
  checked: (item: string) => boolean;
}) => (
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

const ProgramForm: React.FC<{
  proposalData: ApiProposalDetail;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  showCommentInputs: boolean;
}> = ({ proposalData, comments, onCommentChange, alreadyReviewed, showCommentInputs }) => {
  const workplanMap: Record<string, string> = {};
  (proposalData.workplan || []).forEach(({ month, activity }) => {
    workplanMap[month] = activity;
  });

  return (
    <section className="max-w-5xl mx-auto px-5 py-5 border border-gray-200 shadow-sm font-sans text-gray-900 leading-relaxed">
      <div className="text-center mb-8 space-y-1">
        <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
        <p className="font-bold">Iba, Zambales</p>
        <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Program Proposal</p>
      </div>

      <div className="border border-black">
        <div className="p-2">
          <h2 className="text-base font-bold">I. PROFILE</h2>
          <div className="my-2">
            <p className="font-bold">Program Title: <span className="font-normal">{val(proposalData.program_title)}</span></p>
            <p className="font-bold">Program Leader: <span className="font-normal">{val(proposalData.program_leader)}</span></p>
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
                    <td className="w-1/4 border-r border-black px-4 py-3 font-bold">Project Leader:</td>
                    <td className="px-4 py-3">{val(proj.leader)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-1/4 border-r border-black px-4 py-3 font-bold">Project Duration (months):</td>
                    <td className="px-4 py-3">{val(proj.duration_months)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-1/4 border-r border-black px-4 py-3 font-bold">Start Date:</td>
                    <td className="px-4 py-3">{val(proj.start_date)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-1/4 border-r border-black px-4 py-3 font-bold">End Date:</td>
                    <td className="px-4 py-3">{val(proj.end_date)}</td>
                  </tr>
                </React.Fragment>
              ))}
              <tr className="border-b border-t border-black">
                <p className="px-3 py-2 font-bold">IMPLEMENTING AGENCY <span className="font-normal">/ College / Mandated Program:</span></p>
                <p className="px-3 mb-2">{arrVal(proposalData.implementing_agency)}</p>
              </tr>
              <tr className="border-b border-black">
                <p className="px-3 py-2 font-bold">COOPERATING AGENCY/IES <span className="font-normal">(Name/s and Address/es)</span></p>
                <p className="px-3 mb-2 font-normal">{arrVal(proposalData.cooperating_agencies)}</p>
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
                    items={["General", "Environment and Climate Change (for CECC)", "Gender and Development (for GAD)", "Mango-Related (for RMC)"]}
                    checked={(label) => proposalData.tags?.some((t) => t.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                  <p className="font-bold mt-5 mb-3 text-base">CLUSTER</p>
                  <CheckboxList
                    items={["Health, Education, and Social Sciences", "Engineering, Industry, Information Technology", "Environment and Natural Resources", "Tourism, Hospitality Management, Entrepreneurship, Criminal Justice", "Graduate Studies", "Fisheries", "Agriculture, Forestry"]}
                    checked={(label) => proposalData.clusters?.some((c) => c.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                </td>
                <td className="px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3 text-base">EXTENSION AGENDA</p>
                  <CheckboxList
                    items={["Business Management and Livelihood Skills Development", "Accountability, Good Governance, and Peace and Order", "Youth and Adult Functional Literacy and Education", "Accessibility, Inclusivity, and Gender and Development", "Nutrition, Health, and Wellness", "Indigenous People's Rights and Cultural Heritage Preservation", "Human Capital Development", "Adoption and Commercialization of Appropriate Technologies", "Natural Resources, Climate Change, and Disaster Risk Reduction Management"]}
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
          {/* II. RATIONALE */}
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">II. RATIONALE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(proposalData.rationale)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Rationale" onCommentChange={onCommentChange}
              InputValue="rationale_feedback" value={comments["rationale_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          {/* III. SIGNIFICANCE */}
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">III. SIGNIFICANCE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(proposalData.significance)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Significance" onCommentChange={onCommentChange}
              InputValue="significance_feedback" value={comments["significance_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          {/* IV. OBJECTIVES */}
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">IV. OBJECTIVES</h3>
            <p className="text-base font-semibold mb-2 mt-3">General:</p>
            <p className="p-5 bg-gray-100">{val(proposalData.general_objectives)}</p>
            <p className="text-base font-semibold mb-2 mt-3">Specific:</p>
            <p className="p-5 bg-gray-100">{val(proposalData.specific_objectives)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Objectives" onCommentChange={onCommentChange}
              InputValue="objectives_feedback" value={comments["objectives_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          {/* V. METHODOLOGY */}
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
          {showCommentInputs && (
            <CommentInput sectionName="Methodology" onCommentChange={onCommentChange}
              InputValue="methodology_feedback" value={comments["methodology_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          {/* VI. EXPECTED OUTPUT */}
          <div>
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
          {showCommentInputs && (
            <CommentInput sectionName="Expected Output" onCommentChange={onCommentChange}
              InputValue="expected_output_feedback" value={comments["expected_output_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          {/* VII. SUSTAINABILITY PLAN */}
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">VII. SUSTAINABILITY PLAN</h3>
            <p className="text-base whitespace-pre-line">{val(proposalData.sustainability_plan)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Sustainability Plan" onCommentChange={onCommentChange}
              InputValue="sustainability_feedback" value={comments["sustainability_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          {/* VIII. ORG & STAFFING */}
          <div>
            <h3 className="font-bold text-gray-900 p-2 text-base">VIII. ORGANIZATION AND STAFFING</h3>
            <table className="w-full border-t border-black text-sm">
              <tbody>
                <tr className="border-b border-black">
                  <td className="w-1/2 border-r border-black px-4 py-3 text-center font-bold">Name</td>
                  <td className="px-4 py-3 text-center font-bold">Role / Responsibility</td>
                </tr>
                {(proposalData.org_and_staffing || []).length > 0
                  ? proposalData.org_and_staffing.map((item, index) => (
                    <tr key={index} className="border-b border-black">
                      <td className="border-r border-black px-4 py-3">{val(item.name)}</td>
                      <td className="px-4 py-3 whitespace-pre-line">{val(item.role)}</td>
                    </tr>
                  ))
                  : Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-black">
                      <td className="border-r border-black px-4 py-3 text-gray-400 italic">Name here</td>
                      <td className="px-4 py-3"></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Organization & Staffing" onCommentChange={onCommentChange}
              InputValue="org_staffing_feedback" value={comments["org_staffing_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          {/* IX. WORKPLAN */}
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

          {/* X. BUDGET */}
          <div>
            <h3 className="font-bold text-gray-900 text-base p-2">X. BUDGETARY REQUIREMENT</h3>
            <table className="w-full border-t border-black text-sm">
              <tbody>
                <tr className="border-b border-black bg-gray-100">
                  <td className="border-r border-black px-4 py-3 font-bold text-center">Item</td>
                  <td className="px-4 py-3 font-bold text-center">Amount (PhP)</td>
                </tr>
                {(proposalData.budget_requirements || []).length > 0
                  ? proposalData.budget_requirements.map((row, i) => (
                    <tr key={i} className="border-b border-black">
                      <td className="border-r border-black px-4 py-3">{val(row.item)}</td>
                      <td className="px-4 py-3 text-right">₱ {row.amount}</td>
                    </tr>
                  ))
                  : <tr><td colSpan={2} className="text-center px-4 py-3 text-gray-500">No budget data available</td></tr>}
                <tr className="font-bold bg-gray-100">
                  <td className="border-r border-black px-4 py-3 text-right font-bold">Total</td>
                  <td className="px-4 py-3 text-right">
                    ₱ {(proposalData.budget_requirements || []).reduce((sum, r) => sum + Number(r.amount || 0), 0).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Budget" onCommentChange={onCommentChange}
              InputValue="budget_feedback" value={comments["budget_feedback"] || ""} disabled={alreadyReviewed} />
          )}
        </div>
      </div>
    </section>
  );
};

// ================= PROJECT FORM =================

const ProjectForm: React.FC<{
  projectData: any;
  programTitle: string;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  showCommentInputs: boolean;
}> = ({ projectData, programTitle, comments, onCommentChange, alreadyReviewed, showCommentInputs }) => {
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
            <p className="font-bold">Program Title: <span className="font-normal">{val(programTitle)}</span></p>
            <p className="font-bold">Project Title: <span className="font-normal">{val(projectData.project_title)}</span></p>
            <p className="font-bold">Project Leader: <span className="font-normal">{val(projectData.project_leader)}</span></p>
            <p className="font-bold">Project Members: <span className="font-normal">{val(projectData.members)}</span></p>
            <br />
            <p className="font-bold">Project Duration: <span className="font-normal">{val(projectData.duration_months)}</span></p>
            <p className="font-bold">Start Date: <span className="font-normal">{val(projectData.start_date)}</span></p>
            <p className="font-bold">End Date: <span className="font-normal">{val(projectData.end_date)}</span></p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-t border-black">
                <p className="px-3 py-2 font-bold">IMPLEMENTING AGENCY <span className="font-normal">/ College / Mandated Program:</span></p>
                <p className="px-3 mb-2">{arrVal(projectData.implementing_agency)}</p>
              </tr>
              <tr className="border-b border-black">
                <p className="px-3 py-2 font-bold">COOPERATING AGENCY/IES <span className="font-normal">(Name/s and Address/es)</span></p>
                <p className="px-3 mb-2 font-normal">{arrVal(projectData.cooperating_agencies)}</p>
              </tr>
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

        <div className="text-gray-700 leading-relaxed">
          <div className="px-2 py-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">II. RATIONALE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(projectData.rationale)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Project Rationale" onCommentChange={onCommentChange}
              InputValue="proj_rationale_feedback" value={comments["proj_rationale_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">III. SIGNIFICANCE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(projectData.significance)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Project Significance" onCommentChange={onCommentChange}
              InputValue="proj_significance_feedback" value={comments["proj_significance_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          <div className="border-b border-black p-2">
            <h3 className="font-bold text-gray-900 text-base">IV. OBJECTIVES</h3>
            <p className="text-base font-semibold mb-2 mt-3 ml-2">General:</p>
            <p className="p-5 bg-gray-100">{val(projectData.general_objectives)}</p>
            <p className="text-base font-semibold mb-2 mt-3 ml-2">Specific:</p>
            <p className="p-5 bg-gray-100">{val(projectData.specific_objectives)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Project Objectives" onCommentChange={onCommentChange}
              InputValue="proj_objectives_feedback" value={comments["proj_objectives_feedback"] || ""} disabled={alreadyReviewed} />
          )}

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
          {showCommentInputs && (
            <CommentInput sectionName="Project Methodology" onCommentChange={onCommentChange}
              InputValue="proj_methodology_feedback" value={comments["proj_methodology_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          <div>
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

          <div>
            <h3 className="font-bold text-gray-900 text-base p-2">VII. BUDGETARY REQUIREMENT</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-t border-black bg-gray-100">
                  <td className="border-r border-black px-4 py-3 font-bold text-center">Item</td>
                  <td className="px-4 py-3 font-bold text-center">Amount (PhP)</td>
                </tr>
                {(projectData.budget_requirements || []).length > 0
                  ? projectData.budget_requirements.map((row: BudgetItem, i: number) => (
                    <tr key={i} className="border-b border-black">
                      <td className="border-r border-black px-4 py-3">{val(row.item)}</td>
                      <td className="px-4 py-3 text-right">₱ {row.amount}</td>
                    </tr>
                  ))
                  : <tr><td colSpan={2} className="text-center px-4 py-3 text-gray-500">No budget data available</td></tr>}
                <tr className="font-bold bg-gray-100 border-t border-b border-black">
                  <td className="border-r border-black px-4 py-3 text-right font-bold">Total</td>
                  <td className="px-4 py-3 text-right">
                    ₱ {(projectData.budget_requirements || []).reduce((sum: number, r: BudgetItem) => sum + Number(r.amount || 0), 0).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Project Budget" onCommentChange={onCommentChange}
              InputValue="proj_budget_feedback" value={comments["proj_budget_feedback"] || ""} disabled={alreadyReviewed} />
          )}
        </div>
      </div>
    </section>
  );
};

// ================= ACTIVITY FORM =================

const ActivityForm: React.FC<{
  activityData: any;
  programTitle: string;
  projectTitle: string;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  showCommentInputs: boolean;
}> = ({ activityData, programTitle, projectTitle, comments, onCommentChange, alreadyReviewed, showCommentInputs }) => {
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
            <p className="font-bold">Activity Duration: <span className="font-normal">{val(activityData.activity_duration_hours)} hours</span></p>
            <p className="font-normal">Date: <span className="font-normal">{val(activityData.activity_date)}</span></p>
          </div>
        </div>

        <div className="text-gray-700 leading-relaxed">
          <div className="p-4 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">II. RATIONALE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.rationale)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Activity Rationale" onCommentChange={onCommentChange}
              InputValue="act_rationale_feedback" value={comments["act_rationale_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          <div className="p-4 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">III. OBJECTIVES OF THE ACTIVITY</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.objectives)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Activity Objectives" onCommentChange={onCommentChange}
              InputValue="act_objectives_feedback" value={comments["act_objectives_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          <div className="p-4 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">IV. METHODOLOGY</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.methodology)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Activity Methodology" onCommentChange={onCommentChange}
              InputValue="act_methodology_feedback" value={comments["act_methodology_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          <div>
            <h3 className="font-bold text-gray-900 pt-4 px-4 text-base mb-5">V. EXPECTED OUTPUT/OUTCOME</h3>
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
            <h3 className="font-bold text-gray-900 pt-4 px-4 text-base mb-5">VI. PLAN OF ACTIVITY</h3>
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
            <h3 className="font-bold text-gray-900 pt-4 px-4 text-base">VII. BUDGETARY REQUIREMENT</h3>
            <table className="w-full border-t border-black text-sm mt-6">
              <tbody>
                <tr className="border-b border-black bg-gray-100">
                  <td className="border-r border-black px-4 py-3 font-bold text-center">Item</td>
                  <td className="px-4 py-3 font-bold text-center">Amount (PhP)</td>
                </tr>
                {(activityData.budget_requirements || []).length > 0
                  ? activityData.budget_requirements.map((row: BudgetItem, i: number) => (
                    <tr key={i} className="border-b border-black">
                      <td className="border-r border-black px-4 py-3">{val(row.item)}</td>
                      <td className="px-4 py-3 text-right">₱ {row.amount}</td>
                    </tr>
                  ))
                  : <tr><td colSpan={2} className="text-center px-4 py-3 text-gray-500">No budget data available</td></tr>}
                <tr className="font-bold bg-gray-100 border-t border-black">
                  <td className="border-r border-black px-4 py-3 text-right font-bold">Total</td>
                  <td className="px-4 py-3 text-right">
                    ₱ {(activityData.budget_requirements || []).reduce((sum: number, r: BudgetItem) => sum + Number(r.amount || 0), 0).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Activity Budget" onCommentChange={onCommentChange}
              InputValue="act_budget_feedback" value={comments["act_budget_feedback"] || ""} disabled={alreadyReviewed} />
          )}
        </div>
      </div>
    </section>
  );
};

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
  project, activeTab, selectedProject, selectedActivity,
  onSelectProject, onSelectActivity, activitiesCache, loadingCache, onExpandProject,
}) => {
  const isProjectSelected = selectedProject?.id === project.id;
  const activities = activitiesCache[project.id] ?? [];
  const isLoadingActivities = loadingCache[project.id] ?? false;

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => activeTab === "project" ? onSelectProject(project) : onExpandProject(project)}
        className={`w-full text-left px-4 py-3 transition-colors flex items-start gap-2 border-l-2 ${
          isProjectSelected ? "bg-green-50 border-primaryGreen" : "border-transparent hover:bg-gray-100 hover:border-gray-300"
        }`}
      >
        <FolderOpen size={13} className={`mt-0.5 shrink-0 ${isProjectSelected ? "text-primaryGreen" : "text-gray-400"}`} />
        <div className="flex-1 min-w-0">
          <p className={`truncate text-xs font-semibold leading-relaxed text-wrap ${isProjectSelected ? "text-primaryGreen" : "text-gray-700"}`}>
            {project.project_title}
          </p>
          {project.project_leader && (
            <p className="text-[10px] text-gray-400 mt-0.5 truncate">{project.project_leader}</p>
          )}
        </div>
        {activeTab === "activity" && (
          <ChevronRight size={12} className={`shrink-0 mt-0.5 transition-transform text-gray-400 ${isProjectSelected ? "rotate-90" : ""}`} />
        )}
      </button>

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
                    isActSelected ? "bg-blue-50 border-blue-500" : "border-transparent hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <Activity size={11} className={`mt-0.5 shrink-0 ${isActSelected ? "text-blue-500" : "text-gray-300"}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`truncate text-[11px] font-medium leading-relaxed text-wrap ${isActSelected ? "text-blue-700" : "text-gray-600"}`}>
                      {act.activity_title}
                    </p>
                    {act.activity_date && <p className="text-[9px] text-gray-400 mt-0.5">{act.activity_date}</p>}
                    {act.activity_duration_hours > 0 && <p className="text-[9px] text-gray-400">{act.activity_duration_hours}h</p>}
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

const ReviewerCommentModal: React.FC<ReviewerCommentModalProps> = ({
  isOpen, onClose, proposalData, proposalDetail, reviewe, review_id,
}) => {
  const { showToast } = useToast();

  // ── Tab & navigation state ───────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabType>("program");

  // Project list
  const [projectList, setProjectList] = useState<ProjectItem[]>([]);
  const [projectListLoading, setProjectListLoading] = useState(false);

  // Selected project & detail
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [projectDetail, setProjectDetail] = useState<any | null>(null);
  const [projectDetailLoading, setProjectDetailLoading] = useState(false);

  // Activity cache
  const [activitiesCache, setActivitiesCache] = useState<Record<number, ActivityItem[]>>({});
  const [activitiesLoadingCache, setActivitiesLoadingCache] = useState<Record<number, boolean>>({});

  // Selected activity & detail
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [activityDetail, setActivityDetail] = useState<any | null>(null);
  const [activityDetailLoading, setActivityDetailLoading] = useState(false);

  // ── Review state ─────────────────────────────────────────────────────────
  const [comments, setComments] = useState<Comments>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [user, setUser] = useState<{ user_id: string; fullname: string } | null>(null);

  // ── History state ─────────────────────────────────────────────────────────
  const [history, setHistory] = useState<History[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistoryVersion, setSelectedHistoryVersion] = useState<History | null>(null);

  const childId = proposalDetail?.id;
  const statusStyle = proposalData ? getStatusStyle(proposalData.status ?? "") : { className: "", label: "" };

  // Show comment inputs only for current version (no history selected or current selected)
  const showCommentInputs = !selectedHistoryVersion || selectedHistoryVersion.status === "current";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // ── Fetch project list when modal opens ──────────────────────────────────
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

  // ── Fetch history when modal opens ───────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !proposalData?.proposal_id) return;
    const load = async () => {
      setHistoryLoading(true);
      try {
        // Replace with your actual history fetch API call
        // const data = await fetchProposalHistory(proposalData.proposal_id);
        // setHistory(data);
        setHistory([]); // placeholder
      } catch (err) {
        console.error("[History] Failed:", err);
      } finally {
        setHistoryLoading(false);
      }
    };
    load();
  }, [isOpen, proposalData?.proposal_id]);

  // ── Reset on close ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("program");
      setSelectedProject(null);
      setProjectDetail(null);
      setActivitiesCache({});
      setActivitiesLoadingCache({});
      setSelectedActivity(null);
      setActivityDetail(null);
      setComments({});
      setHistory([]);
      setSelectedHistoryVersion(null);
    }
  }, [isOpen]);

  // ── Activity loading ──────────────────────────────────────────────────────
  const loadActivitiesForProject = useCallback(async (project: ProjectItem) => {
    if (activitiesCache[project.id] !== undefined) return;
    setActivitiesLoadingCache((prev) => ({ ...prev, [project.id]: true }));
    try {
      const data: ApiActivityListResponse = await fetchActivityList(project.id);
      setActivitiesCache((prev) => ({ ...prev, [project.id]: data.activities || [] }));
    } catch (err) {
      setActivitiesCache((prev) => ({ ...prev, [project.id]: [] }));
    } finally {
      setActivitiesLoadingCache((prev) => ({ ...prev, [project.id]: false }));
    }
  }, [activitiesCache]);

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

  const handleExpandProject = useCallback(async (project: ProjectItem) => {
    if (selectedProject?.id === project.id) {
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

  // ── Review actions ────────────────────────────────────────────────────────
  const handleCommentChange = (inputValue: string, commentValue: string) => {
    setComments((prev) => ({ ...prev, [inputValue]: commentValue }));
  };

  const hasAnyComment = Object.values(comments).some((c) => c && c.trim() !== "");

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      console.log("Submitting review:", comments);
      showToast("Review submitted successfully!", "success");
      setComments({});
      onClose();
    } catch (err) {
      showToast("Failed to submit review.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      console.log("Approving proposal:", proposalData?.proposal_id);
      showToast("Proposal approved successfully!", "success");
      onClose();
    } catch (err) {
      showToast("Failed to approve proposal.", "error");
    } finally {
      setIsApproving(false);
    }
  };

  if (!isOpen || !proposalData) return null;

  const showProjectSidebar = activeTab === "project" || activeTab === "activity";

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md animate-overlay-enter">
        {/* ── Main Modal Card ── */}
        <div className="bg-white flex-1 h-[100vh] flex flex-col overflow-hidden animate-modal-enter">

          {/* ── Header (mirrors ViewDocument) ── */}
          <div className="flex-shrink-0 flex items-center justify-between px-10 py-6 bg-primaryGreen border-b border-white/10 relative">

            {/* Left: title + status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-[11px] tracking-[0.15em] uppercase text-white/70">
                  Review Proposal
                </span>
                <ChevronRight size={13} className="text-white/40" />
                <span className={`inline-flex items-center px-4 py-[4px] rounded-full text-[12px] uppercase font-semibold backdrop-blur-md border border-white/20 shadow-sm ${statusStyle.className}`}>
                  {statusStyle.label}
                </span>
              </div>
              <h1 className="font-bold text-[22px] text-white leading-snug truncate pr-10 drop-shadow-sm text-wrap">
                {proposalData.title}
              </h1>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mr-6 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/15 shadow-inner">
              <button
                onClick={() => setActiveTab("program")}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "program" ? "bg-white text-primaryGreen shadow-md" : "text-white hover:bg-white/20"
                }`}
              >
                <FileText size={15} />
                Program
              </button>
              <button
                onClick={goToProjectTab}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "project" ? "bg-white text-primaryGreen shadow-md" : "text-white hover:bg-white/20"
                }`}
              >
                <FolderOpen size={15} />
                Project
                {projectList.length > 0 && (
                  <span className={`ml-1 text-[10px] px-2 py-[2px] rounded-full font-bold ${
                    activeTab === "project" ? "bg-primaryGreen text-white" : "bg-white/30 text-white"
                  }`}>
                    {projectList.length}
                  </span>
                )}
              </button>
              <button
                onClick={goToActivityTab}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "activity" ? "bg-white text-primaryGreen shadow-md" : "text-white hover:bg-white/20"
                }`}
              >
                <Activity size={15} />
                Activity
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/90 text-gray-600 shadow-sm border border-white/40
                        hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <X size={17} />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="flex flex-1 overflow-hidden">

            {/* ── Project/Activity Sidebar ── */}
            {showProjectSidebar && (
              <div className="w-64 flex-shrink-0 bg-gray-50/80 border-r border-gray-200 flex flex-col overflow-hidden">
                <div className="sticky top-0 z-10 px-5 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-primaryGreen/10">
                    <FolderOpen size={14} className="text-primaryGreen" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">
                    {activeTab === "project" ? "Projects" : "Projects & Activities"}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
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
                    </div>
                  ) : (
                    projectList.map((proj) => (
                      <div key={proj.id} className="group rounded-xl transition-all duration-200 hover:bg-white hover:shadow-sm">
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

            {/* ── Document Content ── */}
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="p-10">

                {/* PROGRAM TAB */}
                {activeTab === "program" && proposalDetail && (
                  <ProgramForm
                    proposalData={proposalDetail}
                    comments={comments}
                    onCommentChange={handleCommentChange}
                    alreadyReviewed={alreadyReviewed}
                    showCommentInputs={showCommentInputs}
                  />
                )}
                {activeTab === "program" && !proposalDetail && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8">
                    <FormSkeleton lines={6} />
                  </div>
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
                      <div className="bg-white rounded-2xl border border-gray-100 p-8">
                        <FormSkeleton lines={6} />
                      </div>
                    ) : (
                      <ProjectForm
                        projectData={projectDetail || selectedProject}
                        programTitle={proposalDetail?.program_title ?? ""}
                        comments={comments}
                        onCommentChange={handleCommentChange}
                        alreadyReviewed={alreadyReviewed}
                        showCommentInputs={showCommentInputs}
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
                      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 gap-3">
                        <Activity size={40} className="text-gray-300" />
                        <p className="font-medium">Select an activity from the sidebar</p>
                        <p className="text-sm text-gray-400">{selectedProject.project_title}</p>
                      </div>
                    ) : activityDetailLoading ? (
                      <div className="bg-white rounded-2xl border border-gray-100 p-8">
                        <FormSkeleton lines={6} />
                      </div>
                    ) : (
                      <ActivityForm
                        activityData={activityDetail || selectedActivity}
                        programTitle={proposalDetail?.program_title ?? ""}
                        projectTitle={selectedProject.project_title}
                        comments={comments}
                        onCommentChange={handleCommentChange}
                        alreadyReviewed={alreadyReviewed}
                        showCommentInputs={showCommentInputs}
                      />
                    )}
                  </>
                )}

                {/* ── Action Buttons ── */}
                {showCommentInputs && (
                  <div className="mt-10 pt-6 border-t border-gray-100">
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={onClose}
                        className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitReview}
                        disabled={isSubmitting || alreadyReviewed}
                        className="px-8 py-3 bg-primaryGreen text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Submit Review
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowApproveConfirm(true)}
                        disabled={alreadyReviewed || hasAnyComment}
                        className="px-8 py-3 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* ── History Panel (retained exactly) ── */}
            <div className="bg-white h-full w-72 flex-shrink-0 shadow-sm border-l border-gray-200 flex flex-col">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">History</h2>
                  <p className="text-xs text-gray-400 mt-1">Recent changes of proposal</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {historyLoading ? (
                  <div className="px-2 py-2 space-y-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-xl bg-gray-100">
                        <div className="w-9 h-9 rounded-full bg-gray-300" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
                          <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-10">No history available</p>
                ) : (
                  <div className="space-y-2">
                    {history.map((item) => {
                      const label = item.status === "current" ? "Current Proposal" : `Revision ${item.version_no}`;
                      const formattedDate = new Date(item.created_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      });
                      const isSelected = selectedHistoryVersion?.history_id === item.history_id;
                      return (
                        <div
                          key={item.history_id}
                          onClick={() => setSelectedHistoryVersion(isSelected ? null : item)}
                          className={`flex items-start gap-3 p-4 rounded-xl transition cursor-pointer ${
                            isSelected ? "bg-emerald-100 border-2 border-emerald-500" : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-semibold">
                            V{item.version_no}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 font-medium">{label}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Proposal ID {item.proposal_id} • {formattedDate}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Approve Confirm Dialog ── */}
      {showApproveConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-[420px] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Confirm Approval</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Do you want to approve the proposal entitled{" "}
              <span className="font-semibold text-gray-800">"{proposalData?.title}"</span>?
            </p>
            <p className="text-sm text-red-500 mt-2">Are you sure there are no comments to add?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowApproveConfirm(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowApproveConfirm(false); handleApprove(); }}
                disabled={isApproving}
                className="px-6 py-2 bg-primaryGreen text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                {isApproving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Approving...
                  </>
                ) : "Yes, Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewerCommentModal;