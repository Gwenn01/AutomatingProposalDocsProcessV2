import type { ActivityFormData, ActivityItem, ActivityScheduleRow, ApiActivity, ApiProject, BudgetRows, ExpectedOutput6Ps, OrgStaffingItem, ProgramFormData, ProjectFormData, ProjectItem, WorkplanRow } from "@/utils/implementor-api";


export const defaultExpectedOutput = (): ExpectedOutput6Ps => ({
  publications: '', patents: '', products: '', people_services: '',
  places_partnerships: '', policy: '', social_impact: '', economic_impact: '',
});

export const defaultOrgStaffing = (): OrgStaffingItem[] => [
  { activity: 'Proposal Preparation', designation: '', terms: '' },
  { activity: 'Program/Certificates', designation: '', terms: '' },
  { activity: 'Food Preparation', designation: '', terms: '' },
  { activity: 'Resource Speakers', designation: '', terms: '' },
  { activity: 'Masters of Ceremony', designation: '', terms: '' },
  { activity: 'Secretariat for Attendance', designation: '', terms: '' },
  { activity: 'Documentation/Technical', designation: '', terms: '' },
];

export const defaultWorkplanRow = (): WorkplanRow => ({
  objective: '', activity: '', expected_output: '',
  year1_q1: false, year1_q2: false, year1_q3: false, year1_q4: false,
  year2_q1: false, year2_q2: false, year2_q3: false, year2_q4: false,
  year3_q1: false, year3_q2: false, year3_q3: false, year3_q4: false,
});

export const defaultBudget = (): BudgetRows => ({ meals: [], transport: [], supplies: [] });

export const defaultProjectItem = (index: number): ProjectItem => ({
  id: Date.now() + index,
  project_title: '',
  project_leader: '',
  project_members: '',
  project_duration_months: '',
  project_start_date: '',
  project_end_date: '',
});

export const defaultActivityItem = (): ActivityItem => ({
  id: Date.now() + Math.random(),
  activity_title: '',
  project_leader: '',
  project_members: '',
  activity_duration: '8',
  activity_date: '',
});

export const defaultScheduleRows = (): ActivityScheduleRow[] => [
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

export const defaultProgramFormData = (): ProgramFormData => ({
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

export const defaultProjectFormData = (apiProject: ApiProject): ProjectFormData => ({
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

export const defaultActivityFormData = (apiActivity: ApiActivity): ActivityFormData => ({
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