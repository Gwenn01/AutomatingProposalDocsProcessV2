import React from "react";
import CommentInput from "../reviewer/CommentInput";
import { type ApiProposalDetail, type Comments } from "../reviewer/ReviewerCommentModal";
import { CheckboxList } from "./checkbox-list";
import { arrVal, NA, QUARTERS, SIX_PS_LABELS, val } from "@/constants";

export const ProgramForm: React.FC<{
  proposalData: ApiProposalDetail;           // ← now always the FULL detail object
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
    <section className="max-w-5xl mx-auto px-5 py-5 border border-gray-200 shadow-sm font-serif text-gray-900 leading-relaxed">
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
        {showCommentInputs && (
          <CommentInput sectionName="Profile" onCommentChange={onCommentChange}
            InputValue="profile_feedback" value={comments["profile_feedback"] || ""} disabled={alreadyReviewed} />
        )}
        {showCommentInputs && (
          <CommentInput sectionName="Implementing Agency" onCommentChange={onCommentChange}
            InputValue="implementing_agency_feedback" value={comments["implementing_agency_feedback"] || ""} disabled={alreadyReviewed} />
        )}

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
        {showCommentInputs && (
          <CommentInput sectionName="Extension Site/s" onCommentChange={onCommentChange}
            InputValue="extension_site_feedback" value={comments["extension_site_feedback"] || ""} disabled={alreadyReviewed} />
        )}

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
        {showCommentInputs && (
          <CommentInput sectionName="Tagging, Cluster & Extension Agenda" onCommentChange={onCommentChange}
            InputValue="tagging_cluster_extension_feedback" value={comments["tagging_cluster_extension_feedback"] || ""} disabled={alreadyReviewed} />
        )}
        {showCommentInputs && (
          <CommentInput sectionName="SDG & Academic Program" onCommentChange={onCommentChange}
            InputValue="sdg_academic_program_feedback" value={comments["sdg_academic_program_feedback"] || ""} disabled={alreadyReviewed} />
        )}

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
          {showCommentInputs && (
            <CommentInput sectionName="Work Plan" onCommentChange={onCommentChange}
              InputValue="work_plan_feedback" value={comments["work_plan_feedback"] || ""} disabled={alreadyReviewed} />
          )}

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