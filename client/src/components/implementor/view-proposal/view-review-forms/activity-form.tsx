// view-review-forms/activity-form.tsx
import { arrVal, NA, SIX_PS_LABELS, val } from "@/constants";
import { CheckboxList } from "./checkbox-list";
import { VerticalLine } from "./program-form";
import type { BudgetItem } from "../view-reviewed-document";
import { formatDate } from "@/utils/dateFormat";
import { EditableText, EditableTextarea, EditableArray, EditableKeyValueList, EditableSiteList } from "@/components/implementor/view-proposal/view-review-forms/editable-fields";
import type { EditableActivity } from "@/hooks/useProposalEdit";
import { SectionReviews, validReviews } from "./ui/SectionReviews";

interface Comments { [key: string]: string; }

// ─── helpers ────────────────────────────────────────────────────────────────

// const validReviews = (reviews: any): any[] => {
//   if (!Array.isArray(reviews)) return [];
//   return reviews.filter(
//     (r) => r !== null && typeof r === "object" && r.comment != null && r.comment.trim() !== ""
//   );
// };

// const SectionReviews: React.FC<{
//   reviews: any[];
//   showCommentInputs: boolean;
//   sectionName: string;
//   comments: Comments;
//   onCommentChange: (key: string, val: string) => void;
//   alreadyReviewed: boolean;
//   hasAnyReviewAcrossSections: boolean;
// }> = ({ reviews, showCommentInputs, hasAnyReviewAcrossSections }) => (
//   <>
//     {reviews.map((r, i) => (
//       <PreviousComment
//         key={`${r.reviewer_name}-${i}`}
//         comment={r.comment?.trim() || "No Comment Provided"}
//         reviewerName={r.reviewer_name ?? "Reviewer"}
//       />
//     ))}
//     {showCommentInputs && reviews.length === 0 && (
//       <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm">
//         {hasAnyReviewAcrossSections ? (
//           <>
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
//               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
//               </svg>
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-gray-800">No Comment Provided</p>
//               <p className="text-xs text-gray-500">The reviewer did not leave a comment for this section.</p>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
//               <Clock className="h-5 w-5" />
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-gray-800">Not Reviewed Yet</p>
//               <p className="text-xs text-gray-500">This proposal is still pending review.</p>
//             </div>
//           </>
//         )}
//       </div>
//     )}
//   </>
// );

// ─── ActivityForm ─────────────────────────────────────────────────────────────

export const ActivityForm: React.FC<{
  activityData: any;
  programTitle: string;
  projectTitle: string;
  draft: EditableActivity;
  onDraftChange: (d: EditableActivity) => void;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  showCommentInputs: boolean;
  reviewedData?: any;
  isEditing: boolean;
}> = ({
  activityData, programTitle, projectTitle, draft, onDraftChange,
  comments, onCommentChange, alreadyReviewed, showCommentInputs, reviewedData,
  isEditing,
}) => {
  if (!activityData) return <div className="flex items-center justify-center h-64 text-gray-400">Loading activity data...</div>;

  const set = <K extends keyof EditableActivity>(k: K, v: EditableActivity[K]) =>
    onDraftChange({ ...draft, [k]: v });

  // reviews
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

  const hasAnyReviewAcrossSections =
    [profileReviews, agencyReviews, extensionSiteReviews, taggingReviews, sdgReviews,
     rationaleReviews, objectivesReviews, methodologyReviews, expectedOutputReviews,
     planOfActivityReviews, budgetReviews].some((r) => r.length > 0);

  const sectionProps = { comments, onCommentChange, alreadyReviewed, showCommentInputs, hasAnyReviewAcrossSections };

  return (
    <section className="max-w-5xl mx-auto px-5 rounded-sm shadow-sm font-serif text-gray-900 leading-relaxed p-5 border border-gray-200">
      <div className="text-center mb-8 space-y-1">
        <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
        <p className="font-bold">Iba, Zambales</p>
        <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Activity Proposal</p>
      </div>

      {/* I. PROFILE */}
      <div className="p-5">
        <h2 className="text-base font-bold my-2 flex"><VerticalLine />I. PROFILE</h2>
        <div className="my-4 space-y-1">
          <p className="font-bold">Program Title: <span className="font-normal">{val(programTitle)}</span></p>
          <p className="font-bold">Project Title: <span className="font-normal">{val(projectTitle)}</span></p>
          <p className="font-bold">Activity Title:{" "}
            {isEditing
              ? <EditableText value={draft.activity_title} onChange={(v) => set("activity_title", v)} isEditing={isEditing} />
              : <span className="font-normal">{val(activityData.activity_title)}</span>}
          </p>
          <p className="font-bold">Project Leader:{" "}
            {isEditing
              ? <EditableText value={draft.project_leader} onChange={(v) => set("project_leader", v)} isEditing={isEditing} />
              : <span className="font-normal">{val(activityData.project_leader)}</span>}
          </p>
          <p className="font-bold">Members:{" "}
            {isEditing
              ? <EditableArray value={draft.members} onChange={(v) => set("members", v)} isEditing={isEditing} placeholder="Add member…" />
              : <span className="font-normal">{val(activityData.members?.join(", ") || NA)}</span>}
          </p>
          <br />
          <p className="font-bold">Activity Duration:{" "}
            {isEditing
              ? <EditableText value={draft.activity_duration_hours} onChange={(v) => set("activity_duration_hours", v)} isEditing={isEditing} placeholder="e.g. 8" />
              : <span className="font-normal">{val(activityData.activity_duration_hours)} hours</span>}
          </p>
          <p className="font-bold">Date:{" "}
            {isEditing
              ? <input type="date" value={draft.activity_date ?? ""} onChange={(e) => set("activity_date", e.target.value)}
                  className="rounded-lg border border-emerald-300 bg-emerald-50/40 px-3 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
              : <span className="font-normal">{val(formatDate(activityData.activity_date))}</span>}
          </p>
        </div>
      </div>
        <SectionReviews reviews={profileReviews} sectionName="Profile" {...sectionProps} />

      {/* IMPLEMENTING / COOPERATING AGENCY */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-t border-black">
              <td className="px-3 py-2 font-bold" colSpan={2}>
                <span className="flex items-center"><VerticalLine />IMPLEMENTING AGENCY <span className="font-normal ml-1">/ College / Mandated Program:</span></span>
                <p className="pb-1 text-xs text-gray-500 italic mt-0.5">Address/Telephone/Email (Barangay, Municipality, District, Province, Region):</p>
                <div className="px-3 mb-2">
                  {isEditing
                    ? <EditableArray value={draft.implementing_agency} onChange={(v) => set("implementing_agency", v)} isEditing={isEditing} placeholder="Add agency…" />
                    : <p>{arrVal(activityData.implementing_agency)}</p>}
                </div>
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="px-3 py-2 font-bold" colSpan={2}>
                <span className="flex items-center"><VerticalLine />COOPERATING AGENCY/IES <span className="font-normal ml-1">/Program/College (Name/s and Address/es)</span></span>
                <div className="px-3 mb-2">
                  {isEditing
                    ? <EditableArray value={draft.cooperating_agencies} onChange={(v) => set("cooperating_agencies", v)} isEditing={isEditing} placeholder="Add agency…" />
                    : <p className="font-normal">{arrVal(activityData.cooperating_agencies)}</p>}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
        <SectionReviews reviews={agencyReviews} sectionName="Implementing & Cooperating Agency" {...sectionProps} />

      {/* EXTENSION SITES */}
      <div className="font-bold text-base p-3 mb-2 flex items-center"><VerticalLine />EXTENSION SITE/S OR VENUE/S</div>
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
            {isEditing ? (
              <tr className="border-b border-black">
                <td colSpan={7} className="px-4 py-3">
                  <EditableSiteList
                    value={draft.extension_sites as any}
                    onChange={(v) => set("extension_sites", v as any)}
                    isEditing={isEditing}
                  />
                </td>
              </tr>
            ) : (
              (activityData.extension_sites?.length ? activityData.extension_sites : [{}, {}]).map((site: any, i: number) => (
                <tr key={i} className="border-b border-black">
                  <td className="border-r border-black px-4 py-3 text-center">{i + 1}</td>
                  <td className="border-r border-black px-4 py-3">{site.country || "—"}</td>
                  <td className="border-r border-black px-4 py-3">{site.region || "—"}</td>
                  <td className="border-r border-black px-4 py-3">{site.province || "—"}</td>
                  <td className="border-r border-black px-4 py-3">{site.district || "—"}</td>
                  <td className="border-r border-black px-4 py-3">{site.municipality || "—"}</td>
                  <td className="px-4 py-3">{site.barangay || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
        <SectionReviews reviews={extensionSiteReviews} sectionName="Extension Site/s" {...sectionProps} />

      {/* TAGGING / CLUSTER / AGENDA / SDG */}
      <div className="overflow-x-auto">
        <table className="w-full border-b border-black text-sm">
          <tbody>
            <tr className="border-b border-black">
              <td className="border border-black px-4 py-4 align-top w-1/2">
                <div className="font-bold mb-3 text-base flex items-center"><VerticalLine />TAGGING</div>
                <CheckboxList
                  items={["General","Environment and Climate Change (for CECC)","Gender and Development (for GAD)","Mango-Related (for RMC)"]}
                  checked={(label) => (isEditing ? draft.tags : activityData.tags)?.some((t: string) => t.toLowerCase() === label.toLowerCase()) ?? false}
                />
                <div className="font-bold mt-5 mb-3 text-base flex items-center"><VerticalLine />CLUSTER</div>
                <CheckboxList
                  items={["Health, Education, and Social Sciences","Engineering, Industry, Information Technology","Environment and Natural Resources","Tourism, Hospitality Management, Entrepreneurship, Criminal Justice","Graduate Studies","Fisheries","Agriculture, Forestry"]}
                  checked={(label) => (isEditing ? draft.clusters : activityData.clusters)?.some((c: string) => c.toLowerCase() === label.toLowerCase()) ?? false}
                />
              </td>
              <td className="border border-black px-4 py-4 align-top w-1/2">
                <div className="font-bold mb-3 text-base flex items-center"><VerticalLine />EXTENSION AGENDA</div>
                <CheckboxList
                  items={["Business Management and Livelihood Skills Development","Accountability, Good Governance, and Peace and Order","Youth and Adult Functional Literacy and Education","Accessibility, Inclusivity, and Gender and Development","Nutrition, Health, and Wellness","Indigenous People's Rights and Cultural Heritage Preservation","Human Capital Development","Adoption and Commercialization of Appropriate Technologies","Natural Resources, Climate Change, and Disaster Risk Reduction Management"]}
                  checked={(label) => (isEditing ? draft.agendas : activityData.agendas)?.some((a: string) => a.toLowerCase() === label.toLowerCase()) ?? false}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="p-0">
                  <SectionReviews reviews={taggingReviews} sectionName="Tagging, Cluster & Extension Agenda" {...sectionProps} />
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border-r border-black px-4 py-3 font-bold">Sustainable Development Goal (SDG) Addressed:</td>
              <td className="border-r border-black px-4 py-3 font-bold">College / Campus / Mandated Academic Program:</td>
            </tr>
            <tr className="border border-black">
              <td className="px-4 py-3 border-r border-black">
                {isEditing
                  ? <EditableText value={draft.sdg_addressed} onChange={(v) => set("sdg_addressed", v)} isEditing={isEditing} />
                  : val(activityData.sdg_addressed)}
              </td>
              <td className="px-4 py-3">
                {isEditing
                  ? <EditableText value={draft.mandated_academic_program} onChange={(v) => set("mandated_academic_program", v)} isEditing={isEditing} />
                  : val(activityData.mandated_academic_program)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
        <SectionReviews reviews={sdgReviews} sectionName="SDG & Academic Program" {...sectionProps} />

      <div className="text-gray-700 leading-relaxed">
        {/* II. RATIONALE */}
        <div className="p-4 border-b border-black">
          <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />II. RATIONALE</h3>
          <div className="mt-3">
            {isEditing
              ? <EditableTextarea value={draft.rationale} onChange={(v) => set("rationale", v)} isEditing={isEditing} rows={5} />
              : <p className="text-base whitespace-pre-line">{val(activityData.rationale)}</p>}
          </div>
        </div>

          <SectionReviews reviews={rationaleReviews} sectionName="Activity Rationale" {...sectionProps} />

        {/* III. OBJECTIVES */}
        <div className="p-4 border-b border-black">
          <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />III. OBJECTIVES OF THE ACTIVITY</h3>
          <div className="mt-3">
            {isEditing
              ? <EditableTextarea value={draft.objectives} onChange={(v) => set("objectives", v)} isEditing={isEditing} rows={4} />
              : <p className="text-base whitespace-pre-line">{val(activityData.objectives)}</p>}
          </div>
        </div>

          <SectionReviews reviews={objectivesReviews} sectionName="Activity Objectives" {...sectionProps} />

        {/* IV. METHODOLOGY */}
        <div className="p-4 border-b border-black">
          <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />IV. METHODOLOGY</h3>
          <div className="mt-3">
            {isEditing
              ? <EditableTextarea value={draft.methodology as string} onChange={(v) => set("methodology", v)} isEditing={isEditing} rows={4} />
              : <p className="text-base whitespace-pre-line">{val(activityData.methodology)}</p>}
          </div>
        </div>

          <SectionReviews reviews={methodologyReviews} sectionName="Activity Methodology" {...sectionProps} />

        {/* V. EXPECTED OUTPUT */}
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
                  <td className="px-4 py-3">
                    {isEditing
                      ? <EditableText
                          value={draft.expected_output_6ps[idx] ?? ""}
                          onChange={(v) => {
                            const next = [...draft.expected_output_6ps];
                            next[idx] = v;
                            set("expected_output_6ps", next);
                          }}
                          isEditing={isEditing}
                        />
                      : val(activityData.expected_output_6ps?.[idx])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          <SectionReviews reviews={expectedOutputReviews} sectionName="Expected Output" {...sectionProps} />

        {/* VI. PLAN OF ACTIVITY */}
        <div>
          <h3 className="font-bold text-gray-900 pt-4 px-4 text-base mb-5 flex"><VerticalLine />VI. PLAN OF ACTIVITY</h3>
          <table className="w-full border border-black text-sm">
            <tbody>
              <tr className="border-b border-black bg-gray-100">
                <td className="border-r border-black px-4 py-3 font-bold text-center w-1/4">Time</td>
                <td className="border-r border-black px-4 py-3 font-bold text-center">Activity</td>
                <td className="px-4 py-3 font-bold text-center">Person/s Responsible</td>
              </tr>
              {isEditing ? (
                <>
                  {draft.plan_of_activity.map((item, i) => (
                    <tr key={i} className="border-b border-black">
                      <td className="border-r border-black px-2 py-2">
                        <input type="text" value={item.time} placeholder="Time"
                          onChange={(e) => {
                            const next = [...draft.plan_of_activity];
                            next[i] = { ...next[i], time: e.target.value };
                            set("plan_of_activity", next);
                          }}
                          className="w-full rounded border border-emerald-300 bg-emerald-50/40 px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                      </td>
                      <td className="border-r border-black px-2 py-2">
                        <input type="text" value={item.activity} placeholder="Activity"
                          onChange={(e) => {
                            const next = [...draft.plan_of_activity];
                            next[i] = { ...next[i], activity: e.target.value };
                            set("plan_of_activity", next);
                          }}
                          className="w-full rounded border border-emerald-300 bg-emerald-50/40 px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                      </td>
                      <td className="px-2 py-2 flex items-center gap-1">
                        <input type="text" value={item.person_responsible} placeholder="Person"
                          onChange={(e) => {
                            const next = [...draft.plan_of_activity];
                            next[i] = { ...next[i], person_responsible: e.target.value };
                            set("plan_of_activity", next);
                          }}
                          className="flex-1 rounded border border-emerald-300 bg-emerald-50/40 px-2 py-1 text-xs outline-none focus:border-emerald-500" />
                        <button type="button"
                          onClick={() => set("plan_of_activity", draft.plan_of_activity.filter((_, j) => j !== i))}
                          className="text-red-400 hover:text-red-600 text-sm px-1">×</button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="px-4 py-2">
                      <button type="button"
                        onClick={() => set("plan_of_activity", [...draft.plan_of_activity, { time: "", activity: "", person_responsible: "" }])}
                        className="flex items-center gap-1 rounded-lg border border-dashed border-emerald-400 px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50">
                        + Add row
                      </button>
                    </td>
                  </tr>
                </>
              ) : (
                (activityData.plan_of_activity || []).length > 0
                  ? activityData.plan_of_activity.map((item: any, i: number) => (
                    <tr key={i} className="border-b border-black">
                      <td className="border-r border-black px-4 py-3 text-xs">{val(item.time)}</td>
                      <td className="border-r border-black px-4 py-3">{val(item.activity)}</td>
                      <td className="px-4 py-3">{val(item.person_responsible)}</td>
                    </tr>
                  ))
                  : <tr><td colSpan={3} className="text-center px-4 py-6 text-gray-400 italic">No plan of activity data available</td></tr>
              )}
            </tbody>
          </table>
        </div>

          <SectionReviews reviews={planOfActivityReviews} sectionName="Plan of Activities" {...sectionProps} />

        {/* VII. BUDGET */}
        <div>
          <h3 className="font-bold text-gray-900 pt-4 px-4 text-base flex"><VerticalLine />VII. BUDGETARY REQUIREMENT</h3>
          <table className="w-full border border-black text-sm mt-6">
            <tbody>
              <tr className="border-b border-black bg-gray-100">
                <td className="border-r border-black px-4 py-3 font-bold text-center">Item</td>
                <td className="px-4 py-3 font-bold text-center">Amount (PhP)</td>
              </tr>
              {isEditing ? (
                <tr className="border-b border-black">
                  <td colSpan={2} className="px-4 py-3">
                    <EditableKeyValueList
                      value={draft.budget_requirements}
                      onChange={(v) => set("budget_requirements", v as any)}
                      isEditing={isEditing}
                      keyField="item"
                      valField="amount"
                      keyLabel="Item description"
                      valLabel="Amount"
                      emptyTemplate={{ item: "", amount: "" }}
                    />
                  </td>
                </tr>
              ) : (
                (activityData.budget_requirements || []).length > 0
                  ? activityData.budget_requirements.map((row: BudgetItem, i: number) => (
                    <tr key={i} className="border-b border-black">
                      <td className="border-r border-black px-4 py-3">{val(row.item)}</td>
                      <td className="px-4 py-3 text-right">₱ {row.amount}</td>
                    </tr>
                  ))
                  : <tr><td colSpan={2} className="text-center px-4 py-3 text-gray-500">No budget data available</td></tr>
              )}
              <tr className="font-bold bg-gray-100 border-t border-black">
                <td className="border-r border-black px-4 py-3 text-right font-bold">Total</td>
                <td className="px-4 py-3 text-right">
                  ₱ {(isEditing ? draft.budget_requirements : activityData.budget_requirements || [])
                    .reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0)
                    .toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

          <SectionReviews reviews={budgetReviews} sectionName="Activity Budget" {...sectionProps} />

      </div>
    </section>
  );
};