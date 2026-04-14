import { arrVal, SIX_PS_LABELS, val } from "@/constants";
import { CheckboxList } from "./checkbox-list";
import { VerticalLine } from "./program-form";
import { formatDate } from "@/utils/dateFormat";
import type { BudgetItem, Comments } from "@/types/reviewer-comment-types";
import CommentInput from "../../CommentInput";
import { FeedbackBadge } from "../FeedbackBadge";
import { HistoryReviewBadge } from "./HistoryReviewBadge";
import type { HistoryReviewEntry } from "@/constants/reviewer/mappers";
import { useEffect } from "react";

/**
 * Lock ALL inputs only when at least one feedback field is an empty string "".
 *
 * null  = reviewer intentionally skipped → keep editable
 * ""    = field was submitted (even if blank) → lock everything
 * "abc" = has content → show as badge, others stay unlocked unless "" exists
 */
function shouldLockAll(review: any): boolean {
  if (!review) return false;

  const feedbackFields = [
    "profile_feedback",
    "implementing_agency_feedback",
    "extension_site_feedback",
    "tagging_cluster_extension_feedback",
    "sdg_academic_program_feedback",
    "rationale_feedback",
    "significance_feedback",
    "general_objectives_feedback",
    "specific_objectives_feedback",
    "objectives_feedback",
    "methodology_feedback",
    "expected_output_feedback",
    "sustainability_plan_feedback",
    "org_staffing_feedback",
    "work_plan_feedback",
    "budget_requirements_feedback",
  ];

  const values = feedbackFields.map((k) => review[k]);

  // If there are no null values → every field was submitted → lock
  const hasAnyNull = values.some((v) => v === null || v === undefined);
  return !hasAnyNull;
}

const REVIEW_FIELD_MAP: Record<string, string> = {
  proj_profile_feedback:                    "profile_feedback",
  proj_implementing_agency_feedback:        "implementing_agency_feedback",
  proj_extension_site_feedback:             "extension_site_feedback",
  proj_tagging_cluster_extension_feedback:  "tagging_cluster_extension_feedback",
  proj_sdg_academic_program_feedback:       "sdg_academic_program_feedback",
  proj_rationale_feedback:                  "rationale_feedback",
  proj_objectives_feedback:                 "objectives_feedback",
  proj_methodology_feedback:                "methodology_feedback",
  proj_expected_output_feedback:            "expected_output_feedback",
  proj_work_plan_feedback:                  "work_plan_feedback",
  proj_budget_feedback:                     "budget_requirements_feedback",
};

const SectionFeedback: React.FC<{
  showInput: boolean;
  reviewLoading: boolean;
  existingReview: any | null;
  feedbackValue: string | HistoryReviewEntry[] | null | undefined;
  allLocked: boolean;
  label: string;
  inputKey: string;
  inputLabel: string;
  comments: Comments;
  onCommentChange: (k: string, v: string) => void;
  disabled: boolean;
}> = ({
  showInput,
  reviewLoading,
  existingReview,
  feedbackValue,
  allLocked,
  label,
  inputKey,
  inputLabel,
  comments,
  onCommentChange,
  disabled,
}) => {
  // ── History mode: feedbackValue is HistoryReviewEntry[] ───────────────
  if (!showInput && Array.isArray(feedbackValue)) {
    if (feedbackValue.length === 0) return null;
    return <HistoryReviewBadge label={label} entries={feedbackValue} />;
  }

  // ── Current version mode: feedbackValue is string | null ─────────────
  const isFilled = typeof feedbackValue === "string" && feedbackValue.trim() !== "";

  // Has review text → show existing FeedbackBadge
  if (!showInput && existingReview && isFilled) {
    return <FeedbackBadge label={label} value={feedbackValue as string} loading={reviewLoading} />;
  }

  // Viewing history with no comment for this section → nothing
  if (!showInput && existingReview && !isFilled) {
    return null;
  }

  // Editable / locked input for current version
  if (showInput || existingReview) {
    const reviewField = REVIEW_FIELD_MAP[inputKey];
    const lockedValue =
      allLocked && reviewField !== undefined
        ? (existingReview?.[reviewField] ?? "")
        : undefined;
    return (
      <CommentInput
        sectionName={inputLabel}
        onCommentChange={onCommentChange}
        InputValue={inputKey}
        value={lockedValue !== undefined ? lockedValue : comments[inputKey] || ""}
        disabled={disabled || allLocked}
      />
    );
  }

  return null;
};

export const ProjectForm: React.FC<{
  projectData: any;
  programTitle: string;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  showCommentInputs: boolean;
  existingReview?: any | null;
  reviewLoading?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ projectData, programTitle, comments, onCommentChange, alreadyReviewed, showCommentInputs, existingReview, reviewLoading = false, scrollContainerRef }) => {
  if (!projectData) return <div className="flex items-center justify-center h-64 text-gray-400">Loading project data...</div>;

    useEffect(() => {
      if (scrollContainerRef?.current) {
        scrollContainerRef.current.scrollTop = 0; // instant, no smooth needed
      }
    }, [projectData]);

  // Lock all inputs only when any field is exactly ""
  const allLocked = !showCommentInputs ? false : shouldLockAll(existingReview);

  const sf = (
    label: string,
    inputLabel: string,
    inputKey: string,
    feedbackValue: string | null | undefined,
  ) => (
    <SectionFeedback
      showInput={showCommentInputs}
      reviewLoading={reviewLoading}
      existingReview={existingReview ?? null}
      feedbackValue={feedbackValue}
      allLocked={allLocked}
      label={label}
      inputKey={inputKey}
      inputLabel={inputLabel}
      comments={comments}
      onCommentChange={onCommentChange}
      disabled={alreadyReviewed}
    />
  );

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
        {sf("Profile", "Profile", "proj_profile_feedback", existingReview?.profile_feedback)}

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
        {sf("Implementing & Cooperating Agency", "Implementing & Cooperating Agency", "proj_implementing_agency_feedback", existingReview?.implementing_agency_feedback)}

        <p className="font-bold mt-2 mb-3 px-2 flex"><VerticalLine />Extension Site/s or Venue/s</p>
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

              {(projectData.extension_sites?.length ? projectData.extension_sites : [{}, {}]).map((site: any, i: number) => (
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
        {sf("Extension Site/s", "Extension Site/s", "proj_extension_site_feedback", existingReview?.extension_site_feedback)}

        <div className="overflow-x-auto">
          <table className="w-full border-b border-black text-sm">
            <tbody>
              <tr className="border-b border-black">
                <td className="border-r border-black px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3 text-base flex"><VerticalLine />TAGGING</p>
                  <CheckboxList items={["General", "Environment and Climate Change (for CECC)", "Gender and Development (for GAD)", "Mango-Related (for RMC)"]} checked={(label) => projectData.tags?.some((t: string) => t.toLowerCase() === label.toLowerCase()) ?? false} />
                  <p className="font-bold mt-5 mb-3 text-base flex"><VerticalLine />CLUSTER</p>
                  <CheckboxList items={["Health, Education, and Social Sciences", "Engineering, Industry, Information Technology", "Environment and Natural Resources", "Tourism, Hospitality Management, Entrepreneurship, Criminal Justice", "Graduate Studies", "Fisheries", "Agriculture, Forestry"]} checked={(label) => projectData.clusters?.some((c: string) => c.toLowerCase() === label.toLowerCase()) ?? false} />
                </td>
                <td className="px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3 text-base flex"><VerticalLine />EXTENSION AGENDA</p>
                  <CheckboxList items={["Business Management and Livelihood Skills Development", "Accountability, Good Governance, and Peace and Order", "Youth and Adult Functional Literacy and Education", "Accessibility, Inclusivity, and Gender and Development", "Nutrition, Health, and Wellness", "Indigenous People's Rights and Cultural Heritage Preservation", "Human Capital Development", "Adoption and Commercialization of Appropriate Technologies", "Natural Resources, Climate Change, and Disaster Risk Reduction Management"]} checked={(label) => projectData.agendas?.some((a: string) => a.toLowerCase() === label.toLowerCase()) ?? false} />
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="p-0">
                  {sf("Tagging, Cluster & Extension Agenda", "Tagging, Cluster & Extension Agenda", "proj_tagging_cluster_extension_feedback", existingReview?.tagging_cluster_extension_feedback)}
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
        {sf("SDG & Academic Program", "SDG & Academic Program", "proj_sdg_academic_program_feedback", existingReview?.sdg_academic_program_feedback)}

        <div className="text-gray-700 leading-relaxed">
          <div className="px-2 py-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />II. RATIONALE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(projectData.rationale)}</p>
          </div>
          {sf("Rationale", "Project Rationale", "proj_rationale_feedback", existingReview?.rationale_feedback)}

          <div className="p-2 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />III. SIGNIFICANCE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(projectData.significance)}</p>
          </div>
          {sf("Significance", "Project Significance", "proj_significance_feedback", existingReview?.significance_feedback)}

          <div className="border-b border-black p-2">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />IV. OBJECTIVES</h3>
            <p className="text-base font-semibold mb-2 mt-3 ml-2">General:</p>
            <p className="p-5 bg-gray-100">{val(projectData.general_objectives)}</p>
            {sf("General Objectives", "Project General Objectives", "proj_general_objectives_feedback", existingReview?.general_objectives_feedback)}
            <p className="text-base font-semibold mb-2 mt-3 ml-2">Specific:</p>
            <p className="p-5 bg-gray-100">{val(projectData.specific_objectives)}</p>
            {sf("Specific Objectives", "Project Specific Objectives", "proj_specific_objectives_feedback", existingReview?.specific_objectives_feedback)}
          </div>

          <div className="border-b border-black p-2">
            <h3 className="font-bold text-gray-900 text-base mb-5 flex"><VerticalLine />V. METHODOLOGY</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(projectData.methodology)}</p>
          </div>
          {sf("Methodology", "Project Methodology", "proj_methodology_feedback", existingReview?.methodology_feedback)}

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
          {sf("Expected Output", "Expected Output", "proj_expected_output_feedback", existingReview?.expected_output_feedback)}

          <div>
            <h3 className="font-bold text-gray-900 text-base p-2 mb-2 flex"><VerticalLine />VII. WORKPLAN</h3>
            <div className="overflow-x-auto">
              <table className="border border-black text-sm" style={{ minWidth: "900px", width: "100%" }}>
                <thead>
                  <tr className="border-b border-black">
                    <th rowSpan={2} className="border-r border-black px-3 py-2 text-left font-bold min-w-[100px]">Objective</th>
                    <th rowSpan={2} className="border-r border-black px-3 py-2 text-left font-bold min-w-[100px]">Activity</th>
                    <th rowSpan={2} className="border-r border-black px-3 py-2 text-left font-bold min-w-[90px]">Expected Output</th>
                    {['Year 1', 'Year 2', 'Year 3'].map((y) => (<th key={y} colSpan={4} className="border-r border-black px-3 py-2 text-center font-bold last:border-r-0">{y}</th>))}
                  </tr>
                  <tr className="border-b border-black">
                    {[1, 2, 3].map((yr) => ['Q1', 'Q2', 'Q3', 'Q4'].map((q, qi) => (<th key={`${yr}-${q}`} className={`px-2 py-1 text-center font-semibold w-8 ${qi === 3 && yr < 3 ? 'border-r border-black' : ''}`}>{q}</th>)))}
                  </tr>
                </thead>
                <tbody>
                  {(projectData.workplan || []).map((row: any, i: number) => (
                    <tr key={i} className="border-b border-black">
                      <td className="border-r border-black px-3 py-2 align-top">{row.objective || "—"}</td>
                      <td className="border-r border-black px-3 py-2 align-top">{row.activity || "—"}</td>
                      <td className="border-r border-black px-3 py-2 align-top">{row.expected_output || "—"}</td>
                      {[1, 2, 3].map((yr) => ['Q1', 'Q2', 'Q3', 'Q4'].map((q, qi) => {
                        const quarterLabel = `Year ${yr} ${q}`;
                        const boolKey = `year${yr}_${q.toLowerCase()}`;
                        const isChecked = Array.isArray(row.timeline) ? row.timeline.includes(quarterLabel) : !!row[boolKey];
                        return (<td key={`${yr}-${q}`} className={`px-2 py-2 text-center align-middle ${qi === 3 && yr < 3 ? 'border-r border-black' : ''}`}><input type="checkbox" checked={isChecked} readOnly className="rounded" /></td>);
                      }))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {sf("Work Plan", "Project Work Plan", "proj_work_plan_feedback", existingReview?.work_plan_feedback)}

          <div>
            <h3 className="font-bold text-gray-900 text-base p-2 mb-2 flex"><VerticalLine />VIII. BUDGETARY REQUIREMENT</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border border-t border-black bg-gray-100">
                  <td className="border-r border-black px-4 py-3 font-bold text-center">Item</td>
                  <td className="px-4 py-3 font-bold text-center">Amount (PhP)</td>
                </tr>
                {(projectData.budget_requirements || []).length > 0
                  ? projectData.budget_requirements.map((row: BudgetItem, i: number) => (<tr key={i} className="border border-black"><td className="border-r border-black px-4 py-3">{val(row.item)}</td><td className="px-4 py-3 text-right">₱ {row.amount}</td></tr>))
                  : <tr><td colSpan={2} className="text-center px-4 py-3 text-gray-500">No budget data available</td></tr>}
                <tr className="font-bold bg-gray-100 border-t border border-black">
                  <td className="border-r border-black px-4 py-3 text-right font-bold">Total</td>
                  <td className="px-4 py-3 text-right">₱ {(projectData.budget_requirements || []).reduce((sum: number, r: BudgetItem) => sum + Number(r.amount || 0), 0).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {sf("Budget", "Project Budget", "proj_budget_feedback", existingReview?.budget_requirements_feedback)}
        </div>
      </div>
    </section>
  );
};