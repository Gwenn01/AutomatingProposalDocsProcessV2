import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InlineInput from '@/components/implementor/InlineInput';
import { useToast } from '@/context/toast';
import { SectionCard, SectionHeader, TextAreaField } from '@/components/implementor/create-proposal';

// ─────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────

type ProposalType = 'program' | 'project' | 'activity';

interface User {
  user_id: string | number;
  [key: string]: any;
}

interface ParentProposalOption {
  id: string | number;
  title: string;
  leader: string;
  created_at?: string;
}

interface ExpectedOutput6Ps {
  publications: string;
  patents: string;
  products: string;
  people_services: string;
  places_partnerships: string;
  policy: string;
  social_impact: string;
  economic_impact: string;
}

interface OrgStaffingItem {
  activity: string;
  designation: string;
  terms: string;
}

interface BudgetRow {
  item: string;
  cost: string | number;
  qty: string | number;
  amount: string | number;
}

interface BudgetRows {
  meals: BudgetRow[];
  transport: BudgetRow[];
  supplies: BudgetRow[];
}

interface CoverPageData {
  submission_date: string;
  board_resolution_title: string;
  board_resolution_no: string;
  approved_budget_words: string;
  approved_budget_amount: string;
  duration_words: string;
  duration_years: string;
  date_from_to: string;
  activity_title: string;
  activity_date: string;
  activity_venue: string;
  activity_value_statement: string;
  requested_activity_budget: string;
  prmsu_participants_words: string;
  prmsu_participants_num: string;
  partner_agency_participants_words: string;
  partner_agency_participants_num: string;
  partner_agency_name: string;
  trainees_words: string;
  trainees_num: string;
}

interface SiteRow {
  country: string;
  region: string;
  province: string;
  district: string;
  municipality: string;
  barangay: string;
}

interface ProfileData {
  program_title: string;
  program_leader: string;
  project_title: string;
  project_leader: string;
  activity_title: string;
  members: string;
  activity_duration: string;
  activity_date: string;
  project_start_date: string;
  project_end_date: string;
  project_duration_months: string;
  implementing_agency: string;
  address_tel_email: string;
  cooperating_agencies: string;
  sites: SiteRow[];
  tagging_general: boolean;
  tagging_env_climate: boolean;
  tagging_gad: boolean;
  tagging_mango: boolean;
  cluster_health_edu: boolean;
  cluster_engineering: boolean;
  cluster_environment: boolean;
  cluster_tourism: boolean;
  cluster_graduate: boolean;
  cluster_fisheries: boolean;
  cluster_agriculture: boolean;
  ext_agenda_business: boolean;
  ext_agenda_governance: boolean;
  ext_agenda_youth: boolean;
  ext_agenda_accessibility: boolean;
  ext_agenda_nutrition: boolean;
  ext_agenda_indigenous: boolean;
  ext_agenda_human_capital: boolean;
  ext_agenda_technology: boolean;
  ext_agenda_natural_resources: boolean;
  sdg_addressed: string;
  college_mandated_program: string;
}

interface WorkplanRow {
  objective: string;
  activity: string;
  expected_output: string;
  year1_q1: boolean; year1_q2: boolean; year1_q3: boolean; year1_q4: boolean;
  year2_q1: boolean; year2_q2: boolean; year2_q3: boolean; year2_q4: boolean;
  year3_q1: boolean; year3_q2: boolean; year3_q3: boolean; year3_q4: boolean;
}

interface ProgramBudgetRow {
  label: string;
  qty: string;
  unit: string;
  unit_cost: string;
  prmsu: string;
  agency: string;
  total: string;
}

interface ScheduleItem {
  time: string;
  activity: string;
  speaker: string;
}

interface ActivityScheduleData {
  activity_title: string;
  activity_date: string;
  schedule: ScheduleItem[];
}

// ─────────────────────────────────────────────
// DEFAULTS
// ─────────────────────────────────────────────

const defaultProfile = (): ProfileData => ({
  program_title: '', program_leader: '', project_title: '', project_leader: '',
  activity_title: '', members: '', activity_duration: '8 hours', activity_date: '',
  project_start_date: '', project_end_date: '', project_duration_months: '',
  implementing_agency: '', address_tel_email: '', cooperating_agencies: '',
  sites: [
    { country: '', region: '', province: '', district: '', municipality: '', barangay: '' },
    { country: '', region: '', province: '', district: '', municipality: '', barangay: '' },
  ],
  tagging_general: false, tagging_env_climate: false, tagging_gad: false, tagging_mango: false,
  cluster_health_edu: false, cluster_engineering: false, cluster_environment: false,
  cluster_tourism: false, cluster_graduate: false, cluster_fisheries: false, cluster_agriculture: false,
  ext_agenda_business: false, ext_agenda_governance: false, ext_agenda_youth: false,
  ext_agenda_accessibility: false, ext_agenda_nutrition: false, ext_agenda_indigenous: false,
  ext_agenda_human_capital: false, ext_agenda_technology: false, ext_agenda_natural_resources: false,
  sdg_addressed: '', college_mandated_program: '',
});

const defaultCover = (): CoverPageData => ({
  submission_date: '', board_resolution_title: '', board_resolution_no: '',
  approved_budget_words: '', approved_budget_amount: '', duration_words: '',
  duration_years: '', date_from_to: '', activity_title: '', activity_date: '',
  activity_venue: '', activity_value_statement: '', requested_activity_budget: '',
  prmsu_participants_words: '', prmsu_participants_num: '',
  partner_agency_participants_words: '', partner_agency_participants_num: '',
  partner_agency_name: '', trainees_words: '', trainees_num: '',
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

const defaultBudgetRows = (): BudgetRows => ({ meals: [], transport: [], supplies: [] });

const defaultSchedule = (): ActivityScheduleData => ({
  activity_title: '',
  activity_date: '',
  schedule: [
    { time: '7:30–8:00 AM', activity: 'Registration', speaker: '' },
    { time: '8:00–8:05 AM', activity: 'Invocation–AV Presentation', speaker: '' },
    { time: '8:20–8:45 AM', activity: 'Opening Remarks', speaker: 'Dr. Roy N. Villalobos, University President' },
    { time: '8:45–9:00 AM', activity: 'Welcome Remarks', speaker: '' },
    { time: '9:00 AM–12:00 NOON', activity: '', speaker: '' },
    { time: '12:00–1:00 PM', activity: 'LUNCH BREAK', speaker: '' },
    { time: '1:00–3:00 PM', activity: '', speaker: '' },
    { time: '3:00–4:30 PM', activity: 'Open Forum / Evaluation', speaker: '' },
    { time: '4:30–4:45 PM', activity: 'Awarding of Certificates', speaker: '' },
    { time: '4:45–4:55 PM', activity: 'Closing Remarks', speaker: '' },
    { time: '4:55–5:00 PM', activity: 'Photo Opportunity', speaker: '' },
  ],
});

const defaultExpectedOutput = (): ExpectedOutput6Ps => ({
  publications: '', patents: '', products: '', people_services: '',
  places_partnerships: '', policy: '', social_impact: '', economic_impact: '',
});

const defaultWorkplan = (): WorkplanRow[] => [{
  objective: '', activity: '', expected_output: '',
  year1_q1: false, year1_q2: false, year1_q3: false, year1_q4: false,
  year2_q1: false, year2_q2: false, year2_q3: false, year2_q4: false,
  year3_q1: false, year3_q2: false, year3_q3: false, year3_q4: false,
}];

const defaultProgramBudget = (): ProgramBudgetRow[] => [
  { label: 'Project 1', qty: '', unit: '', unit_cost: '', prmsu: '', agency: '', total: '' },
];

// ─────────────────────────────────────────────
// PROPOSAL HIERARCHY CONFIG
// ─────────────────────────────────────────────

const PROPOSAL_TYPES = [
  {
    type: 'program' as ProposalType,
    label: 'Program Proposal',
    description: 'Top-level multi-project extension program spanning multiple years',
    color: 'from-blue-600 to-indigo-600',
    dotColor: 'bg-blue-500',
    parentType: null as ProposalType | null,
    parentLabel: null as string | null,
  },
  {
    type: 'project' as ProposalType,
    label: 'Project Proposal',
    description: 'An extension project that belongs under a Program Proposal',
    color: 'from-green-600 to-emerald-600',
    dotColor: 'bg-green-500',
    parentType: 'program' as ProposalType | null,
    parentLabel: 'Program Proposal',
  },
  {
    type: 'activity' as ProposalType,
    label: 'Activity Proposal',
    description: 'A single activity that belongs under a Project Proposal',
    color: 'from-orange-500 to-amber-600',
    dotColor: 'bg-orange-500',
    parentType: 'project' as ProposalType | null,
    parentLabel: 'Project Proposal',
  },
];


// ─────────────────────────────────────────────
// PARENT PROPOSAL SELECTOR
// ─────────────────────────────────────────────

const ParentProposalSelector: React.FC<{
  proposalType: ProposalType;
  parentOptions: ParentProposalOption[];
  selectedParent: ParentProposalOption | null;
  onSelect: (parent: ParentProposalOption | null) => void;
  isLoading: boolean;
}> = ({ proposalType, parentOptions, selectedParent, onSelect, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const config = PROPOSAL_TYPES.find((t) => t.type === proposalType)!;

  const filtered = parentOptions.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.leader.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (option: ParentProposalOption) => {
    onSelect(option);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
    setQuery('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      {/* Purple header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 md:px-8 py-5">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <div>
            <h3 className="text-2xl font-bold text-white">Link to {config.parentLabel}</h3>
            <p className="text-white/80 text-sm mt-0.5">
              Select the {config.parentLabel} this {config.label} belongs to
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-5 text-xs bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex-wrap">
          {proposalType === 'project' ? (
            <>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-semibold">Program</span>
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="px-2 py-0.5 rounded-md bg-green-200 text-green-800 font-semibold ring-2 ring-green-400">Project ← You are here</span>
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-500 font-semibold">Activity</span>
            </>
          ) : (
            <>
              <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-500 font-semibold">Program</span>
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-500 font-semibold">Project</span>
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="px-2 py-0.5 rounded-md bg-orange-200 text-orange-800 font-semibold ring-2 ring-orange-400">Activity ← You are here</span>
            </>
          )}
        </div>

        {/* Selected parent card */}
        {selectedParent ? (
          <div className="flex items-start justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-2xl mb-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mt-0.5 shadow">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-0.5">
                  {config.parentLabel} Selected
                </p>
                <p className="font-bold text-gray-900 text-base leading-tight">{selectedParent.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">Leader: {selectedParent.leader}</p>
              </div>
            </div>
            <button onClick={handleClear}
              className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
              title="Remove selection">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-sm text-amber-800">
            <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            No {config.parentLabel} selected — search below to link this proposal.
          </div>
        )}

        {/* Search input + dropdown */}
        <div ref={ref} className="relative">
          <div
            onClick={() => !isLoading && setIsOpen((o) => !o)}
            className={`flex items-center gap-3 px-4 py-3.5 border-2 rounded-xl cursor-pointer transition-all
              ${isOpen ? 'border-indigo-400 ring-2 ring-indigo-200 bg-white' : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'}`}
          >
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={query}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
              onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
              placeholder={isLoading ? 'Loading proposals…' : `Search ${config.parentLabel}s by title or leader…`}
              disabled={isLoading}
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" />
            {isLoading ? (
              <svg className="animate-spin w-4 h-4 text-indigo-500 shrink-0" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>

          {isOpen && !isLoading && (
            <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <svg className="w-10 h-10 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm font-medium">No {config.parentLabel}s found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              ) : (
                <>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">
                      {filtered.length} {config.parentLabel}{filtered.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                  {filtered.map((option) => {
                    const isSelected = selectedParent?.id === option.id;
                    return (
                      <button key={option.id} onClick={() => handleSelect(option)}
                        className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors border-b border-gray-50 last:border-0
                          ${isSelected ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold
                          ${isSelected ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                          {option.title.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm truncate ${isSelected ? 'text-indigo-700' : 'text-gray-900'}`}>
                            {option.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Leader: {option.leader}
                            {option.created_at && (
                              <span className="ml-2 text-gray-400">
                                · {new Date(option.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </p>
                        </div>
                        {isSelected && (
                          <svg className="w-4 h-4 text-indigo-500 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PROPOSAL TYPE SELECTOR
// ─────────────────────────────────────────────

const ProposalTypeSelector: React.FC<{
  selected: ProposalType | null;
  onSelect: (type: ProposalType) => void;
}> = ({ selected, onSelect }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {PROPOSAL_TYPES.map(({ type, label, description, color, parentLabel }) => (
      <button key={type} onClick={() => onSelect(type)}
        className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.99]
          ${selected === type ? 'border-transparent ring-4 ring-green-400/40 shadow-lg bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} mb-4 flex items-center justify-center shadow-md`}>
          {type === 'program' && (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          )}
          {type === 'project' && (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          {type === 'activity' && (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        <h4 className="font-bold text-gray-900 text-lg mb-1">{label}</h4>
        <p className="text-sm text-gray-500 mb-3">{description}</p>
        {parentLabel && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 rounded-lg px-2.5 py-1.5 w-fit">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="font-medium">Under a {parentLabel}</span>
          </div>
        )}
        {selected === type && (
          <div className={`absolute top-4 right-4 w-6 h-6 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow`}>
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>
    ))}
  </div>
);

// ─────────────────────────────────────────────
// PROFILE SECTION
// ─────────────────────────────────────────────

const ProfileSection: React.FC<{
  type: ProposalType;
  profile: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
}> = ({ type, profile, onChange }) => {
  const field = (label: string, key: keyof ProfileData, inputType = 'text') => (
    <div key={key} className="flex flex-col md:flex-row md:items-center gap-3 group">
      <span className="md:w-72 text-sm font-semibold text-gray-900 flex items-center gap-2 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        {label}:
      </span>
      <input type={inputType}
        className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        value={profile[key] as string}
        onChange={(e) => onChange({ [key]: e.target.value })}
        placeholder={`Enter ${label.toLowerCase()}...`} />
    </div>
  );

  const checkbox = (label: string, key: keyof ProfileData) => (
    <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
      <input type="checkbox" checked={profile[key] as boolean}
        onChange={(e) => onChange({ [key]: e.target.checked })}
        className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
      {label}
    </label>
  );

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <SectionHeader title="I. Profile" subtitle="Basic program / project / activity information" />
      <div className="p-6 md:p-8 space-y-4">
        {field('Program Title', 'program_title')}
        {(type === 'program' || type === 'project') && field('Program Leader', 'program_leader')}
        {(type === 'project' || type === 'activity') && field('Project Title', 'project_title')}
        {field('Project Leader', 'project_leader')}
        {field('Members', 'members')}
        {type === 'activity' && (
          <>
            {field('Activity Title', 'activity_title')}
            {field('Activity Duration', 'activity_duration')}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <span className="md:w-72 text-sm font-semibold text-gray-900 shrink-0">Date:</span>
              <input type="date"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={profile.activity_date} onChange={(e) => onChange({ activity_date: e.target.value })} />
            </div>
          </>
        )}
        {(type === 'program' || type === 'project') && (
          <>
            {field('Project Duration (months)', 'project_duration_months')}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <span className="md:w-72 text-sm font-semibold text-gray-900 shrink-0">Project Start Date:</span>
              <input type="date"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={profile.project_start_date} onChange={(e) => onChange({ project_start_date: e.target.value })} />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <span className="md:w-72 text-sm font-semibold text-gray-900 shrink-0">Project End Date:</span>
              <input type="date"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={profile.project_end_date} onChange={(e) => onChange({ project_end_date: e.target.value })} />
            </div>
          </>
        )}
        <div className="pt-2 border-t border-gray-100 space-y-4">
          {field('Implementing Agency / College / Mandated Program', 'implementing_agency')}
          {field('Address / Telephone / Email', 'address_tel_email')}
          {field('Cooperating Agency/ies / Program / College', 'cooperating_agencies')}
        </div>
        {/* Sites */}
        <div className="pt-2 border-t border-gray-100">
          <label className="block text-sm font-bold text-gray-900 mb-3">Extension Site/s or Venue/s</label>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-100">
                  {['#', 'Country', 'Region', 'Province', 'District', 'Municipality', 'Barangay'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-semibold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profile.sites.map((site, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-3 py-2 text-gray-500 font-medium">{i + 1}</td>
                    {(['country', 'region', 'province', 'district', 'municipality', 'barangay'] as (keyof SiteRow)[]).map((col) => (
                      <td key={col} className="px-2 py-1">
                        <input className="w-full bg-transparent border-b border-gray-200 focus:border-green-500 outline-none py-1 text-xs"
                          value={site[col]}
                          onChange={(e) => {
                            const updated = [...profile.sites];
                            updated[i] = { ...updated[i], [col]: e.target.value };
                            onChange({ sites: updated });
                          }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => onChange({ sites: [...profile.sites, { country: '', region: '', province: '', district: '', municipality: '', barangay: '' }] })}
            className="mt-2 text-xs text-green-600 hover:text-green-700 font-semibold bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Site
          </button>
        </div>
        {/* Tagging & Agenda */}
        <div className="pt-2 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3">Tagging</p>
              <div className="space-y-2">
                {checkbox('General', 'tagging_general')}
                {checkbox('Environment and Climate Change (for CECC)', 'tagging_env_climate')}
                {checkbox('Gender and Development (for GAD)', 'tagging_gad')}
                {checkbox('Mango-Related (for RMC)', 'tagging_mango')}
              </div>
              <p className="text-sm font-bold text-gray-900 mt-4 mb-3">Cluster</p>
              <div className="space-y-2">
                {checkbox('Health, Education, and Social Sciences', 'cluster_health_edu')}
                {checkbox('Engineering, Industry, Information Technology', 'cluster_engineering')}
                {checkbox('Environment and Natural Resources', 'cluster_environment')}
                {checkbox('Tourism, Hospitality, Entrepreneurship, Criminal Justice', 'cluster_tourism')}
                {checkbox('Graduate Studies', 'cluster_graduate')}
                {checkbox('Fisheries', 'cluster_fisheries')}
                {checkbox('Agriculture, Forestry', 'cluster_agriculture')}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3">Extension Agenda</p>
              <div className="space-y-2">
                {checkbox('Business Management and Livelihood Skills Development', 'ext_agenda_business')}
                {checkbox('Accountability, Good Governance, and Peace and Order', 'ext_agenda_governance')}
                {checkbox('Youth and Adult Functional Literacy and Education', 'ext_agenda_youth')}
                {checkbox('Accessibility, Inclusivity, and Gender and Development', 'ext_agenda_accessibility')}
                {checkbox('Nutrition, Health, and Wellness', 'ext_agenda_nutrition')}
                {checkbox("Indigenous People's Rights and Cultural Heritage Preservation", 'ext_agenda_indigenous')}
                {checkbox('Human Capital Development', 'ext_agenda_human_capital')}
                {checkbox('Adoption and Commercialization of Appropriate Technologies', 'ext_agenda_technology')}
                {checkbox('Natural Resources, Climate Change, and Disaster Risk Reduction Management', 'ext_agenda_natural_resources')}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-100 space-y-4">
          {field('Sustainable Development Goal (SDG) Addressed', 'sdg_addressed')}
          {field('College / Campus / Mandated Academic Program', 'college_mandated_program')}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// EXPECTED OUTPUT
// ─────────────────────────────────────────────

const ExpectedOutputSection: React.FC<{
  title: string;
  data: ExpectedOutput6Ps;
  onChange: (key: keyof ExpectedOutput6Ps, value: string) => void;
}> = ({ title, data, onChange }) => (
  <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
    <SectionHeader title={title} subtitle="6P's Framework Assessment" />
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-green-500">
            <th className="px-6 py-4 text-left font-bold text-gray-900 w-1/3">6P's</th>
            <th className="px-6 py-4 text-left font-bold text-gray-900">Output</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {([
            { label: 'Publications', key: 'publications' },
            { label: 'Patents / IP', key: 'patents' },
            { label: 'Products', key: 'products' },
            { label: 'People Services', key: 'people_services' },
            { label: 'Places and Partnerships', key: 'places_partnerships' },
            { label: 'Policy', key: 'policy' },
            { label: 'Social Impact', key: 'social_impact' },
            { label: 'Economic Impact', key: 'economic_impact' },
          ] as { label: string; key: keyof ExpectedOutput6Ps }[]).map(({ label, key }) => (
            <tr key={key} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50">{label}</td>
              <td className="px-6 py-4">
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                  placeholder={`Enter ${label.toLowerCase()}...`}
                  value={data[key]}
                  onChange={(e) => onChange(key, e.target.value)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// ORG & STAFFING
// ─────────────────────────────────────────────

const OrgStaffingSection: React.FC<{
  title: string;
  rows: OrgStaffingItem[];
  onChange: (updated: OrgStaffingItem[]) => void;
}> = ({ title, rows, onChange }) => {
  const update = (i: number, field: keyof OrgStaffingItem, value: string) => {
    const updated = [...rows];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <SectionHeader title={title} subtitle="Persons involved and responsibility" />
      <div className="p-6 md:p-8">
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-100 border-b-2 border-green-500">
            <span className="text-xs font-bold text-gray-900">Activity</span>
            <span className="text-xs font-bold text-gray-900">Designation / Name</span>
            <span className="text-xs font-bold text-gray-900">Terms of Reference</span>
          </div>
          {rows.map((item, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <div className="text-sm font-semibold text-gray-900 self-center">{item.activity}</div>
              <textarea rows={3} placeholder="Full name of faculty / non-teaching"
                className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs resize-none outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={item.designation} onChange={(e) => update(i, 'designation', e.target.value)} />
              <textarea rows={3} placeholder="Responsibilities and terms of reference"
                className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs resize-none outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={item.terms} onChange={(e) => update(i, 'terms', e.target.value)} />
            </div>
          ))}
        </div>
        <button onClick={() => onChange([...rows, { activity: '', designation: '', terms: '' }])}
          className="mt-3 flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-semibold bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Row
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// BUDGET SECTION
// ─────────────────────────────────────────────

const BudgetSection: React.FC<{
  title: string;
  rows: BudgetRows;
  onChange: (rows: BudgetRows) => void;
}> = ({ title, rows, onChange }) => {
  const handleChange = (category: keyof BudgetRows, index: number, field: keyof BudgetRow, value: string) => {
    const updated = [...rows[category]];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'cost' || field === 'qty') {
      updated[index].amount = (Number(updated[index].cost) || 0) * (Number(updated[index].qty) || 0);
    }
    onChange({ ...rows, [category]: updated });
  };
  const addRow = (cat: keyof BudgetRows) =>
    onChange({ ...rows, [cat]: [...rows[cat], { item: '', cost: '', qty: '', amount: '' }] });
  const totalAmount = (cat: keyof BudgetRows) =>
    rows[cat].reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const grandTotal = (['meals', 'transport', 'supplies'] as (keyof BudgetRows)[]).reduce(
    (s, cat) => s + totalAmount(cat), 0,
  );
  const CATS = [
    { key: 'meals' as keyof BudgetRows, label: 'A. Meals and Snacks', c: { header: 'bg-orange-50 text-orange-900', subtotal: 'bg-orange-100 border-t-2 border-orange-200 text-orange-900', btn: 'text-orange-600 bg-orange-50 hover:bg-orange-100', dot: 'bg-orange-500' } },
    { key: 'transport' as keyof BudgetRows, label: 'B. Transportation', c: { header: 'bg-blue-50 text-blue-900', subtotal: 'bg-blue-100 border-t-2 border-blue-200 text-blue-900', btn: 'text-blue-600 bg-blue-50 hover:bg-blue-100', dot: 'bg-blue-500' } },
    { key: 'supplies' as keyof BudgetRows, label: 'C. Supplies and Materials', c: { header: 'bg-purple-50 text-purple-900', subtotal: 'bg-purple-100 border-t-2 border-purple-200 text-purple-900', btn: 'text-purple-600 bg-purple-50 hover:bg-purple-100', dot: 'bg-purple-500' } },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <SectionHeader title={title} subtitle="Detailed budget breakdown" />
      <div className="p-6 md:p-8">
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 text-white">
                {['Item', 'Cost (PHP)', 'Pax / Qty', 'Amount'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CATS.map(({ key, label, c }) => (
                <React.Fragment key={key}>
                  <tr className={c.header}>
                    <td colSpan={4} className="px-6 py-3 font-bold flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${c.dot}`} /> {label}
                    </td>
                  </tr>
                  {rows[key].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input placeholder="Item description" value={row.item}
                          onChange={(e) => handleChange(key, i, 'item', e.target.value)}
                          className="w-full bg-transparent border-b border-gray-200 focus:border-green-500 outline-none text-sm text-center" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" placeholder="0.00" value={row.cost}
                          onChange={(e) => handleChange(key, i, 'cost', e.target.value)}
                          className="w-full bg-transparent border-b border-gray-200 focus:border-green-500 outline-none text-sm text-center appearance-none" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" placeholder="0" value={row.qty}
                          onChange={(e) => handleChange(key, i, 'qty', e.target.value)}
                          className="w-full bg-transparent border-b border-gray-200 focus:border-green-500 outline-none text-sm text-center appearance-none" />
                      </td>
                      <td className="px-4 py-3">
                        <input readOnly value={row.amount}
                          className="w-full bg-gray-100 border border-gray-200 rounded-md text-sm text-center font-medium text-gray-700 cursor-not-allowed" />
                      </td>
                    </tr>
                  ))}
                  <tr className={`font-bold ${c.subtotal}`}>
                    <td className="px-6 py-3" colSpan={3}>Subtotal — {label.split('. ')[1]}</td>
                    <td className="px-6 py-3">₱ {totalAmount(key).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="px-6 py-2">
                      <button onClick={() => addRow(key)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${c.btn}`}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Row
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              <tr className="bg-green-700 text-white font-bold">
                <td className="px-6 py-4" colSpan={3}>GRAND TOTAL</td>
                <td className="px-6 py-4">₱ {grandTotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PROGRAM BUDGET
// ─────────────────────────────────────────────

const ProgramBudgetSection: React.FC<{
  title: string;
  rows: ProgramBudgetRow[];
  onChange: (rows: ProgramBudgetRow[]) => void;
}> = ({ title, rows, onChange }) => {
  const update = (i: number, key: keyof ProgramBudgetRow, value: string) => {
    const updated = [...rows];
    updated[i] = { ...updated[i], [key]: value };
    if (key === 'prmsu' || key === 'agency') {
      updated[i].total = String((parseFloat(updated[i].prmsu) || 0) + (parseFloat(updated[i].agency) || 0));
    }
    onChange(updated);
  };
  const cols: (keyof ProgramBudgetRow)[] = ['label', 'qty', 'unit', 'unit_cost', 'prmsu', 'agency', 'total'];
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <SectionHeader title={title} subtitle="Budget per project and activity" />
      <div className="p-6 md:p-8 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white">
              {['Line-Item Budget', 'Qty', 'Unit', 'Unit Cost', 'PRMSU', 'Agency X', 'Total (PHP)'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                {cols.map((col) => (
                  <td key={col} className="px-3 py-2">
                    <input readOnly={col === 'total'} value={row[col]}
                      onChange={(e) => update(i, col, e.target.value)}
                      className={`w-full text-sm outline-none border-b border-gray-200 focus:border-green-500 bg-transparent ${col === 'total' ? 'font-bold text-green-700 cursor-not-allowed' : ''}`}
                      placeholder="—" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => onChange([...rows, { label: '', qty: '', unit: '', unit_cost: '', prmsu: '', agency: '', total: '' }])}
          className="mt-3 flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-semibold bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Row
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// WORKPLAN
// ─────────────────────────────────────────────

const WorkplanSection: React.FC<{
  title: string;
  rows: WorkplanRow[];
  onChange: (rows: WorkplanRow[]) => void;
}> = ({ title, rows, onChange }) => {
  const update = (i: number, key: keyof WorkplanRow, value: any) => {
    const updated = [...rows];
    (updated[i] as any)[key] = value;
    onChange(updated);
  };
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <SectionHeader title={title} subtitle="Objectives, activities, and quarterly timeline" />
      <div className="p-6 md:p-8 overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th rowSpan={2} className="px-3 py-2 border border-gray-300 text-left font-bold text-gray-900 min-w-[120px]">Objective</th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-300 text-left font-bold text-gray-900 min-w-[120px]">Activity</th>
              <th rowSpan={2} className="px-3 py-2 border border-gray-300 text-left font-bold text-gray-900 min-w-[100px]">Expected Output/s</th>
              {['Year 1', 'Year 2', 'Year 3'].map((y) => (
                <th key={y} colSpan={4} className="px-3 py-2 border border-gray-300 text-center font-bold text-gray-900">{y}</th>
              ))}
            </tr>
            <tr className="bg-gray-50">
              {[1, 2, 3].map((yr) => ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                <th key={`${yr}-${q}`} className="px-2 py-1 border border-gray-300 text-center font-semibold text-gray-700 w-8">{q}</th>
              )))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-2 py-2">
                  <textarea rows={2} value={row.objective} onChange={(e) => update(i, 'objective', e.target.value)}
                    className="w-full bg-transparent outline-none resize-none text-xs" placeholder="Objective..." />
                </td>
                <td className="border border-gray-200 px-2 py-2">
                  <textarea rows={2} value={row.activity} onChange={(e) => update(i, 'activity', e.target.value)}
                    className="w-full bg-transparent outline-none resize-none text-xs" placeholder="Activity..." />
                </td>
                <td className="border border-gray-200 px-2 py-2">
                  <textarea rows={2} value={row.expected_output} onChange={(e) => update(i, 'expected_output', e.target.value)}
                    className="w-full bg-transparent outline-none resize-none text-xs" placeholder="Output..." />
                </td>
                {([1, 2, 3] as const).map((yr) => ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => {
                  const key = `year${yr}_${q.toLowerCase()}` as keyof WorkplanRow;
                  return (
                    <td key={`${yr}-${q}`} className="border border-gray-200 px-2 py-2 text-center">
                      <input type="checkbox" checked={row[key] as boolean}
                        onChange={(e) => update(i, key, e.target.checked)}
                        className="rounded text-green-600 focus:ring-green-500" />
                    </td>
                  );
                }))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => onChange([...rows, { objective: '', activity: '', expected_output: '', year1_q1: false, year1_q2: false, year1_q3: false, year1_q4: false, year2_q1: false, year2_q2: false, year2_q3: false, year2_q4: false, year3_q1: false, year3_q2: false, year3_q3: false, year3_q4: false }])}
          className="mt-3 flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-semibold bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Row
        </button>
      </div>
    </div>
  );
};



// ─────────────────────────────────────────────
// ACTIVITY SCHEDULE
// ─────────────────────────────────────────────

const ActivityScheduleSection: React.FC<{
  schedule: ActivityScheduleData;
  onChange: (updated: ActivityScheduleData) => void;
}> = ({ schedule, onChange }) => {
  const updateRow = (i: number, field: keyof ScheduleItem, value: string) => {
    const updated = [...schedule.schedule];
    updated[i] = { ...updated[i], [field]: value };
    onChange({ ...schedule, schedule: updated });
  };
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <SectionHeader title="VIII. Plan of Activities" subtitle="Activity schedule and programme flow" />
      <div className="p-6 md:p-10">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <input placeholder="ENTER ACTIVITY TITLE HERE"
            className="w-full text-center font-bold text-xl md:text-2xl outline-none bg-transparent text-blue-700 placeholder-blue-400 border-b-2 border-blue-400 pb-2 mb-4 focus:border-blue-600"
            value={schedule.activity_title}
            onChange={(e) => onChange({ ...schedule, activity_title: e.target.value })} />
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-sm font-semibold text-gray-700">Date:</span>
            <input type="date" className="border-2 border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={schedule.activity_date}
              onChange={(e) => onChange({ ...schedule, activity_date: e.target.value })} />
          </div>
          <p className="text-lg font-bold text-center text-gray-900 uppercase tracking-wide">Programme</p>
        </div>
        <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-green-600 to-emerald-600">
                <th className="py-4 px-6 text-center text-white font-bold text-sm border-r border-white/20 w-40">Time</th>
                <th className="py-4 px-6 text-center text-white font-bold text-sm">Part of the Program / Speaker</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedule.schedule.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-4 px-6 align-top border-r border-gray-200 bg-gray-50">
                    <input value={row.time} placeholder="e.g., 9:00 AM" onChange={(e) => updateRow(i, 'time', e.target.value)}
                      className="w-full text-center bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <input value={row.activity} placeholder="Activity / Part of Program" onChange={(e) => updateRow(i, 'activity', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 font-semibold outline-none focus:ring-2 focus:ring-green-500" />
                      <input value={row.speaker} placeholder="Speaker / Facilitator (optional)" onChange={(e) => updateRow(i, 'speaker', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={() => onChange({ ...schedule, schedule: [...schedule.schedule, { time: '', activity: '', speaker: '' }] })}
          className="mt-4 flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-semibold bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Schedule Row
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

const CreateProposal: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [proposalType, setProposalType] = useState<ProposalType | null>(null);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Parent linking
  const [selectedParent, setSelectedParent] = useState<ParentProposalOption | null>(null);
  const [parentOptions, setParentOptions] = useState<ParentProposalOption[]>([]);
  const [isLoadingParents, setIsLoadingParents] = useState(false);

  // Form state
  const [profile, setProfile] = useState<ProfileData>(defaultProfile());
  const [cover, setCover] = useState<CoverPageData>(defaultCover());
  const [rationale, setRationale] = useState('');
  const [significance, setSignificance] = useState('');
  const [generalObjectives, setGeneralObjectives] = useState('');
  const [specificObjectives, setSpecificObjectives] = useState('');
  const [methodology, setMethodology] = useState('');
  const [expectedOutput, setExpectedOutput] = useState<ExpectedOutput6Ps>(defaultExpectedOutput());
  const [sustainabilityPlan, setSustainabilityPlan] = useState('');
  const [orgStaffing, setOrgStaffing] = useState<OrgStaffingItem[]>(defaultOrgStaffing());
  const [workplan, setWorkplan] = useState<WorkplanRow[]>(defaultWorkplan());
  const [budgetRows, setBudgetRows] = useState<BudgetRows>(defaultBudgetRows());
  const [programBudget, setProgramBudget] = useState<ProgramBudgetRow[]>(defaultProgramBudget());
  const [activitySchedule, setActivitySchedule] = useState<ActivityScheduleData>(defaultSchedule());

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/', { replace: true }); return; }
    try { setUser(JSON.parse(stored)); }
    catch { navigate('/', { replace: true }); }
  }, [navigate]);

  // ── Fetch parent proposals from API ──────────────────────────────────────
  // Replace the mock block below with your real API calls:
  //   type === 'project'  → fetch all PROGRAM proposals
  //   type === 'activity' → fetch all PROJECT proposals
  // ─────────────────────────────────────────────────────────────────────────
  const fetchParentProposals = useCallback(async (type: ProposalType) => {
    const config = PROPOSAL_TYPES.find((t) => t.type === type);
    if (!config?.parentType) return;
    setIsLoadingParents(true);
    try {
      // ── REPLACE with your real API call ──────────────────────────────────
      // const res = await fetch(`/api/proposals?type=${config.parentType}`, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      // });
      // const data = await res.json();
      // setParentOptions(data.map((p: any) => ({
      //   id: p.id,
      //   title: p.title,
      //   leader: p.project_leader ?? p.program_leader ?? '—',
      //   created_at: p.created_at,
      // })));
      // ── Mock data (remove when API is connected) ─────────────────────────
      await new Promise((r) => setTimeout(r, 600));
      const mock: Record<string, ParentProposalOption[]> = {
        program: [
          { id: 1, title: 'Community ICT Empowerment Program', leader: 'Dr. Lorna L. Acuavera', created_at: '2024-01-15' },
          { id: 2, title: 'Agricultural Extension and Livelihood Program', leader: 'Dr. Jose M. Santos', created_at: '2024-02-20' },
          { id: 3, title: 'Environmental Stewardship and Climate Resilience Program', leader: 'Prof. Maria C. Reyes', created_at: '2024-03-10' },
          { id: 4, title: 'Health and Wellness Community Outreach Program', leader: 'Dr. Ana P. Cruz', created_at: '2024-04-05' },
        ],
        project: [
          { id: 101, title: 'Basic Computer Skills Training for Out-of-School Youth', leader: 'Mr. Walter G. Lara', created_at: '2024-02-01' },
          { id: 102, title: 'Organic Farming Techniques Dissemination Project', leader: 'Ms. Nichole Baluyot', created_at: '2024-03-15' },
          { id: 103, title: 'Coastal Cleanup and Marine Biodiversity Education Project', leader: 'Engr. Mea M. Amuyot', created_at: '2024-04-20' },
          { id: 104, title: 'Maternal and Child Health Literacy Project', leader: 'Dr. Edward Banes', created_at: '2024-05-10' },
        ],
      };
      setParentOptions(mock[config.parentType] ?? []);
      // ─────────────────────────────────────────────────────────────────────
    } catch {
      showToast('Failed to load parent proposals.', 'error');
    } finally {
      setIsLoadingParents(false);
    }
  }, [showToast]);

  const resetForm = (type: ProposalType) => {
    setSelectedParent(null);
    setParentOptions([]);
    setTitle('');
    setProfile(defaultProfile());
    setCover(defaultCover());
    setRationale(''); setSignificance('');
    setGeneralObjectives(''); setSpecificObjectives('');
    setMethodology('');
    setExpectedOutput(defaultExpectedOutput());
    setSustainabilityPlan('');
    setOrgStaffing(defaultOrgStaffing());
    setWorkplan(defaultWorkplan());
    setBudgetRows(defaultBudgetRows());
    setProgramBudget(defaultProgramBudget());
    setActivitySchedule(defaultSchedule());
    fetchParentProposals(type);
  };

  const handleSelectType = (type: ProposalType) => {
    setProposalType(type);
    resetForm(type);
  };

  // When a parent is selected, auto-fill related profile fields
  const handleSelectParent = (parent: ParentProposalOption | null) => {
    setSelectedParent(parent);
    if (!parent) return;
    if (proposalType === 'project') {
      setProfile((prev) => ({ ...prev, program_title: parent.title, program_leader: parent.leader }));
    } else if (proposalType === 'activity') {
      setProfile((prev) => ({ ...prev, project_title: parent.title, project_leader: parent.leader }));
    }
  };

  const handleSubmit = async () => {
    if (!proposalType) { showToast('Please select a proposal type.', 'info'); return; }
    if (!title.trim()) { showToast('Please enter a proposal title.', 'info'); return; }
    const config = PROPOSAL_TYPES.find((t) => t.type === proposalType)!;
    if (config.parentType && !selectedParent) {
      showToast(`Please select a ${config.parentLabel} to link this proposal to.`, 'info');
      return;
    }
    if (proposalType === 'activity') {
      if (!cover.activity_date) { showToast('Please fill in the Activity Date in the Cover Page.', 'info'); return; }
      if (!cover.activity_title) { showToast('Please fill in the Activity Title in the Cover Page.', 'info'); return; }
    }
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      console.log({ proposalType, title, parentId: selectedParent?.id, userId: user?.user_id, profile, cover, rationale, significance, generalObjectives, specificObjectives, methodology, expectedOutput, sustainabilityPlan, orgStaffing, workplan, budgetRows, programBudget, activitySchedule });
      showToast('Proposal submitted successfully!', 'success');
      resetForm(proposalType);
    } catch (err) {
      showToast(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeConfig = PROPOSAL_TYPES.find((t) => t.type === proposalType);
  const stepOffset = typeConfig?.parentType ? 1 : 0; // steps shift by 1 when there's a parent selector

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-8 animate-overlay-enter">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Create Proposal</h2>
          <p className="text-sm text-gray-500 mt-1">
            Select a proposal type, then fill in the required details.
          </p>
        </div>

        <div className="space-y-6">

          {/* ── Step 1: Type ── */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-7 h-7 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center shrink-0">1</div>
              <h3 className="text-xl font-bold text-gray-900">Select Proposal Type</h3>
            </div>
            {/* Hierarchy hint */}
            <div className="flex items-center gap-2 mb-5 text-xs bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100 w-fit flex-wrap">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span className="font-semibold text-blue-700">Program</span>
              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <span className="font-semibold text-green-700">Project</span>
              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
              <span className="font-semibold text-orange-600">Activity</span>
              <span className="text-gray-400 mx-1">·</span>
              <span className="text-gray-500">Proposals are linked in this hierarchy</span>
            </div>
            <ProposalTypeSelector selected={proposalType} onSelect={handleSelectType} />
          </div>

          {proposalType && (
            <>
              {/* ── Step 2: Parent Linking (Project & Activity only) ── */}
              {typeConfig?.parentType && (
                <div>
                  <div className="flex items-center gap-3 mb-3 px-1">
                    <div className="w-7 h-7 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center shrink-0">2</div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Link to {typeConfig.parentLabel}
                    </h3>
                  </div>
                  <ParentProposalSelector
                    proposalType={proposalType}
                    parentOptions={parentOptions}
                    selectedParent={selectedParent}
                    onSelect={handleSelectParent}
                    isLoading={isLoadingParents}
                  />
                </div>
              )}

              {/* ── Step 2/3: Proposal Title ── */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {2 + stepOffset}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{typeConfig?.label} Title</h3>
                </div>
                {/* Selected parent context chip */}
                {selectedParent && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 text-xs font-medium">
                      <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Under: <span className="font-bold ml-0.5">{selectedParent.title}</span>
                    </div>
                  </div>
                )}
                <div className="relative">
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder={`Enter ${typeConfig?.label.toLowerCase()} title...`}
                    className="peer w-full px-4 pt-5 pb-2 text-sm bg-white border border-gray-300 rounded-xl shadow-sm outline-none
                      transition-all duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 hover:border-gray-400" />
                  <label className="absolute left-4 top-1.5 text-xs text-emerald-600 pointer-events-none font-medium">
                    {typeConfig?.label} Title
                  </label>
                </div>
              </div>

              {/* I. Profile */}
              <ProfileSection type={proposalType} profile={profile} onChange={(u) => setProfile((p) => ({ ...p, ...u }))} />

              {/* II. Rationale */}
              <SectionCard title="II. Rationale">
                <TextAreaField placeholder="Include a brief result of the conducted needs assessment..." value={rationale} onChange={(e) => setRationale(e.target.value)} rows={8} />
              </SectionCard>

              {/* III. Significance */}
              <SectionCard title="III. Significance">
                <TextAreaField placeholder="Describe the significance of this proposal..." value={significance} onChange={(e) => setSignificance(e.target.value)} rows={6} />
              </SectionCard>

              {/* IV. Objectives */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
                  <h3 className="text-xl font-bold text-gray-900">
                    IV. {proposalType === 'activity' ? 'Objectives of the Activity' : 'Objectives'}
                  </h3>
                </div>
                {proposalType !== 'activity' ? (
                  <div className="space-y-5">
                    <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                      <p className="font-bold text-gray-900 mb-3">General Objectives:</p>
                      <TextAreaField value={generalObjectives} onChange={(e) => setGeneralObjectives(e.target.value)} />
                    </div>
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                      <p className="font-bold text-gray-900 mb-3">Specific Objectives:</p>
                      <TextAreaField value={specificObjectives} onChange={(e) => setSpecificObjectives(e.target.value)} />
                    </div>
                  </div>
                ) : (
                  <TextAreaField placeholder="Describe the objectives of this activity..." value={generalObjectives} onChange={(e) => setGeneralObjectives(e.target.value)} rows={6} />
                )}
              </div>

              {/* V. Methodology */}
              <SectionCard title="V. Methodology">
                <TextAreaField placeholder={proposalType === 'activity' ? 'Short narrative of the methodology...' : 'Describe the methodology...'} value={methodology} onChange={(e) => setMethodology(e.target.value)} rows={8} />
              </SectionCard>

              {/* VI. Expected Output */}
              <ExpectedOutputSection title="VI. Expected Output / Outcome" data={expectedOutput}
                onChange={(key, value) => setExpectedOutput((p) => ({ ...p, [key]: value }))} />

              {/* VII. Sustainability Plan (Program & Project only) */}
              {(proposalType === 'program' || proposalType === 'project') && (
                <SectionCard title="VII. Sustainability Plan">
                  <TextAreaField placeholder="Describe the sustainability plan..." value={sustainabilityPlan} onChange={(e) => setSustainabilityPlan(e.target.value)} rows={10} />
                </SectionCard>
              )}

              {/* Org & Staffing */}
              <OrgStaffingSection
                title={proposalType === 'activity' ? 'VII. Organization and Staffing' : 'VIII. Organization and Staffing'}
                rows={orgStaffing} onChange={setOrgStaffing}
              />

              {/* Plan of Activities (Activity only) */}
              {proposalType === 'activity' && (
                <ActivityScheduleSection schedule={activitySchedule} onChange={setActivitySchedule} />
              )}

              {/* Workplan (Program & Project) */}
              {(proposalType === 'program' || proposalType === 'project') && (
                <WorkplanSection
                  title={proposalType === 'program' ? 'VIII. Workplan' : 'IX. Workplan'}
                  rows={workplan} onChange={setWorkplan}
                />
              )}

              {/* Budgetary Requirement */}
              {proposalType === 'program' ? (
                <ProgramBudgetSection title="IX. Budgetary Requirement" rows={programBudget} onChange={setProgramBudget} />
              ) : (
                <BudgetSection
                  title={proposalType === 'project' ? 'X. Budgetary Requirement' : 'IX. Budgetary Requirement'}
                  rows={budgetRows} onChange={setBudgetRows}
                />
              )}

              {/* Submit */}
              <div className="flex justify-end py-6">
                <button onClick={handleSubmit} disabled={isSubmitting}
                  className={`group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                    text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/30
                    transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-green-500/40'}`}>
                  <span className="flex items-center gap-3">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting…
                      </>
                    ) : (
                      <>
                        Submit {typeConfig?.label}
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProposal;