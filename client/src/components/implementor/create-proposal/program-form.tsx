import { getProgramCompletion } from "@/helpers/create-proposal-helper";
import type { ProgramBudgetRow, ProgramFormData, ProjectItem } from "@/api/implementor-api";
import { useState } from "react";
import { Card } from "./ui/card";
import { SectionHeader } from "./ui/section-header";
import { CompletionBadge } from "./ui/completion-badge";
import { Field } from "./ui/Field";
import { defaultProjectItem } from "@/constants/defaults";
import { CommonProfileFields } from "./ui/common-profile-fields";
import { TextArea } from "./ui/text-area";
import { ExpectedOutputTable } from "./tables/ExpectedOutputTable";
import { OrgStaffingTable } from "./tables/OrgStaffingTable";
import { WorkplanTable } from "./tables/WorkplanTable";
import { Spinner } from "./ui/Spinner";
import { ArrowRight } from "lucide-react";

interface ProgramFormProps { data: ProgramFormData; onChange: (v: ProgramFormData) => void; onNext: () => void; isSubmitting: boolean; }

export const ProgramProposalForm = ({ data, onChange, onNext, isSubmitting }: ProgramFormProps) => {
  const upd = (field: keyof ProgramFormData, val: any) => onChange({ ...data, [field]: val });
  const updateProject = (i: number, field: keyof ProjectItem, val: string) => { const u = [...data.projects]; u[i] = { ...u[i], [field]: val }; upd('projects', u); };
  const pct = getProgramCompletion(data);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6"><SectionHeader title="I. Program Profile" subtitle="Basic program information" /></div>
        <div className="flex flex-col gap-5">
          <div className="md:col-span-2"><Field label="Program Title" value={data.program_title} onChange={(e) => upd('program_title', e.target.value)} required /></div>
          <Field label="Program Leader" value={data.program_leader} onChange={(e) => upd('program_leader', e.target.value)} required />

          <div className='py-5'>
            <SectionHeader title="Projects Under This Program" subtitle="Define all projects to include. You'll fill in project details in the next step." />
            <div className="space-y-4">
              {data.projects.map((proj, i) => (
                <div key={proj.id} className={`border-2 rounded-2xl p-5 transition-all ${!proj.project_title?.trim() ? 'border-red-100 bg-red-50/20' : 'border-gray-100 hover:border-emerald-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">{i + 1}</div>
                      <span className="font-bold text-gray-900 text-sm">Project {i + 1}</span>
                      {proj.project_title && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{proj.project_title}</span>}
                    </div>
                    {data.projects.length > 1 && (
                      <button onClick={() => upd('projects', data.projects.filter((_, idx) => idx !== i))} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><Field label="Project Title" value={proj.project_title} onChange={(e) => updateProject(i, 'project_title', e.target.value)} required /></div>
                    <Field label="Project Leader" value={proj.project_leader} onChange={(e) => updateProject(i, 'project_leader', e.target.value)} required />
                    <Field label="Project Members" value={proj.project_members} onChange={(e) => updateProject(i, 'project_members', e.target.value)} />
                    <Field label="Duration (months)" type="number" value={proj.project_duration_months} onChange={(e) => updateProject(i, 'project_duration_months', e.target.value)} />
                    <div />
                    <Field label="Start Date" type="date" value={proj.project_start_date} onChange={(e) => updateProject(i, 'project_start_date', e.target.value)} />
                    <Field label="End Date" type="date" value={proj.project_end_date} onChange={(e) => updateProject(i, 'project_end_date', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => upd('projects', [...data.projects, defaultProjectItem(data.projects.length)])}
              className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition-all border-2 border-dashed border-emerald-200 hover:border-emerald-400 w-full justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Another Project
            </button>
          </div>

          <div>
            <div className="mt-5"><CommonProfileFields data={data as any} onChange={(v) => onChange({ ...data, ...v })} /></div>
          </div>
        </div>
      </Card>

      <Card><SectionHeader title="II. Rationale" subtitle="Include a brief result of the conducted needs assessment." /><TextArea value={data.rationale} onChange={(e) => upd('rationale', e.target.value)} rows={7} required placeholder="Include a brief result of the conducted needs assessment..." /></Card>
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
      <Card><SectionHeader title="VII. Sustainability Plan" /><TextArea value={data.sustainability_plan} onChange={(e) => upd('sustainability_plan', e.target.value)} rows={8} required /></Card>
      <Card><SectionHeader title="VIII. Organization and Staffing" /><OrgStaffingTable rows={data.org_staffing} onChange={(val) => upd('org_staffing', val)} /></Card>
      <Card><SectionHeader title="IX. Workplan" /><WorkplanTable rows={data.workplan} onChange={(val) => upd('workplan', val)} /></Card>
      <Card>
        <SectionHeader title="X. Budgetary Requirement" subtitle="Program-level budget summary." />
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-900 text-white">{['Line-Item Budget', 'Qty', 'Unit', 'Unit Cost', 'PRMSU', 'Agency X', 'Total (PHP)', ''].map((h) => <th key={h} className="px-4 py-3 text-left font-bold">{h}</th>)}</tr></thead>
            <tbody>
              {data.program_budget.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  {(['label', 'qty', 'unit', 'unit_cost', 'prmsu', 'agency', 'total'] as (keyof ProgramBudgetRow)[]).map((col) => (
                    <td key={col} className="px-3 py-2">
                      <input readOnly={col === 'total'} value={row[col]}
                        onChange={(e) => { const u = [...data.program_budget]; u[i] = { ...u[i], [col]: e.target.value }; if (col === 'prmsu' || col === 'agency') u[i].total = String((parseFloat(u[i].prmsu) || 0) + (parseFloat(u[i].agency) || 0)); upd('program_budget', u); }}
                        className={`w-full text-sm outline-none border-b border-gray-200 focus:border-emerald-500 bg-transparent ${col === 'total' ? 'font-bold text-emerald-700 cursor-not-allowed' : ''}`} placeholder="—" />
                    </td>
                  ))}
                  <td className="px-2 py-2"><button onClick={() => upd('program_budget', data.program_budget.filter((_, idx) => idx !== i))} className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={() => upd('program_budget', [...data.program_budget, { label: '', qty: '', unit: '', unit_cost: '', prmsu: '', agency: '', total: '' }])} className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Row
        </button>
      </Card>

      {/* ── Floating Action Panel ─────────────────────────────────── */}
<div className="fixed right-5 bottom-5 z-50 flex flex-col items-end">
  <div
    style={{ maxHeight: collapsed ? 0 : 200, opacity: collapsed ? 0 : 1, padding: collapsed ? '0 18px' : '16px 18px' }}
    className="bg-white border border-gray-200 rounded-2xl rounded-br-none min-w-[260px] overflow-hidden transition-all duration-300 ease-in-out"
  >
    <p className="text-xs text-gray-500 font-medium mb-2">Form completion</p>
    <CompletionBadge pct={pct} />
    <button onClick={onNext} disabled={isSubmitting} className="mt-3 w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all">
      {isSubmitting ? <><Spinner />Saving...</> : <>Save &amp; Configure Projects <ArrowRight /></>}
    </button>
  </div>
  <button
    onClick={() => setCollapsed(c => !c)}
    className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-bl-lg rounded-br-lg rounded-tl-lg transition-all"
  >
    <svg className={`w-3 h-3 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
    {collapsed ? 'Save panel' : 'Collapse'}
  </button>
</div>
    </div>
  );
};