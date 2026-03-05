import React from "react";
import { CheckboxList } from "./checkbox-list";
import { arrVal, NA, QUARTERS, SIX_PS_LABELS, val } from "@/constants";
import type { ApiProposalDetail, Comments } from "../view-reviewed-document";
import CommentInput from "@/components/reviewer/CommentInput";
import PreviousComment from "@/components/reviewer/PreviousComment";
import { formatDate } from "@/utils/dateFormat";
import { Clock } from "lucide-react";

export const VerticalLine: React.FC = () => <div className="w-1 h-6 bg-primaryGreen mr-4" />;

// Only keep plain objects with a non-blank comment
const validReviews = (reviews: any): any[] => {
  if (!Array.isArray(reviews)) return [];
  return reviews.filter(
    (r) => r !== null && typeof r === "object" && typeof r.comment === "string" && r.comment.trim() !== ""
  );
};

// Render reviews + conditionally show "Not Reviewed Yet" or "No Comment Provided"
// depending on whether any section across the whole form has been reviewed.
const SectionReviews: React.FC<{
  reviews: any[];
  showCommentInputs: boolean;
  sectionName: string;
  inputKey: string;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  hasAnyReviewAcrossSections: boolean;
}> = ({ reviews, showCommentInputs, sectionName, inputKey, comments, onCommentChange, alreadyReviewed, hasAnyReviewAcrossSections }) => (
  <>
    {reviews.map((r, i) => {
      const commentText =
        r.comment && r.comment.trim() !== "" ? r.comment : "No Comment Provided";

      return (
        <PreviousComment
          key={i}
          comment={commentText}
          reviewerName={r.reviewer_name ?? "Reviewer"}
        />
      );
    })}

    {showCommentInputs && reviews.length === 0 && (
      <div>
        {hasAnyReviewAcrossSections ? (
          /* At least one other section has a review — this section was skipped */
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">No Comment Provided</p>
              <p className="text-xs text-gray-500">The reviewer did not leave a comment for this section.</p>
            </div>
          </div>
        ) : (
          /* No section has any review at all — proposal is fully pending */
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Not Reviewed Yet</p>
              <p className="text-xs text-gray-500">This proposal is still pending review.</p>
            </div>
          </div>
        )}
      </div>
    )}
  </>
);

export const ProgramForm: React.FC<{
  proposalData: ApiProposalDetail;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  showCommentInputs: boolean;
  reviewedData?: any;
}> = ({ proposalData, comments, onCommentChange, alreadyReviewed, showCommentInputs, reviewedData }) => {

  const workplanMap: Record<string, string> = {};
  (proposalData.workplan || []).forEach(({ month, activity }) => {
    workplanMap[month] = activity;
  });

  const profileReviews        = validReviews(reviewedData?.profile?.reviews);
  const agencyReviews         = validReviews(reviewedData?.agencies?.reviews);
  const extensionSiteReviews  = validReviews(reviewedData?.extension_sites?.reviews);
  const taggingReviews        = validReviews(reviewedData?.tagging_clustering_extension?.reviews);
  const sdgReviews            = validReviews(reviewedData?.sdg_and_academic_program?.reviews);
  const rationaleReviews      = validReviews(reviewedData?.rationale?.reviews);
  const significanceReviews   = validReviews(reviewedData?.significance?.reviews);
  const generalObjReviews     = validReviews(reviewedData?.objectives?.reviews_general);
  const specificObjReviews    = validReviews(reviewedData?.objectives?.reviews_specific);
  const methodologyReviews    = validReviews(reviewedData?.methodology?.reviews);
  const expectedOutputReviews = validReviews(reviewedData?.expected_output_6ps?.reviews);
  const sustainabilityReviews = validReviews(reviewedData?.sustainability_plan?.reviews);
  const orgStaffingReviews    = validReviews(reviewedData?.organization_and_staffing?.reviews);
  const workplanReviews       = validReviews(reviewedData?.work_plan?.reviews);
  const budgetReviews         = validReviews(reviewedData?.budget_requirements?.reviews);

  // True if at least one section across the entire form has a valid review
  const hasAnyReviewAcrossSections =
    profileReviews.length > 0 ||
    agencyReviews.length > 0 ||
    extensionSiteReviews.length > 0 ||
    taggingReviews.length > 0 ||
    sdgReviews.length > 0 ||
    rationaleReviews.length > 0 ||
    significanceReviews.length > 0 ||
    generalObjReviews.length > 0 ||
    specificObjReviews.length > 0 ||
    methodologyReviews.length > 0 ||
    expectedOutputReviews.length > 0 ||
    sustainabilityReviews.length > 0 ||
    orgStaffingReviews.length > 0 ||
    workplanReviews.length > 0 ||
    budgetReviews.length > 0;

  const sectionProps = { comments, onCommentChange, alreadyReviewed, showCommentInputs, hasAnyReviewAcrossSections };

  return (
    <section className="max-w-5xl mx-auto px-5 py-5 border border-gray-200 shadow-sm font-serif text-gray-900 leading-relaxed">
      <div className="text-center mb-8 space-y-1">
        <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
        <p className="font-bold">Iba, Zambales</p>
        <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Program Proposal</p>
      </div>

      <div className="">
        {/* I. PROFILE */}
        <div className="p-2">
          <h2 className="text-base font-bold flex"><VerticalLine />I. PROFILE</h2>
          <div className="my-2">
            <p className="font-bold">Program Title: <span className="font-normal">{val(proposalData.program_title)}</span></p>
            <p className="font-bold">Program Leader: <span className="font-normal">{val(proposalData.program_leader)}</span></p>
            <br />
            {(proposalData.project_list || []).map((proj: any, i: number) => (
              <React.Fragment key={i}>
                <div>
                  <p className="font-bold">Project Title {i + 1}: <span className="font-normal">{val(proj.project_title)}</span></p>
                  <p className="font-bold">Project Leader: <span className="font-normal">{val(proj.project_leader)}</span></p>
                  <p className="font-bold">Project Members: <span className="font-normal">{val(proj.project_member?.join(", "))}</span></p>
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
        <SectionReviews reviews={profileReviews} sectionName="Profile" inputKey="profile_feedback" {...sectionProps} />

        {/* IMPLEMENTING / COOPERATING AGENCY */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-t border-black">
                <p className="px-3 py-3 font-bold flex"><VerticalLine />IMPLEMENTING AGENCY <span className="font-normal">/ College / Mandated Program:</span></p>
                <p className="px-3 mb-2 text-base">{arrVal(proposalData.implementing_agency)}</p>
              </tr>
              <tr className="border-b border-black">
                <p className="px-3 py-2 font-bold flex"><VerticalLine />COOPERATING AGENCY/IES <span className="font-normal">(Name/s and Address/es)</span></p>
                <p className="px-3 mb-2 font-normal">{arrVal(proposalData.cooperating_agencies)}</p>
              </tr>
            </tbody>
          </table>
        </div>
        <SectionReviews reviews={agencyReviews} sectionName="Implementing & Cooperating Agency" inputKey="implementing_agency_feedback" {...sectionProps} />

        {/* EXTENSION SITES */}
        <p className="font-bold p-3 text-base flex"><VerticalLine />EXTENSION SITE/S OR VENUE/S</p>
        <div className="overflow-x-auto">
          <table className="w-full border-t border-black text-sm">
            <tbody>
              <tr className="border border-black">
                <td className="border-r border-black px-4 py-3 font-bold text-center w-12">#</td>
                <td className="px-4 py-3 font-bold">Site / Venue</td>
              </tr>
              {(proposalData.extension_sites?.length ? proposalData.extension_sites : ["—", "—"]).map((site, i) => (
                <tr key={i} className="border border-black">
                  <td className="border-r border-black px-4 py-3 text-center">{i + 1}</td>
                  <td className="px-4 py-3">{site || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SectionReviews reviews={extensionSiteReviews} sectionName="Extension Site/s" inputKey="extension_site_feedback" {...sectionProps} />

        {/* TAGGING / CLUSTER / AGENDA */}
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
              {/* Tagging reviews + input inside the table */}
              <tr>
                <td colSpan={2} className="p-0">
                  <SectionReviews reviews={taggingReviews} sectionName="Tagging, Cluster & Extension Agenda" inputKey="tagging_cluster_extension_feedback" {...sectionProps} />
                </td>
              </tr>
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
        <SectionReviews reviews={sdgReviews} sectionName="SDG & Academic Program" inputKey="sdg_academic_program_feedback" {...sectionProps} />

        <div className="text-gray-700 leading-relaxed">
          {/* II. RATIONALE */}
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />II. RATIONALE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(proposalData.rationale)}</p>
          </div>
          <SectionReviews reviews={rationaleReviews} sectionName="Rationale" inputKey="rationale_feedback" {...sectionProps} />

          {/* III. SIGNIFICANCE */}
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />III. SIGNIFICANCE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(proposalData.significance)}</p>
          </div>
          <SectionReviews reviews={significanceReviews} sectionName="Significance" inputKey="significance_feedback" {...sectionProps} />

          {/* IV. OBJECTIVES */}
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />IV. OBJECTIVES</h3>
            <p className="text-base font-semibold mb-2 mt-3">General:</p>
            <p className="p-5 text-base">{val(proposalData.general_objectives)}</p>
            <SectionReviews reviews={generalObjReviews} sectionName="General Objectives" inputKey="general_objectives_feedback" {...sectionProps} />
            <p className="text-base font-semibold mb-2 mt-3">Specific:</p>
            <p className="p-5 text-base">{val(proposalData.specific_objectives)}</p>
            <SectionReviews reviews={specificObjReviews} sectionName="Specific Objectives" inputKey="specific_objectives_feedback" {...sectionProps} />
          </div>

          {/* V. METHODOLOGY */}
          <div className="p-3 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base mb-2 flex"><VerticalLine />V. METHODOLOGY</h3>
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
          <SectionReviews reviews={methodologyReviews} sectionName="Methodology" inputKey="methodology_feedback" {...sectionProps} />

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
          <SectionReviews reviews={expectedOutputReviews} sectionName="Expected Output" inputKey="expected_output_feedback" {...sectionProps} />

          {/* VII. SUSTAINABILITY PLAN */}
          <div className="p-2 border-b border-black">
            <h3 className="mb-3 font-bold text-gray-900 text-base flex"><VerticalLine />VII. SUSTAINABILITY PLAN</h3>
            <p className="text-base whitespace-pre-line">{val(proposalData.sustainability_plan)}</p>
          </div>
          <SectionReviews reviews={sustainabilityReviews} sectionName="Sustainability Plan" inputKey="sustainability_feedback" {...sectionProps} />

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
          <SectionReviews reviews={orgStaffingReviews} sectionName="Organization & Staffing" inputKey="org_staffing_feedback" {...sectionProps} />

          {/* IX. WORKPLAN */}
          <div>
            <h3 className="font-bold text-gray-900 p-2 text-base flex"><VerticalLine />IX. WORKPLAN</h3>
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
          <SectionReviews reviews={workplanReviews} sectionName="Work Plan" inputKey="work_plan_feedback" {...sectionProps} />

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
          <SectionReviews reviews={budgetReviews} sectionName="Budget" inputKey="budget_feedback" {...sectionProps} />
        </div>
      </div>
    </section>
  );
};