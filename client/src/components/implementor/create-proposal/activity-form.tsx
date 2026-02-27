import { getActivityCompletion } from "@/helpers/create-proposal-helper";
import type { ActivityFormData, ActivityScheduleRow } from "@/utils/implementor-api";
import { SectionHeader } from "./ui/section-header";
import { CompletionBadge } from "./ui/completion-badge";
import { Card } from "./ui/card";
import { Field } from "./ui/Field";
import { CommonProfileFields } from "./ui/common-profile-fields";
import { TextArea } from "./ui/text-area";
import { ExpectedOutputTable } from "./tables/ExpectedOutputTable";
import { OrgStaffingTable } from "./tables/OrgStaffingTable";
import { BudgetTable } from "./tables/BudgetTable";
import { Spinner } from "./ui/Spinner";

interface ActivityFormProps { data: ActivityFormData; onChange: (v: ActivityFormData) => void; onSave: () => void; isSaving: boolean; }

export const ActivityProposalForm = ({ data, onChange, onSave, isSaving }: ActivityFormProps) => {
  const upd = (field: keyof ActivityFormData, val: any) => onChange({ ...data, [field]: val });

  const updateScheduleRow = (i: number, field: keyof ActivityScheduleRow, val: string) => {
    const u = [...data.schedule.rows]; u[i] = { ...u[i], [field]: val }; upd('schedule', { ...data.schedule, rows: u });
  };

  const pct = getActivityCompletion(data);

  return (
    <div className="space-y-5">
      {/* Activity meta banner */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 font-black text-sm flex items-center justify-center">#{data.apiActivityId}</div>
          <div><p className="font-bold text-gray-900">{data.activity_title}</p><p className="text-xs text-gray-500">Activity ID from API</p></div>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4"><SectionHeader title="I. Activity Profile" /><CompletionBadge pct={pct} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <Field label="Activity Title" value={data.activity_title} onChange={(e) => upd('activity_title', e.target.value)} readOnly />
          <Field label="Activity Duration (e.g. 8 hours)" value={data.activity_duration} onChange={(e) => upd('activity_duration', e.target.value)} />
        </div>
        <CommonProfileFields data={data} onChange={onChange} />
      </Card>

      <Card><SectionHeader title="II. Rationale" /><TextArea value={data.rationale} onChange={(e) => upd('rationale', e.target.value)} rows={7} required /></Card>
      <Card><SectionHeader title="III. Significance" /><TextArea value={data.significance} onChange={(e) => upd('significance', e.target.value)} rows={6} required /></Card>
      <Card><SectionHeader title="IV. Objectives of the Activity" /><TextArea value={data.objectives} onChange={(e) => upd('objectives', e.target.value)} rows={6} required /></Card>
      <Card><SectionHeader title="V. Methodology" subtitle="Short narrative" /><TextArea value={data.methodology} onChange={(e) => upd('methodology', e.target.value)} rows={7} required /></Card>
      <Card><SectionHeader title="VI. Expected Output / Outcome" subtitle="6P's Framework Assessment" /><ExpectedOutputTable data={data.expected_output} onChange={(val) => upd('expected_output', val)} /></Card>
      <Card><SectionHeader title="VII. Organization and Staffing" /><OrgStaffingTable rows={data.org_staffing} onChange={(val) => upd('org_staffing', val)} /></Card>

      <Card>
        <SectionHeader title="VIII. Plan of Activities" subtitle="Activity schedule and programme flow" />
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title of the Activity" value={data.schedule.activity_title} onChange={(e) => upd('schedule', { ...data.schedule, activity_title: e.target.value })} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Activity Date</label>
              <input type="date" value={data.schedule.activity_date} onChange={(e) => upd('schedule', { ...data.schedule, activity_date: e.target.value })} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
            <table className="w-full text-sm">
              <thead><tr className="bg-gradient-to-r from-emerald-600 to-teal-600"><th className="py-3 px-5 text-center text-white font-bold border-r border-white/20 w-36">Time</th><th className="py-3 px-5 text-left text-white font-bold">Activity</th><th className="py-3 px-5 text-left text-white font-bold w-48">Speaker / Facilitator</th><th className="py-3 px-3 text-white font-bold w-10" /></tr></thead>
              <tbody className="divide-y divide-gray-200">
                {data.schedule.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-r border-gray-200 bg-gray-50"><input value={row.time} onChange={(e) => updateScheduleRow(i, 'time', e.target.value)} className="w-full text-center bg-white border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500 text-xs" /></td>
                    <td className="py-2 px-4"><input value={row.activity} onChange={(e) => updateScheduleRow(i, 'activity', e.target.value)} placeholder="Activity" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-semibold outline-none focus:ring-2 focus:ring-emerald-500 text-sm" /></td>
                    <td className="py-2 px-4"><input value={row.speaker} onChange={(e) => updateScheduleRow(i, 'speaker', e.target.value)} placeholder="Name / role" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 outline-none focus:ring-2 focus:ring-blue-400" /></td>
                    <td className="py-2 px-2 text-center"><button onClick={() => { if (data.schedule.rows.length > 1) upd('schedule', { ...data.schedule, rows: data.schedule.rows.filter((_, idx) => idx !== i) }); }} className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all mx-auto"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => upd('schedule', { ...data.schedule, rows: [...data.schedule.rows, { time: '', activity: '', speaker: '' }] })} className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Row
          </button>
        </div>
      </Card>

      <Card><SectionHeader title="IX. Budgetary Requirement" /><BudgetTable rows={data.budget} onChange={(val) => upd('budget', val)} /></Card>

      <div className="flex justify-end py-2">
        <button onClick={onSave} disabled={isSaving}
          className={`flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-200 transition-all hover:scale-[1.02] ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}>
          {isSaving ? (<><Spinner />Saving Activity...</>) : (<><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Save This Activity</>)}
        </button>
      </div>
    </div>
  );
};
