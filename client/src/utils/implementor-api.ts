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
      const text = await res.text();
      try {
        errorBody = JSON.parse(text);
        message = errorBody?.detail ?? errorBody?.message ?? JSON.stringify(errorBody) ?? message;
      } catch {
        // Not JSON — likely a Django HTML traceback
        message = text.slice(0, 300) || message;
        errorBody = { raw: text };
      }
    } catch { /* ignore read errors */ }
    if (import.meta.env.DEV) {
      console.error(`[implementor-api] ${res.status} ${res.url}\n`, 'Error body:', JSON.stringify(errorBody, null, 2));
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
    if (!newToken) { forceLogout(); throw new Error('Session expired. Please log in again.'); }
    res = await makeRequest();
    if (res.status === 401) { forceLogout(); throw new Error('Session expired. Please log in again.'); }
  }

  return res;
}

// ─────────────────────────────────────────────
// FORM DATA TYPES
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
  project_leader: string;
  project_members: string;
  activity_duration: string;
  activity_date: string;
}

// API response shapes
export interface ApiProject {
  id: number;
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
  id: number;
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
  // From API (pre-filled, read-only)
  apiProjectId: number;
  project_title: string;
  project_leader: string;

  // User-filled fields
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

  // Track save state
  saved: boolean;
}

// ─────────────────────────────────────────────
// MAPPING UTILITIES
// ─────────────────────────────────────────────

export function toStringArray(value: string): string[] {
  if (!value?.trim()) return [];
  return value.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

export function mapWorkplanRows(rows: WorkplanRow[]): { month: string; activity: string }[] {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const result: { month: string; activity: string }[] = [];
  rows.forEach((row) => {
    if (!row.activity.trim() && !row.objective.trim()) return;
    [1, 2, 3].forEach((yr) => {
      quarters.forEach((q) => {
        const key = `year${yr}_${q.toLowerCase()}` as keyof WorkplanRow;
        if (row[key]) result.push({ month: `Year ${yr} ${q}`, activity: row.activity || row.objective });
      });
    });
  });
  if (result.length === 0) {
    rows.forEach((row) => {
      if (row.activity || row.objective) result.push({ month: '—', activity: row.activity || row.objective });
    });
  }
  return result;
}

export function mapOrgStaffing(rows: OrgStaffingItem[]): { role: string; name: string }[] {
  return rows.filter((r) => r.designation?.trim()).map((r) => ({ role: r.activity, name: r.designation }));
}

export function mapBudgetRows(rows: BudgetRows): { item: string; amount: number }[] {
  return (['meals', 'transport', 'supplies'] as (keyof BudgetRows)[]).flatMap((cat) =>
    rows[cat].filter((r) => r.item?.trim()).map((r) => ({ item: r.item, amount: Number(r.amount) || 0 })),
  );
}

export function mapProgramBudgetRows(rows: ProgramBudgetRow[]): { item: string; amount: number }[] {
  return rows.filter((r) => r.label?.trim()).map((r) => ({ item: r.label, amount: Number(r.total) || 0 }));
}

export function mapExpectedOutput(output: ExpectedOutput6Ps): string[] {
  return Object.values(output).filter(Boolean);
}

export function mapMethodology(text: string): { phase: string; activities: string[] }[] {
  const lines = toStringArray(text);
  return [{ phase: 'Methodology', activities: lines.length ? lines : [text || '—'] }];
}

// ─────────────────────────────────────────────
// API FUNCTIONS
// ─────────────────────────────────────────────

/** POST /api/program-proposal/ — Create program proposal, then resolve child_id via /proposals-node/Program */
export async function submitProgramProposal(programData: ProgramFormData): Promise<{ child_id: number; [key: string]: any }> {
  const payload = {
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
    budget_requirements: mapProgramBudgetRows(programData.program_budget),
  };

  if (import.meta.env.DEV) console.log('[submitProgramProposal] payload:', JSON.stringify(payload, null, 2));

  // POST the program proposal (response does NOT include child_id)
  const res = await authFetch(`${BASE_URL}/program-proposal/`, { method: 'POST', body: JSON.stringify(payload) });
  const postResult: any = await handleResponse(res);

  // If the POST response already has child_id, use it directly
  if (postResult?.child_id) return postResult;

  // Otherwise, fetch the proposals list and find the most recently created one matching the title
  const listRes = await authFetch(`${BASE_URL}/proposals-node/Program`);
  const list: Array<{ id: number; child_id: number; title: string; created_at: string }> = await handleResponse(listRes);

  // Sort by id descending to get the latest, filter by matching title
  const matching = list
    .filter((p) => p.title === programData.program_title)
    .sort((a, b) => b.id - a.id);

  const found = matching[0];
  if (!found?.child_id) {
    // Fallback: just grab the overall latest entry
    const latest = [...list].sort((a, b) => b.id - a.id)[0];
    if (!latest?.child_id) throw new Error('Could not resolve child_id for the created program proposal.');
    if (import.meta.env.DEV) console.log('[submitProgramProposal] resolved child_id (fallback):', latest.child_id);
    return { ...postResult, child_id: latest.child_id };
  }

  if (import.meta.env.DEV) console.log('[submitProgramProposal] resolved child_id:', found.child_id);
  return { ...postResult, child_id: found.child_id };
}

/** GET /api/program-proposal/{childId}/projects/ — Fetch project list */
export async function fetchProjectList(childId: number): Promise<ApiProjectListResponse> {
  const res = await authFetch(`${BASE_URL}/program-proposal/${childId}/projects/`);
  return handleResponse<ApiProjectListResponse>(res);
}

/** PUT /api/project-proposal/{projectId}/ — Save project proposal */
export async function saveProjectProposal(projectId: number, form: ProjectFormData): Promise<any> {
  const payload = {
    activity_list: form.activities.map((act) => ({
      activity_title: act.activity_title,
      project_leader: act.project_leader || form.project_leader,
      project_member: toStringArray(act.project_members),
      activity_duration: Number(act.activity_duration) || 8,
      activity_date: act.activity_date || null,
    })),
    implementing_agency: toStringArray(form.implementing_agency),
    cooperating_agencies: toStringArray(form.cooperating_agencies),
    extension_sites: toStringArray(form.extension_site),
    tags: form.tagging,
    clusters: form.cluster,
    agendas: form.extension_agenda,
    sdg_addressed: form.sdg_addressed,
    mandated_academic_program: form.college_mandated_program,
    rationale: form.rationale,
    significance: form.significance,
    general_objectives: form.general_objectives,
    specific_objectives: form.specific_objectives,
    methodology: mapMethodology(form.methodology),
    expected_output_6ps: mapExpectedOutput(form.expected_output),
    sustainability_plan: form.sustainability_plan,
    org_and_staffing: mapOrgStaffing(form.org_staffing),
    workplan: mapWorkplanRows(form.workplan),
    budget_requirements: mapBudgetRows(form.budget),
  };

  if (import.meta.env.DEV) console.log(`[saveProjectProposal] projectId=${projectId}`, JSON.stringify(payload, null, 2));
  const res = await authFetch(`${BASE_URL}/project-proposal/${projectId}/`, { method: 'PUT', body: JSON.stringify(payload) });
  return handleResponse(res);
}

/** GET /api/project-proposal/{projectId}/activities/ — Fetch activity list */
export async function fetchActivityList(projectId: number): Promise<ApiActivityListResponse> {
  const res = await authFetch(`${BASE_URL}/project-proposal/${projectId}/activities/`);
  return handleResponse<ApiActivityListResponse>(res);
}

/** PATCH /api/activity-proposal/{activityId}/ — Save activity proposal */
export async function saveActivityProposal(activityId: number, form: ActivityFormData): Promise<any> {
  const payload = {
    implementing_agency: toStringArray(form.implementing_agency),
    cooperating_agencies: toStringArray(form.cooperating_agencies),
    extension_sites: toStringArray(form.extension_site),
    tags: form.tagging,
    clusters: form.cluster,
    agendas: form.extension_agenda,
    sdg_addressed: form.sdg_addressed,
    mandated_academic_program: form.college_mandated_program,
    rationale: form.rationale,
    significance: form.significance,
    objectives_of_activity: form.objectives,
    methodology: form.methodology,
    expected_output_6ps: mapExpectedOutput(form.expected_output),
    sustainability_plan: form.sustainability_plan,
    org_and_staffing: mapOrgStaffing(form.org_staffing),
    plan_of_activity: form.schedule.rows
      .filter((r) => r.activity?.trim())
      .map((r) => ({ time: r.time, activity: `${r.activity}${r.speaker ? ` — ${r.speaker}` : ''}` })),
    budget_requirements: mapBudgetRows(form.budget),
  };

  if (import.meta.env.DEV) console.log(`[saveActivityProposal] activityId=${activityId}`, JSON.stringify(payload, null, 2));
  const res = await authFetch(`${BASE_URL}/activity-proposal/${activityId}/`, { method: 'PUT', body: JSON.stringify(payload) });
  return handleResponse(res);
}
export type ProposalNodeType = 'Program' | 'Project' | 'Activity';

export async function fetchProgramProposalDetail(childId: number | string): Promise<any> {
  const res = await authFetch(`${BASE_URL}/program-proposal/${childId}/`);
  return handleResponse<any>(res);
}
export async function fetchProposalsNode(type: ProposalNodeType): Promise<any> {
  const res = await authFetch(`${BASE_URL}/proposals-node/${type}`);
  const data = await handleResponse<any>(res);
  console.log(`[fetchProposalsNode/${type}]`, JSON.stringify(data, null, 2));
  return data;
}