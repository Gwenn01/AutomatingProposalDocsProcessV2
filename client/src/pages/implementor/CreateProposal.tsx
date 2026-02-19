import { useState, useCallback } from 'react';
import {
  submitProgramProposal,
  fetchProjectList,
  saveProjectProposal,
  fetchActivityList,
  saveActivityProposal,
  type ProgramFormData,
  type ProjectFormData,
  type ActivityFormData,
  type ExpectedOutput6Ps,
  type OrgStaffingItem,
  type WorkplanRow,
  type BudgetRows,
  type ProgramBudgetRow,
  type ProjectItem,
  type ActivityItem,
  type ActivityScheduleData,
  type ActivityScheduleRow,
  type BudgetLineItem,
  type ApiProject,
  type ApiActivity,
} from '@/utils/implementor-api';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const TAGGING_OPTIONS = [
  'General',
  'Environment and Climate Change (for CECC)',
  'Gender and Development (for GAD)',
  'Mango-Related (for RMC)',
];

const CLUSTER_OPTIONS = [
  'Health, Education, and Social Sciences',
  'Engineering, Industry, Information Technology',
  'Environment and Natural Resources',
  'Tourism, Hospitality Management, Entrepreneurship, Criminal Justice',
  'Graduate Studies',
  'Fisheries',
  'Agriculture, Forestry',
];

const AGENDA_OPTIONS = [
  'Business Management and Livelihood Skills Development',
  'Accountability, Good Governance, and Peace and Order',
  'Youth and Adult Functional Literacy and Education',
  'Accessibility, Inclusivity, and Gender and Development',
  'Nutrition, Health, and Wellness',
  "Indigenous People's Rights and Cultural Heritage Preservation",
  'Human Capital Development',
  'Adoption and Commercialization of Appropriate Technologies',
  'Natural Resources, Climate Change, and Disaster Risk Reduction Management',
];

// ─────────────────────────────────────────────
// DEFAULTS
// ─────────────────────────────────────────────

const defaultExpectedOutput = (): ExpectedOutput6Ps => ({
  publications: '', patents: '', products: '', people_services: '',
  places_partnerships: '', policy: '', social_impact: '', economic_impact: '',
});

const defaultOrgStaffing = (): OrgStaffingItem[] => [
  { activity: 'Proposal Preparation', designation: '', terms: '' },
  { activity: 'Program/Certificates', designation: '', terms: '' },
  { activity: 'Food Preparation', designation: '', terms: '' },
  { activity: 'Resource Speakers', designation: '', terms: '' },
  { activity: 'Masters of Ceremony', designation: '', terms: '' },
  { activity: 'Secretariat for Attendance', designation: '', terms: '' },
  { activity: 'Documentation/Technical', designation: '', terms: '' },
];

const defaultWorkplanRow = (): WorkplanRow => ({
  objective: '', activity: '', expected_output: '',
  year1_q1: false, year1_q2: false, year1_q3: false, year1_q4: false,
  year2_q1: false, year2_q2: false, year2_q3: false, year2_q4: false,
  year3_q1: false, year3_q2: false, year3_q3: false, year3_q4: false,
});

const defaultBudget = (): BudgetRows => ({ meals: [], transport: [], supplies: [] });

const defaultProjectItem = (index: number): ProjectItem => ({
  id: Date.now() + index,
  project_title: '',
  project_leader: '',
  project_members: '',
  project_duration_months: '',
  project_start_date: '',
  project_end_date: '',
});

const defaultActivityItem = (): ActivityItem => ({
  id: Date.now() + Math.random(),
  activity_title: '',
  project_leader: '',
  project_members: '',
  activity_duration: '8',
  activity_date: '',
});

const defaultScheduleRows = (): ActivityScheduleRow[] => [
  { time: '8:00 - 8:05 AM', activity: 'AVP National Anthem', speaker: '' },
  { time: '8:05 - 8:10 AM', activity: 'AVP Invocation', speaker: '' },
  { time: '8:10 - 8:20 AM', activity: 'Welcome Message', speaker: '' },
  { time: '8:20 - 8:30 AM', activity: 'Opening Remarks', speaker: '' },
  { time: '8:30 - 8:35 AM', activity: 'Overview of the Activity', speaker: '' },
  { time: '9:30 - 9:45 AM', activity: 'AM Snacks', speaker: '' },
  { time: '12:00 - 1:00 PM', activity: 'LUNCH BREAK', speaker: '' },
  { time: '3:30 - 4:15 PM', activity: 'PM Snacks / Open Forum', speaker: '' },
  { time: '4:15 - 4:30 PM', activity: 'Evaluation', speaker: '' },
  { time: '4:30 - 4:45 PM', activity: 'Closing Remarks', speaker: '' },
  { time: '4:45 - 5:00 PM', activity: 'Photo Documentation', speaker: '' },
];

const defaultProgramFormData = (): ProgramFormData => ({
  program_title: '', program_leader: '', members: '',
  implementing_agency: '', address_tel_email: '', cooperating_agencies: '',
  extension_site: '', tagging: [], cluster: [], extension_agenda: [],
  sdg_addressed: '', college_mandated_program: '',
  rationale: '', significance: '', general_objectives: '', specific_objectives: '',
  methodology: '', sustainability_plan: '',
  expected_output: defaultExpectedOutput(),
  org_staffing: defaultOrgStaffing(),
  workplan: [defaultWorkplanRow()],
  program_budget: [{ label: 'Project 1', qty: '', unit: '', unit_cost: '', prmsu: '', agency: '', total: '' }],
  projects: [defaultProjectItem(0)],
});

const defaultProjectFormData = (apiProject: ApiProject): ProjectFormData => ({
  apiProjectId: apiProject.id,
  project_title: apiProject.project_title,
  project_leader: apiProject.project_leader,
  implementing_agency: '', address_tel_email: '', cooperating_agencies: '',
  extension_site: '', tagging: [], cluster: [], extension_agenda: [],
  sdg_addressed: '', college_mandated_program: '',
  rationale: '', significance: '', general_objectives: '', specific_objectives: '',
  methodology: '', sustainability_plan: '',
  expected_output: defaultExpectedOutput(),
  org_staffing: defaultOrgStaffing(),
  workplan: [defaultWorkplanRow()],
  budget: defaultBudget(),
  activities: [{ ...defaultActivityItem(), project_leader: apiProject.project_leader }],
  saved: false,
});

const defaultActivityFormData = (apiActivity: ApiActivity): ActivityFormData => ({
  apiActivityId: apiActivity.id,
  activity_title: apiActivity.activity_title,
  implementing_agency: '', address_tel_email: '', cooperating_agencies: '',
  extension_site: '', tagging: [], cluster: [], extension_agenda: [],
  sdg_addressed: '', college_mandated_program: '',
  activity_duration: String(apiActivity.activity_duration_hours || 8),
  rationale: '', significance: '', objectives: '', methodology: '', sustainability_plan: '',
  expected_output: defaultExpectedOutput(),
  org_staffing: defaultOrgStaffing(),
  schedule: { activity_title: apiActivity.activity_title, activity_date: apiActivity.activity_date || '', rows: defaultScheduleRows() },
  budget: defaultBudget(),
  saved: false,
});

// ─────────────────────────────────────────────
// COMPLETION HELPERS
// ─────────────────────────────────────────────

const getProgramCompletion = (data: ProgramFormData): number => {
  const fields: (keyof ProgramFormData)[] = ['program_title', 'program_leader', 'implementing_agency', 'rationale', 'significance', 'general_objectives', 'specific_objectives', 'methodology', 'sustainability_plan'];
  const filled = fields.filter((f) => (data[f] as string)?.trim()).length;
  const projectsFilled = data.projects.every((p) => p.project_title?.trim() && p.project_leader?.trim());
  return Math.round(((filled + (projectsFilled ? 2 : 0)) / (fields.length + 2)) * 100);
};

const getProjectCompletion = (data: ProjectFormData): number => {
  const fields: (keyof ProjectFormData)[] = ['implementing_agency', 'rationale', 'significance', 'general_objectives', 'specific_objectives', 'methodology', 'sustainability_plan'];
  const filled = fields.filter((f) => (data[f] as string)?.trim()).length;
  const actsFilled = data.activities.length > 0 && data.activities.every((a) => a.activity_title?.trim());
  return Math.round(((filled + (actsFilled ? 1 : 0)) / (fields.length + 1)) * 100);
};

const getActivityCompletion = (data: ActivityFormData): number => {
  const fields: (keyof ActivityFormData)[] = ['implementing_agency', 'rationale', 'significance', 'objectives', 'methodology'];
  const filled = fields.filter((f) => (data[f] as string)?.trim()).length;
  return Math.round((filled / fields.length) * 100);
};

// ─────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────

const CompletionBadge = ({ pct }: { pct: number }) => {
  const color = pct === 100 ? 'bg-emerald-500 text-white' : pct >= 60 ? 'bg-amber-400 text-amber-900' : 'bg-red-100 text-red-600';
  return <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{pct === 100 ? '✓ Complete' : `${pct}%`}</span>;
};

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [{ label: 'Program', icon: '📋' }, { label: 'Projects', icon: '📁' }, { label: 'Activities', icon: '📅' }];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const isActive = currentStep === stepNum;
        const isDone = currentStep > stepNum;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                ${isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-110' : isDone ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-400' : 'bg-gray-100 text-gray-400 border-2 border-gray-200'}`}>
                {isDone ? '✓' : step.icon}
              </div>
              <span className={`text-xs font-semibold mt-1.5 ${isActive ? 'text-emerald-700' : isDone ? 'text-emerald-500' : 'text-gray-400'}`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`w-20 h-0.5 mx-1 mb-5 transition-all duration-500 ${currentStep > stepNum ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
          </div>
        );
      })}
    </div>
  );
};

interface FieldProps { label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; required?: boolean; readOnly?: boolean; }
const Field = ({ label, type = 'text', value, onChange, placeholder, required, readOnly }: FieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
    <input type={type} value={value} onChange={onChange} readOnly={readOnly}
      placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
      className={`border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-gray-300 transition-all
        ${readOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : required && !value?.trim() ? 'bg-red-50/30 border-red-200' : 'bg-gray-50 border-gray-200'}`}
    />
  </div>
);

interface TextAreaProps { label?: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number; placeholder?: string; required?: boolean; }
const TextArea = ({ label, value, onChange, rows = 5, placeholder, required }: TextAreaProps) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>}
    <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder}
      className={`border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-gray-300 transition-all resize-none
        ${required && !value?.trim() ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-gray-50'}`}
    />
  </div>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
    <div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 ${className}`}>{children}</div>
);

const CheckboxGroup = ({ label, options, selected, onChange }: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
    <div className="grid grid-cols-1 gap-1.5">
      {options.map((opt) => (
        <label key={opt} className="flex items-start gap-2.5 cursor-pointer group">
          <input type="checkbox" checked={selected.includes(opt)}
            onChange={(e) => { if (e.target.checked) onChange([...selected, opt]); else onChange(selected.filter((o) => o !== opt)); }}
            className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 shrink-0" />
          <span className="text-xs text-gray-700 group-hover:text-gray-900 leading-relaxed">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const ExpectedOutputTable = ({ data, onChange }: { data: ExpectedOutput6Ps; onChange: (v: ExpectedOutput6Ps) => void }) => {
  const rows: { label: string; key: keyof ExpectedOutput6Ps }[] = [
    { label: 'Publications', key: 'publications' }, { label: 'Patents / IP', key: 'patents' },
    { label: 'Products', key: 'products' }, { label: 'People Services', key: 'people_services' },
    { label: 'Places and Partnerships', key: 'places_partnerships' }, { label: 'Policy', key: 'policy' },
    { label: 'Social Impact', key: 'social_impact' }, { label: 'Economic Impact', key: 'economic_impact' },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead><tr className="bg-gray-50 border-b-2 border-emerald-500"><th className="px-5 py-3 text-left font-bold text-gray-900 w-48">6P's Category</th><th className="px-5 py-3 text-left font-bold text-gray-900">Expected Output</th></tr></thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map(({ label, key }) => (
            <tr key={key} className="hover:bg-gray-50">
              <td className="px-5 py-3 font-semibold text-gray-700 bg-gray-50/60">{label}</td>
              <td className="px-5 py-3"><input className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={data[key]} onChange={(e) => onChange({ ...data, [key]: e.target.value })} placeholder={`Enter ${label.toLowerCase()}...`} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const OrgStaffingTable = ({ rows, onChange }: { rows: OrgStaffingItem[]; onChange: (v: OrgStaffingItem[]) => void }) => {
  const update = (i: number, field: keyof OrgStaffingItem, value: string) => { const u = [...rows]; u[i] = { ...u[i], [field]: value }; onChange(u); };
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-[1fr_1.5fr_1.5fr_32px] px-4 py-3 bg-gray-100 border-b-2 border-emerald-500 text-xs font-bold text-gray-900 gap-3">
        <span>Activity / Role</span><span>Designation / Name</span><span>Terms of Reference</span><span />
      </div>
      {rows.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_1.5fr_1.5fr_32px] gap-3 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 items-start">
          <input value={item.activity} onChange={(e) => update(i, 'activity', e.target.value)} placeholder="Activity / role" className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-gray-800" />
          <textarea rows={2} value={item.designation} onChange={(e) => update(i, 'designation', e.target.value)} placeholder="Full name" className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs resize-none outline-none focus:ring-2 focus:ring-emerald-500" />
          <textarea rows={2} value={item.terms} onChange={(e) => update(i, 'terms', e.target.value)} placeholder="Terms of reference" className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs resize-none outline-none focus:ring-2 focus:ring-emerald-500" />
          <button onClick={() => { if (rows.length > 1) onChange(rows.filter((_, idx) => idx !== i)); }} className="mt-1 w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
      <div className="p-4">
        <button onClick={() => onChange([...rows, { activity: '', designation: '', terms: '' }])} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-all">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Row
        </button>
      </div>
    </div>
  );
};

const BudgetTable = ({ rows, onChange }: { rows: BudgetRows; onChange: (v: BudgetRows) => void }) => {
  const handle = (cat: keyof BudgetRows, i: number, field: keyof BudgetLineItem, val: string) => {
    const updated = [...rows[cat]];
    updated[i] = { ...updated[i], [field]: val };
    if (field === 'cost' || field === 'qty') updated[i].amount = (Number(updated[i].cost) || 0) * (Number(updated[i].qty) || 0);
    onChange({ ...rows, [cat]: updated });
  };
  const total = (cat: keyof BudgetRows) => rows[cat].reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const grand = (['meals', 'transport', 'supplies'] as (keyof BudgetRows)[]).reduce((s, c) => s + total(c), 0);
  const cats: { key: keyof BudgetRows; label: string; color: string }[] = [
    { key: 'meals', label: 'A. Meals and Snacks', color: 'text-orange-700 bg-orange-50' },
    { key: 'transport', label: 'B. Transportation', color: 'text-blue-700 bg-blue-50' },
    { key: 'supplies', label: 'C. Supplies and Materials', color: 'text-purple-700 bg-purple-50' },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead><tr className="bg-gray-900 text-white">{['Item', 'Cost (PHP)', 'Pax / Qty', 'Amount', ''].map((h, i) => <th key={i} className="px-5 py-3 text-left font-bold">{h}</th>)}</tr></thead>
        <tbody>
          {cats.map(({ key, label, color }) => (
            <>
              <tr key={`header-${key}`}><td colSpan={5} className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wide ${color}`}>{label}</td></tr>
              {rows[key].map((row, i) => (
                <tr key={`${key}-${i}`} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2"><input placeholder="Item description" value={row.item} onChange={(e) => handle(key, i, 'item', e.target.value)} className="w-full bg-transparent border-b border-gray-200 focus:border-emerald-500 outline-none text-sm" /></td>
                  <td className="px-4 py-2"><input type="number" placeholder="0.00" value={row.cost} onChange={(e) => handle(key, i, 'cost', e.target.value)} className="w-full bg-transparent border-b border-gray-200 focus:border-emerald-500 outline-none text-sm" /></td>
                  <td className="px-4 py-2"><input type="number" placeholder="0" value={row.qty} onChange={(e) => handle(key, i, 'qty', e.target.value)} className="w-full bg-transparent border-b border-gray-200 focus:border-emerald-500 outline-none text-sm" /></td>
                  <td className="px-4 py-2"><input readOnly value={row.amount ? `₱ ${Number(row.amount).toLocaleString()}` : ''} placeholder="₱ 0" className="w-full bg-gray-100 rounded px-2 py-1 text-sm font-medium text-gray-700 cursor-not-allowed" /></td>
                  <td className="px-2 py-2"><button onClick={() => onChange({ ...rows, [key]: rows[key].filter((_, idx) => idx !== i) })} className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></td>
                </tr>
              ))}
              <tr key={`subtotal-${key}`} className="bg-gray-50"><td colSpan={3} className="px-5 py-2 font-bold text-gray-700 text-sm">Subtotal</td><td className="px-5 py-2 font-bold text-sm">₱ {total(key).toLocaleString()}</td><td /></tr>
              <tr key={`add-${key}`}><td colSpan={5} className="px-5 py-2"><button onClick={() => onChange({ ...rows, [key]: [...rows[key], { item: '', cost: '', qty: '', amount: '' }] })} className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Row</button></td></tr>
            </>
          ))}
          <tr className="bg-emerald-700 text-white font-bold"><td colSpan={3} className="px-5 py-3">GRAND TOTAL</td><td className="px-5 py-3">₱ {grand.toLocaleString()}</td><td /></tr>
        </tbody>
      </table>
    </div>
  );
};

const WorkplanTable = ({ rows, onChange }: { rows: WorkplanRow[]; onChange: (v: WorkplanRow[]) => void }) => {
  const update = (i: number, key: keyof WorkplanRow, val: any) => { const u = [...rows]; (u[i] as any)[key] = val; onChange(u); };
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th rowSpan={2} className="px-3 py-2 border border-gray-300 text-left font-bold min-w-[100px]">Objective</th>
            <th rowSpan={2} className="px-3 py-2 border border-gray-300 text-left font-bold min-w-[100px]">Activity</th>
            <th rowSpan={2} className="px-3 py-2 border border-gray-300 text-left font-bold min-w-[90px]">Expected Output</th>
            {['Year 1', 'Year 2', 'Year 3'].map((y) => <th key={y} colSpan={4} className="px-3 py-2 border border-gray-300 text-center font-bold">{y}</th>)}
            <th rowSpan={2} className="px-2 py-2 border border-gray-300 w-8" />
          </tr>
          <tr className="bg-gray-50">{[1, 2, 3].map((yr) => ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => <th key={`${yr}-${q}`} className="px-2 py-1 border border-gray-300 text-center font-semibold w-8">{q}</th>))}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-2 py-2"><textarea rows={2} value={row.objective} onChange={(e) => update(i, 'objective', e.target.value)} className="w-full bg-transparent outline-none resize-none text-xs" placeholder="Objective..." /></td>
              <td className="border border-gray-200 px-2 py-2"><textarea rows={2} value={row.activity} onChange={(e) => update(i, 'activity', e.target.value)} className="w-full bg-transparent outline-none resize-none text-xs" placeholder="Activity..." /></td>
              <td className="border border-gray-200 px-2 py-2"><textarea rows={2} value={row.expected_output} onChange={(e) => update(i, 'expected_output', e.target.value)} className="w-full bg-transparent outline-none resize-none text-xs" placeholder="Output..." /></td>
              {[1, 2, 3].map((yr) => ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => { const key = `year${yr}_${q.toLowerCase()}` as keyof WorkplanRow; return <td key={`${yr}-${q}`} className="border border-gray-200 px-2 py-2 text-center"><input type="checkbox" checked={row[key] as boolean} onChange={(e) => update(i, key, e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500" /></td>; }))}
              <td className="border border-gray-200 px-2 py-2 text-center"><button onClick={() => { if (rows.length > 1) onChange(rows.filter((_, idx) => idx !== i)); }} className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-red-500 rounded transition-all mx-auto"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4"><button onClick={() => onChange([...rows, defaultWorkplanRow()])} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Row</button></div>
    </div>
  );
};

const CommonProfileFields = ({ data, onChange }: { data: ProjectFormData | ActivityFormData; onChange: (v: any) => void }) => {
  const upd = (field: string, val: any) => onChange({ ...data, [field]: val });
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2"><Field label="Implementing Agency / College / Mandated Program" value={data.implementing_agency} onChange={(e) => upd('implementing_agency', e.target.value)} required /></div>
        <div className="md:col-span-2"><Field label="Address / Telephone / Email" value={data.address_tel_email} onChange={(e) => upd('address_tel_email', e.target.value)} /></div>
        <div className="md:col-span-2"><Field label="Cooperating Agency/ies" value={data.cooperating_agencies} onChange={(e) => upd('cooperating_agencies', e.target.value)} /></div>
        <div className="md:col-span-2"><Field label="Extension Site/s or Venue/s" value={data.extension_site} onChange={(e) => upd('extension_site', e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200"><CheckboxGroup label="Tagging" options={TAGGING_OPTIONS} selected={data.tagging} onChange={(val) => upd('tagging', val)} /></div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200"><CheckboxGroup label="Cluster" options={CLUSTER_OPTIONS} selected={data.cluster} onChange={(val) => upd('cluster', val)} /></div>
        <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-200"><CheckboxGroup label="Extension Agenda" options={AGENDA_OPTIONS} selected={data.extension_agenda} onChange={(val) => upd('extension_agenda', val)} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="SDG Addressed" value={data.sdg_addressed} onChange={(e) => upd('sdg_addressed', e.target.value)} />
        <Field label="College / Campus / Mandated Academic Program" value={data.college_mandated_program} onChange={(e) => upd('college_mandated_program', e.target.value)} />
      </div>
    </div>
  );
};

const Spinner = () => (
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ─────────────────────────────────────────────
// STEP 1: PROGRAM FORM
// ─────────────────────────────────────────────

interface ProgramFormProps { data: ProgramFormData; onChange: (v: ProgramFormData) => void; onNext: () => void; isSubmitting: boolean; }

const ProgramProposalForm = ({ data, onChange, onNext, isSubmitting }: ProgramFormProps) => {
  const upd = (field: keyof ProgramFormData, val: any) => onChange({ ...data, [field]: val });
  const updateProject = (i: number, field: keyof ProjectItem, val: string) => { const u = [...data.projects]; u[i] = { ...u[i], [field]: val }; upd('projects', u); };
  const pct = getProgramCompletion(data);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6"><SectionHeader title="I. Program Profile" subtitle="Basic program information" /><CompletionBadge pct={pct} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2"><Field label="Program Title" value={data.program_title} onChange={(e) => upd('program_title', e.target.value)} required /></div>
          <Field label="Program Leader" value={data.program_leader} onChange={(e) => upd('program_leader', e.target.value)} required />
          <Field label="Members" value={data.members} onChange={(e) => upd('members', e.target.value)} />
        </div>
        <div className="mt-5"><CommonProfileFields data={data as any} onChange={(v) => onChange({ ...data, ...v })} /></div>
      </Card>

      <Card>
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

      <div className="flex justify-end py-4">
        <button onClick={onNext} disabled={isSubmitting}
          className={`flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-4 rounded-xl font-bold text-base shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}>
          {isSubmitting ? (<><Spinner />Saving Program...</>) : (<>Save Program & Configure Projects <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>)}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// STEP 2: PROJECT FORM
// ─────────────────────────────────────────────

interface ProjectFormProps { data: ProjectFormData; onChange: (v: ProjectFormData) => void; onSave: () => void; isSaving: boolean; }

const ProjectProposalForm = ({ data, onChange, onSave, isSaving }: ProjectFormProps) => {
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

// ─────────────────────────────────────────────
// STEP 3: ACTIVITY FORM
// ─────────────────────────────────────────────

interface ActivityFormProps { data: ActivityFormData; onChange: (v: ActivityFormData) => void; onSave: () => void; isSaving: boolean; }

const ActivityProposalForm = ({ data, onChange, onSave, isSaving }: ActivityFormProps) => {
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

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function CreateProposal() {
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Step 1
  const [programData, setProgramData] = useState<ProgramFormData>(defaultProgramFormData());
  const [programChildId, setProgramChildId] = useState<number | null>(null);
  const [isSubmittingProgram, setIsSubmittingProgram] = useState(false);

  // Step 2
  const [projectForms, setProjectForms] = useState<ProjectFormData[]>([]);
  const [activeProjectTab, setActiveProjectTab] = useState(0);
  const [projectSaving, setProjectSaving] = useState<Record<number, boolean>>({});
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Step 3
  // activityForms: keyed by projectId (API id), array of activities per project
  const [activityFormsByProject, setActivityFormsByProject] = useState<Record<number, ActivityFormData[]>>({});
  const [activeActivityKey, setActiveActivityKey] = useState<{ projectId: number; activityIdx: number } | null>(null);
  const [activitySaving, setActivitySaving] = useState<Record<string, boolean>>({});
  const [loadingActivities, setLoadingActivities] = useState<Record<number, boolean>>({});

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  // ── STEP 1: Save Program → GET project list ──────────────────────────────
  const handleProgramNext = async () => {
    if (!programData.program_title.trim()) { showToast('Please enter a Program Title.', 'error'); return; }
    if (programData.projects.some((p) => !p.project_title.trim())) { showToast('Please fill in all Project Titles.', 'error'); return; }
    if (!programData.rationale.trim()) { showToast('Please fill in the Rationale.', 'error'); return; }

    setIsSubmittingProgram(true);
    try {
      const result = await submitProgramProposal(programData);
      const childId = result?.child_id ?? result?.id ?? result?.program_proposal_id;
      if (!childId) throw new Error('API did not return a program child_id.');
      setProgramChildId(Number(childId));

      // Fetch the project list from the API
      setLoadingProjects(true);
      const projectListData = await fetchProjectList(Number(childId));
      const forms = projectListData.projects.map((p) => defaultProjectFormData(p));
      setProjectForms(forms);
      setActiveProjectTab(0);
      setStep(2);
      scrollToTop();
      showToast(`Program saved! ID: #${childId}. Fill in each project below.`);
    } catch (err: any) {
      showToast(`Failed to save program: ${err.message}`, 'error');
    } finally {
      setIsSubmittingProgram(false);
      setLoadingProjects(false);
    }
  };

  // ── STEP 2: Save individual project via PUT /api/project-proposal/{id}/ ──
  const handleSaveProject = async (projectIndex: number) => {
    const form = projectForms[projectIndex];
    if (!form) return;
    if (form.activities.some((a) => !a.activity_title.trim())) { showToast('Fill in all Activity Titles for this project.', 'error'); return; }

    setProjectSaving((prev) => ({ ...prev, [projectIndex]: true }));
    try {
      await saveProjectProposal(form.apiProjectId, form);
      setProjectForms((prev) => { const u = [...prev]; u[projectIndex] = { ...u[projectIndex], saved: true }; return u; });
      showToast(`Project "${form.project_title}" saved!`);
    } catch (err: any) {
      showToast(`Failed to save project: ${err.message}`, 'error');
    } finally {
      setProjectSaving((prev) => ({ ...prev, [projectIndex]: false }));
    }
  };

  // ── STEP 2 → STEP 3: All projects must be saved ───────────────────────────
  const handleGoToActivities = async () => {
    const unsaved = projectForms.filter((p) => !p.saved);
    if (unsaved.length > 0) {
      showToast(`Please save all projects first. (${unsaved.length} unsaved)`, 'error');
      return;
    }

    // Fetch activities for each project
    const newActivityForms: Record<number, ActivityFormData[]> = {};
    const loadingMap: Record<number, boolean> = {};

    for (const pf of projectForms) {
      loadingMap[pf.apiProjectId] = true;
      setLoadingActivities({ ...loadingMap });
      try {
        const actData = await fetchActivityList(pf.apiProjectId);
        newActivityForms[pf.apiProjectId] = actData.activities.map((a) => defaultActivityFormData(a));
      } catch (err: any) {
        showToast(`Failed to load activities for "${pf.project_title}": ${err.message}`, 'error');
        return;
      } finally {
        loadingMap[pf.apiProjectId] = false;
        setLoadingActivities({ ...loadingMap });
      }
    }

    setActivityFormsByProject(newActivityForms);

    // Set first activity as active
    const firstProject = projectForms[0];
    if (firstProject && newActivityForms[firstProject.apiProjectId]?.length > 0) {
      setActiveActivityKey({ projectId: firstProject.apiProjectId, activityIdx: 0 });
    }

    setStep(3);
    scrollToTop();
  };

  // ── STEP 3: Save activity via PATCH /api/activity-proposal/{id}/ ──────────
  const handleSaveActivity = async (projectId: number, activityIdx: number) => {
    const forms = activityFormsByProject[projectId];
    const form = forms?.[activityIdx];
    if (!form) return;

    const key = `${projectId}-${activityIdx}`;
    setActivitySaving((prev) => ({ ...prev, [key]: true }));
    try {
      await saveActivityProposal(form.apiActivityId, form);
      setActivityFormsByProject((prev) => {
        const u = { ...prev };
        u[projectId] = [...u[projectId]];
        u[projectId][activityIdx] = { ...u[projectId][activityIdx], saved: true };
        return u;
      });
      showToast(`Activity "${form.activity_title}" saved!`);
    } catch (err: any) {
      showToast(`Failed to save activity: ${err.message}`, 'error');
    } finally {
      setActivitySaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  // ── Submit all → reset ─────────────────────────────────────────────────────
  const handleSubmitAll = () => {
    const allActivities = Object.values(activityFormsByProject).flat();
    const unsaved = allActivities.filter((a) => !a.saved);
    if (unsaved.length > 0) {
      showToast(`Please save all activities first. (${unsaved.length} unsaved)`, 'error');
      return;
    }
    showToast('All proposals submitted successfully! 🎉');
    // Reset everything
    setProgramData(defaultProgramFormData());
    setProgramChildId(null);
    setProjectForms([]);
    setActivityFormsByProject({});
    setActiveProjectTab(0);
    setActiveActivityKey(null);
    setStep(1);
    scrollToTop();
  };

  const updateProjectForm = (index: number, newData: ProjectFormData) => {
    setProjectForms((prev) => { const u = [...prev]; u[index] = newData; return u; });
  };

  const updateActivityForm = (projectId: number, activityIdx: number, newData: ActivityFormData) => {
    setActivityFormsByProject((prev) => {
      const u = { ...prev };
      u[projectId] = [...(u[projectId] || [])];
      u[projectId][activityIdx] = newData;
      return u;
    });
  };

  const allProjectsSaved = projectForms.length > 0 && projectForms.every((p) => p.saved);
  const allActivitiesSaved = Object.values(activityFormsByProject).flat().length > 0 &&
    Object.values(activityFormsByProject).flat().every((a) => a.saved);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-4 md:p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl font-semibold text-sm animate-in slide-in-from-top-2
          ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Proposal</h1>
          <p className="text-gray-500 mt-1 text-sm">Build your program, projects, and activities step by step.</p>
          {programChildId && (
            <div className="mt-2 inline-flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full font-semibold">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Program saved — ID: #{programChildId}
            </div>
          )}
        </div>

        <StepIndicator currentStep={step} />

        {/* ══════════════ STEP 1 ══════════════ */}
        {step === 1 && (
          <ProgramProposalForm
            data={programData} onChange={setProgramData}
            onNext={handleProgramNext} isSubmitting={isSubmittingProgram}
          />
        )}

        {/* ══════════════ STEP 2 ══════════════ */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Project Proposals</h2>
                <p className="text-sm text-gray-500 mt-0.5">Configure each project under <span className="font-semibold text-emerald-700">{programData.program_title}</span></p>
              </div>
              <div className="flex items-center gap-2">
                {allProjectsSaved && <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">✓ All projects saved</span>}
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">{projectForms.length} project{projectForms.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {loadingProjects ? (
              <div className="flex items-center justify-center py-16 gap-3 text-emerald-600 font-semibold">
                <Spinner />Loading projects from server...
              </div>
            ) : (
              <>
                {/* Project tab list */}
                <div className="flex flex-col gap-1.5">
                  {projectForms.map((pf, i) => {
                    const pct = getProjectCompletion(pf);
                    const isActive = activeProjectTab === i;
                    return (
                      <button key={pf.apiProjectId} onClick={() => setActiveProjectTab(i)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left
                          ${isActive ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-300 hover:text-emerald-700'}`}>
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>{i + 1}</span>
                          <span>{pf.project_title || `Project ${i + 1}`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {pf.saved
                            ? <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'}`}>✓ Saved</span>
                            : !isActive && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">{pct}% filled</span>}
                          <svg className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active project form */}
                {projectForms[activeProjectTab] && (
                  <div>
                    <div className="flex items-center gap-3 mb-5 px-1">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-md">{activeProjectTab + 1}</div>
                      <h3 className="text-lg font-bold text-gray-900">{projectForms[activeProjectTab].project_title || `Project ${activeProjectTab + 1}`}</h3>
                    </div>
                    <ProjectProposalForm
                      data={projectForms[activeProjectTab]}
                      onChange={(newData) => updateProjectForm(activeProjectTab, newData)}
                      onSave={() => handleSaveProject(activeProjectTab)}
                      isSaving={!!projectSaving[activeProjectTab]}
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-between py-4">
              <button onClick={() => { setStep(1); scrollToTop(); }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold bg-white border border-gray-200 hover:border-gray-300 px-6 py-3 rounded-xl transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                Back to Program
              </button>
              <button onClick={handleGoToActivities} disabled={!allProjectsSaved}
                title={!allProjectsSaved ? 'Save all projects before continuing' : ''}
                className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold shadow-lg transition-all duration-200
                  ${allProjectsSaved ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/30 hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {loadingActivities && Object.values(loadingActivities).some(Boolean) ? (<><Spinner />Loading Activities...</>) : (<>Continue to Activities <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>)}
              </button>
            </div>
          </div>
        )}

        {/* ══════════════ STEP 3 ══════════════ */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Activity Proposals</h2>
                <p className="text-sm text-gray-500 mt-0.5">Fill and save each activity individually</p>
              </div>
              <div className="flex items-center gap-2">
                {allActivitiesSaved && <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">✓ All activities saved</span>}
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                  {Object.values(activityFormsByProject).flat().filter((a) => a.saved).length} / {Object.values(activityFormsByProject).flat().length} saved
                </span>
              </div>
            </div>

            {/* Activity tabs grouped by project */}
            <div className="flex flex-col gap-3">
              {projectForms.map((pf) => {
                const activities = activityFormsByProject[pf.apiProjectId] || [];
                return (
                  <div key={pf.apiProjectId} className="space-y-1.5">
                    <div className="flex items-center gap-2 px-1">
                      <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">P</div>
                      <h4 className="font-bold text-gray-800 text-sm">{pf.project_title}</h4>
                      <div className="flex-1 h-px bg-gray-100" />
                      {loadingActivities[pf.apiProjectId] && <span className="text-xs text-gray-400 flex items-center gap-1"><Spinner />Loading...</span>}
                    </div>
                    <div className="flex flex-col gap-1 pl-7">
                      {activities.map((act, ai) => {
                        const key = `${pf.apiProjectId}-${ai}`;
                        const isActive = activeActivityKey?.projectId === pf.apiProjectId && activeActivityKey?.activityIdx === ai;
                        const pct = getActivityCompletion(act);
                        return (
                          <button key={act.apiActivityId} onClick={() => setActiveActivityKey({ projectId: pf.apiProjectId, activityIdx: ai })}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left
                              ${isActive ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600'}`}>
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${isActive ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'}`}>{String.fromCharCode(65 + ai)}</span>
                              <span>{act.activity_title || `Activity ${ai + 1}`}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isActive ? 'bg-white/20 text-white' : 'text-gray-400 bg-gray-100'}`}>#{act.apiActivityId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {act.saved
                                ? <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'}`}>✓ Saved</span>
                                : !isActive && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">{pct > 0 ? `${pct}%` : 'Not started'}</span>}
                              <svg className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                          </button>
                        );
                      })}
                      {activities.length === 0 && !loadingActivities[pf.apiProjectId] && (
                        <p className="text-xs text-gray-400 italic px-4 py-2">No activities found for this project.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active activity form */}
            {activeActivityKey && (() => {
              const { projectId, activityIdx } = activeActivityKey;
              const form = activityFormsByProject[projectId]?.[activityIdx];
              const projName = projectForms.find((p) => p.apiProjectId === projectId)?.project_title || '';
              const key = `${projectId}-${activityIdx}`;
              if (!form) return null;
              return (
                <div>
                  <div className="flex items-center gap-3 mb-5 px-1">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md">{String.fromCharCode(65 + activityIdx)}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{form.activity_title || `Activity ${activityIdx + 1}`}</h3>
                      <p className="text-xs text-gray-500">Under: {projName}</p>
                    </div>
                  </div>
                  <ActivityProposalForm
                    data={form}
                    onChange={(newData) => updateActivityForm(projectId, activityIdx, newData)}
                    onSave={() => handleSaveActivity(projectId, activityIdx)}
                    isSaving={!!activitySaving[key]}
                  />
                </div>
              );
            })()}

            <div className="flex items-center justify-between py-4">
              <button onClick={() => { setStep(2); scrollToTop(); }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold bg-white border border-gray-200 hover:border-gray-300 px-6 py-3 rounded-xl transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                Back to Projects
              </button>
              <button onClick={handleSubmitAll} disabled={!allActivitiesSaved}
                title={!allActivitiesSaved ? 'Save all activities before submitting' : ''}
                className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold shadow-lg transition-all duration-200
                  ${allActivitiesSaved ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/30 hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Submit Proposal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}