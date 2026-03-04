import { arrVal, NA, SIX_PS_LABELS, val } from "@/constants";
import { CheckboxList } from "./checkbox-list";
import { VerticalLine } from "./program-form";
import type { BudgetItem, Comments, MethodologyPhase, WorkplanItem } from "../view-reviewed-document";
import CommentInput from "@/components/reviewer/CommentInput";
import PreviousComment from "@/components/reviewer/PreviousComment";

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
      <CommentInput
        sectionName={sectionName}
        onCommentChange={onCommentChange}
        InputValue={inputKey}
        value={comments[inputKey] || ""}
        disabled={alreadyReviewed}
      />
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
  /** Reviewed data shape mirrors program-form's reviewedData */
  reviewedData?: any;
}> = ({ projectData, programTitle, comments, onCommentChange, alreadyReviewed, showCommentInputs, reviewedData }) => {
  if (!projectData) return <div className="flex items-center justify-center h-64 text-gray-400">Loading project data...</div>;

  const workplanMap: Record<string, string> = {};
  (projectData.workplan || []).forEach(({ month, activity }: WorkplanItem) => { workplanMap[month] = activity; });

  // Derive validated review arrays for every section
  const profileReviews       = validReviews(reviewedData?.profile?.reviews);
  const agencyReviews        = validReviews(reviewedData?.agencies?.reviews);
  const extensionSiteReviews = validReviews(reviewedData?.extension_sites?.reviews);
  const taggingReviews       = validReviews(reviewedData?.tagging_clustering_extension?.reviews);
  const sdgReviews           = validReviews(reviewedData?.sdg_and_academic_program?.reviews);
  const rationaleReviews     = validReviews(reviewedData?.rationale?.reviews);
  const significanceReviews  = validReviews(reviewedData?.significance?.reviews);
  const generalObjReviews    = validReviews(reviewedData?.objectives?.reviews_general);
  const specificObjReviews   = validReviews(reviewedData?.objectives?.reviews_specific);
  const methodologyReviews   = validReviews(reviewedData?.methodology?.reviews);
  const expectedOutputReviews = validReviews(reviewedData?.expected_output_6ps?.reviews);
  const budgetReviews        = validReviews(reviewedData?.budget_requirements?.reviews);

  // Shared props passed to every SectionReviews instance
  const sectionProps = { comments, onCommentChange, alreadyReviewed, showCommentInputs };

  return (
    <section className="max-w-5xl mx-auto border border-gray-200 py-5 shadow-sm font-serif text-gray-900 leading-relaxed p-5">
      <div className="text-center mb-8 space-y-1">
        <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
        <p className="font-bold">Iba, Zambales</p>
        <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Project Proposal</p>
      </div>

      <div className="">
        {/* ---------------------------------------------------------------- */}
        {/* I. PROFILE                                                        */}
        {/* ---------------------------------------------------------------- */}
        <div className="p-5">
          <h2 className="text-base font-bold my-2 flex"><VerticalLine />I. PROFILE</h2>
          <div className="my-4">
            <p className="font-bold">Program Title: <span className="font-normal">{val(programTitle)}</span></p>
            <p className="font-bold">Project Title: <span className="font-normal">{val(projectData.project_title)}</span></p>
            <p className="font-bold">Project Leader: <span className="font-normal">{val(projectData.project_leader)}</span></p>
            <p className="font-bold">Project Members: <span className="font-normal">{val(projectData.members?.map((m: any) => m).join(", "))}</span></p>
            <br />
            <p className="font-bold">Project Duration: <span className="font-normal">{val(projectData.duration_months)}</span></p>
            <p className="font-bold">Start Date: <span className="font-normal">{val(projectData.start_date)}</span></p>
            <p className="font-bold">End Date: <span className="font-normal">{val(projectData.end_date)}</span></p>
          </div>
        </div>
        <SectionReviews reviews={profileReviews} sectionName="Profile" inputKey="proj_profile_feedback" {...sectionProps} />

        {/* ---------------------------------------------------------------- */}
        {/* IMPLEMENTING / COOPERATING AGENCY                                 */}
        {/* ---------------------------------------------------------------- */}
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
        <SectionReviews reviews={agencyReviews} sectionName="Implementing & Cooperating Agency" inputKey="proj_implementing_agency_feedback" {...sectionProps} />

        {/* ---------------------------------------------------------------- */}
        {/* EXTENSION SITES                                                   */}
        {/* ---------------------------------------------------------------- */}
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
        <SectionReviews reviews={extensionSiteReviews} sectionName="Extension Site/s" inputKey="proj_extension_site_feedback" {...sectionProps} />

        {/* ---------------------------------------------------------------- */}
        {/* TAGGING / CLUSTER / AGENDA / SDG                                  */}
        {/* ---------------------------------------------------------------- */}
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
              {/* Tagging / Cluster / Agenda reviews rendered inside the table */}
              <tr>
                <td colSpan={2} className="p-0">
                  <SectionReviews reviews={taggingReviews} sectionName="Tagging, Cluster & Extension Agenda" inputKey="proj_tagging_cluster_extension_feedback" {...sectionProps} />
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
        <SectionReviews reviews={sdgReviews} sectionName="SDG & Academic Program" inputKey="proj_sdg_academic_program_feedback" {...sectionProps} />

        <div className="text-gray-700 leading-relaxed">
          {/* -------------------------------------------------------------- */}
          {/* II. RATIONALE                                                    */}
          {/* -------------------------------------------------------------- */}
          <div className="px-2 py-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />II. RATIONALE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(projectData.rationale)}</p>
          </div>
          <SectionReviews reviews={rationaleReviews} sectionName="Project Rationale" inputKey="proj_rationale_feedback" {...sectionProps} />

          {/* -------------------------------------------------------------- */}
          {/* III. SIGNIFICANCE                                                */}
          {/* -------------------------------------------------------------- */}
          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />III. SIGNIFICANCE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(projectData.significance)}</p>
          </div>
          <SectionReviews reviews={significanceReviews} sectionName="Project Significance" inputKey="proj_significance_feedback" {...sectionProps} />

          {/* -------------------------------------------------------------- */}
          {/* IV. OBJECTIVES                                                   */}
          {/* -------------------------------------------------------------- */}
          <div className="border-b border-black p-2">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />IV. OBJECTIVES</h3>
            <p className="text-base font-semibold mb-2 mt-3 ml-2">General:</p>
            <p className="p-5 bg-gray-100">{val(projectData.general_objectives)}</p>
            <SectionReviews reviews={generalObjReviews} sectionName="Project General Objectives" inputKey="proj_general_objectives_feedback" {...sectionProps} />
            <p className="text-base font-semibold mb-2 mt-3 ml-2">Specific:</p>
            <p className="p-5 bg-gray-100">{val(projectData.specific_objectives)}</p>
            <SectionReviews reviews={specificObjReviews} sectionName="Project Specific Objectives" inputKey="proj_specific_objectives_feedback" {...sectionProps} />
          </div>

          {/* -------------------------------------------------------------- */}
          {/* V. METHODOLOGY                                                   */}
          {/* -------------------------------------------------------------- */}
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
          <SectionReviews reviews={methodologyReviews} sectionName="Project Methodology" inputKey="proj_methodology_feedback" {...sectionProps} />

          {/* -------------------------------------------------------------- */}
          {/* VI. EXPECTED OUTPUT                                              */}
          {/* -------------------------------------------------------------- */}
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
          <SectionReviews reviews={expectedOutputReviews} sectionName="Expected Output" inputKey="proj_expected_output_feedback" {...sectionProps} />

          {/* -------------------------------------------------------------- */}
          {/* VII. BUDGET                                                      */}
          {/* -------------------------------------------------------------- */}
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
          <SectionReviews reviews={budgetReviews} sectionName="Project Budget" inputKey="proj_budget_feedback" {...sectionProps} />
        </div>
      </div>
    </section>
  );
};