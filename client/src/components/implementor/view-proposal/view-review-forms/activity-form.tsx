import { arrVal, NA, SIX_PS_LABELS, val } from "@/constants";
import { CheckboxList } from "./checkbox-list";
import { VerticalLine } from "./program-form";
import CommentInput from "@/components/reviewer/CommentInput";
import PreviousComment from "@/components/reviewer/PreviousComment";
import type { BudgetItem } from "../view-reviewed-document";
import { Clock } from "lucide-react";

interface Comments {
  [key: string]: string;
}

// ---------------------------------------------------------------------------
// Helpers (mirrored from program-form)
// ---------------------------------------------------------------------------

/** Only keep plain objects with a non-blank comment */
const validReviews = (reviews: any): any[] => {
  if (!Array.isArray(reviews)) return [];
  return reviews.filter(
    (r) => r !== null && typeof r === "object" && typeof r.comment === "string" && r.comment.trim() !== ""
  );
};

/**
 * Renders existing review comments for a section, then – only when no reviews
 * exist yet and showCommentInputs is true – shows the CommentInput field.
 * This mirrors the SectionReviews component in program-form.
 */
const SectionReviews: React.FC<{
  reviews: any[];
  showCommentInputs: boolean;
  sectionName: string;
  inputKey: string;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
}> = ({ reviews, showCommentInputs, sectionName, inputKey, comments, onCommentChange, alreadyReviewed }) => (
  <>
    {reviews.map((r, i) => (
      <PreviousComment key={i} comment={r.comment} reviewerName={r.reviewer_name ?? "Reviewer"} />
    ))}
    {showCommentInputs && reviews.length === 0 && (
      <div className="">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm">
          
          {/* Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Clock className="h-5 w-5" />
          </div>

          {/* Text Content */}
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Not Reviewed Yet
            </p>
            <p className="text-xs text-gray-500">
              This proposal is still pending review.
            </p>
          </div>
        </div>
      </div>
    )}
  </>
);

// ---------------------------------------------------------------------------
// ActivityForm
// ---------------------------------------------------------------------------

export const ActivityForm: React.FC<{
  activityData: any;
  programTitle: string;
  projectTitle: string;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  showCommentInputs: boolean;
  /** Reviewed data shape mirrors program-form's reviewedData */
  reviewedData?: any;
}> = ({ activityData, programTitle, projectTitle, comments, onCommentChange, alreadyReviewed, showCommentInputs, reviewedData }) => {
  if (!activityData) return <div className="flex items-center justify-center h-64 text-gray-400">Loading activity data...</div>;

  // Derive validated review arrays for every section
  const profileReviews        = validReviews(reviewedData?.profile?.reviews);
  const agencyReviews         = validReviews(reviewedData?.agencies?.reviews);
  const extensionSiteReviews  = validReviews(reviewedData?.extension_sites?.reviews);
  const taggingReviews        = validReviews(reviewedData?.tagging_clustering_extension?.reviews);
  const sdgReviews            = validReviews(reviewedData?.sdg_and_academic_program?.reviews);
  const rationaleReviews      = validReviews(reviewedData?.rationale?.reviews);
  const objectivesReviews     = validReviews(reviewedData?.objectives?.reviews);
  const methodologyReviews    = validReviews(reviewedData?.methodology?.reviews);
  const expectedOutputReviews = validReviews(reviewedData?.expected_output_6ps?.reviews);
  const planOfActivityReviews = validReviews(reviewedData?.plan_of_activity?.reviews);
  const budgetReviews         = validReviews(reviewedData?.budget_requirements?.reviews);

  // Shared props passed to every SectionReviews instance
  const sectionProps = { comments, onCommentChange, alreadyReviewed, showCommentInputs };

  return (
    <section className="max-w-5xl mx-auto px-5 rounded-sm shadow-sm font-serif text-gray-900 leading-relaxed p-5 border border-gray-200">
      <div className="text-center mb-8 space-y-1">
        <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
        <p className="font-bold">Iba, Zambales</p>
        <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Activity Proposal</p>
      </div>

      <div className="">
        {/* ---------------------------------------------------------------- */}
        {/* I. PROFILE                                                        */}
        {/* ---------------------------------------------------------------- */}
        <div className="p-5">
          <h2 className="text-base font-bold my-2 flex"><VerticalLine />I. PROFILE</h2>
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
        <SectionReviews reviews={profileReviews} sectionName="Profile" inputKey="act_profile_feedback" {...sectionProps} />

        {/* ---------------------------------------------------------------- */}
        {/* IMPLEMENTING / COOPERATING AGENCY                                 */}
        {/* ---------------------------------------------------------------- */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-t border-black">
                <p className="px-3 py-2 font-bold flex"><VerticalLine />IMPLEMENTING AGENCY <span className="font-normal">/ College / Mandated Program:</span></p>
                <p className="px-3 pb-1 text-xs text-gray-500 italic">Address/Telephone/Email (Barangay, Municipality, District, Province, Region):</p>
                <p className="px-3 mb-2">{arrVal(activityData.implementing_agency)}</p>
              </tr>
              <tr className="border-b border-black">
                <p className="px-3 py-2 font-bold flex"><VerticalLine />COOPERATING AGENCY/IES <span className="font-normal">/Program/College (Name/s and Address/es)</span></p>
                <p className="px-3 mb-2 font-normal">{arrVal(activityData.cooperating_agencies)}</p>
              </tr>
            </tbody>
          </table>
        </div>
        <SectionReviews reviews={agencyReviews} sectionName="Implementing & Cooperating Agency" inputKey="act_implementing_agency_feedback" {...sectionProps} />

        {/* ---------------------------------------------------------------- */}
        {/* EXTENSION SITES                                                   */}
        {/* ---------------------------------------------------------------- */}
        <p className="font-bold text-base p-3 mb-2 flex"><VerticalLine />EXTENSION SITE/S OR VENUE/S</p>
        <div className="overflow-x-auto">
          <table className="w-full border border-black text-sm">
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
        <SectionReviews reviews={extensionSiteReviews} sectionName="Extension Site/s" inputKey="act_extension_site_feedback" {...sectionProps} />

        {/* ---------------------------------------------------------------- */}
        {/* TAGGING / CLUSTER / AGENDA / SDG                                  */}
        {/* ---------------------------------------------------------------- */}
        <div className="overflow-x-auto">
          <table className="w-full border-b border-black text-sm">
            <tbody>
              <tr className="border-b border-black">
                <td className="border border-black px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3 text-base flex"><VerticalLine />TAGGING</p>
                  <CheckboxList
                    items={["General", "Environment and Climate Change (for CECC)", "Gender and Development (for GAD)", "Mango-Related (for RMC)"]}
                    checked={(label) => activityData.tags?.some((t: string) => t.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                  <p className="font-bold mt-5 mb-3 text-base flex"><VerticalLine />CLUSTER</p>
                  <CheckboxList
                    items={["Health, Education, and Social Sciences", "Engineering, Industry, Information Technology", "Environment and Natural Resources", "Tourism, Hospitality Management, Entrepreneurship, Criminal Justice", "Graduate Studies", "Fisheries", "Agriculture, Forestry"]}
                    checked={(label) => activityData.clusters?.some((c: string) => c.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                </td>
                <td className="border border-black px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3 text-base flex"><VerticalLine />EXTENSION AGENDA</p>
                  <CheckboxList
                    items={["Business Management and Livelihood Skills Development", "Accountability, Good Governance, and Peace and Order", "Youth and Adult Functional Literacy and Education", "Accessibility, Inclusivity, and Gender and Development", "Nutrition, Health, and Wellness", "Indigenous People's Rights and Cultural Heritage Preservation", "Human Capital Development", "Adoption and Commercialization of Appropriate Technologies", "Natural Resources, Climate Change, and Disaster Risk Reduction Management"]}
                    checked={(label) => activityData.agendas?.some((a: string) => a.toLowerCase() === label.toLowerCase()) ?? false}
                  />
                </td>
              </tr>
              {/* Tagging / Cluster / Agenda reviews rendered inside the table */}
              <tr>
                <td colSpan={2} className="p-0">
                  <SectionReviews reviews={taggingReviews} sectionName="Tagging, Cluster & Extension Agenda" inputKey="act_tagging_cluster_extension_feedback" {...sectionProps} />
                </td>
              </tr>
              <tr className="border border-black">
                <td className="border-r border-black px-4 py-3 font-bold">Sustainable Development Goal (SDG) Addressed:</td>
                <td className="border-r border-black px-4 py-3 font-bold">College / Campus / Mandated Academic Program:</td>
              </tr>
              <tr className="border border-black">
                <td className="px-4 py-3 border-r border-black">{val(activityData.sdg_addressed)}</td>
                <td className="px-4 py-3">{val(activityData.mandated_academic_program)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <SectionReviews reviews={sdgReviews} sectionName="SDG & Academic Program" inputKey="act_sdg_academic_program_feedback" {...sectionProps} />

        <div className="text-gray-700 leading-relaxed">
          {/* -------------------------------------------------------------- */}
          {/* II. RATIONALE                                                    */}
          {/* -------------------------------------------------------------- */}
          <div className="p-4 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />II. RATIONALE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.rationale)}</p>
          </div>
          <SectionReviews reviews={rationaleReviews} sectionName="Activity Rationale" inputKey="act_rationale_feedback" {...sectionProps} />

          {/* -------------------------------------------------------------- */}
          {/* III. OBJECTIVES                                                  */}
          {/* -------------------------------------------------------------- */}
          <div className="p-4 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />III. OBJECTIVES OF THE ACTIVITY</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.objectives)}</p>
          </div>
          <SectionReviews reviews={objectivesReviews} sectionName="Activity Objectives" inputKey="act_objectives_feedback" {...sectionProps} />

          {/* -------------------------------------------------------------- */}
          {/* IV. METHODOLOGY                                                  */}
          {/* -------------------------------------------------------------- */}
          <div className="p-4 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />IV. METHODOLOGY</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.methodology)}</p>
          </div>
          <SectionReviews reviews={methodologyReviews} sectionName="Activity Methodology" inputKey="act_methodology_feedback" {...sectionProps} />

          {/* -------------------------------------------------------------- */}
          {/* V. EXPECTED OUTPUT                                               */}
          {/* -------------------------------------------------------------- */}
          <div>
            <h3 className="font-bold text-gray-900 pt-4 px-4 text-base mb-5 flex"><VerticalLine />V. EXPECTED OUTPUT/OUTCOME</h3>
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
          <SectionReviews reviews={expectedOutputReviews} sectionName="Expected Output" inputKey="act_expected_output_feedback" {...sectionProps} />

          {/* -------------------------------------------------------------- */}
          {/* VI. PLAN OF ACTIVITY                                             */}
          {/* -------------------------------------------------------------- */}
          <div>
            <h3 className="font-bold text-gray-900 pt-4 px-4 text-base mb-5 flex"><VerticalLine />VI. PLAN OF ACTIVITY</h3>
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
          <SectionReviews reviews={planOfActivityReviews} sectionName="Plan of Activities" inputKey="act_work_plan_feedback" {...sectionProps} />

          {/* -------------------------------------------------------------- */}
          {/* VII. BUDGET                                                      */}
          {/* -------------------------------------------------------------- */}
          <div>
            <h3 className="font-bold text-gray-900 pt-4 px-4 text-base flex"><VerticalLine />VII. BUDGETARY REQUIREMENT</h3>
            <table className="w-full border border-black text-sm mt-6">
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
          <SectionReviews reviews={budgetReviews} sectionName="Activity Budget" inputKey="act_budget_feedback" {...sectionProps} />
        </div>
      </div>
    </section>
  );
};