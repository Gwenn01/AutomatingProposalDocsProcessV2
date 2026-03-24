// view-review-forms/project-form.tsx
import { arrVal, NA, SIX_PS_LABELS, val } from "@/constants";
import { CheckboxList } from "./checkbox-list";
import { VerticalLine } from "./program-form";
import type { BudgetItem, Comments, MethodologyPhase, WorkplanItem } from "../view-reviewed-document";
import PreviousComment from "@/components/reviewer/PreviousComment";
import { Clock } from "lucide-react";
import { formatDate } from "@/utils/dateFormat";
import { CommentHeader } from "./ui/comment-header";
import { EditableText, EditableTextarea, EditableArray, EditableKeyValueList, EditableSiteList } from "@/components/implementor/view-proposal/view-review-forms/editable-fields";
import type { EditableProject } from "@/hooks/useProposalEdit";

// ─── helpers ────────────────────────────────────────────────────────────────

const validReviews = (reviews: any): any[] => {
  if (!Array.isArray(reviews)) return [];
  return reviews.filter(
    (r) => r !== null && typeof r === "object" && typeof r.comment === "string" && r.comment.trim() !== ""
  );
};

const SectionReviews: React.FC<{
  reviews: any[];
  showCommentInputs: boolean;
  sectionName: string;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  hasAnyReviewAcrossSections: boolean;
}> = ({ reviews, showCommentInputs, hasAnyReviewAcrossSections }) => (
  <>
    {reviews.map((r, i) => (
      <PreviousComment
        key={i}
        comment={r.comment?.trim() || "No Comment Provided"}
        reviewerName={r.reviewer_name ?? "Reviewer"}
      />
    ))}
    {showCommentInputs && reviews.length === 0 && (
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm">
        {hasAnyReviewAcrossSections ? (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">No Comment Provided</p>
              <p className="text-xs text-gray-500">The reviewer did not leave a comment for this section.</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Not Reviewed Yet</p>
              <p className="text-xs text-gray-500">This proposal is still pending review.</p>
            </div>
          </>
        )}
      </div>
    )}
  </>
);

// ─── ProjectForm ─────────────────────────────────────────────────────────────

export const ProjectForm: React.FC<{
  projectData: any;
  programTitle: string;
  draft: EditableProject;
  onDraftChange: (d: EditableProject) => void;
  comments: Comments;
  onCommentChange: (key: string, val: string) => void;
  alreadyReviewed: boolean;
  showCommentInputs: boolean;
  reviewedData?: any;
  isEditing: boolean;
}> = ({
  projectData, programTitle, draft, onDraftChange,
  comments, onCommentChange, alreadyReviewed, showCommentInputs, reviewedData,
  isEditing,
}) => {
  if (!projectData) return <div className="flex items-center justify-center h-64 text-gray-400">Loading project data...</div>;

  const set = <K extends keyof EditableProject>(k: K, v: EditableProject[K]) =>
    onDraftChange({ ...draft, [k]: v });

  // reviews
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
  const workplanReviews = validReviews(reviewedData?.work_plan?.reviews);

const hasAnyReviewAcrossSections =
  [profileReviews, agencyReviews, extensionSiteReviews, taggingReviews, sdgReviews,
   rationaleReviews, significanceReviews, generalObjReviews, specificObjReviews,
   methodologyReviews, expectedOutputReviews, budgetReviews, workplanReviews].some((r) => r.length > 0);
  const sectionProps = { comments, onCommentChange, alreadyReviewed, showCommentInputs, hasAnyReviewAcrossSections };

  //console.log("Project Data", projectData)

  return (
    <section className="max-w-5xl mx-auto border border-gray-200 py-5 shadow-sm font-serif text-gray-900 leading-relaxed p-5">
      <div className="text-center mb-8 space-y-1">
        <p className="font-bold text-base uppercase">President Ramon Magsaysay State University</p>
        <p className="font-bold">Iba, Zambales</p>
        <p className="font-bold text-xl mt-3 uppercase tracking-widest">Extension Project Proposal</p>
      </div>

      {/* I. PROFILE */}
      <div className="p-5">
        <h2 className="text-base font-bold my-2 flex"><VerticalLine />I. PROFILE</h2>
        <div className="my-4 space-y-1">
          <p className="font-bold">Program Title: <span className="font-normal">{val(programTitle)}</span></p>
          <p className="font-bold">Project Title:{" "}
            {isEditing
              ? <EditableText value={draft.project_title} onChange={(v) => set("project_title", v)} isEditing={isEditing} />
              : <span className="font-normal">{val(projectData.project_title)}</span>}
          </p>
          <p className="font-bold">Project Leader:{" "}
            {isEditing
              ? <EditableText value={draft.project_leader} onChange={(v) => set("project_leader", v)} isEditing={isEditing} />
              : <span className="font-normal">{val(projectData.project_leader)}</span>}
          </p>
          <p className="font-bold">Project Members:{" "}
            {isEditing
              ? <EditableArray value={draft.members} onChange={(v) => set("members", v)} isEditing={isEditing} placeholder="Add member…" />
              : <span className="font-normal">{val(projectData.members?.map((m: any) => m).join(", "))}</span>}
          </p>
          <br />
          <p className="font-bold">Project Duration:{" "}
            {isEditing
              ? <EditableText value={draft.duration_months} onChange={(v) => set("duration_months", v)} isEditing={isEditing} />
              : <span className="font-normal">{val(projectData.duration_months)}</span>}
          </p>
          <p className="font-bold">Start Date:{" "}
            {isEditing
              ? <input type="date" value={draft.start_date ?? ""} onChange={(e) => set("start_date", e.target.value)}
                  className="rounded-lg border border-emerald-300 bg-emerald-50/40 px-3 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
              : <span className="font-normal">{val(formatDate(projectData.start_date))}</span>}
          </p>
          <p className="font-bold">End Date:{" "}
            {isEditing
              ? <input type="date" value={draft.end_date ?? ""} onChange={(e) => set("end_date", e.target.value)}
                  className="rounded-lg border border-emerald-300 bg-emerald-50/40 px-3 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
              : <span className="font-normal">{val(formatDate(projectData.end_date))}</span>}
          </p>
        </div>
      </div>
      <CommentHeader sectionName="Profile">
        <SectionReviews reviews={profileReviews} sectionName="Profile" {...sectionProps} />
      </CommentHeader>

      {/* IMPLEMENTING / COOPERATING AGENCY */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-t border-black">
              <td className="px-3 pt-2 font-bold" colSpan={2}>
                <span className="flex items-center"><VerticalLine />IMPLEMENTING AGENCY <span className="font-normal ml-1">/ College / Mandated Program:</span></span>
                <p className="px-3 py-1 mb-1 text-xs text-gray-500 italic">Address/Telephone/Email (Barangay, Municipality, District, Province, Region):</p>
                <div className="px-3 mb-2">
                  {isEditing
                    ? <EditableArray value={draft.implementing_agency} onChange={(v) => set("implementing_agency", v)} isEditing={isEditing} placeholder="Add agency…" />
                    : <p className="text-lg">{arrVal(projectData.implementing_agency)}</p>}
                </div>
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="px-3 py-2 font-bold" colSpan={2}>
                <span className="flex items-center"><VerticalLine />COOPERATING AGENCY/IES <span className="font-normal ml-1">(Name/s and Address/es)</span></span>
                <div className="px-3 mb-2">
                  {isEditing
                    ? <EditableArray value={draft.cooperating_agencies} onChange={(v) => set("cooperating_agencies", v)} isEditing={isEditing} placeholder="Add agency…" />
                    : <p className="font-normal text-lg">{arrVal(projectData.cooperating_agencies)}</p>}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <CommentHeader sectionName="Implementing & Cooperating Agency">
        <SectionReviews reviews={agencyReviews} sectionName="Implementing & Cooperating Agency" {...sectionProps} />
      </CommentHeader>

      {/* EXTENSION SITES */}
      <div className="font-bold mt-2 mb-3 px-2 flex items-center"><VerticalLine />Extension Site/s or Venue/s</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border border-t border-black">
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
              <tr className="border border-black">
                <td colSpan={7} className="px-4 py-3">
                  <EditableSiteList
                    value={draft.extension_sites as any}
                    onChange={(v) => set("extension_sites", v as any)}
                    isEditing={isEditing}
                  />
                </td>
              </tr>
            ) : (
              (projectData.extension_sites?.length ? projectData.extension_sites : [{}, {}]).map((site: any, i: number) => (
                <tr key={i} className="border border-black">
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
      <CommentHeader sectionName="Extension Sites">
        <SectionReviews reviews={extensionSiteReviews} sectionName="Extension Site/s" {...sectionProps} />
      </CommentHeader>

      {/* TAGGING / CLUSTER / AGENDA / SDG */}
      <div className="overflow-x-auto">
        <table className="w-full border-b border-black text-sm">
          <tbody>
            <tr className="border-b border-black">
              <td className="border-r border-black px-4 py-4 align-top w-1/2">
                <div className="font-bold mb-3 text-base flex items-center"><VerticalLine />TAGGING</div>
                <CheckboxList
                  items={["General","Environment and Climate Change (for CECC)","Gender and Development (for GAD)","Mango-Related (for RMC)"]}
                  checked={(label) => (isEditing ? draft.tags : projectData.tags)?.some((t: string) => t.toLowerCase() === label.toLowerCase()) ?? false}
                />
                <div className="font-bold mt-5 mb-3 text-base flex items-center"><VerticalLine />CLUSTER</div>
                <CheckboxList
                  items={["Health, Education, and Social Sciences","Engineering, Industry, Information Technology","Environment and Natural Resources","Tourism, Hospitality Management, Entrepreneurship, Criminal Justice","Graduate Studies","Fisheries","Agriculture, Forestry"]}
                  checked={(label) => (isEditing ? draft.clusters : projectData.clusters)?.some((c: string) => c.toLowerCase() === label.toLowerCase()) ?? false}
                />
              </td>
              <td className="px-4 py-4 align-top w-1/2">
                <div className="font-bold mb-3 text-base flex items-center"><VerticalLine />EXTENSION AGENDA</div>
                <CheckboxList
                  items={["Business Management and Livelihood Skills Development","Accountability, Good Governance, and Peace and Order","Youth and Adult Functional Literacy and Education","Accessibility, Inclusivity, and Gender and Development","Nutrition, Health, and Wellness","Indigenous People's Rights and Cultural Heritage Preservation","Human Capital Development","Adoption and Commercialization of Appropriate Technologies","Natural Resources, Climate Change, and Disaster Risk Reduction Management"]}
                  checked={(label) => (isEditing ? draft.agendas : projectData.agendas)?.some((a: string) => a.toLowerCase() === label.toLowerCase()) ?? false}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="p-0">
                <CommentHeader sectionName="Tagging, Cluster & Extension Agenda">
                  <SectionReviews reviews={taggingReviews} sectionName="Tagging, Cluster & Extension Agenda" {...sectionProps} />
                </CommentHeader>
              </td>
            </tr>
            <tr className="border border-black">
              <td className="border-r border-black px-4 py-3 font-bold">Sustainable Development Goal (SDG) Addressed</td>
              <td className="border-r border-black px-4 py-3 font-bold">College/Campus/Mandated Academic Program:</td>
            </tr>
            <tr className="border border-black">
              <td className="px-4 py-3 border-r border-black">
                {isEditing
                  ? <EditableText value={draft.sdg_addressed} onChange={(v) => set("sdg_addressed", v)} isEditing={isEditing} />
                  : val(projectData.sdg_addressed)}
              </td>
              <td className="px-4 py-3">
                {isEditing
                  ? <EditableText value={draft.mandated_academic_program} onChange={(v) => set("mandated_academic_program", v)} isEditing={isEditing} />
                  : val(projectData.mandated_academic_program)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <CommentHeader sectionName="SDG & Academic Program">
        <SectionReviews reviews={sdgReviews} sectionName="SDG & Academic Program" {...sectionProps} />
      </CommentHeader>

      <div className="text-gray-700 leading-relaxed">
        {/* II. RATIONALE */}
        <div className="px-2 py-2 border-b border-black">
          <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />II. RATIONALE</h3>
          <div className="mt-3">
            {isEditing
              ? <EditableTextarea value={draft.rationale} onChange={(v) => set("rationale", v)} isEditing={isEditing} rows={5} />
              : <p className="text-base whitespace-pre-line">{val(projectData.rationale)}</p>}
          </div>
        </div>
        <CommentHeader sectionName="Project Rationale">
          <SectionReviews reviews={rationaleReviews} sectionName="Project Rationale" {...sectionProps} />
        </CommentHeader>

        {/* III. SIGNIFICANCE */}
        <div className="p-2 border-b border-black">
          <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />III. SIGNIFICANCE</h3>
          <div className="mt-3">
            {isEditing
              ? <EditableTextarea value={draft.significance} onChange={(v) => set("significance", v)} isEditing={isEditing} rows={5} />
              : <p className="text-base whitespace-pre-line">{val(projectData.significance)}</p>}
          </div>
        </div>
        <CommentHeader sectionName="Project Significance">
          <SectionReviews reviews={significanceReviews} sectionName="Project Significance" {...sectionProps} />
        </CommentHeader>

        {/* IV. OBJECTIVES */}
        <div className="border-b border-black p-2">
          <h3 className="font-bold text-gray-900 text-base flex"><VerticalLine />IV. OBJECTIVES</h3>
          <p className="text-base font-semibold mb-2 mt-3 ml-2">General:</p>
          {isEditing
            ? <EditableTextarea value={draft.general_objectives} onChange={(v) => set("general_objectives", v)} isEditing={isEditing} rows={4} />
            : <p className="p-5 bg-gray-100">{val(projectData.general_objectives)}</p>}
          <SectionReviews reviews={generalObjReviews} sectionName="Project General Objectives" {...sectionProps} />
          <p className="text-base font-semibold mb-2 mt-3 ml-2">Specific:</p>
          {isEditing
            ? <EditableTextarea value={draft.specific_objectives} onChange={(v) => set("specific_objectives", v)} isEditing={isEditing} rows={4} />
            : <p className="p-5 bg-gray-100">{val(projectData.specific_objectives)}</p>}
          <SectionReviews reviews={specificObjReviews} sectionName="Project Specific Objectives" {...sectionProps} />
        </div>

        {/* V. METHODOLOGY */}
        <div className="border-b border-black p-2">
          <h3 className="font-bold text-gray-900 text-base mb-5 flex"><VerticalLine />V. METHODOLOGY</h3>
            {isEditing
              ? <EditableTextarea value={draft.methodology} onChange={(v) => set("methodology", v)} isEditing={isEditing} rows={5} />
              : <p className="text-base whitespace-pre-line">{val(projectData.methodology)}</p>}
          {/* {isEditing ? (
            <div className="space-y-4">
              {draft.methodology.map((phase, pi) => (
                <div key={pi} className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={phase.phase}
                      placeholder="Phase name"
                      onChange={(e) => {
                        const next = [...draft.methodology];
                        next[pi] = { ...next[pi], phase: e.target.value };
                        set("methodology", next);
                      }}
                      className="flex-1 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                    <button type="button" onClick={() => set("methodology", draft.methodology.filter((_, i) => i !== pi))}
                      className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">Remove</button>
                  </div>
                  <EditableArray
                    value={phase.activities}
                    onChange={(acts) => {
                      const next = [...draft.methodology];
                      next[pi] = { ...next[pi], activities: acts };
                      set("methodology", next);
                    }}
                    isEditing={isEditing}
                    placeholder="Add activity…"
                  />
                </div>
              ))}
              <button type="button"
                onClick={() => set("methodology", [...draft.methodology, { phase: "", activities: [] }])}
                className="flex items-center gap-1 rounded-lg border border-dashed border-emerald-400 px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50">
                + Add phase
              </button>
            </div>
          ) : (
            (projectData.methodology || []).length > 0
              ? projectData.methodology.map((phase: MethodologyPhase, pi: number) => (
                <div key={pi} className="mb-4">
                  <p className="font-semibold text-gray-800 mb-2">{phase.phase}</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    {(phase.activities || []).map((act, ai) => <li key={ai} className="text-base">{act}</li>)}
                  </ul>
                </div>
              ))
              : <p className="text-base">{NA}</p>
          )} */}
        </div>
        <CommentHeader sectionName="Project Methodology">
          <SectionReviews reviews={methodologyReviews} sectionName="Project Methodology" {...sectionProps} />
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
                      : val(projectData.expected_output_6ps?.[idx])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CommentHeader sectionName="Expected Output">
          <SectionReviews reviews={expectedOutputReviews} sectionName="Expected Output" {...sectionProps} />
        </CommentHeader>

        {/* IX. WORKPLAN */}
<div>
  <h3 className="font-bold text-gray-900 text-base p-2 mb-2 flex"><VerticalLine />IX. WORKPLAN</h3>
  <div className="overflow-x-auto">
    <table className="border border-black text-sm" style={{ minWidth: "900px", width: "100%" }}>
      <thead>
        <tr className="border-b border-black">
          <th rowSpan={2} className="border-r border-black px-3 py-2 text-left font-bold min-w-[100px]">Objective</th>
          <th rowSpan={2} className="border-r border-black px-3 py-2 text-left font-bold min-w-[100px]">Activity</th>
          <th rowSpan={2} className="border-r border-black px-3 py-2 text-left font-bold min-w-[90px]">Expected Output</th>
          {['Year 1', 'Year 2', 'Year 3'].map((y) => (
            <th key={y} colSpan={4} className="border-r border-black px-3 py-2 text-center font-bold last:border-r-0">{y}</th>
          ))}
        </tr>
        <tr className="border-b border-black">
          {[1, 2, 3].map((yr) =>
            ['Q1', 'Q2', 'Q3', 'Q4'].map((q, qi) => (
              <th key={`${yr}-${q}`} className={`px-2 py-1 text-center font-semibold w-8 ${qi === 3 && yr < 3 ? 'border-r border-black' : ''}`}>{q}</th>
            ))
          )}
        </tr>
      </thead>
      <tbody>
        {(projectData.workplan || []).map((row: any, i: number) => (
          <tr key={i} className="border-b border-black">
            <td className="border-r border-black px-3 py-2 align-top">{row.objective || "—"}</td>
            <td className="border-r border-black px-3 py-2 align-top">{row.activity || "—"}</td>
            <td className="border-r border-black px-3 py-2 align-top">{row.expected_output || "—"}</td>
            {[1, 2, 3].map((yr) =>
              ['Q1', 'Q2', 'Q3', 'Q4'].map((q, qi) => {
                const quarterLabel = `Year ${yr} ${q}`;
                const boolKey = `year${yr}_${q.toLowerCase()}`;
                const isChecked = Array.isArray(row.timeline)
                  ? row.timeline.includes(quarterLabel)
                  : !!row[boolKey];
                return (
                  <td key={`${yr}-${q}`} className={`px-2 py-2 text-center align-middle ${qi === 3 && yr < 3 ? 'border-r border-black' : ''}`}>
                    <input type="checkbox" checked={isChecked} readOnly className="rounded" />
                  </td>
                );
              })
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
<CommentHeader sectionName="Work Plan">
  <SectionReviews reviews={workplanReviews} sectionName="Work Plan" {...sectionProps} />
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
                (projectData.budget_requirements || []).length > 0
                  ? projectData.budget_requirements.map((row: BudgetItem, i: number) => (
                    <tr key={i} className="border border-black">
                      <td className="border-r border-black px-4 py-3">{val(row.item)}</td>
                      <td className="px-4 py-3 text-right">₱ {row.amount}</td>
                    </tr>
                  ))
                  : <tr><td colSpan={2} className="text-center px-4 py-3 text-gray-500">No budget data available</td></tr>
              )}
              <tr className="font-bold bg-gray-100 border-t border border-black">
                <td className="border-r border-black px-4 py-3 text-right font-bold">Total</td>
                <td className="px-4 py-3 text-right">
                  ₱ {(isEditing ? draft.budget_requirements : projectData.budget_requirements || [])
                    .reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0)
                    .toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommentHeader sectionName="Budget Requirement">
          <SectionReviews reviews={budgetReviews} sectionName="Project Budget" {...sectionProps} />
        </CommentHeader>
      </div>
    </section>
  );
};