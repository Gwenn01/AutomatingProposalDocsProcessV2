import { getProjectCompletion } from "@/helpers/create-proposal-helper";
import type { ActivityItem, ProjectFormData } from "@/utils/implementor-api";
import { Card } from "./ui/card";
import { SectionHeader } from "./ui/section-header";
import { CompletionBadge } from "./ui/completion-badge";
import { CommonProfileFields } from "./ui/common-profile-fields";
import { Field } from "./ui/Field";
import { defaultActivityItem } from "@/constants/defaults";
import { TextArea } from "./ui/text-area";
import { ExpectedOutputTable } from "./tables/ExpectedOutputTable";
import { OrgStaffingTable } from "./tables/OrgStaffingTable";
import { WorkplanTable } from "./tables/WorkplanTable";
import { BudgetTable } from "./tables/BudgetTable";
import { Spinner } from "./ui/Spinner";

interface ProjectFormProps { data: ProjectFormData; onChange: (v: ProjectFormData) => void; onSave: () => void; isSaving: boolean; }

export const ProjectProposalForm = ({ data, onChange, onSave, isSaving }: ProjectFormProps) => {
  const upd = (field: keyof ProjectFormData, val: any) => onChange({ ...data, [field]: val });

  const updateActivity = (i: number, field: keyof ActivityItem, val: string) => {
    const u = [...data.activities]; u[i] = { ...u[i], [field]: val }; upd('activities', u);
  };
  const pct = getProjectCompletion(data);

  return (
    <div className="space-y-5">
      {/* Project meta banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div><span className="font-bold text-gray-600 text-xs uppercase tracking-wide block">Project</span><span className="text-gray-900 font-semibold">{data.project_title}</span></div>
          <div><span className="font-bold text-gray-600 text-xs uppercase tracking-wide block">Project Leader</span><span className="text-gray-900 font-semibold">{data.project_leader || '—'}</span></div>
          <div><span className="font-bold text-gray-600 text-xs uppercase tracking-wide block">API ID</span><span className="text-gray-900 font-semibold">#{data.apiProjectId}</span></div>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4"><SectionHeader title="I. Project Profile" /><CompletionBadge pct={pct} /></div>
        <CommonProfileFields data={data} onChange={onChange} />
      </Card>

      {/* Activities for this project */}
      <Card>
        <SectionHeader title="Activities Under This Project" subtitle="Define all activities. You'll fill in full activity details in the next step." />
        <div className="space-y-3">
          {data.activities.map((act, i) => (
            <div key={act.id} className={`border-2 rounded-xl p-4 transition-all ${!act.activity_title?.trim() ? 'border-red-100 bg-red-50/20' : 'border-gray-100 hover:border-orange-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-orange-100 text-orange-700 text-xs font-black flex items-center justify-center shrink-0">{i + 1}</div>
                <span className="text-xs font-bold text-gray-700">Activity {i + 1}</span>
                {data.activities.length > 1 && (
                  <button onClick={() => upd('activities', data.activities.filter((_, idx) => idx !== i))} className="ml-auto w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2"><Field label="Activity Title" value={act.activity_title} onChange={(e) => updateActivity(i, 'activity_title', e.target.value)} required /></div>
                <Field label="Project Leader" value={act.project_leader} onChange={(e) => updateActivity(i, 'project_leader', e.target.value)} />
                <Field label="Members (comma separated)" value={act.project_members} onChange={(e) => updateActivity(i, 'project_members', e.target.value)} />
                <Field label="Duration (hours)" type="number" value={act.activity_duration} onChange={(e) => updateActivity(i, 'activity_duration', e.target.value)} />
                <Field label="Activity Date" type="date" value={act.activity_date} onChange={(e) => updateActivity(i, 'activity_date', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => upd('activities', [...data.activities, { ...defaultActivityItem(), project_leader: data.project_leader }])}
          className="mt-3 flex items-center gap-2 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-2.5 rounded-xl transition-all border-2 border-dashed border-orange-200 hover:border-orange-400 w-full justify-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Another Activity
        </button>
      </Card>

      <Card><SectionHeader title="II. Rationale" /><TextArea value={data.rationale} onChange={(e) => upd('rationale', e.target.value)} rows={7} required /></Card>
      <Card><SectionHeader title="III. Significance" /><TextArea value={data.significance} onChange={(e) => upd('significance', e.target.value)} rows={6} required /></Card>
      <Card>
        <SectionHeader title="IV. Objectives" />
        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200"><p className="font-bold text-gray-900 text-sm mb-3">General Objectives: <span className="text-red-400">*</span></p><TextArea value={data.general_objectives} onChange={(e) => upd('general_objectives', e.target.value)} rows={4} required /></div>
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200"><p className="font-bold text-gray-900 text-sm mb-3">Specific Objectives: <span className="text-red-400">*</span></p><TextArea value={data.specific_objectives} onChange={(e) => upd('specific_objectives', e.target.value)} rows={4} required /></div>
        </div>
      </Card>
      <Card><SectionHeader title="V. Methodology" /><TextArea value={data.methodology} onChange={(e) => upd('methodology', e.target.value)} rows={7} required /></Card>
      <Card><SectionHeader title="VI. Expected Output / Outcome" subtitle="6P's Framework Assessment" /><ExpectedOutputTable data={data.expected_output} onChange={(val) => upd('expected_output', val)} /></Card>
      <Card><SectionHeader title="VII. Sustainability Plan" /><TextArea value={data.sustainability_plan} onChange={(e) => upd('sustainability_plan', e.target.value)} rows={7} required /></Card>
      <Card><SectionHeader title="VIII. Organization and Staffing" /><OrgStaffingTable rows={data.org_staffing} onChange={(val) => upd('org_staffing', val)} /></Card>
      <Card><SectionHeader title="IX. Workplan" /><WorkplanTable rows={data.workplan} onChange={(val) => upd('workplan', val)} /></Card>
      <Card><SectionHeader title="X. Budgetary Requirement" /><BudgetTable rows={data.budget} onChange={(val) => upd('budget', val)} /></Card>

      <div className="flex justify-end py-2">
        <button onClick={onSave} disabled={isSaving}
          className={`flex items-center gap-2 bg-white border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}>
          {isSaving ? (<><Spinner />Saving...</>) : (<><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Save This Project</>)}
        </button>
      </div>
    </div>
  );
};