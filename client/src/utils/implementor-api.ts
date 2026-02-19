// ─────────────────────────────────────────────
// implementor-api.ts
// ─────────────────────────────────────────────

const BASE_URL = 'http://127.0.0.1:8000/api';

// ─────────────────────────────────────────────
// AUTH HELPERS
// ─────────────────────────────────────────────

function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

function storeAccessToken(token: string): void {
  localStorage.setItem('access_token', token);
}

function forceLogout(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await fetch(`${BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data: { access: string } = await res.json();
    storeAccessToken(data.access);
    return data.access;
  } catch {
    return null;
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorBody: any = {};
    let message = `Request failed with status ${res.status}`;
    try {
      errorBody = await res.json();
      message = errorBody?.detail ?? errorBody?.message ?? JSON.stringify(errorBody) ?? message;
    } catch {
      // ignore parse errors
    }
    if (import.meta.env.DEV) {
      console.error(
        `[implementor-api] ${res.status} ${res.url}\n`,
        'Django error body:', JSON.stringify(errorBody, null, 2),
      );
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const makeRequest = () =>
    fetch(url, { ...options, headers: { ...getAuthHeaders(), ...(options.headers ?? {}) } });

  let res = await makeRequest();

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      forceLogout();
      throw new Error('Session expired. Please log in again.');
    }
    res = await makeRequest();
    if (res.status === 401) {
      forceLogout();
      throw new Error('Session expired. Please log in again.');
    }
  }

  return res;
}

// ─────────────────────────────────────────────
// SHARED TYPES
// ─────────────────────────────────────────────

export interface MethodologyPhase {
  phase: string;
  activities: string[];
}

export interface OrgStaffingApiItem {
  role: string;
  name: string;
}

export interface BudgetItem {
  item: string;
  amount: number;
}

export interface WorkplanMonth {
  month: string;
  activity: string;
}

export interface PlanOfActivityItem {
  time: string;
  activity: string;
}

// ─────────────────────────────────────────────
// FORM DATA TYPES (used in CreateProposal.tsx)
// ─────────────────────────────────────────────

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
  activity: string;
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
}

// ─────────────────────────────────────────────
// PAYLOAD TYPES
// ─────────────────────────────────────────────

export interface ProjectListItem {
  project_title: string;
  project_leader: string;
  project_member: string[];
  project_duration: number;
  project_start_date: string | null;
  project_end_date: string | null;
}

export interface ProgramProposalPayload {
  title: string;
  program_title: string;
  program_leader: string;
  project_list: ProjectListItem[];
  implementing_agency: string[];
  cooperating_agencies: string[];
  extension_sites: string[];
  tags: string[];
  clusters: string[];
  agendas: string[];
  sdg_addressed: string;
  mandated_academic_program: string;
  rationale: string;
  significance: string;
  general_objectives: string;
  specific_objectives: string;
  methodology: MethodologyPhase[];
  expected_output_6ps: string[];
  sustainability_plan: string;
  org_and_staffing: OrgStaffingApiItem[];
  workplan: WorkplanMonth[];
  budget_requirements: BudgetItem[];
}

export interface ActivityListItem {
  activity_title: string;
  project_leader: string;
  project_member: string[];
  activity_duration: number;
  activity_date: string | null;
}

export interface ProjectDetailsPayload {
  activity_list: ActivityListItem[];
  implementing_agency: string[];
  cooperating_agencies: string[];
  extension_sites: string[];
  tags: string[];
  clusters: string[];
  agendas: string[];
  sdg_addressed: string;
  mandated_academic_program: string;
  rationale: string;
  significance: string;
  general_objectives: string;
  specific_objectives: string;
  methodology: MethodologyPhase[];
  expected_output_6ps: string[];
  sustainability_plan: string;
  org_and_staffing: OrgStaffingApiItem[];
  workplan: WorkplanMonth[];
  budget_requirements: BudgetItem[];
}

export interface ActivityProposalPayload {
  implementing_agency: string[];
  cooperating_agencies: string[];
  extension_sites: string[];
  tags: string[];
  clusters: string[];
  agendas: string[];
  sdg_addressed: string;
  mandated_academic_program: string;
  rationale: string;
  significance: string;
  objectives_of_activity: string;
  methodology: string;
  expected_output_6ps: string[];
  sustainability_plan: string;
  org_and_staffing: OrgStaffingApiItem[];
  plan_of_activity: PlanOfActivityItem[];
  budget_requirements: BudgetItem[];
}

// ─────────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────────

export interface ProgramProposalResponse {
  id?: number;
  child_id?: number;
  program_proposal_id?: number;
  title?: string;
  [key: string]: any;
}

export interface ProjectDetailsResponse {
  activities?: Array<{ id: number; activity_title: string; [key: string]: any }>;
  [key: string]: any;
}

export interface ParentProposalOption {
  id: number;
  title: string;
  leader: string;
  created_at?: string;
}

export type ProposalNodeType = 'Program' | 'Project' | 'Activity';

// ─────────────────────────────────────────────
// MAPPING UTILITIES
// ─────────────────────────────────────────────

export function toStringArray(value: string): string[] {
  if (!value?.trim()) return [];
  return value
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function mapWorkplanRows(rows: WorkplanRow[]): WorkplanMonth[] {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const result: WorkplanMonth[] = [];
  rows.forEach((row) => {
    if (!row.activity.trim() && !row.objective.trim()) return;
    [1, 2, 3].forEach((yr) => {
      quarters.forEach((q) => {
        const key = `year${yr}_${q.toLowerCase()}` as keyof WorkplanRow;
        if (row[key]) {
          result.push({ month: `Year ${yr} ${q}`, activity: row.activity || row.objective });
        }
      });
    });
  });
  if (result.length === 0) {
    rows.forEach((row) => {
      if (row.activity || row.objective) {
        result.push({ month: '—', activity: row.activity || row.objective });
      }
    });
  }
  return result;
}

export function mapOrgStaffing(rows: OrgStaffingItem[]): OrgStaffingApiItem[] {
  return rows
    .filter((r) => r.designation?.trim())
    .map((r) => ({ role: r.activity, name: r.designation }));
}

export function mapBudgetRows(rows: BudgetRows): BudgetItem[] {
  return (['meals', 'transport', 'supplies'] as (keyof BudgetRows)[]).flatMap((cat) =>
    rows[cat]
      .filter((r) => r.item?.trim())
      .map((r) => ({ item: r.item, amount: Number(r.amount) || 0 })),
  );
}

export function mapProgramBudgetRows(rows: ProgramBudgetRow[]): BudgetItem[] {
  return rows
    .filter((r) => r.label?.trim())
    .map((r) => ({ item: r.label, amount: Number(r.total) || 0 }));
}

export function mapExpectedOutput(output: ExpectedOutput6Ps): string[] {
  return Object.values(output).filter(Boolean);
}

export function mapMethodology(text: string): MethodologyPhase[] {
  const lines = toStringArray(text);
  return [{ phase: 'Methodology', activities: lines.length ? lines : [text || '—'] }];
}

// ─────────────────────────────────────────────
// PAYLOAD BUILDERS
// ─────────────────────────────────────────────

export interface ProgramFormData {
  program_title: string;
  program_leader: string;
  members: string;
  implementing_agency: string;
  address_tel_email: string;
  cooperating_agencies: string;
  extension_site: string;
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
}

export interface ProjectFormData {
  implementing_agency: string;
  address_tel_email: string;
  cooperating_agencies: string;
  extension_site: string;
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
  activities: ActivityItem[];
}

export interface ActivityFormData {
  implementing_agency: string;
  address_tel_email: string;
  cooperating_agencies: string;
  extension_site: string;
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
}

/**
 * Builds the payload for POST /api/program-proposal/
 * Aggregates all project/activity budgets automatically.
 */
export function buildProgramPayload(
  programData: ProgramFormData,
  projectForms: ProjectFormData[],
): ProgramProposalPayload {
  // Aggregate budgets: program-level rows + all project budget rows
  const aggregatedBudget: BudgetItem[] = [];

  // From program-level budget table
  mapProgramBudgetRows(programData.program_budget).forEach((b) => aggregatedBudget.push(b));

  // From each project's budget
  projectForms.forEach((pf, i) => {
    const projectLabel = programData.projects[i]?.project_title || `Project ${i + 1}`;
    mapBudgetRows(pf.budget).forEach((b) =>
      aggregatedBudget.push({ item: `${projectLabel} - ${b.item}`, amount: b.amount }),
    );
  });

  return {
    title: programData.program_title || 'Program Proposal',
    program_title: programData.program_title,
    program_leader: programData.program_leader,
    project_list: programData.projects.map((p) => ({
      project_title: p.project_title,
      project_leader: p.project_leader,
      project_member: toStringArray(p.project_members),
      project_duration: Number(p.project_duration_months) || 0,
      project_start_date: p.project_start_date || null,
      project_end_date: p.project_end_date || null,
    })),
    implementing_agency: toStringArray(programData.implementing_agency),
    cooperating_agencies: toStringArray(programData.cooperating_agencies),
    extension_sites: toStringArray(programData.extension_site),
    tags: programData.tagging,
    clusters: programData.cluster,
    agendas: programData.extension_agenda,
    sdg_addressed: programData.sdg_addressed,
    mandated_academic_program: programData.college_mandated_program,
    rationale: programData.rationale,
    significance: programData.significance,
    general_objectives: programData.general_objectives,
    specific_objectives: programData.specific_objectives,
    methodology: mapMethodology(programData.methodology),
    expected_output_6ps: mapExpectedOutput(programData.expected_output),
    sustainability_plan: programData.sustainability_plan,
    org_and_staffing: mapOrgStaffing(programData.org_staffing),
    workplan: mapWorkplanRows(programData.workplan),
    budget_requirements: aggregatedBudget,
  };
}

/**
 * Builds the payload for PUT /api/program-proposal/{child_id}/projects/
 * Sends all activities for the given project plus its proposal fields.
 */
export function buildProjectDetailsPayload(
  projectForm: ProjectFormData,
  projectLeader: string,
): ProjectDetailsPayload {
  return {
    activity_list: projectForm.activities.map((act) => ({
      activity_title: act.activity_title,
      project_leader: projectLeader,
      project_member: [],
      activity_duration: 8,
      activity_date: null,
    })),
    implementing_agency: toStringArray(projectForm.implementing_agency),
    cooperating_agencies: toStringArray(projectForm.cooperating_agencies),
    extension_sites: toStringArray(projectForm.extension_site),
    tags: projectForm.tagging,
    clusters: projectForm.cluster,
    agendas: projectForm.extension_agenda,
    sdg_addressed: projectForm.sdg_addressed,
    mandated_academic_program: projectForm.college_mandated_program,
    rationale: projectForm.rationale,
    significance: projectForm.significance,
    general_objectives: projectForm.general_objectives,
    specific_objectives: projectForm.specific_objectives,
    methodology: mapMethodology(projectForm.methodology),
    expected_output_6ps: mapExpectedOutput(projectForm.expected_output),
    sustainability_plan: projectForm.sustainability_plan,
    org_and_staffing: mapOrgStaffing(projectForm.org_staffing),
    workplan: mapWorkplanRows(projectForm.workplan),
    budget_requirements: mapBudgetRows(projectForm.budget),
  };
}

/**
 * Builds the payload for PATCH /api/activity-proposal/{id}/
 */
export function buildActivityPayload(actData: ActivityFormData): ActivityProposalPayload {
  return {
    implementing_agency: toStringArray(actData.implementing_agency),
    cooperating_agencies: toStringArray(actData.cooperating_agencies),
    extension_sites: toStringArray(actData.extension_site),
    tags: actData.tagging,
    clusters: actData.cluster,
    agendas: actData.extension_agenda,
    sdg_addressed: actData.sdg_addressed,
    mandated_academic_program: actData.college_mandated_program,
    rationale: actData.rationale,
    significance: actData.significance,
    objectives_of_activity: actData.objectives,
    methodology: actData.methodology,
    expected_output_6ps: mapExpectedOutput(actData.expected_output),
    sustainability_plan: actData.sustainability_plan,
    org_and_staffing: mapOrgStaffing(actData.org_staffing),
    plan_of_activity: actData.schedule.rows
      .filter((r) => r.activity?.trim())
      .map((r) => ({
        time: r.time,
        activity: `${r.activity}${r.speaker ? ` — ${r.speaker}` : ''}`,
      })),
    budget_requirements: mapBudgetRows(actData.budget),
  };
}

// ─────────────────────────────────────────────
// API FUNCTIONS
// ─────────────────────────────────────────────

/**
 * POST /api/program-proposal/
 * Creates a new program proposal. Returns the created object with child_id.
 */
export async function submitProgramProposal(
  programData: ProgramFormData,
  projectForms: ProjectFormData[],
): Promise<ProgramProposalResponse> {
  const payload = buildProgramPayload(programData, projectForms);
  if (import.meta.env.DEV) {
    console.log('[submitProgramProposal] payload:', JSON.stringify(payload, null, 2));
  }
  const res = await authFetch(`${BASE_URL}/program-proposal/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return handleResponse<ProgramProposalResponse>(res);
}

/**
 * PUT /api/program-proposal/{childId}/projects/
 * Submits detailed fields for a specific project under the program (including activity_list).
 */
export async function submitProjectDetails(
  childId: number,
  projectForm: ProjectFormData,
  projectLeader: string,
): Promise<ProjectDetailsResponse> {
  const payload = buildProjectDetailsPayload(projectForm, projectLeader);
  if (import.meta.env.DEV) {
    console.log(`[submitProjectDetails] childId=${childId} payload:`, JSON.stringify(payload, null, 2));
  }
  const res = await authFetch(`${BASE_URL}/program-proposal/${childId}/projects/`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return handleResponse<ProjectDetailsResponse>(res);
}

/**
 * PATCH /api/activity-proposal/{activityId}/
 * Saves/updates a single activity proposal.
 */
export async function saveActivityProposal(
  activityId: number,
  actData: ActivityFormData,
): Promise<unknown> {
  const payload = buildActivityPayload(actData);
  if (import.meta.env.DEV) {
    console.log(`[saveActivityProposal] activityId=${activityId} payload:`, JSON.stringify(payload, null, 2));
  }
  const res = await authFetch(`${BASE_URL}/activity-proposal/${activityId}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// ─────────────────────────────────────────────
// FETCH / LIST FUNCTIONS
// ─────────────────────────────────────────────

export async function fetchProposalsNode(type: ProposalNodeType): Promise<any> {
  const res = await authFetch(`${BASE_URL}/proposals-node/${type}`);
  const data = await handleResponse<any>(res);
  console.log(`[fetchProposalsNode/${type}]`, JSON.stringify(data, null, 2));
  return data;
}

export async function fetchProgramProposals(): Promise<ParentProposalOption[]> {
  const res = await authFetch(`${BASE_URL}/proposals-node/Program`);
  const data: any[] = await handleResponse(res);
  return data.map((p) => ({
    id: p.child_id,
    title: p.title,
    leader: p.program_leader ?? p.project_leader ?? p.created_by ?? `User #${p.user}`,
    created_at: p.created_at,
  }));
}

export async function fetchProjectProposals(): Promise<ParentProposalOption[]> {
  const res = await authFetch(`${BASE_URL}/proposals-node/Project`);
  const data: any[] = await handleResponse(res);
  return data.map((p) => ({
    id: p.child_id,
    title: p.title,
    leader: p.project_leader ?? p.program_leader ?? p.created_by ?? `User #${p.user}`,
    created_at: p.created_at,
  }));
}

export async function fetchActivityProposals(): Promise<any[]> {
  const res = await authFetch(`${BASE_URL}/proposals-node/Activity`);
  return handleResponse<any[]>(res);
}

export async function fetchProgramProposalDetail(childId: number | string): Promise<any> {
  const res = await authFetch(`${BASE_URL}/program-proposal/${childId}/`);
  return handleResponse<any>(res);
}

export async function fetchProjectList(childId: number | string): Promise<any> {
  const res = await authFetch(`${BASE_URL}/program-proposal/${childId}/projects/`);
  return handleResponse<any>(res);
}