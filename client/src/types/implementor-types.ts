export interface ExpectedOutput6Ps {
  publications: string;
  patents: string;
  products: string;
  people_services: string;
  places_partnerships: string;
  policy: string;
  social_impact: string;
  economic_impact: string;
}

export interface OrgStaffingItem {
  //activity: string;
  designation: string;
  terms: string;
}

export interface WorkplanRow {
  objective: string;
  activity: string;
  expected_output: string;
  year1_q1: boolean; year1_q2: boolean; year1_q3: boolean; year1_q4: boolean;
  year2_q1: boolean; year2_q2: boolean; year2_q3: boolean; year2_q4: boolean;
  year3_q1: boolean; year3_q2: boolean; year3_q3: boolean; year3_q4: boolean;
}

export interface BudgetLineItem {
  item: string;
  cost: string;
  qty: string;
  amount: string | number;
}

export interface BudgetRows {
  meals: BudgetLineItem[];
  transport: BudgetLineItem[];
  supplies: BudgetLineItem[];
}

export interface ProgramBudgetRow {
  label: string;
  qty: string;
  unit: string;
  unit_cost: string;
  prmsu: string;
  agency: string;
  total: string;
}

export interface ActivityScheduleRow {
  time: string;
  activity: string;
  speaker: string;
}

export interface ActivityScheduleData {
  activity_title: string;
  activity_date: string;
  rows: ActivityScheduleRow[];
}

export interface ProjectItem {
  id: number;
  project_title: string;
  project_leader: string;
  project_members: string;
  project_duration_months: string;
  project_start_date: string;
  project_end_date: string;
}

export interface ActivityItem {
  id: number;
  activity_title: string;
  project_leader: string;
  project_members: string;
  activity_duration: string;
  activity_date: string;
}

// API response shapes
export interface ApiProject {
  id: number;
  child_id: number;
  project_title: string;
  project_leader: string;
  members: string[];
  duration_months: number;
  start_date: string | null;
  end_date: string | null;
}

export interface ApiProjectListResponse {
  id: number; // child_id of the program-proposal
  program_title: string;
  projects: ApiProject[];
}

export interface ApiActivity {
  child_id: number;
  activity_title: string;
  project_leader: string;
  members: string[];
  activity_duration_hours: number;
  activity_date: string | null;
}

export interface ApiActivityListResponse {
  id: number; // project id
  project_title: string;
  activities: ApiActivity[];
}

export interface ProgramFormData {
  program_title: string;
  program_leader: string;
  members: string;
  implementing_agency: string;
  address_tel_email: string;
  cooperating_agencies: string;
  extension_site: { country: string; region: string; province: string; district: string; municipality:string; barangay: string }[];
  tagging: string[];
  cluster: string[];
  extension_agenda: string[];
  sdg_addressed: string;
  college_mandated_program: string;
  rationale: string;
  significance: string;
  general_objectives: string;
  specific_objectives: string;
  methodology: string;
  sustainability_plan: string;
  expected_output: ExpectedOutput6Ps;
  org_staffing: OrgStaffingItem[];
  workplan: WorkplanRow[];
  program_budget: ProgramBudgetRow[];
  projects: ProjectItem[];
  program_budget_total?: string;
}

export interface ProjectFormData {
  // From API (pre-filled, read-only)
  apiProjectId: number;
  apiProjectNodeId: number;
  project_title: string;
  project_leader: string;

  project_members: string;
  project_duration_months: string;
  project_start_date: string;
  project_end_date: string;

  // User-filled fields
  implementing_agency: string;
  address_tel_email: string;
  cooperating_agencies: string;
  extension_site: { country: string; region: string; province: string; district: string; municipality:string; barangay: string }[];
  tagging: string[];
  cluster: string[];
  extension_agenda: string[];
  sdg_addressed: string;
  college_mandated_program: string;
  rationale: string;
  significance: string;
  general_objectives: string;
  specific_objectives: string;
  methodology: string;
  sustainability_plan: string;
  expected_output: ExpectedOutput6Ps;
  org_staffing: OrgStaffingItem[];
  workplan: WorkplanRow[];
  budget: BudgetRows;

  // Activity list for this project
  activities: ActivityItem[];

  // Track save state
  saved: boolean;
}

export interface ActivityFormData {
  // From API (pre-filled, read-only)
  apiActivityId: number;
  activity_title: string;

  // User-filled fields
  implementing_agency: string;
  address_tel_email: string;
  cooperating_agencies: string;
  extension_site: { country: string; region: string; province: string; district: string; municipality:string; barangay: string }[];
  tagging: string[];
  cluster: string[];
  extension_agenda: string[];
  sdg_addressed: string;
  college_mandated_program: string;
  activity_duration: string;
  rationale: string;
  significance: string;
  objectives: string;
  methodology: string;
  sustainability_plan: string;
  expected_output: ExpectedOutput6Ps;
  org_staffing: OrgStaffingItem[];
  schedule: ActivityScheduleData;
  budget: BudgetRows;

  // Track save state
  saved: boolean;
}

export interface ProgramHistoryListFields {
  proposal_id: string;
  program_id: number;
  program_title: string;
  program_leader: string;
  history_id: number;
  version: number;
  status: string;
}

export interface ProjectHistoryListFields {
  proposal_id: number;
  project_id: number;
  project_title: string;
  project_leader: string;
  history_id: number;
  version: number;
  status: string;
}

export interface ActivityHistoryListFields {
  proposal_id: number;
  activity_id: number;
  activity_title: string;
  project_leader: string;
  history_id: number;
  version: number;
  status: string;
  
}
