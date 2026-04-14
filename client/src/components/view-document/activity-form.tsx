import { arrVal, NA, SIX_PS_LABELS, val } from "@/constants";

import type { OrgStaffingItem } from "../implementor/DocumentViewerModal";

import { formatDate } from "@/utils/dateFormat";
import { CheckboxList } from "../reviewer/reviewer-comment-modal/view-review/checkbox-list";
import type { BudgetItem } from "@/types/reviewer-comment-types";
import { useEffect, useRef } from "react";

export const ActivityFormDocument: React.FC<{ activityData: any; programTitle: string; projectTitle: string }> = ({ activityData, programTitle, projectTitle }) => {
  if (!activityData) return <div className="flex items-center justify-center h-64 text-gray-400">Loading activity data...</div>;

  const topRef = useRef<HTMLElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activityData]); // fires whenever proposalData changes

  return (
    <section 
      ref={topRef}
      className="max-w-5xl mx-auto px-5 rounded-sm shadow-sm font-serif text-gray-900 leading-relaxed">
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
              <p className="font-normal">Date: <span className="font-normal">{val(formatDate(activityData.activity_date))}</span></p>
              <br />

            </div>

        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-t border-black text-sm">
            <tbody>
              <tr className="border-b border-t border-black">
                <td className="px-3 py-3">
                  <p className="font-bold">IMPLEMENTING AGENCY <span className="font-normal">/ College / Mandated Program:</span></p>
                  <p className="mb-1">Address/Telephone/Email (Barangay, Municipality, District, Province, Region):</p>
                  <p>{arrVal(activityData.implementing_agency)}</p>
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="px-3 py-3">
                  <p className="font-bold">COOPERATING AGENCY/IES /Program/College <span className="font-normal">(Name/s and Address/es)</span></p>
                  <p className="font-normal">{arrVal(activityData.cooperating_agencies)}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      <p className="font-bold text-base p-3">EXTENSION SITE/S OR VENUE/S</p>
      <div className="overflow-x-auto px-3">
        <table className="w-full border border-black text-sm table-fixed">
          <tbody>
            <tr className="border-b border-black">
              <td className="border-r border-black px-2 py-3 font-bold text-center w-[60px]">Sites No.</td>
              <td className="border-r border-black px-2 py-3 font-bold text-center w-[100px]">Country</td>
              <td className="border-r border-black px-2 py-3 font-bold text-center w-[120px]">Region</td>
              <td className="border-r border-black px-2 py-3 font-bold text-center w-[120px]">Province</td>
              <td className="border-r border-black px-2 py-3 font-bold text-center w-[120px]">District</td>
              <td className="border-r border-black px-2 py-3 font-bold text-center w-[140px]">Municipality</td>
              <td className="px-2 py-3 font-bold text-center w-[140px]">Barangay</td>
            </tr>

            {(activityData.extension_sites?.length ? activityData.extension_sites : [{}, {}]).map((site: any, i: number) => (
              <tr key={i} className="border-b border-black">
                <td className="border-r border-black px-2 py-3 text-center">
                  {i + 1}
                </td>

                <td className="border-r border-black px-2 py-3 whitespace-normal break-words">
                  {site.country || "—"}
                </td>

                <td className="border-r border-black px-2 py-3 whitespace-normal break-words">
                  {site.region || "—"}
                </td>

                <td className="border-r border-black px-2 py-3 whitespace-normal break-words">
                  {site.province || "—"}
                </td>

                <td className="border-r border-black px-2 py-3 whitespace-normal break-words">
                  {site.district || "—"}
                </td>

                <td className="border-r border-black px-2 py-3 whitespace-normal break-words">
                  {site.municipality || "—"}
                </td>

                <td className="px-2 py-3 whitespace-normal break-words">
                  {site.barangay || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        <div className="overflow-x-auto border-t border-black mt-4">
          <table className="w-full border-b border-black text-sm">
            <tbody>
              <tr className="border-b border-black">
                <td className="border-r border-black px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3">TAGGING</p>
                  <CheckboxList
                    items={["General","Environment and Climate Change (for CECC)","Gender and Development (for GAD)","Mango-Related (for RMC)"]}
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
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.objectives_of_activity)}</p>
          </div>
          <div className="p-4 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base">V. METHODOLOGY <span className="text-base italic font-normal">(short narrative)</span></h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.methodology)}</p>
          </div>
            <h3 className="font-bold text-gray-900 py-3 px-4 text-base">VI. EXPECTED OUTPUT/OUTCOME</h3>
          <div className="px-3 border-b border-black pb-3">
            <table className="w-full border border-black text-sm">
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
        <h3 className="font-bold text-gray-900 py-3 px-4 text-base">VII. ORGANIZATION AND STAFFING</h3>
          <div className="px-3 border-b border-black pb-3">
            <table className="w-full border border-black text-sm">
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

          <div className="px-4 py-3">
            <h3 className="font-bold text-gray-900 text-base ">VIII. PLAN OF ACTIVITY</h3>
            <h3 className="text-base font-bold mt-2">Title of Activity: <span>{activityData.activity_title}</span></h3>
            <h3 className="text-base font-bold">Date: <span>{formatDate(activityData.activity_date)}</span></h3>
          </div>

          <div className="px-3 pb-3 border-b border-black">
            <table className="w-full border border-black text-sm">
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

          <h3 className="font-bold text-gray-900 pt-2 px-4 text-base">IX. BUDGETARY REQUIREMENT</h3>
          <div className="px-3 py-3">
            <table className="w-full border border-black text-sm">
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