import { useState, useCallback, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// SCROLL TO TOP UTILITY
// ─────────────────────────────────────────────
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// ─────────────────────────────────────────────
// TYPES & DEFAULTS
// ─────────────────────────────────────────────

const defaultProjectRow = (index) => ({
  id: Date.now() + index,
  project_title: '',
  project_leader: '',
  project_members: '',
  project_duration_months: '',
  project_start_date: '',
  project_end_date: '',
});

const defaultActivityRow = (index) => ({
  id: Date.now() + index,
  activity_title: '',
});

const defaultExpectedOutput = () => ({
  publications: '', patents: '', products: '', people_services: '',
  places_partnerships: '', policy: '', social_impact: '', economic_impact: '',
});

const defaultOrgStaffing = () => ([
  { activity: 'Proposal Preparation', designation: '', terms: '' },
  { activity: 'Program/Certificates', designation: '', terms: '' },
  { activity: 'Food Preparation', designation: '', terms: '' },
  { activity: 'Resource Speakers', designation: '', terms: '' },
  { activity: 'Masters of Ceremony', designation: '', terms: '' },
  { activity: 'Secretariat for Attendance', designation: '', terms: '' },
  { activity: 'Documentation/Technical', designation: '', terms: '' },
]);

const defaultWorkplanRow = () => ({
  objective: '', activity: '', expected_output: '',
  year1_q1: false, year1_q2: false, year1_q3: false, year1_q4: false,
  year2_q1: false, year2_q2: false, year2_q3: false, year2_q4: false,
  year3_q1: false, year3_q2: false, year3_q3: false, year3_q4: false,
});

const defaultBudget = () => ({ meals: [], transport: [], supplies: [] });

const TAGGING_OPTIONS = ['General', 'Environment and Climate Change (for CECC)', 'Gender and Development (for GAD)', 'Mango-Related (for RMC)'];
const CLUSTER_OPTIONS = ['Health, Education, and Social Sciences', 'Engineering, Industry, Information Technology', 'Environment and Natural Resources', 'Tourism, Hospitality Management, Entrepreneurship, Criminal Justice', 'Graduate Studies', 'Fisheries', 'Agriculture, Forestry'];
const AGENDA_OPTIONS = ['Business Management and Livelihood Skills Development', 'Accountability, Good Governance, and Peace and Order', 'Youth and Adult Functional Literacy and Education', 'Accessibility, Inclusivity, and Gender and Development', 'Nutrition, Health, and Wellness', 'Indigenous People\'s Rights and Cultural Heritage Preservation', 'Human Capital Development', 'Adoption and Commercialization of Appropriate Technologies', 'Natural Resources, Climate Change, and Disaster Risk Reduction Management'];

const defaultProgramFormData = () => ({
  program_title: '',
  program_leader: '',
  members: '',
  implementing_agency: '',
  address_tel_email: '',
  cooperating_agencies: '',
  extension_site: '',
  tagging: [],
  cluster: [],
  extension_agenda: [],
  sdg_addressed: '',
  college_mandated_program: '',
  rationale: '',
  significance: '',
  general_objectives: '',
  specific_objectives: '',
  methodology: '',
  sustainability_plan: '',
  expected_output: defaultExpectedOutput(),
  org_staffing: defaultOrgStaffing(),
  workplan: [defaultWorkplanRow()],
  program_budget: [{ label: 'Project 1', qty: '', unit: '', unit_cost: '', prmsu: '', agency: '', total: '' }],
  projects: [defaultProjectRow(0)],
});

const defaultProjectFormData = () => ({
  implementing_agency: '',
  address_tel_email: '',
  cooperating_agencies: '',
  extension_site: '',
  tagging: [],
  cluster: [],
  extension_agenda: [],
  sdg_addressed: '',
  college_mandated_program: '',
  rationale: '',
  significance: '',
  general_objectives: '',
  specific_objectives: '',
  methodology: '',
  sustainability_plan: '',
  expected_output: defaultExpectedOutput(),
  org_staffing: defaultOrgStaffing(),
  workplan: [defaultWorkplanRow()],
  budget: defaultBudget(),
  activities: [defaultActivityRow(0)],
});

const defaultActivityFormData = () => ({
  implementing_agency: '',
  address_tel_email: '',
  cooperating_agencies: '',
  extension_site: '',
  tagging: [],
  cluster: [],
  extension_agenda: [],
  sdg_addressed: '',
  college_mandated_program: '',
  activity_duration: '',
  rationale: '',
  significance: '',
  objectives: '',
  methodology: '',
  expected_output: defaultExpectedOutput(),
  org_staffing: defaultOrgStaffing(),
  schedule: {
    activity_title: '',
    activity_date: '',
    rows: [
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
    ],
  },
  budget: defaultBudget(),
});

// ─────────────────────────────────────────────
// VALIDATION HELPERS
// ─────────────────────────────────────────────

const getProgramCompletion = (data) => {
  const fields = ['program_title', 'program_leader', 'implementing_agency', 'rationale', 'significance', 'general_objectives', 'specific_objectives', 'methodology', 'sustainability_plan'];
  const filled = fields.filter(f => data[f]?.trim()).length;
  const projectsFilled = data.projects.every(p => p.project_title?.trim() && p.project_leader?.trim());
  return Math.round(((filled + (projectsFilled ? 2 : 0)) / (fields.length + 2)) * 100);
};

const getProjectCompletion = (data) => {
  const fields = ['implementing_agency', 'rationale', 'significance', 'general_objectives', 'specific_objectives', 'methodology', 'sustainability_plan'];
  const filled = fields.filter(f => data[f]?.trim()).length;
  const actsFilled = data.activities.every(a => a.activity_title?.trim());
  return Math.round(((filled + (actsFilled ? 1 : 0)) / (fields.length + 1)) * 100);
};

const getActivityCompletion = (data) => {
  const fields = ['implementing_agency', 'rationale', 'significance', 'objectives', 'methodology'];
  const filled = fields.filter(f => data[f]?.trim()).length;
  return Math.round((filled / fields.length) * 100);
};

// ─────────────────────────────────────────────
// COMPLETION BADGE
// ─────────────────────────────────────────────

const CompletionBadge = ({ pct }) => {
  const color = pct === 100 ? 'bg-emerald-500 text-white' : pct >= 60 ? 'bg-amber-400 text-amber-900' : 'bg-red-100 text-red-600';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>
      {pct === 100 ? '✓' : `${pct}%`}
    </span>
  );
};

// ─────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { label: 'Program', icon: '📋' },
    { label: 'Projects', icon: '📁' },
    { label: 'Activities', icon: '📅' },
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const isActive = currentStep === stepNum;
        const isDone = currentStep > stepNum;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-110' :
                isDone ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-400' :
                'bg-gray-100 text-gray-400 border-2 border-gray-200'
              }`}>
                {isDone ? '✓' : step.icon}
              </div>
              <span className={`text-xs font-semibold mt-1.5 ${isActive ? 'text-emerald-700' : isDone ? 'text-emerald-500' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-20 h-0.5 mx-1 mb-5 transition-all duration-500 ${currentStep > stepNum ? 'bg-emerald-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────
// FORM FIELD COMPONENTS
// ─────────────────────────────────────────────

const Field = ({ label, type = 'text', value, onChange, placeholder, required }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
      {label}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
      className={`bg-gray-50 border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-gray-300 transition-all ${
        required && !value?.trim() ? 'border-red-200 bg-red-50/30' : 'border-gray-200'
      }`}
    />
  </div>
);

const TextArea = ({ label, value, onChange, rows = 5, placeholder, required }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
    )}
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-gray-300 transition-all resize-none ${
        required && !value?.trim() ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-gray-50'
      }`}
    />
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
    <div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 ${className}`}>
    {children}
  </div>
);

// ─────────────────────────────────────────────
// CHECKBOX GROUP
// ─────────────────────────────────────────────

const CheckboxGroup = ({ label, options, selected, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
    <div className="grid grid-cols-1 gap-1.5">
      {options.map((opt) => (
        <label key={opt} className="flex items-start gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={(e) => {
              if (e.target.checked) onChange([...selected, opt]);
              else onChange(selected.filter(o => o !== opt));
            }}
            className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
          />
          <span className="text-xs text-gray-700 group-hover:text-gray-900 leading-relaxed">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// EXPECTED OUTPUT TABLE
// ─────────────────────────────────────────────

const ExpectedOutputTable = ({ data, onChange }) => {
  const rows = [
    { label: 'Publications', key: 'publications' },
    { label: 'Patents / IP', key: 'patents' },
    { label: 'Products', key: 'products' },
    { label: 'People Services', key: 'people_services' },
    { label: 'Places and Partnerships', key: 'places_partnerships' },
    { label: 'Policy', key: 'policy' },
    { label: 'Social Impact', key: 'social_impact' },
    { label: 'Economic Impact', key: 'economic_impact' },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-emerald-500">
            <th className="px-5 py-3 text-left font-bold text-gray-900 w-48">6P's Category</th>
            <th className="px-5 py-3 text-left font-bold text-gray-900">Expected Output</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map(({ label, key }) => (
            <tr key={key} className="hover:bg-gray-50">
              <td className="px-5 py-3 font-semibold text-gray-700 bg-gray-50/60">{label}</td>
              <td className="px-5 py-3">
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  value={data[key]}
                  onChange={(e) => onChange({ ...data, [key]: e.target.value })}
                  placeholder={`Enter ${label.toLowerCase()}...`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─────────────────────────────────────────────
// ORG STAFFING TABLE
// ─────────────────────────────────────────────

const OrgStaffingTable = ({ rows, onChange }) => {
  const update = (i, field, value) => {
    const updated = [...rows];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };
  const remove = (i) => {
    if (rows.length <= 1) return;
    onChange(rows.filter((_, idx) => idx !== i));
  };
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-[1fr_1.5fr_1.5fr_32px] px-4 py-3 bg-gray-100 border-b-2 border-emerald-500 text-xs font-bold text-gray-900 gap-3">
        <span>Activity / Role</span>
        <span>Designation / Name</span>
        <span>Terms of Reference</span>
        <span></span>
      </div>
      {rows.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_1.5fr_1.5fr_32px] gap-3 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 items-start">
          <div>
            <input value={item.activity} onChange={(e) => update(i, 'activity', e.target.value)}
              placeholder="Activity / role name"
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-gray-800" />
          </div>
          <textarea rows={2} value={item.designation} onChange={(e) => update(i, 'designation', e.target.value)}
            placeholder="Full name of faculty / non-teaching"
            className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs resize-none outline-none focus:ring-2 focus:ring-emerald-500" />
          <textarea rows={2} value={item.terms} onChange={(e) => update(i, 'terms', e.target.value)}
            placeholder="Responsibilities and terms of reference"
            className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs resize-none outline-none focus:ring-2 focus:ring-emerald-500" />
          <button onClick={() => remove(i)} className="mt-1 w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
      <div className="p-4">
        <button onClick={() => onChange([...rows, { activity: '', designation: '', terms: '' }])}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-all">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Row
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// BUDGET TABLE
// ─────────────────────────────────────────────

const BudgetTable = ({ rows, onChange }) => {
  const handle = (cat, i, field, val) => {
    const updated = [...rows[cat]];
    updated[i] = { ...updated[i], [field]: val };
    if (field === 'cost' || field === 'qty') {
      updated[i].amount = (Number(updated[i].cost) || 0) * (Number(updated[i].qty) || 0);
    }
    onChange({ ...rows, [cat]: updated });
  };
  const removeRow = (cat, i) => onChange({ ...rows, [cat]: rows[cat].filter((_, idx) => idx !== i) });
  const addRow = (cat) => onChange({ ...rows, [cat]: [...rows[cat], { item: '', cost: '', qty: '', amount: '' }] });
  const total = (cat) => rows[cat].reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const grand = ['meals', 'transport', 'supplies'].reduce((s, c) => s + total(c), 0);
  const cats = [
    { key: 'meals', label: 'A. Meals and Snacks', color: 'text-orange-700 bg-orange-50' },
    { key: 'transport', label: 'B. Transportation', color: 'text-blue-700 bg-blue-50' },
    { key: 'supplies', label: 'C. Supplies and Materials', color: 'text-purple-700 bg-purple-50' },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900 text-white">
            {['Item', 'Cost (PHP)', 'Pax / Qty', 'Amount', ''].map((h, idx) => (
              <th key={idx} className="px-5 py-3 text-left font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cats.map(({ key, label, color }) => (
            <tbody key={key}>
              <tr><td colSpan={5} className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wide ${color}`}>{label}</td></tr>
              {rows[key].map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <input placeholder="Item description" value={row.item} onChange={e => handle(key, i, 'item', e.target.value)}
                      className="w-full bg-transparent border-b border-gray-200 focus:border-emerald-500 outline-none text-sm" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" placeholder="0.00" value={row.cost} onChange={e => handle(key, i, 'cost', e.target.value)}
                      className="w-full bg-transparent border-b border-gray-200 focus:border-emerald-500 outline-none text-sm" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" placeholder="0" value={row.qty} onChange={e => handle(key, i, 'qty', e.target.value)}
                      className="w-full bg-transparent border-b border-gray-200 focus:border-emerald-500 outline-none text-sm" />
                  </td>
                  <td className="px-4 py-2">
                    <input readOnly value={row.amount ? `₱ ${Number(row.amount).toLocaleString()}` : ''} placeholder="₱ 0"
                      className="w-full bg-gray-100 rounded px-2 py-1 text-sm font-medium text-gray-700 cursor-not-allowed" />
                  </td>
                  <td className="px-2 py-2">
                    <button onClick={() => removeRow(key, i)} className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-5 py-2 font-bold text-gray-700 text-sm">Subtotal</td>
                <td className="px-5 py-2 font-bold text-sm">₱ {total(key).toLocaleString()}</td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={5} className="px-5 py-2">
                  <button onClick={() => addRow(key)} className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Row
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
          <tr className="bg-emerald-700 text-white font-bold">
            <td colSpan={3} className="px-5 py-3">GRAND TOTAL</td>
            <td className="px-5 py-3">₱ {grand.toLocaleString()}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// ─────────────────────────────────────────────
// WORKPLAN TABLE
// ─────────────────────────────────────────────

const WorkplanTable = ({ rows, onChange }) => {
  const update = (i, key, val) => {
    const updated = [...rows];
    updated[i][key] = val;
    onChange(updated);
  };
  const remove = (i) => {
    if (rows.length <= 1) return;
    onChange(rows.filter((_, idx) => idx !== i));
  };
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th rowSpan={2} className="px-3 py-2 border border-gray-300 text-left font-bold min-w-[100px]">Objective</th>
            <th rowSpan={2} className="px-3 py-2 border border-gray-300 text-left font-bold min-w-[100px]">Activity</th>
            <th rowSpan={2} className="px-3 py-2 border border-gray-300 text-left font-bold min-w-[90px]">Expected Output</th>
            {['Year 1', 'Year 2', 'Year 3'].map(y => (
              <th key={y} colSpan={4} className="px-3 py-2 border border-gray-300 text-center font-bold">{y}</th>
            ))}
            <th rowSpan={2} className="px-2 py-2 border border-gray-300 w-8"></th>
          </tr>
          <tr className="bg-gray-50">
            {[1,2,3].map(yr => ['Q1','Q2','Q3','Q4'].map(q => (
              <th key={`${yr}-${q}`} className="px-2 py-1 border border-gray-300 text-center font-semibold w-8">{q}</th>
            )))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-2 py-2">
                <textarea rows={2} value={row.objective} onChange={e => update(i, 'objective', e.target.value)}
                  className="w-full bg-transparent outline-none resize-none text-xs" placeholder="Objective..." />
              </td>
              <td className="border border-gray-200 px-2 py-2">
                <textarea rows={2} value={row.activity} onChange={e => update(i, 'activity', e.target.value)}
                  className="w-full bg-transparent outline-none resize-none text-xs" placeholder="Activity..." />
              </td>
              <td className="border border-gray-200 px-2 py-2">
                <textarea rows={2} value={row.expected_output} onChange={e => update(i, 'expected_output', e.target.value)}
                  className="w-full bg-transparent outline-none resize-none text-xs" placeholder="Output..." />
              </td>
              {[1,2,3].map(yr => ['Q1','Q2','Q3','Q4'].map(q => {
                const key = `year${yr}_${q.toLowerCase()}`;
                return (
                  <td key={`${yr}-${q}`} className="border border-gray-200 px-2 py-2 text-center">
                    <input type="checkbox" checked={row[key]} onChange={e => update(i, key, e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500" />
                  </td>
                );
              }))}
              <td className="border border-gray-200 px-2 py-2 text-center">
                <button onClick={() => remove(i)} className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-red-500 rounded transition-all mx-auto">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4">
        <button onClick={() => onChange([...rows, defaultWorkplanRow()])}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Row
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// COMMON PROFILE FIELDS (shared by all 3 forms)
// ─────────────────────────────────────────────

const CommonProfileFields = ({ data, onChange }) => {
  const upd = (field, val) => onChange({ ...data, [field]: val });
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Field label="Implementing Agency / College / Mandated Program" value={data.implementing_agency} onChange={e => upd('implementing_agency', e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <Field label="Address / Telephone / Email (Barangay, Municipality, District, Province, Region)" value={data.address_tel_email} onChange={e => upd('address_tel_email', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Field label="Cooperating Agency/ies / Program/College (Name/s and Address/es)" value={data.cooperating_agencies} onChange={e => upd('cooperating_agencies', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Field label="Extension Site/s or Venue/s" value={data.extension_site} onChange={e => upd('extension_site', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <CheckboxGroup label="Tagging" options={TAGGING_OPTIONS} selected={data.tagging || []} onChange={val => upd('tagging', val)} />
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <CheckboxGroup label="Cluster" options={CLUSTER_OPTIONS} selected={data.cluster || []} onChange={val => upd('cluster', val)} />
        </div>
        <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-200">
          <CheckboxGroup label="Extension Agenda" options={AGENDA_OPTIONS} selected={data.extension_agenda || []} onChange={val => upd('extension_agenda', val)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Sustainable Development Goal (SDG) Addressed" value={data.sdg_addressed} onChange={e => upd('sdg_addressed', e.target.value)} />
        <Field label="College / Campus / Mandated Academic Program" value={data.college_mandated_program} onChange={e => upd('college_mandated_program', e.target.value)} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// STEP 1: PROGRAM PROPOSAL FORM
// ─────────────────────────────────────────────

const ProgramProposalForm = ({ data, onChange, onNext, isSubmitting }) => {
  const updateProject = (i, field, val) => {
    const updated = [...data.projects];
    updated[i] = { ...updated[i], [field]: val };
    onChange({ ...data, projects: updated });
  };
  const addProject = () => onChange({ ...data, projects: [...data.projects, defaultProjectRow(data.projects.length)] });
  const removeProject = (i) => {
    if (data.projects.length === 1) return;
    onChange({ ...data, projects: data.projects.filter((_, idx) => idx !== i) });
  };
  const upd = (field, val) => onChange({ ...data, [field]: val });
  const pct = getProgramCompletion(data);

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <SectionHeader title="I. Program Profile" subtitle="Basic program information" />
          <CompletionBadge pct={pct} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Field label="Program Title" value={data.program_title} onChange={e => upd('program_title', e.target.value)} required />
          </div>
          <Field label="Program Leader" value={data.program_leader} onChange={e => upd('program_leader', e.target.value)} required />
          <Field label="Members" value={data.members} onChange={e => upd('members', e.target.value)} />
        </div>
        <div className="mt-5">
          <CommonProfileFields data={data} onChange={onChange} />
        </div>
      </Card>

      {/* Projects */}
      <Card>
        <SectionHeader title="Projects Under This Program" subtitle="Add all projects included in this program proposal" />
        <div className="space-y-4">
          {data.projects.map((proj, i) => (
            <div key={proj.id} className={`border-2 rounded-2xl p-5 transition-all group relative ${!proj.project_title?.trim() ? 'border-red-100 bg-red-50/20' : 'border-gray-100 hover:border-emerald-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">{i + 1}</div>
                  <span className="font-bold text-gray-900 text-sm">Project {i + 1}</span>
                  {proj.project_title && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{proj.project_title}</span>}
                  {!proj.project_title?.trim() && <span className="text-xs text-red-400 font-medium">Required</span>}
                </div>
                {data.projects.length > 1 && (
                  <button onClick={() => removeProject(i)}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Field label="Project Title" value={proj.project_title} onChange={e => updateProject(i, 'project_title', e.target.value)} required />
                </div>
                <Field label="Project Leader" value={proj.project_leader} onChange={e => updateProject(i, 'project_leader', e.target.value)} required />
                <Field label="Project Members" value={proj.project_members} onChange={e => updateProject(i, 'project_members', e.target.value)} />
                <Field label="Project Duration (months)" type="number" value={proj.project_duration_months} onChange={e => updateProject(i, 'project_duration_months', e.target.value)} />
                <div />
                <Field label="Project Start Date" type="date" value={proj.project_start_date} onChange={e => updateProject(i, 'project_start_date', e.target.value)} />
                <Field label="Project End Date" type="date" value={proj.project_end_date} onChange={e => updateProject(i, 'project_end_date', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
        <button onClick={addProject}
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition-all border-2 border-dashed border-emerald-200 hover:border-emerald-400 w-full justify-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Another Project
        </button>
      </Card>

      <Card>
        <SectionHeader title="II. Rationale" subtitle="Include a brief result of the conducted needs assessment." />
        <TextArea value={data.rationale} onChange={e => upd('rationale', e.target.value)} rows={7} required
          placeholder="Include a brief result of the conducted needs assessment..." />
      </Card>

      <Card>
        <SectionHeader title="III. Significance" />
        <TextArea value={data.significance} onChange={e => upd('significance', e.target.value)} rows={6} required
          placeholder="Describe the significance of this program..." />
      </Card>

      <Card>
        <SectionHeader title="IV. Objectives" />
        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
            <p className="font-bold text-gray-900 text-sm mb-3">General Objectives: <span className="text-red-400">*</span></p>
            <TextArea value={data.general_objectives} onChange={e => upd('general_objectives', e.target.value)} rows={4} required />
          </div>
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <p className="font-bold text-gray-900 text-sm mb-3">Specific Objectives: <span className="text-red-400">*</span></p>
            <TextArea value={data.specific_objectives} onChange={e => upd('specific_objectives', e.target.value)} rows={4} required />
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="V. Methodology" />
        <TextArea value={data.methodology} onChange={e => upd('methodology', e.target.value)} rows={7} required
          placeholder="Describe the methodology..." />
      </Card>

      <Card>
        <SectionHeader title="VI. Expected Output / Outcome" subtitle="6P's Framework Assessment" />
        <ExpectedOutputTable data={data.expected_output} onChange={val => upd('expected_output', val)} />
      </Card>

      <Card>
        <SectionHeader title="VII. Sustainability Plan" />
        <TextArea value={data.sustainability_plan} onChange={e => upd('sustainability_plan', e.target.value)} rows={8} required
          placeholder="Describe the sustainability plan..." />
      </Card>

      <Card>
        <SectionHeader title="VIII. Organization and Staffing" subtitle="Persons involved and their responsibilities" />
        <OrgStaffingTable rows={data.org_staffing} onChange={val => upd('org_staffing', val)} />
      </Card>

      <Card>
        <SectionHeader title="IX. Workplan" />
        <WorkplanTable rows={data.workplan} onChange={val => upd('workplan', val)} />
      </Card>

      {/* Program Budget */}
      <Card>
        <SectionHeader title="IX. Budgetary Requirement" subtitle="Budget per project and activity" />
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 text-white">
                {['Line-Item Budget', 'Qty', 'Unit', 'Unit Cost', 'PRMSU', 'Agency X', 'Total (PHP)', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.program_budget.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  {['label', 'qty', 'unit', 'unit_cost', 'prmsu', 'agency', 'total'].map(col => (
                    <td key={col} className="px-3 py-2">
                      <input
                        readOnly={col === 'total'}
                        value={row[col]}
                        onChange={e => {
                          const updated = [...data.program_budget];
                          updated[i] = { ...updated[i], [col]: e.target.value };
                          if (col === 'prmsu' || col === 'agency') {
                            updated[i].total = String((parseFloat(updated[i].prmsu) || 0) + (parseFloat(updated[i].agency) || 0));
                          }
                          upd('program_budget', updated);
                        }}
                        className={`w-full text-sm outline-none border-b border-gray-200 focus:border-emerald-500 bg-transparent ${col === 'total' ? 'font-bold text-emerald-700 cursor-not-allowed' : ''}`}
                        placeholder="—"
                      />
                    </td>
                  ))}
                  <td className="px-2 py-2">
                    <button onClick={() => upd('program_budget', data.program_budget.filter((_, idx) => idx !== i))}
                      className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={() => upd('program_budget', [...data.program_budget, { label: '', qty: '', unit: '', unit_cost: '', prmsu: '', agency: '', total: '' }])}
          className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Row
        </button>
      </Card>

      <div className="flex justify-end py-4">
        <button onClick={onNext} disabled={isSubmitting}
          className={`flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-4 rounded-xl font-bold text-base shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}>
          {isSubmitting ? (
            <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving Program...</>
          ) : (
            <>Save Program & Configure Projects<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
          )}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// STEP 2: PROJECT PROPOSAL FORM
// ─────────────────────────────────────────────

const ProjectProposalForm = ({ projectInfo, data, onChange }) => {
  const upd = (field, val) => onChange({ ...data, [field]: val });
  const updateActivity = (i, val) => {
    const updated = [...data.activities];
    updated[i] = { ...updated[i], activity_title: val };
    upd('activities', updated);
  };
  const addActivity = () => upd('activities', [...data.activities, defaultActivityRow(data.activities.length)]);
  const removeActivity = (i) => {
    if (data.activities.length === 1) return;
    upd('activities', data.activities.filter((_, idx) => idx !== i));
  };
  const pct = getProjectCompletion(data);

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><span className="font-bold text-gray-600 text-xs uppercase tracking-wide block">Project Leader</span><span className="text-gray-900 font-semibold">{projectInfo.project_leader || '—'}</span></div>
          <div><span className="font-bold text-gray-600 text-xs uppercase tracking-wide block">Duration</span><span className="text-gray-900 font-semibold">{projectInfo.project_duration_months ? `${projectInfo.project_duration_months} months` : '—'}</span></div>
          <div><span className="font-bold text-gray-600 text-xs uppercase tracking-wide block">Start Date</span><span className="text-gray-900 font-semibold">{projectInfo.project_start_date || '—'}</span></div>
          <div><span className="font-bold text-gray-600 text-xs uppercase tracking-wide block">End Date</span><span className="text-gray-900 font-semibold">{projectInfo.project_end_date || '—'}</span></div>
        </div>
      </div>

      {/* I. Profile */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="I. Project Profile" subtitle="Extension site and classification" />
          <CompletionBadge pct={pct} />
        </div>
        <CommonProfileFields data={data} onChange={onChange} />
      </Card>

      {/* Activities */}
      <Card>
        <SectionHeader title="Activities Under This Project" subtitle="Add all activities included in this project proposal" />
        <div className="space-y-3">
          {data.activities.map((act, i) => (
            <div key={act.id} className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all group ${!act.activity_title?.trim() ? 'border-red-100 bg-red-50/20' : 'border-gray-100 hover:border-orange-200'}`}>
              <div className="w-6 h-6 rounded-md bg-orange-100 text-orange-700 text-xs font-black flex items-center justify-center shrink-0">{i + 1}</div>
              <div className="flex-1">
                <input
                  value={act.activity_title}
                  onChange={e => updateActivity(i, e.target.value)}
                  placeholder={`Activity Title ${i + 1} (required)`}
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${!act.activity_title?.trim() ? 'border-red-200 bg-red-50/30' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>
              {data.activities.length > 1 && (
                <button onClick={() => removeActivity(i)}
                  className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addActivity}
          className="mt-3 flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-2.5 rounded-xl transition-all border-2 border-dashed border-orange-200 hover:border-orange-400 w-full justify-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Another Activity
        </button>
      </Card>

      <Card>
        <SectionHeader title="II. Rationale" subtitle="Include a brief result of the conducted needs assessment." />
        <TextArea value={data.rationale} onChange={e => upd('rationale', e.target.value)} rows={7} required
          placeholder="Include a brief result of the conducted needs assessment..." />
      </Card>

      <Card>
        <SectionHeader title="III. Significance" />
        <TextArea value={data.significance} onChange={e => upd('significance', e.target.value)} rows={6} required
          placeholder="Describe the significance..." />
      </Card>

      <Card>
        <SectionHeader title="IV. Objectives" />
        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
            <p className="font-bold text-gray-900 text-sm mb-3">General Objectives: <span className="text-red-400">*</span></p>
            <TextArea value={data.general_objectives} onChange={e => upd('general_objectives', e.target.value)} rows={4} required />
          </div>
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <p className="font-bold text-gray-900 text-sm mb-3">Specific Objectives: <span className="text-red-400">*</span></p>
            <TextArea value={data.specific_objectives} onChange={e => upd('specific_objectives', e.target.value)} rows={4} required />
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="V. Methodology" />
        <TextArea value={data.methodology} onChange={e => upd('methodology', e.target.value)} rows={7} required />
      </Card>

      <Card>
        <SectionHeader title="VI. Expected Output / Outcome" subtitle="6P's Framework Assessment" />
        <ExpectedOutputTable data={data.expected_output} onChange={val => upd('expected_output', val)} />
      </Card>

      <Card>
        <SectionHeader title="VII. Sustainability Plan" />
        <TextArea value={data.sustainability_plan} onChange={e => upd('sustainability_plan', e.target.value)} rows={7} required />
      </Card>

      <Card>
        <SectionHeader title="VIII. Organization and Staffing" subtitle="Persons involved and their responsibilities" />
        <OrgStaffingTable rows={data.org_staffing} onChange={val => upd('org_staffing', val)} />
      </Card>

      <Card>
        <SectionHeader title="IX. Workplan" />
        <WorkplanTable rows={data.workplan} onChange={val => upd('workplan', val)} />
      </Card>

      <Card>
        <SectionHeader title="X. Budgetary Requirement" />
        <BudgetTable rows={data.budget} onChange={val => upd('budget', val)} />
      </Card>
    </div>
  );
};

// ─────────────────────────────────────────────
// STEP 3: ACTIVITY PROPOSAL FORM
// ─────────────────────────────────────────────

const ActivityProposalForm = ({ activityInfo, data, onChange }) => {
  const upd = (field, val) => onChange({ ...data, [field]: val });

  const updateScheduleRow = (i, field, val) => {
    const updated = [...data.schedule.rows];
    updated[i] = { ...updated[i], [field]: val };
    upd('schedule', { ...data.schedule, rows: updated });
  };
  const removeScheduleRow = (i) => {
    if (data.schedule.rows.length <= 1) return;
    upd('schedule', { ...data.schedule, rows: data.schedule.rows.filter((_, idx) => idx !== i) });
  };
  const pct = getActivityCompletion(data);

  return (
    <div className="space-y-5">
      {/* I. Profile */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="I. Activity Profile" subtitle="Extension site and classification" />
          <CompletionBadge pct={pct} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <Field label="Activity Duration (e.g. 8 hours)" value={data.activity_duration} onChange={e => upd('activity_duration', e.target.value)} />
        </div>
        <CommonProfileFields data={data} onChange={onChange} />
      </Card>

      <Card>
        <SectionHeader title="II. Rationale" subtitle="Include a brief result of the conducted needs assessment." />
        <TextArea value={data.rationale} onChange={e => upd('rationale', e.target.value)} rows={7} required
          placeholder="Include a brief result of the conducted needs assessment..." />
      </Card>

      <Card>
        <SectionHeader title="III. Significance" />
        <TextArea value={data.significance} onChange={e => upd('significance', e.target.value)} rows={6} required />
      </Card>

      <Card>
        <SectionHeader title="IV. Objectives of the Activity" />
        <TextArea value={data.objectives} onChange={e => upd('objectives', e.target.value)} rows={6} required
          placeholder="Describe the objectives of this activity..." />
      </Card>

      <Card>
        <SectionHeader title="V. Methodology" subtitle="Short narrative" />
        <TextArea value={data.methodology} onChange={e => upd('methodology', e.target.value)} rows={7} required />
      </Card>

      <Card>
        <SectionHeader title="VI. Expected Output / Outcome" subtitle="6P's Framework Assessment" />
        <ExpectedOutputTable data={data.expected_output} onChange={val => upd('expected_output', val)} />
      </Card>

      <Card>
        <SectionHeader title="VII. Organization and Staffing" subtitle="Persons involved and their responsibilities" />
        <OrgStaffingTable rows={data.org_staffing} onChange={val => upd('org_staffing', val)} />
      </Card>

      {/* Activity Schedule */}
      <Card>
        <SectionHeader title="VIII. Plan of Activities" subtitle="Activity schedule and programme flow" />
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title of the Activity" value={data.schedule.activity_title}
              onChange={e => upd('schedule', { ...data.schedule, activity_title: e.target.value })} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Activity Date</label>
              <input type="date" value={data.schedule.activity_date}
                onChange={e => upd('schedule', { ...data.schedule, activity_date: e.target.value })}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-600 to-teal-600">
                  <th className="py-3 px-5 text-center text-white font-bold border-r border-white/20 w-36">Time</th>
                  <th className="py-3 px-5 text-left text-white font-bold flex-1">Activity</th>
                  <th className="py-3 px-5 text-left text-white font-bold w-48">Speaker / Facilitator</th>
                  <th className="py-3 px-3 text-white font-bold w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.schedule.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-r border-gray-200 bg-gray-50">
                      <input value={row.time} onChange={e => updateScheduleRow(i, 'time', e.target.value)}
                        className="w-full text-center bg-white border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500 text-xs" />
                    </td>
                    <td className="py-2 px-4">
                      <input value={row.activity} onChange={e => updateScheduleRow(i, 'activity', e.target.value)}
                        placeholder="Activity" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 font-semibold outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </td>
                    <td className="py-2 px-4">
                      <input value={row.speaker} onChange={e => updateScheduleRow(i, 'speaker', e.target.value)}
                        placeholder="Name / role" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 outline-none focus:ring-2 focus:ring-blue-400" />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button onClick={() => removeScheduleRow(i)} className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all mx-auto">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => upd('schedule', { ...data.schedule, rows: [...data.schedule.rows, { time: '', activity: '', speaker: '' }] })}
            className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Row
          </button>
        </div>
      </Card>

      <Card>
        <SectionHeader title="IX. Budgetary Requirement" />
        <BudgetTable rows={data.budget} onChange={val => upd('budget', val)} />
      </Card>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

const CreateProposal = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [programData, setProgramData] = useState(defaultProgramFormData());
  const [projectForms, setProjectForms] = useState([]);
  const [activeProjectTab, setActiveProjectTab] = useState(0);
  const [activityForms, setActivityForms] = useState([]);
  const [activeActivityKey, setActiveActivityKey] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // API stubs
  const submitProgramAPI = async (data) => { await new Promise(r => setTimeout(r, 1200)); return { id: 1000 }; };
  const submitProjectAPI = async (data) => { await new Promise(r => setTimeout(r, 800)); return { id: 1001 }; };
  const submitActivityAPI = async (data) => { await new Promise(r => setTimeout(r, 600)); return { id: 1002 }; };

  const handleProgramNext = async () => {
    if (!programData.program_title.trim()) { showToast('Please enter a Program Title.', 'error'); return; }
    if (programData.projects.some(p => !p.project_title.trim())) { showToast('Please fill in all Project Titles.', 'error'); return; }
    if (!programData.rationale.trim()) { showToast('Please fill in the Rationale.', 'error'); return; }

    setIsSubmitting(true);
    try {
      await submitProgramAPI(programData);
      showToast('Program proposal saved! Now configure your projects.');
      setProjectForms(programData.projects.map(() => defaultProjectFormData()));
      setActiveProjectTab(0);
      setStep(2);
      scrollToTop();
    } catch { showToast('Failed to save program proposal.', 'error'); }
    finally { setIsSubmitting(false); }
  };

  const handleProjectsNext = async () => {
    const missing = projectForms.some(f => f.activities.some(a => !a.activity_title.trim()));
    if (missing) { showToast('Please fill in all Activity Titles in every project.', 'error'); return; }
    const missingFields = projectForms.some(f => !f.implementing_agency?.trim() || !f.rationale?.trim());
    if (missingFields) { showToast('Please fill in required fields (Implementing Agency & Rationale) for all projects.', 'error'); return; }

    setIsSubmitting(true);
    try {
      for (let i = 0; i < projectForms.length; i++) {
        await submitProjectAPI({ ...projectForms[i], project_info: programData.projects[i] });
      }
      showToast('All project proposals saved! Now configure your activities.');
      const forms = [];
      projectForms.forEach((pf, pi) => {
        pf.activities.forEach((act, ai) => {
          forms.push({ projectIndex: pi, activityIndex: ai, activityTitle: act.activity_title, data: defaultActivityFormData() });
        });
      });
      setActivityForms(forms);
      setActiveActivityKey(forms.length > 0 ? `${forms[0].projectIndex}-${forms[0].activityIndex}` : null);
      setStep(3);
      scrollToTop();
    } catch { showToast('Failed to save project proposals.', 'error'); }
    finally { setIsSubmitting(false); }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      for (const form of activityForms) {
        await submitActivityAPI({ ...form.data, activity_title: form.activityTitle });
      }
      showToast('All activity proposals submitted successfully! 🎉');
      setTimeout(() => {
        setProgramData(defaultProgramFormData());
        setProjectForms([]);
        setActivityForms([]);
        setActiveProjectTab(0);
        setActiveActivityKey(null);
        setStep(1);
        scrollToTop();
      }, 1500);
    } catch { showToast('Failed to submit some activities.', 'error'); }
    finally { setIsSubmitting(false); }
  };

  const updateActivityForm = (key, newData) => {
    setActivityForms(prev => prev.map(f =>
      `${f.projectIndex}-${f.activityIndex}` === key ? { ...f, data: newData } : f
    ));
  };

  const activitiesByProject = activityForms.reduce((acc, form) => {
    const pi = form.projectIndex;
    if (!acc[pi]) acc[pi] = [];
    acc[pi].push(form);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-4 md:p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl font-semibold text-sm transition-all ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Proposal</h1>
          <p className="text-gray-500 mt-1 text-sm">Build your program, projects, and activities step by step.</p>
        </div>

        <StepIndicator currentStep={step} />

        {/* ── STEP 1: PROGRAM ── */}
        {step === 1 && (
          <ProgramProposalForm
            data={programData}
            onChange={setProgramData}
            onNext={handleProgramNext}
            isSubmitting={isSubmitting}
          />
        )}

        {/* ── STEP 2: PROJECTS ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Project Proposals</h2>
                <p className="text-sm text-gray-500 mt-0.5">Configure each project under <span className="font-semibold text-emerald-700">{programData.program_title}</span></p>
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                {programData.projects.length} project{programData.projects.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Project Tabs as list */}
            <div className="flex flex-col gap-1.5">
              {programData.projects.map((proj, i) => {
                const pct = projectForms[i] ? getProjectCompletion(projectForms[i]) : 0;
                const isActive = activeProjectTab === i;
                return (
                  <button key={i} onClick={() => setActiveProjectTab(i)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-300 hover:text-emerald-700'
                    }`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>{i + 1}</span>
                      <span>{proj.project_title || `Project ${i + 1}`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {pct < 100 && !isActive && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">{pct}% filled</span>
                      )}
                      {pct === 100 && !isActive && (
                        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">✓ Complete</span>
                      )}
                      <svg className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Project Form */}
            {projectForms[activeProjectTab] && (
              <div>
                <div className="flex items-center gap-3 mb-5 px-1">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-md">{activeProjectTab + 1}</div>
                  <h3 className="text-lg font-bold text-gray-900">{programData.projects[activeProjectTab].project_title || `Project ${activeProjectTab + 1}`}</h3>
                </div>
                <ProjectProposalForm
                  projectInfo={programData.projects[activeProjectTab]}
                  data={projectForms[activeProjectTab]}
                  onChange={(newData) => {
                    const updated = [...projectForms];
                    updated[activeProjectTab] = newData;
                    setProjectForms(updated);
                  }}
                />
              </div>
            )}

            <div className="flex items-center justify-between py-4">
              <button onClick={() => { setStep(1); scrollToTop(); }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold bg-white border border-gray-200 hover:border-gray-300 px-6 py-3 rounded-xl transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                Back to Program
              </button>
              <button onClick={handleProjectsNext} disabled={isSubmitting}
                className={`flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:scale-[1.02] ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {isSubmitting ? (
                  <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving Projects...</>
                ) : (
                  <>Save Projects & Configure Activities<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: ACTIVITIES ── */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Activity Proposals</h2>
                <p className="text-sm text-gray-500 mt-0.5">Configure each activity across all projects</p>
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                {activityForms.length} activit{activityForms.length !== 1 ? 'ies' : 'y'}
              </div>
            </div>

            {/* Activity list grouped by project */}
            <div className="flex flex-col gap-3">
              {Object.entries(activitiesByProject).map(([piStr, forms]) => {
                const pi = Number(piStr);
                const projectName = programData.projects[pi]?.project_title || `Project ${pi + 1}`;
                return (
                  <div key={pi} className="space-y-1.5">
                    <div className="flex items-center gap-2 px-1">
                      <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">{pi + 1}</div>
                      <h4 className="font-bold text-gray-800 text-sm">{projectName}</h4>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <div className="flex flex-col gap-1 pl-7">
                      {forms.map((form) => {
                        const key = `${form.projectIndex}-${form.activityIndex}`;
                        const isActive = activeActivityKey === key;
                        const pct = getActivityCompletion(form.data);
                        return (
                          <button key={key} onClick={() => setActiveActivityKey(key)}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left ${
                              isActive
                                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600'
                            }`}>
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${isActive ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'}`}>
                                {String.fromCharCode(65 + form.activityIndex)}
                              </span>
                              <span>{form.activityTitle || `Activity ${form.activityIndex + 1}`}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {pct < 100 && !isActive && (
                                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">{pct}% filled</span>
                              )}
                              {pct === 100 && !isActive && (
                                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">✓ Complete</span>
                              )}
                              <svg className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Activity Form */}
            {activeActivityKey && (() => {
              const form = activityForms.find(f => `${f.projectIndex}-${f.activityIndex}` === activeActivityKey);
              if (!form) return null;
              return (
                <div>
                  <div className="flex items-center gap-3 mb-5 px-1">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                      {String.fromCharCode(65 + form.activityIndex)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{form.activityTitle || `Activity ${form.activityIndex + 1}`}</h3>
                      <p className="text-xs text-gray-500">Under: {programData.projects[form.projectIndex]?.project_title || `Project ${form.projectIndex + 1}`}</p>
                    </div>
                  </div>
                  <ActivityProposalForm
                    activityInfo={form}
                    data={form.data}
                    onChange={(newData) => updateActivityForm(activeActivityKey, newData)}
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
              <button onClick={handleFinalSubmit} disabled={isSubmitting}
                className={`flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-12 py-4 rounded-xl font-bold text-base shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:scale-[1.02] ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {isSubmitting ? (
                  <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Submitting All Activities...</>
                ) : (
                  <>Submit All Activity Proposals<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProposal;