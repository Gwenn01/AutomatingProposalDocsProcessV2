import { arrVal, NA, SIX_PS_LABELS, val } from "@/constants";
import { CheckboxList } from "./checkbox-list";
import { VerticalLine } from "./program-form";
import type { BudgetItem, Comments, MethodologyPhase, WorkplanItem } from "../view-reviewed-document";
import CommentInput from "@/components/reviewer/CommentInput";
import PreviousComment from "@/components/reviewer/PreviousComment";
import { Clock } from "lucide-react";
import { formatDate } from "@/utils/dateFormat";
import { CommentHeader } from "./ui/comment-header";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Only keep plain objects with a non-blank comment */
const validReviews = (reviews: any): any[] => {
  if (!Array.isArray(reviews)) return [];
  return reviews.filter(
    (r) => r !== null && typeof r === "object" && typeof r.comment === "string" && r.comment.trim() !== ""
  );
};

/**
 * Renders existing review comments for a section.
 * - If NO section across the whole form has been reviewed → "Not Reviewed Yet"
 * - If at least ONE section has a review but THIS section has none → "No Comment Provided"
 */
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

// ---------------------------------------------------------------------------
// ProjectForm
// ---------------------------------------------------------------------------

export const ProjectForm: React.FC<{
  projectData: any;
  programTitle: string;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  showCommentInputs: boolean;
  reviewedData?: any;
}> = ({ projectData, programTitle, comments, onCommentChange, alreadyReviewed, showCommentInputs, reviewedData }) => {
  if (!projectData) return <div className="flex items-center justify-center h-64 text-gray-400">Loading project data...</div>;

  const workplanMap: Record<string, string> = {};
  (projectData.workplan || []).forEach(({ month, activity }: WorkplanItem) => { workplanMap[month] = activity; });

  // Derive validated review arrays for every section
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
    budgetReviews.length > 0;

  const sectionProps = { comments, onCommentChange, alreadyReviewed, showCommentInputs, hasAnyReviewAcrossSections };

  return (
    <section className="max-w-5xl mx-auto border border-gray-200 py-5 shadow-sm font-serif text-gray-900 leading-relaxed p-5">
      <div className="text-center mb-8 space-y-1">
        <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
        <p className="font-bold">Iba, Zambales</p>
        <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Project Proposal</p>
      </div>

      <div className="">
        {/* I. PROFILE */}
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

        <CommentHeader sectionName="Profile" >
          <SectionReviews reviews={profileReviews} sectionName="Profile" inputKey="proj_profile_feedback" {...sectionProps} />
        </CommentHeader>

        {/* IMPLEMENTING / COOPERATING AGENCY */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-t border-black">
                <p className="px-3 pt-2 font-bold flex"><VerticalLine />IMPLEMENTING AGENCY <span className="font-normal">/ College / Mandated Program:</span></p>
                <p className="px-3 py-1 mb-2">Address/Telephone/Email (Barangay, Municipality, District, Province, Region):</p>
                <p className="px-3 mb-2 text-lg">{arrVal(projectData.implementing_agency)}</p>
              </tr>
              <tr className="border-b border-black">
                <p className="px-3 py-2 font-bold flex"><VerticalLine />COOPERATING AGENCY/IES <span className="font-normal">(Name/s and Address/es)</span></p>
                <p className="px-3 mb-2 font-normal text-lg">{arrVal(projectData.cooperating_agencies)}</p>
              </tr>
            </tbody>
          </table>
        </div>
        <CommentHeader sectionName="Implementing & Cooperating Agency" >
          <SectionReviews reviews={agencyReviews} sectionName="Implementing & Cooperating Agency" inputKey="proj_implementing_agency_feedback" {...sectionProps} />
        </CommentHeader>

        {/* EXTENSION SITES */}
        <p className="font-bold mt-2 mb-3 px-2 flex"><VerticalLine />Extension Site/s or Venue/s</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border border-t border-black">
                <td className="border-r border-black px-4 py-3 font-bold text-center w-12">#</td>
                <td className="px-4 py-3 font-bold">Site / Venue</td>
              </tr>
              {(projectData.extension_sites?.length ? projectData.extension_sites : ["—", "—"]).map((site: string, i: number) => (
                <tr key={i} className="border border-black">
                  <td className="border-r border-black px-4 py-3 text-center">{i + 1}</td>
                  <td className="px-4 py-3">{site || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CommentHeader sectionName="Extension Sites" >
          <SectionReviews reviews={extensionSiteReviews} sectionName="Extension Site/s" inputKey="proj_extension_site_feedback" {...sectionProps} />
        </CommentHeader>

        {/* TAGGING / CLUSTER / AGENDA / SDG */}
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
              <tr>
                <td colSpan={2} className="p-0">
                  <CommentHeader sectionName="Tagging, Cluster & Extension Agenda" >
                    <SectionReviews reviews={taggingReviews} sectionName="Tagging, Cluster & Extension Agenda" inputKey="proj_tagging_cluster_extension_feedback" {...sectionProps} />
                  </CommentHeader>
                </td>
              </tr>
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
        <CommentHeader sectionName="Tagging, Cluster & Extension Agenda" >
          <SectionReviews reviews={sdgReviews} sectionName="SDG & Academic Program" inputKey="proj_sdg_academic_program_feedback" {...sectionProps} />
        </CommentHeader>
        <div className="text-gray-700 leading-relaxed">
          {/* II. RATIONALE */}
          <div className="px-2 py-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />II. RATIONALE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(projectData.rationale)}</p>
          </div>
          <CommentHeader sectionName="Project Rationale">
            <SectionReviews reviews={rationaleReviews} sectionName="Project Rationale" inputKey="proj_rationale_feedback" {...sectionProps} />
          </CommentHeader>

          {/* III. SIGNIFICANCE */}
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />III. SIGNIFICANCE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(projectData.significance)}</p>
          </div>
          <CommentHeader sectionName="Project Significance">
            <SectionReviews reviews={significanceReviews} sectionName="Project Significance" inputKey="proj_significance_feedback" {...sectionProps} />
          </CommentHeader>

          {/* IV. OBJECTIVES */}
          <div className="border-b border-black p-2">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />IV. OBJECTIVES</h3>
            <p className="text-base font-semibold mb-2 mt-3 ml-2">General:</p>
            <p className="p-5 bg-gray-100">{val(projectData.general_objectives)}</p>
            <SectionReviews reviews={generalObjReviews} sectionName="Project General Objectives" inputKey="proj_general_objectives_feedback" {...sectionProps} />
            <p className="text-base font-semibold mb-2 mt-3 ml-2">Specific:</p>
            <p className="p-5 bg-gray-100">{val(projectData.specific_objectives)}</p>
            <SectionReviews reviews={specificObjReviews} sectionName="Project Specific Objectives" inputKey="proj_specific_objectives_feedback" {...sectionProps} />
          </div>

          {/* V. METHODOLOGY */}
          <div className="border-b border-black p-2">
            <h3 className="font-bold text-gray-900 text-base mb-5 flex"><VerticalLine />V. METHODOLOGY</h3>
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
          <CommentHeader sectionName="Project Methodology" >
            <SectionReviews reviews={methodologyReviews} sectionName="Project Methodology" inputKey="proj_methodology_feedback" {...sectionProps} />
          </CommentHeader>

          {/* VI. EXPECTED OUTPUT */}
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
          <CommentHeader sectionName="Expected Output" >
            <SectionReviews reviews={expectedOutputReviews} sectionName="Expected Output" inputKey="proj_expected_output_feedback" {...sectionProps} />
          </CommentHeader>

          {/* VII. BUDGET */}
          <div>
            <h3 className="font-bold text-gray-900 text-base p-2 mb-2 flex"><VerticalLine />VII. BUDGETARY REQUIREMENT</h3>
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
          <CommentHeader sectionName="Budget Requirement" >
            <SectionReviews reviews={budgetReviews} sectionName="Project Budget" inputKey="proj_budget_feedback" {...sectionProps} />
          </CommentHeader>
        </div>
      </div>
    </section>
  );
};