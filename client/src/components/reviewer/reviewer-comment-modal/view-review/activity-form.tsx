import { arrVal, SIX_PS_LABELS, val } from "@/constants";

import { CheckboxList } from "./checkbox-list";
import { VerticalLine } from "./program-form";
import { formatDate } from "@/utils/dateFormat";
import type { BudgetItem, Comments } from "@/types/reviewer-comment-types";
import CommentInput from "../../CommentInput";
import { FeedbackBadge } from "../FeedbackBadge";
import { HistoryReviewBadge } from "./HistoryReviewBadge";
import type { HistoryReviewEntry } from "@/constants/reviewer/mappers";
import { useEffect, useState } from "react";
import SubmittingOverlay from "../SubmittingOverlay";
import { div } from "framer-motion/client";

const NA = "N/A";

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
    "objectives_feedback",
    "methodology_feedback",
    "expected_output_feedback",
    "work_plan_feedback",
    "budget_requirements_feedback",
  ];

  const values = feedbackFields.map((k) => review[k]);

  // If there are no null values → every field was submitted → lock
  const hasAnyNull = values.some((v) => v === null || v === undefined);
  return !hasAnyNull;
}
/**
 * Map from inputKey (comments state key) → existingReview field name.
 * Allows SF to read the persisted value from existingReview when locked.
 */
const REVIEW_FIELD_MAP: Record<string, string> = {
  act_profile_feedback:                    "profile_feedback",
  act_implementing_agency_feedback:        "implementing_agency_feedback",
  act_extension_site_feedback:             "extension_site_feedback",
  act_tagging_cluster_extension_feedback:  "tagging_cluster_extension_feedback",
  act_sdg_academic_program_feedback:       "sdg_academic_program_feedback",
  act_rationale_feedback:                  "rationale_feedback",
  act_objectives_feedback:                 "objectives_feedback",
  act_methodology_feedback:                "methodology_feedback",
  act_expected_output_feedback:            "expected_output_feedback",
  act_work_plan_feedback:                  "work_plan_feedback",
  act_budget_feedback:                     "budget_requirements_feedback",
};

const SF: React.FC<{
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
  // ── History mode: array of reviewer entries ───────────────────────────
  if (!showInput && Array.isArray(feedbackValue)) {
    if (feedbackValue.length === 0) return null;
    return <HistoryReviewBadge label={label} entries={feedbackValue} />;
  }

  // ── Current version mode ──────────────────────────────────────────────
  const isFilled = typeof feedbackValue === "string" && feedbackValue.trim() !== "";

  if (!showInput && existingReview && isFilled) {
    return <FeedbackBadge label={label} value={feedbackValue as string} loading={reviewLoading} />;
  }

  if (!showInput && existingReview && !isFilled) {
    return null;
  }

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
        value={lockedValue !== undefined ? lockedValue : (comments[inputKey] || "")}
        disabled={disabled || allLocked}
      />
    );
  }

  return null;
};

export const ActivityForm: React.FC<{
  activityData: any;
  programTitle: string;
  projectTitle: string;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  showCommentInputs: boolean;
  existingReview?: any | null;
  reviewLoading?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}> = ({
  activityData,
  programTitle,
  projectTitle,
  comments,
  onCommentChange,
  alreadyReviewed,
  showCommentInputs,
  existingReview,
  reviewLoading = false,
  scrollContainerRef
}) => {
  if (!activityData) return <div className="flex items-center justify-center h-64 text-gray-400">Loading activity data...</div>;

  useEffect(() => {
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTop = 0; // instant, no smooth needed
    }
  }, [activityData]);

  const allLocked = !showCommentInputs ? false : shouldLockAll(existingReview);


  const sf = (
    label: string,
    inputLabel: string,
    inputKey: string,
    feedbackValue: string | null | undefined,
  ) => (
    <SF
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

  const [isSubmitting, setIsSubmitting] = useState(true);

  return (
    <section className="max-w-5xl mx-auto px-5 rounded-sm shadow-sm font-serif text-gray-900 leading-relaxed p-5 border border-gray-200">
      {/* {isSubmitting && 
        (
          <div className="fixed w-full h-full flex items-center justify-center bg-black/30 z-10">
            <SubmittingOverlay message="Submitting Review..." />
          </div>
        )  
      } */}

      <div className="text-center mb-8 space-y-1">
        <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
        <p className="font-bold">Iba, Zambales</p>
        <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Activity Proposal</p>
      </div>

      <div className="">
        {/* I. PROFILE */}
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
            <p className="font-normal">Date: <span className="font-normal">{val(formatDate(activityData.activity_date))}</span></p>
          </div>
        </div>
        {sf("Profile", "Profile", "act_profile_feedback", existingReview?.profile_feedback)}

        {/* IMPLEMENTING / COOPERATING AGENCY */}
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
        {sf("Implementing & Cooperating Agency", "Implementing & Cooperating Agency", "act_implementing_agency_feedback", existingReview?.implementing_agency_feedback)}

        {/* EXTENSION SITES */}
        <p className="font-bold text-base p-3 mb-2 flex"><VerticalLine />EXTENSION SITE/S OR VENUE/S</p>
        <div className="overflow-x-auto">
          <table className="w-full border border-black text-sm">
            <thead>
              <tr className="border-b border-black">
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
              {(activityData.extension_sites?.length ? activityData.extension_sites : [{}, {}]).map((site: any, i: number) => (
                <tr key={i} className="border-b border-black">
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
        {sf("Extension Site/s", "Extension Site/s", "act_extension_site_feedback", existingReview?.extension_site_feedback)}

        {/* TAGGING / CLUSTER / AGENDA / SDG */}
        <div className="overflow-x-auto">
          <table className="w-full border-b border-black text-sm">
            <tbody>
              <tr className="border-b border-black">
                <td className="border border-black px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3 text-base flex"><VerticalLine />TAGGING</p>
                  <CheckboxList items={["General", "Environment and Climate Change (for CECC)", "Gender and Development (for GAD)", "Mango-Related (for RMC)"]} checked={(label) => activityData.tags?.some((t: string) => t.toLowerCase() === label.toLowerCase()) ?? false} />
                  <p className="font-bold mt-5 mb-3 text-base flex"><VerticalLine />CLUSTER</p>
                  <CheckboxList items={["Health, Education, and Social Sciences", "Engineering, Industry, Information Technology", "Environment and Natural Resources", "Tourism, Hospitality Management, Entrepreneurship, Criminal Justice", "Graduate Studies", "Fisheries", "Agriculture, Forestry"]} checked={(label) => activityData.clusters?.some((c: string) => c.toLowerCase() === label.toLowerCase()) ?? false} />
                </td>
                <td className="border border-black px-4 py-4 align-top w-1/2">
                  <p className="font-bold mb-3 text-base flex"><VerticalLine />EXTENSION AGENDA</p>
                  <CheckboxList items={["Business Management and Livelihood Skills Development", "Accountability, Good Governance, and Peace and Order", "Youth and Adult Functional Literacy and Education", "Accessibility, Inclusivity, and Gender and Development", "Nutrition, Health, and Wellness", "Indigenous People's Rights and Cultural Heritage Preservation", "Human Capital Development", "Adoption and Commercialization of Appropriate Technologies", "Natural Resources, Climate Change, and Disaster Risk Reduction Management"]} checked={(label) => activityData.agendas?.some((a: string) => a.toLowerCase() === label.toLowerCase()) ?? false} />
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="p-0">
                  {sf("Tagging, Cluster & Extension Agenda", "Tagging, Cluster & Extension Agenda", "act_tagging_cluster_extension_feedback", existingReview?.tagging_cluster_extension_feedback)}
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
        {sf("SDG & Academic Program", "SDG & Academic Program", "act_sdg_academic_program_feedback", existingReview?.sdg_academic_program_feedback)}

        <div className="text-gray-700 leading-relaxed">
          <div className="p-4 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />II. RATIONALE</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.rationale)}</p>
          </div>
          {sf("Rationale", "Activity Rationale", "act_rationale_feedback", existingReview?.rationale_feedback)}

          <div className="p-4 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />III. OBJECTIVES OF THE ACTIVITY</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.objectives)}</p>
          </div>
          {sf("Objectives", "Activity Objectives", "act_objectives_feedback", existingReview?.objectives_feedback)}

          <div className="p-4 border-b border-black">
            <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />IV. METHODOLOGY</h3>
            <p className="text-base mt-3 whitespace-pre-line">{val(activityData.methodology)}</p>
          </div>
          {sf("Methodology", "Activity Methodology", "act_methodology_feedback", existingReview?.methodology_feedback)}

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
          {sf("Expected Output", "Expected Output", "act_expected_output_feedback", existingReview?.expected_output_feedback)}

          <div>
            <h3 className="font-bold text-gray-900 pt-4 px-4 text-base mb-5 flex"><VerticalLine />VI. PLAN OF ACTIVITY</h3>
            <table className="w-full border border-black text-sm">
              <tbody>
                <tr className="border-b border-black bg-gray-100">
                  <td className="border-r border-black px-4 py-3 font-bold text-center w-1/4">Time</td>
                  <td className="border-r border-black px-4 py-3 font-bold text-center">Activity</td>
                  <td className="px-4 py-3 font-bold text-center">Person/s Responsible</td>
                </tr>
                {(activityData.plan_of_activity || []).length > 0
                  ? activityData.plan_of_activity.map((item: any, i: number) => (
                    <tr key={i} className="border-b border-black">
                      <td className="border-r border-black px-4 py-3 text-xs">{val(item.time)}</td>
                      <td className="border-r border-black px-4 py-3">{val(item.activity)}</td>
                      <td className="px-4 py-3">{val(item.person_responsible)}</td>
                    </tr>
                  ))
                  : <tr><td colSpan={3} className="text-center px-4 py-6 text-gray-400 italic">No plan of activity data available</td></tr>}
              </tbody>
            </table>
          </div>
          {sf("Plan of Activity", "Plan of Activities", "act_work_plan_feedback", existingReview?.work_plan_feedback)}

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
          {sf("Budget", "Activity Budget", "act_budget_feedback", existingReview?.budget_requirements_feedback)}
        </div>
      </div>
    </section>
  );
};