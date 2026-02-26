import { arrVal, NA, SIX_PS_LABELS, val } from "@/constants";
import CommentInput from "../reviewer/CommentInput";
import { type BudgetItem, type Comments, type MethodologyPhase, type WorkplanItem } from "../reviewer/ReviewerCommentModal";
import { CheckboxList } from "./checkbox-list";

export const ProjectForm: React.FC<{
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
    <section className="max-w-5xl mx-auto border border-gray-200 py-5 shadow-sm font-serif text-gray-900 leading-relaxed">
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
        {showCommentInputs && (
          <CommentInput sectionName="Implementing Agency" onCommentChange={onCommentChange}
            InputValue="proj_implementing_agency_feedback" value={comments["proj_implementing_agency_feedback"] || ""} disabled={alreadyReviewed} />
        )}

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
        {showCommentInputs && (
          <CommentInput sectionName="Extension Site/s" onCommentChange={onCommentChange}
            InputValue="proj_extension_site_feedback" value={comments["proj_extension_site_feedback"] || ""} disabled={alreadyReviewed} />
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-b border-black text-sm">
            <tbody>
              <tr className="border-b border-black">
                <td className="border-r border-black px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3 text-base">TAGGING</p>
                  <CheckboxList
                    items={["General", "Environment and Climate Change (for CECC)", "Gender and Development (for GAD)", "Mango-Related (for RMC)"]}
                    checked={(label) => projectData.tags?.some((t: string) => t.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                  <p className="font-bold mt-5 mb-3 text-base">CLUSTER</p>
                  <CheckboxList
                    items={["Health, Education, and Social Sciences", "Engineering, Industry, Information Technology", "Environment and Natural Resources", "Tourism, Hospitality Management, Entrepreneurship, Criminal Justice", "Graduate Studies", "Fisheries", "Agriculture, Forestry"]}
                    checked={(label) => projectData.clusters?.some((c: string) => c.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                </td>
                <td className="px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3 text-base">EXTENSION AGENDA</p>
                  <CheckboxList
                    items={["Business Management and Livelihood Skills Development", "Accountability, Good Governance, and Peace and Order", "Youth and Adult Functional Literacy and Education", "Accessibility, Inclusivity, and Gender and Development", "Nutrition, Health, and Wellness", "Indigenous People's Rights and Cultural Heritage Preservation", "Human Capital Development", "Adoption and Commercialization of Appropriate Technologies", "Natural Resources, Climate Change, and Disaster Risk Reduction Management"]}
                    checked={(label) => projectData.agendas?.some((a: string) => a.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black px-4 py-3 font-bold">Sustainable Development Goal (SDG) Addressed</td>
                <td className="border-r border-black px-4 py-3 font-bold">College/Campus/Mandated Academic Program:</td>
              </tr>
              <tr>
                <td className="px-4 py-3 border-r border-black">{val(projectData.sdg_addressed)}</td>
                <td className="px-4 py-3">{val(projectData.mandated_academic_program)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {showCommentInputs && (
          <CommentInput sectionName="Tagging, Cluster & Extension Agenda" onCommentChange={onCommentChange}
            InputValue="proj_tagging_cluster_extension_feedback" value={comments["proj_tagging_cluster_extension_feedback"] || ""} disabled={alreadyReviewed} />
        )}
        {showCommentInputs && (
          <CommentInput sectionName="SDG & Academic Program" onCommentChange={onCommentChange}
            InputValue="proj_sdg_academic_program_feedback" value={comments["proj_sdg_academic_program_feedback"] || ""} disabled={alreadyReviewed} />
        )}

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
            <table className="w-full border-t border-black text-sm">
              <tbody>
                <tr className="border-b border-black">
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
          {showCommentInputs && (
            <CommentInput sectionName="Expected Output" onCommentChange={onCommentChange}
              InputValue="proj_expected_output_feedback" value={comments["proj_expected_output_feedback"] || ""} disabled={alreadyReviewed} />
          )}

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