import React from "react";

import { CheckboxList } from "../view-review/checkbox-list";
import type { ApiProposalDetail } from "../reviewer/ReviewerCommentModal";
import { arrVal, NA, QUARTERS, SIX_PS_LABELS, val } from "@/constants";

export const ProgramFormDocument: React.FC<{ proposalData: ApiProposalDetail }> = ({ proposalData }) => {
  const workplanMap: Record<string, string> = {};
  (proposalData.workplan || []).forEach(({ month, activity }) => { workplanMap[month] = activity; });
  console.log("proposalData", proposalData.project_list);

  return (
    <section className="max-w-5xl mx-auto px-5 py-5 shadow-sm font-serif text-gray-900 leading-relaxed">
      <div className="text-center mb-8 space-y-1">
        <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
        <p className="font-bold">Iba, Zambales</p>
        <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Program Proposal</p>
      </div>

      <div className="border border-black">
        <div className="p-5">
          <h2 className="text-base font-bold ">I. PROFILE</h2>

          <div className="my-2">
            <p className="font-bold">Program Title 1: <span className="font-normal">{val(proposalData.program_title)}</span></p>
            <p className="font-bold">Program Leader: <span className="font-normal">{val(proposalData.program_leader)}</span></p>
          </div>
          {(proposalData.project_list || []).map((proj: any, i: number) => (
            <React.Fragment key={i}>
              <div >
                <p className="font-bold">Project Title {i + 1}: <span className="font-normal">{val(proj.project_title)}</span></p>
                <p className="font-bold">Project Leader: <span className="font-normal">{val(proj.project_leader)}</span></p>
                <p className="font-bold">Project Members: <span className="font-normal">{val(proj.project_member.map((m: any) => m).join(", "))}</span></p>
                <br />
                <p className="font-bold">Project Duration: <span className="font-normal">{val(proj.project_duration)}</span></p>
                <p className="font-bold">Project Start Date: <span className="font-normal">{val(proj.project_start_date)}</span></p>
                <p className="font-bold">Project End Date: <span className="font-normal">{val(proj.project_end_date)}</span></p>
                <br />
              </div>
            </React.Fragment>
          ))}
        </div>
          <div className="">
            <table className="w-full text-sm">
              <tbody>

                <tr className="border-b border-t border-black">
                  <p className="px-3 mt-3 font-bold">IMPLEMENTING AGENCY <span className="font-normal">/ College / Mandated Program:</span></p>
                  <p className="px-3 mb-3">Address/Telephone/Email (Barangay, Municipality, District, Province, Region):</p>
                  <p className="px-3 mb-2 text-base">{arrVal(proposalData.implementing_agency)}</p>
                  {/* <td className="px-4 py-3">{arrVal(proposalData.implementing_agency)}</td> */}
                </tr>
                <tr className="border-b border-black">
                  <p className="p-3 font-bold">COOPERATING AGENCY/IES /Program/College <span className="font-normal">(Name/s and Address/es)</span></p>
                  <p className="px-3 mb-2 font-normal text-base">{arrVal(proposalData.cooperating_agencies)}</p>
                  {/* <td className="px-4 py-3"></td> */}
                </tr>
              </tbody>
            </table>
          </div>

          <p className="font-bold p-3 text-base">EXTENSION SITE/S OR VENUE/S</p>
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
          <div className="p-3 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">II. RATIONALE <span className="text-base italic font-normal">(Include a brief result of the conducted needs assessment.)</span></h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(proposalData.rationale)}</p>
          </div>
          <div className="p-3 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">III. SIGNIFICANCE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(proposalData.significance)}</p>
          </div>
          <div className="p-3 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">IV. OBJECTIVES</h3>
            <p className="text-base font-semibold mb-2 mt-3">General:</p>
            <p className="p-5 bg-gray-100">{val(proposalData.general_objectives)}</p>
            <p className="text-base font-semibold mb-2 mt-3">Specific:</p>
            <p className="p-5 bg-gray-100">{val(proposalData.specific_objectives)}</p>
          </div>
          <div className="p-3 border-b border-black">
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
            <h3 className="font-bold text-gray-900 text-base p-3">VI. EXPECTED OUTPUT/OUTCOME</h3>
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

          <div className="p-3 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base mb-3">VII. SUSTAINABILITY PLAN</h3>
            <p className="text-base whitespace-pre-line">{val(proposalData.sustainability_plan)}</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 p-3 text-base">VIII. ORGANIZATION AND STAFFING <span className="text-base italic font-normal">(Persons involved and responsibility)</span></h3>
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
            <h3 className="font-bold text-gray-900 p-3 text-base">IX. WORKPLAN</h3>
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
            <h3 className="font-bold text-gray-900 text-base p-3">X. BUDGETARY REQUIREMENT</h3>
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

    </section>
  );
};