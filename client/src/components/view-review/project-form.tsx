import { arrVal, NA, SIX_PS_LABELS, val } from "@/constants";
import CommentInput from "../reviewer/CommentInput";
import { type BudgetItem, type Comments, type MethodologyPhase, type WorkplanItem } from "../reviewer/ReviewerCommentModal";
import { CheckboxList } from "./checkbox-list";
import { VerticalLine } from "./program-form";
import { formatDate } from "@/utils/dateFormat";

export const ProjectForm: React.FC<{
  projectData: any;
  programTitle: string;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  showCommentInputs: boolean;
}> = ({ projectData, programTitle, comments, onCommentChange, alreadyReviewed, showCommentInputs }) => {
  if (!projectData) return <div className="flex items-center justify-center h-64 text-gray-400">Loading project data...</div>;

  return (
    <section className="max-w-5xl mx-auto border border-gray-200 py-5 shadow-sm font-serif text-gray-900 leading-relaxed p-5">
      <div className="text-center mb-8 space-y-1">
        <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
        <p className="font-bold">Iba, Zambales</p>
        <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Project Proposal</p>
      </div>

      <div className="">
        <div className="p-5">
          <h2 className="text-base font-bold my-2 flex"><VerticalLine />I. PROFILE</h2>
          <div className="my-4">
            <p className="font-bold">Program Title: <span className="font-normal">{val(programTitle)}</span></p>
            <p className="font-bold">Project Title: <span className="font-normal">{val(projectData.project_title)}</span></p>
            <p className="font-bold">Project Leader: <span className="font-normal">{val(projectData.project_leader)}</span></p>
            <p className="font-bold">Project Members: <span className="font-normal">{val(projectData.members?.map((m: any) => m).join(", "))}</span></p>
            <br />
            <p className="font-bold">Project Duration: <span className="font-normal">{val(projectData.duration_months)}</span></p>
            <p className="font-bold">Start Date: <span className="font-normal">{val(formatDate(projectData.start_date))}</span></p>
            <p className="font-bold">End Date: <span className="font-normal">{val(formatDate(projectData.end_date))}</span></p>
          </div>
        </div>
          {showCommentInputs && (
            <CommentInput sectionName="Profile" onCommentChange={onCommentChange}
              InputValue="proj_profile_feedback" value={comments["proj_profile_feedback"] || ""} disabled={alreadyReviewed} />
          )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-t border-black">
                <p className="px-3 pt-2 font-bold flex"><VerticalLine />IMPLEMENTING AGENCY <span className="font-normal">/ College / Mandated Program:</span></p>
                <p className="px-3 py-1 mb-2">Address/Telephone/Email (Barangay, Municipality, District, Province, Region):</p>
                <p className="px-3 mb-2 text-lg">{arrVal(projectData.implementing_agency)}</p>
                {/* {showCommentInputs && (
                  <CommentInput sectionName="Implementing Agency" onCommentChange={onCommentChange}
                    InputValue="proj_implementing_agency_feedback" value={comments["proj_implementing_agency_feedback"] || ""} disabled={alreadyReviewed} />
                )} */}
              </tr>
              <tr className="border-b border-black">
                <p className="px-3 py-2 font-bold flex"><VerticalLine />COOPERATING AGENCY/IES <span className="font-normal">(Name/s and Address/es)</span></p>
                <p className="px-3 mb-2 font-normal text-lg">{arrVal(projectData.cooperating_agencies)}</p>
              </tr>
            </tbody>
          </table>
        </div>
        {showCommentInputs && (
          <CommentInput sectionName="Implementing & Cooperating Agency" onCommentChange={onCommentChange}
            InputValue="proj_implementing_agency_feedback" value={comments["proj_implementing_agency_feedback"] || ""} disabled={alreadyReviewed} />
        )}

        <p className="font-bold mt-2 mb-3 px-2 flex"><VerticalLine />Extension Site/s or Venue/s</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border border-t border-black">
                <td className="border-r border-black px-4 py-3 font-bold text-center w-12">#</td>
                <td className="border-r border-black px-4 py-3 font-bold text-center">Country</td>
                <td className="border-r border-black px-4 py-3 font-bold text-center">Region</td>
                <td className="border-r border-black px-4 py-3 font-bold text-center">Province</td>
                <td className="border-r border-black px-4 py-3 font-bold text-center">District</td>
                <td className="border-r border-black px-4 py-3 font-bold text-center">Municipality</td>
                <td className="px-4 py-3 font-bold text-center">Barangay</td>
              </tr>
            </thead>
            <tbody>
              {(projectData.extension_sites?.length ? projectData.extension_sites : [{}, {}]).map((site: any, i: number) => (
                <tr key={i} className="border border-black">
                  <td className="border-r border-black px-4 py-3 text-center">{i + 1}</td>
                  <td className="border-r border-black px-4 py-3">{site.country || "—"}</td>
                  <td className="border-r border-black px-4 py-3">{site.region || "—"}</td>
                  <td className="border-r border-black px-4 py-3">{site.province || "—"}</td>
                  <td className="border-r border-black px-4 py-3">{site.district || "—"}</td>
                  <td className="border-r border-black px-4 py-3">{site.municipality || "—"}</td>
                  <td className="px-4 py-3">{site.barangay || "—"}</td>
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
                  <p className="font-bold mb-3 text-base flex"><VerticalLine />TAGGING</p>
                  <CheckboxList
                    items={["General", "Environment and Climate Change (for CECC)", "Gender and Development (for GAD)", "Mango-Related (for RMC)"]}
                    checked={(label) => projectData.tags?.some((t: string) => t.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                  <p className="font-bold mt-5 mb-3 text-base flex"><VerticalLine />CLUSTER</p>
                  <CheckboxList
                    items={["Health, Education, and Social Sciences", "Engineering, Industry, Information Technology", "Environment and Natural Resources", "Tourism, Hospitality Management, Entrepreneurship, Criminal Justice", "Graduate Studies", "Fisheries", "Agriculture, Forestry"]}
                    checked={(label) => projectData.clusters?.some((c: string) => c.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                </td>
                <td className="px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3 text-base flex"><VerticalLine />EXTENSION AGENDA</p>
                  <CheckboxList
                    items={["Business Management and Livelihood Skills Development", "Accountability, Good Governance, and Peace and Order", "Youth and Adult Functional Literacy and Education", "Accessibility, Inclusivity, and Gender and Development", "Nutrition, Health, and Wellness", "Indigenous People's Rights and Cultural Heritage Preservation", "Human Capital Development", "Adoption and Commercialization of Appropriate Technologies", "Natural Resources, Climate Change, and Disaster Risk Reduction Management"]}
                    checked={(label) => projectData.agendas?.some((a: string) => a.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                </td>
                
              </tr>
              {showCommentInputs && (
                    <tr>
                      <td colSpan={2} className="p-0">
                        <CommentInput
                          sectionName="Tagging, Cluster & Extension Agenda"
                          onCommentChange={onCommentChange}
                          InputValue="proj_tagging_cluster_extension_feedback"
                          value={comments["proj_tagging_cluster_extension_feedback"] || ""}
                          disabled={alreadyReviewed}
                        />
                      </td>
                    </tr>
                  )}
              <tr className="border border-black">
                <td className="border-r border-black px-4 py-3 font-bold">Sustainable Development Goal (SDG) Addressed</td>
                <td className="border-r border-black px-4 py-3 font-bold">College/Campus/Mandated Academic Program:</td>
              </tr>
              <tr className="border border-black">
                <td className="px-4 py-3 border-r border-black">{val(projectData.sdg_addressed)}</td>
                <td className="px-4 py-3">{val(projectData.mandated_academic_program)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {showCommentInputs && (
          <CommentInput sectionName="SDG & Academic Program" onCommentChange={onCommentChange}
            InputValue="proj_sdg_academic_program_feedback" value={comments["proj_sdg_academic_program_feedback"] || ""} disabled={alreadyReviewed} />
        )}
        {/* {showCommentInputs && (
          <CommentInput sectionName="Profile" onCommentChange={onCommentChange}
            InputValue="proj_profile_feedback" value={comments["proj_profile_feedback"] || ""} disabled={alreadyReviewed} />
        )} */}

        <div className="text-gray-700 leading-relaxed">
          <div className="px-2 py-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />II. RATIONALE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(projectData.rationale)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Project Rationale" onCommentChange={onCommentChange}
              InputValue="proj_rationale_feedback" value={comments["proj_rationale_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />III. SIGNIFICANCE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(projectData.significance)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Project Significance" onCommentChange={onCommentChange}
              InputValue="proj_significance_feedback" value={comments["proj_significance_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          <div className="border-b border-black p-2">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />IV. OBJECTIVES</h3>
            <p className="text-base font-semibold mb-2 mt-3 ml-2">General:</p>
            <p className="p-5 bg-gray-100">{val(projectData.general_objectives)}</p>
          {showCommentInputs && (
            <CommentInput sectionName="Project General Objectives" onCommentChange={onCommentChange}
              InputValue="proj_general_objectives_feedback" value={comments["proj_general_objectives_feedback"] || ""} disabled={alreadyReviewed} />
          )}
            <p className="text-base font-semibold mb-2 mt-3 ml-2">Specific:</p>
            <p className="p-5 bg-gray-100">{val(projectData.specific_objectives)}</p>
          {showCommentInputs && (
            <CommentInput sectionName="Project Specific Objectives" onCommentChange={onCommentChange}
              InputValue="proj_specific_objectives_feedback" value={comments["proj_specific_objectives_feedback"] || ""} disabled={alreadyReviewed} />
          )}
          </div>
          {/* {showCommentInputs && (
            <CommentInput sectionName="Project Objectives" onCommentChange={onCommentChange}
              InputValue="proj_objectives_feedback" value={comments["proj_objectives_feedback"] || ""} disabled={alreadyReviewed} />
          )} */}

          <div className="border-b border-black p-2">
            <h3 className="font-bold text-gray-900 text-base mb-5 flex"><VerticalLine />V. METHODOLOGY</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(projectData.methodology)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Project Methodology" onCommentChange={onCommentChange}
              InputValue="proj_methodology_feedback" value={comments["proj_methodology_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          <div>
            <h3 className="font-bold text-gray-900 p-2 text-base my-2 flex"><VerticalLine />VI. EXPECTED OUTPUT/OUTCOME</h3>
            <table className="w-full border-t border-black text-sm">
              <tbody>
                <tr className="border border-black">
                  <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-center">6P's and 2 I's</td>
                  <td className="px-4 py-3 text-center font-bold">OUTPUT</td>
                </tr>
                {SIX_PS_LABELS.map((label, idx) => (
                  <tr key={label} className="border border-black">
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

        {/* VIII. WORKPLAN */}
        <div>
          <h3 className="font-bold text-gray-900 text-base p-2 mb-2 flex"><VerticalLine />VII. WORKPLAN</h3>
          <div className="overflow-x-auto">
            <table className="border border-black text-sm" style={{ minWidth: "900px", width: "100%" }}>
              <thead>
                <tr className="border-b border-black">
                  <th rowSpan={2} className="border-r border-black px-3 py-2 text-left font-bold min-w-[100px]">Objective</th>
                  <th rowSpan={2} className="border-r border-black px-3 py-2 text-left font-bold min-w-[100px]">Activity</th>
                  <th rowSpan={2} className="border-r border-black px-3 py-2 text-left font-bold min-w-[90px]">Expected Output</th>
                  {['Year 1', 'Year 2', 'Year 3'].map((y) => (
                    <th key={y} colSpan={4} className="border-r border-black px-3 py-2 text-center font-bold last:border-r-0">{y}</th>
                  ))}
                </tr>
                <tr className="border-b border-black">
                  {[1, 2, 3].map((yr) =>
                    ['Q1', 'Q2', 'Q3', 'Q4'].map((q, qi) => (
                      <th key={`${yr}-${q}`} className={`px-2 py-1 text-center font-semibold w-8 ${qi === 3 && yr < 3 ? 'border-r border-black' : ''}`}>{q}</th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {(projectData.workplan || []).map((row: any, i: number) => (
                  <tr key={i} className="border-b border-black">
                    <td className="border-r border-black px-3 py-2 align-top">{row.objective || "—"}</td>
                    <td className="border-r border-black px-3 py-2 align-top">{row.activity || "—"}</td>
                    <td className="border-r border-black px-3 py-2 align-top">{row.expected_output || "—"}</td>
                    {[1, 2, 3].map((yr) =>
                      ['Q1', 'Q2', 'Q3', 'Q4'].map((q, qi) => {
                        const quarterLabel = `Year ${yr} ${q}`;
                        const boolKey = `year${yr}_${q.toLowerCase()}`;
                        const isChecked = Array.isArray(row.timeline)
                          ? row.timeline.includes(quarterLabel)
                          : !!row[boolKey];
                        return (
                          <td key={`${yr}-${q}`} className={`px-2 py-2 text-center align-middle ${qi === 3 && yr < 3 ? 'border-r border-black' : ''}`}>
                            <input type="checkbox" checked={isChecked} readOnly className="rounded" />
                          </td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showCommentInputs && (
          <CommentInput sectionName="Project Work Plan" onCommentChange={onCommentChange}
            InputValue="proj_work_plan_feedback" value={comments["proj_work_plan_feedback"] || ""} disabled={alreadyReviewed} />
        )}

          <div>
            <h3 className="font-bold text-gray-900 text-base p-2 mb-2 flex"><VerticalLine />VIII. BUDGETARY REQUIREMENT</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border border-t border-black bg-gray-100">
                  <td className="border-r border-black px-4 py-3 font-bold text-center">Item</td>
                  <td className="px-4 py-3 font-bold text-center">Amount (PhP)</td>
                </tr>
                {(projectData.budget_requirements || []).length > 0
                  ? projectData.budget_requirements.map((row: BudgetItem, i: number) => (
                    <tr key={i} className="border border-black">
                      <td className="border-r border-black px-4 py-3">{val(row.item)}</td>
                      <td className="px-4 py-3 text-right">₱ {row.amount}</td>
                    </tr>
                  ))
                  : <tr><td colSpan={2} className="text-center px-4 py-3 text-gray-500">No budget data available</td></tr>}
                <tr className="font-bold bg-gray-100 border-t border border-black">
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