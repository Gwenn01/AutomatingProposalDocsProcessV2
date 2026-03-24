import React from "react";
import CommentInput from "../reviewer/CommentInput";
import { type ApiProposalDetail, type Comments } from "../reviewer/ReviewerCommentModal";
import { CheckboxList } from "./checkbox-list";
import { arrVal, NA, QUARTERS, SIX_PS_LABELS, val } from "@/constants";
import { formatDate } from "@/utils/dateFormat";

export const VerticalLine: React.FC = () => <div className="w-1 h-6 bg-primaryGreen mr-4" />;

export const ProgramForm: React.FC<{
  proposalData: ApiProposalDetail;           // ← now always the FULL detail object
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  showCommentInputs: boolean;
}> = ({ proposalData, comments, onCommentChange, alreadyReviewed, showCommentInputs }) => {



  return (
    <section className="max-w-5xl mx-auto px-5 py-5 border border-gray-200 shadow-sm font-serif text-gray-900 leading-relaxed">
      <div className="text-center mb-8 space-y-1">
        <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
        <p className="font-bold">Iba, Zambales</p>
        <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Program Proposal</p>
      </div>

      <div className="">
        <div className="p-2">
          <h2 className="text-base font-bold flex"><VerticalLine />I. PROFILE</h2>
          <div className="my-2">
            <p className="font-bold">Program Title: <span className="font-normal">{val(proposalData.program_title)}</span></p>
            <p className="font-bold">Program Leader: <span className="font-normal">{val(proposalData.program_leader)}</span></p>
            <br />
            {(proposalData.project_list || []).map((proj: any, i: number) => (
              <React.Fragment key={i}>
                <div >
                  
                  <p className="font-bold">Project Title {i + 1}: <span className="font-normal">{val(proj.project_title)}</span></p>
                  <p className="font-bold">Project Leader: <span className="font-normal">{val(proj.project_leader)}</span></p>
                  <p className="font-bold">Project Members: <span className="font-normal">{val(proj.project_member.map((m: any) => m).join(", "))}</span></p>
                  <br />
                  <p className="font-bold">Project Duration: <span className="font-normal">{val(proj.project_duration)}</span></p>
                  <p className="font-bold">Project Start Date: <span className="font-normal">{val(formatDate(proj.project_start_date))}</span></p>
                  <p className="font-bold">Project End Date: <span className="font-normal">{val(formatDate(proj.project_end_date))}</span></p>
                  <br />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        {showCommentInputs && (
          <CommentInput sectionName="Profile" onCommentChange={onCommentChange}
            InputValue="profile_feedback" value={comments["profile_feedback"] || ""} disabled={alreadyReviewed} />
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>

              <tr className="border-b border-t border-black">
                <p className="px-3 py-3 font-bold flex"><VerticalLine />IMPLEMENTING AGENCY <span className="font-normal">/ College / Mandated Program:</span></p>
                <p className="px-3 mb-2 text-base">{arrVal(proposalData.implementing_agency)}</p>
                {/* {showCommentInputs && (
                  <CommentInput sectionName="Implementing Agency" onCommentChange={onCommentChange}
                      InputValue="implementing_agency_feedback" value={comments["implementing_agency_feedback"] || ""} disabled={alreadyReviewed} />
                  )} */}
              </tr>
              <tr className="border-b border-black">
                <p className="px-3 py-2 font-bold flex"><VerticalLine />COOPERATING AGENCY/IES <span className="font-normal">(Name/s and Address/es)</span></p>
                <p className="px-3 mb-2 font-normal">{arrVal(proposalData.cooperating_agencies)}</p>
                {showCommentInputs && (
                  <CommentInput sectionName="Implementing & Cooperating Agency" onCommentChange={onCommentChange}
                      InputValue="implementing_agency_feedback" value={comments["implementing_agency_feedback"] || ""} disabled={alreadyReviewed} />
                )}
              </tr>
            </tbody>
          </table>
        </div>


    <p className="font-bold p-3 text-base flex"><VerticalLine />EXTENSION SITE/S OR VENUE/S</p>
    <div className="overflow-x-auto">
      <table className="w-full border-t border-black text-sm">
        <thead>
          <tr className="border border-black">
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
          {(proposalData.extension_sites?.length ? proposalData.extension_sites : [{}, {}]).map((site: any, i: number) => (
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
        InputValue="extension_site_feedback" value={comments["extension_site_feedback"] || ""} disabled={alreadyReviewed} />
    )}

      <div className="overflow-x-auto">
        <table className="w-full border-b border-black text-sm">
          <tbody>
            <tr className="border-b border-black">
              <td className="border-r border-black px-4 py-4 align-top w-1/2">
                <p className="font-bold mb-3 text-base flex"><VerticalLine />TAGGING</p>
                <CheckboxList
                  items={["General", "Environment and Climate Change (for CECC)", "Gender and Development (for GAD)", "Mango-Related (for RMC)"]}
                  checked={(label) => proposalData.tags?.some((t) => t.toLowerCase() === label.toLowerCase()) ?? false}
                />
                <p className="font-bold mt-5 mb-3 text-base flex"><VerticalLine />CLUSTER</p>
                <CheckboxList
                  items={["Health, Education, and Social Sciences", "Engineering, Industry, Information Technology", "Environment and Natural Resources", "Tourism, Hospitality Management, Entrepreneurship, Criminal Justice", "Graduate Studies", "Fisheries", "Agriculture, Forestry"]}
                  checked={(label) => proposalData.clusters?.some((c) => c.toLowerCase() === label.toLowerCase()) ?? false}
                />
              </td>
              <td className="px-4 py-4 align-top w-1/2">
                <p className="font-bold mb-3 text-base flex"><VerticalLine />EXTENSION AGENDA</p>
                <CheckboxList
                  items={["Business Management and Livelihood Skills Development", "Accountability, Good Governance, and Peace and Order", "Youth and Adult Functional Literacy and Education", "Accessibility, Inclusivity, and Gender and Development", "Nutrition, Health, and Wellness", "Indigenous People's Rights and Cultural Heritage Preservation", "Human Capital Development", "Adoption and Commercialization of Appropriate Technologies", "Natural Resources, Climate Change, and Disaster Risk Reduction Management"]}
                  checked={(label) => proposalData.agendas?.some((a) => a.toLowerCase() === label.toLowerCase()) ?? false}
                />
              </td>
            </tr>

            {/* Make the CommentInput span both columns: use a single cell with colspan={2} */}
            {showCommentInputs && (
              <tr>
                <td colSpan={2} className="p-0">
                  <CommentInput
                    sectionName="Tagging, Cluster & Extension Agenda"
                    onCommentChange={onCommentChange}
                    InputValue="tagging_cluster_extension_feedback"
                    value={comments["tagging_cluster_extension_feedback"] || ""}
                    disabled={alreadyReviewed}
                  />
                </td>
              </tr>
            )}

            <tr className="border border-black">
              <td className="border-r border-black px-4 py-3 font-bold">Sustainable Development Goal (SDG) Addressed</td>
              <td className="px-4 py-3 font-bold">College/Campus/Mandated Academic Program:</td>
            </tr>
            <tr className="border border-black">
              <td className="px-4 py-3 border-r border-black">{val(proposalData.sdg_addressed)}</td>
              <td className="px-4 py-3">{val(proposalData.mandated_academic_program)}</td>
            </tr>
          </tbody>
        </table>
      </div>


        {showCommentInputs && (
          <CommentInput sectionName="SDG & Academic Program" onCommentChange={onCommentChange}
            InputValue="sdg_academic_program_feedback" value={comments["sdg_academic_program_feedback"] || ""} disabled={alreadyReviewed} />
        )}



        <div className="text-gray-700 leading-relaxed">
          {/* II. RATIONALE */}
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />II. RATIONALE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(proposalData.rationale)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Rationale" onCommentChange={onCommentChange}
              InputValue="rationale_feedback" value={comments["rationale_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          {/* III. SIGNIFICANCE */}
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />III. SIGNIFICANCE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(proposalData.significance)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Significance" onCommentChange={onCommentChange}
              InputValue="significance_feedback" value={comments["significance_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          {/* IV. OBJECTIVES */}
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />IV. OBJECTIVES</h3>
            <p className="text-base font-semibold mb-2 mt-3">General:</p>
            <p className="p-5 text-base">{val(proposalData.general_objectives)}</p>
          {showCommentInputs && (
            <CommentInput sectionName="General Objectives" onCommentChange={onCommentChange}
              InputValue="general_objectives_feedback" value={comments["general_objectives_feedback"] || ""} disabled={alreadyReviewed} />
          )}
            <p className="text-base font-semibold mb-2 mt-3">Specific:</p>
            <p className="p-5 text-base">{val(proposalData.specific_objectives)}</p>
          {showCommentInputs && (
            <CommentInput sectionName="Specific Objectives" onCommentChange={onCommentChange}
              InputValue="specific_objectives_feedback" value={comments["specific_objectives_feedback"] || ""} disabled={alreadyReviewed} />
          )}
          </div>
          {/* V. METHODOLOGY */}
          <div className="p-3 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base mb-2 flex"><VerticalLine />V. METHODOLOGY</h3>
                <p className="text-base mt-3 whitespace-pre-line">{val(proposalData.methodology)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Methodology" onCommentChange={onCommentChange}
              InputValue="methodology_feedback" value={comments["methodology_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          {/* VI. EXPECTED OUTPUT */}
          <div>
            <h3 className="font-bold text-gray-900 text-base p-3 flex"><VerticalLine />VI. EXPECTED OUTPUT/OUTCOME</h3>
            <table className="w-full border-t border-black text-sm">
              <tbody>
                <tr className="border border-black">
                  <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-center">6P's and 2 I's</td>
                  <td className="px-4 py-3 text-center font-bold">OUTPUT</td>
                </tr>
                {SIX_PS_LABELS.map((label, idx) => (
                  <tr key={label} className="border border-black">
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
            <h3 className="mb-3 font-bold text-gray-900 text-base flex"><VerticalLine />VII. SUSTAINABILITY PLAN</h3>
            <p className="text-base whitespace-pre-line">{val(proposalData.sustainability_plan)}</p>
          </div>
          {showCommentInputs && (
            <CommentInput sectionName="Sustainability Plan" onCommentChange={onCommentChange}
              InputValue="sustainability_feedback" value={comments["sustainability_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          {/* VIII. ORG & STAFFING */}
          <div>
            <h3 className="font-bold text-gray-900 p-3 text-base flex"><VerticalLine />VIII. ORGANIZATION AND STAFFING</h3>
            <table className="w-full border-t border-black text-sm">
              <tbody>
                <tr className="border border-black">
                  <td className="w-1/2 border-r border-black px-4 py-3 text-center font-bold">Name</td>
                  <td className="px-4 py-3 text-center font-bold">Role / Responsibility</td>
                </tr>
                {(proposalData.org_and_staffing || []).length > 0
                  ? proposalData.org_and_staffing.map((item, index) => (
                    <tr key={index} className="border border-black">
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
            <h3 className="font-bold text-gray-900 p-2 text-base flex"><VerticalLine />IX. WORKPLAN</h3>
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
                  {(proposalData.workplan || []).map((row: any, i: number) => (
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
            <CommentInput sectionName="Work Plan" onCommentChange={onCommentChange}
              InputValue="work_plan_feedback" value={comments["work_plan_feedback"] || ""} disabled={alreadyReviewed} />
          )}

          {/* X. BUDGET */}
          <div>
            <h3 className="font-bold text-gray-900 text-base p-2 flex"><VerticalLine />X. BUDGETARY REQUIREMENT</h3>
            <table className="w-full border border-black text-sm">
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