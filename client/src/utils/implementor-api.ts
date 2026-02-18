// ─────────────────────────────────────────────
// utils/implementor-api.ts
// API utilities for Program, Project, and Activity proposals
// ─────────────────────────────────────────────

const BASE_URL = 'http://127.0.0.1:8000/api';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// TOKEN MANAGEMENT
// Mirrors auth-api.ts: tokens are stored as
//   localStorage.access_token  (JWT access)
//   localStorage.refresh_token (JWT refresh)
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

/** Redirect to login and wipe stored auth data. */
function forceLogout(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  // Redirect to root — adjust path if your login route is different
  window.location.href = '/';
}

/**
 * Calls SimpleJWT's token-refresh endpoint and stores the new access token.
 * Returns the new token, or null if refresh fails (session expired).
 */
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
    // Always log full Django error in dev so we can see exactly which fields failed
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

/**
 * Fetch wrapper that:
 *  1. Attaches Bearer auth header automatically
 *  2. On 401 → refreshes the access token once and retries
 *  3. On second 401 → forceLogout() and throws
 */
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
// PROGRAM PROPOSAL
// ─────────────────────────────────────────────

export interface ProgramProposalPayload {
  title: string;

  program_title: string;
  program_leader: string;

  projects_list: string[];

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

export async function submitProgramProposal(
  payload: ProgramProposalPayload,
): Promise<unknown> {
  if (import.meta.env.DEV) {
    console.log('[submitProgramProposal] payload:', JSON.stringify(payload, null, 2));
  }
  const res = await authFetch(`${BASE_URL}/program-proposal/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// ─────────────────────────────────────────────
// PROJECT PROPOSAL
// ─────────────────────────────────────────────

export interface ProjectProposalPayload {
  title: string;

  /** ID of the parent Program Proposal */
  program_proposal_id: number;

  project_title: string;
  project_leader: string;

  members: string[];

  duration_months: number;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD

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

export async function submitProjectProposal(
  payload: ProjectProposalPayload,
): Promise<unknown> {
  if (import.meta.env.DEV) {
    console.log('[submitProjectProposal] payload:', JSON.stringify(payload, null, 2));
    console.log('[submitProjectProposal] program_proposal_id type:', typeof payload.program_proposal_id, '| value:', payload.program_proposal_id);

    // Check if logged-in user matches the program owner
    try {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      console.log('[submitProjectProposal] logged-in user_id:', user?.user_id, '| program owner user field from node API: check console above');
    } catch {}
  }
  const res = await authFetch(`${BASE_URL}/project-proposal/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/**
 * DEV-ONLY: Probe the project-proposal endpoint to find the exact field name
 * Django expects for the program FK. Call this from the browser console:
 *   import('/src/utils/implementor-api.ts').then(m => m.diagnoseProjectProposalFields(14))
 *
 * It tries submitting a minimal payload with different FK field names and logs
 * which one Django accepts (or which error changes).
 */
export async function diagnoseProjectProposalFields(programId: number): Promise<void> {
  const minimalBase = {
    title: '__DIAG_TEST__',
    project_title: 'diag',
    project_leader: 'diag',
    members: [],
    duration_months: 1,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    implementing_agency: [],
    cooperating_agencies: [],
    extension_sites: [],
    tags: [], clusters: [], agendas: [],
    sdg_addressed: 'diag',
    mandated_academic_program: 'diag',
    rationale: 'diag', significance: 'diag',
    general_objectives: 'diag', specific_objectives: 'diag',
    methodology: [{ phase: 'diag', activities: ['diag'] }],
    expected_output_6ps: ['diag'],
    sustainability_plan: 'diag',
    org_and_staffing: [],
    workplan: [],
    budget_requirements: [],
  };

  const variants: Record<string, any>[] = [
    { ...minimalBase, program_proposal_id: programId },
    { ...minimalBase, program_proposal: programId },
    { ...minimalBase, program_id: programId },
    { ...minimalBase, program: programId },
  ];

  const variantNames = ['program_proposal_id', 'program_proposal', 'program_id', 'program'];

  console.group(`[diagnoseProjectProposalFields] Testing program FK field name with id=${programId}`);

  // First: fetch the actual program proposal detail to check its status
  try {
    const detailRes = await authFetch(`${BASE_URL}/program-proposal/${programId}/`);
    if (detailRes.ok) {
      const detail = await detailRes.json();
      console.log(`📋 Program Proposal #${programId} detail:`, detail);
      console.log(`   status="${detail.status}" — if not "draft", backend may reject it as FK`);
    } else {
      const err = await detailRes.json().catch(() => ({}));
      console.warn(`⚠️ Could not fetch program detail (${detailRes.status}):`, err);
    }
  } catch(e) {
    console.warn('Could not fetch program detail:', e);
  }

  for (let i = 0; i < variants.length; i++) {
    const fieldName = variantNames[i];
    try {
      const res = await authFetch(`${BASE_URL}/project-proposal/`, {
        method: 'POST',
        body: JSON.stringify(variants[i]),
      });
      const body = await res.json();
      if (res.ok) {
        console.log(`✅ SUCCESS with field "${fieldName}" — response:`, body);
      } else {
        const stillProgramErr = JSON.stringify(body).includes('Program Proposal does not exist');
        console.warn(`❌ "${fieldName}" → ${res.status}`, stillProgramErr ? '(still same FK error)' : '(DIFFERENT error — FK field name accepted! Fix other fields)', body);
      }
    } catch (err) {
      console.error(`💥 "${fieldName}" threw:`, err);
    }
  }
  console.groupEnd();
}

// ─────────────────────────────────────────────
// ACTIVITY PROPOSAL
// ─────────────────────────────────────────────

export interface ActivityProposalPayload {
  title: string;

  /** ID of the parent Project Proposal */
  project_proposal_id: number;

  activity_title: string;
  project_leader: string;

  members: string[];

  activity_duration_hours: number;
  activity_date: string; // YYYY-MM-DD

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

export async function submitActivityProposal(
  payload: ActivityProposalPayload,
): Promise<unknown> {
  const res = await authFetch(`${BASE_URL}/activity-proposal/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// ─────────────────────────────────────────────
// FETCH PARENT PROPOSALS (for linking dropdowns)
// ─────────────────────────────────────────────

export interface ParentProposalOption {
  id: number;
  title: string;
  leader: string;
  created_at?: string;
}

// ─────────────────────────────────────────────
// PROPOSALS NODE — debug fetch
// GET /api/proposals-node/Program|Project|Activity
// ─────────────────────────────────────────────

export type ProposalNodeType = 'Program' | 'Project' | 'Activity';

export async function fetchProposalsNode(type: ProposalNodeType): Promise<any> {
  const res = await authFetch(`${BASE_URL}/proposals-node/${type}`);
  const data = await handleResponse<any>(res);
  console.log(`[fetchProposalsNode/${type}]`, JSON.stringify(data, null, 2));
  return data;
}

/** Fetch all Program Proposals (used when creating a Project) */
export async function fetchProgramProposals(): Promise<ParentProposalOption[]> {
  const res = await authFetch(`${BASE_URL}/proposals-node/Program`);
  const data: any[] = await handleResponse(res);
  console.log('[fetchProgramProposals] raw response:', JSON.stringify(data, null, 2));
  return data.map((p) => ({
    id: p.child_id,   // ✅ actual ProjectProposal PK                                       // number — used as FK
    title: p.title,
    leader: p.program_leader ?? p.project_leader ?? p.created_by ?? `User #${p.user}`,
    created_at: p.created_at,
  }));
}

/** Fetch all Project Proposals (used when creating an Activity) */
export async function fetchProjectProposals(): Promise<ParentProposalOption[]> {
  const res = await authFetch(`${BASE_URL}/proposals-node/Project`);
  const data: any[] = await handleResponse(res);
  console.log('[fetchProjectProposals] raw response:', JSON.stringify(data, null, 2));
  return data.map((p) => ({
    id: p.child_id,   // ✅ actual ProjectProposal PK                                       // number — used as FK
    title: p.title,
    leader: p.project_leader ?? p.program_leader ?? p.created_by ?? `User #${p.user}`,
    created_at: p.created_at,
  }));
}

/** Fetch all Activity Proposals (utility / debug) */
export async function fetchActivityProposals(): Promise<any[]> {
  const res = await authFetch(`${BASE_URL}/proposals-node/Activity`);
  const data: any[] = await handleResponse(res);
  console.log('[fetchActivityProposals] raw response:', JSON.stringify(data, null, 2));
  return data;
}

// ─────────────────────────────────────────────
// DATA MAPPERS
// Converts CreateProposal.tsx local state → API payload shapes
// ─────────────────────────────────────────────

import type {
  ProfileData,
  ExpectedOutput6Ps,
  OrgStaffingItem,
  WorkplanRow,
  BudgetRows,
  ProgramBudgetRow,
  ActivityScheduleData,
} from '@/pages/implementor/CreateProposal'; // adjust path if needed

/** Split a newline- or comma-separated string into a trimmed string array. */
function toStringArray(value: string): string[] {
  if (!value?.trim()) return [];
  return value
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Convert workplan rows to month-based API shape. */
function mapWorkplanRows(rows: WorkplanRow[]): WorkplanMonth[] {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const result: WorkplanMonth[] = [];
  rows.forEach((row) => {
    if (!row.activity.trim() && !row.objective.trim()) return;
    // Collect which quarters are checked across all 3 years
    [1, 2, 3].forEach((yr) => {
      quarters.forEach((q) => {
        const key = `year${yr}_${q.toLowerCase()}` as keyof WorkplanRow;
        if (row[key]) {
          result.push({ month: `Year ${yr} ${q}`, activity: row.activity || row.objective });
        }
      });
    });
    // If no quarters checked but there is content, still include it
    if (result.length === 0 && (row.activity || row.objective)) {
      result.push({ month: '—', activity: row.activity || row.objective });
    }
  });
  return result;
}

/** Convert OrgStaffingItem[] → OrgStaffingApiItem[] */
function mapOrgStaffing(rows: OrgStaffingItem[]): OrgStaffingApiItem[] {
  return rows
    .filter((r) => r.designation.trim())
    .map((r) => ({ role: r.activity, name: r.designation }));
}

/** Convert BudgetRows → BudgetItem[] */
function mapBudgetRows(rows: BudgetRows): BudgetItem[] {
  return (['meals', 'transport', 'supplies'] as (keyof BudgetRows)[])
    .flatMap((cat) =>
      rows[cat]
        .filter((r) => r.item.trim())
        .map((r) => ({ item: r.item, amount: Number(r.amount) || 0 })),
    );
}

/** Convert ProgramBudgetRow[] → BudgetItem[] */
function mapProgramBudgetRows(rows: ProgramBudgetRow[]): BudgetItem[] {
  return rows
    .filter((r) => r.label.trim())
    .map((r) => ({ item: r.label, amount: Number(r.total) || 0 }));
}

/** Convert ExpectedOutput6Ps → string[] (non-empty values) */
function mapExpectedOutput(output: ExpectedOutput6Ps): string[] {
  return Object.values(output).filter(Boolean);
}

/** Convert tags/clusters/agendas from ProfileData booleans → string arrays */
function mapTags(profile: ProfileData): string[] {
  const tags: string[] = [];
  if (profile.tagging_general) tags.push('general');
  if (profile.tagging_env_climate) tags.push('environment-and-climate-change');
  if (profile.tagging_gad) tags.push('gender-and-development');
  if (profile.tagging_mango) tags.push('mango-related');
  return tags;
}

function mapClusters(profile: ProfileData): string[] {
  const clusters: string[] = [];
  if (profile.cluster_health_edu) clusters.push('Health, Education, and Social Sciences');
  if (profile.cluster_engineering) clusters.push('Engineering, Industry, Information Technology');
  if (profile.cluster_environment) clusters.push('Environment and Natural Resources');
  if (profile.cluster_tourism) clusters.push('Tourism, Hospitality, Entrepreneurship, Criminal Justice');
  if (profile.cluster_graduate) clusters.push('Graduate Studies');
  if (profile.cluster_fisheries) clusters.push('Fisheries');
  if (profile.cluster_agriculture) clusters.push('Agriculture, Forestry');
  return clusters;
}

function mapAgendas(profile: ProfileData): string[] {
  const agendas: string[] = [];
  if (profile.ext_agenda_business) agendas.push('Business Management and Livelihood Skills Development');
  if (profile.ext_agenda_governance) agendas.push('Accountability, Good Governance, and Peace and Order');
  if (profile.ext_agenda_youth) agendas.push('Youth and Adult Functional Literacy and Education');
  if (profile.ext_agenda_accessibility) agendas.push('Accessibility, Inclusivity, and Gender and Development');
  if (profile.ext_agenda_nutrition) agendas.push('Nutrition, Health, and Wellness');
  if (profile.ext_agenda_indigenous) agendas.push("Indigenous People's Rights and Cultural Heritage Preservation");
  if (profile.ext_agenda_human_capital) agendas.push('Human Capital Development');
  if (profile.ext_agenda_technology) agendas.push('Adoption and Commercialization of Appropriate Technologies');
  if (profile.ext_agenda_natural_resources) agendas.push('Natural Resources, Climate Change, and Disaster Risk Reduction Management');
  return agendas;
}

function mapSitesToStrings(profile: ProfileData): string[] {
  return profile.sites
    .filter((s) => s.barangay || s.municipality || s.province)
    .map((s) => [s.barangay, s.municipality, s.province, s.region, s.country].filter(Boolean).join(', '));
}

// ─────────────────────────────────────────────
// BUILDER FUNCTIONS
// ─────────────────────────────────────────────

export function buildProgramPayload(
  title: string,
  profile: ProfileData,
  rationale: string,
  significance: string,
  generalObjectives: string,
  specificObjectives: string,
  methodology: string,
  expectedOutput: ExpectedOutput6Ps,
  sustainabilityPlan: string,
  orgStaffing: OrgStaffingItem[],
  workplan: WorkplanRow[],
  programBudget: ProgramBudgetRow[],
): ProgramProposalPayload {
  return {
    title,
    program_title: profile.program_title,
    program_leader: profile.program_leader,
    projects_list: toStringArray(profile.project_title),
    implementing_agency: toStringArray(profile.implementing_agency),
    cooperating_agencies: toStringArray(profile.cooperating_agencies),
    extension_sites: mapSitesToStrings(profile),
    tags: mapTags(profile),
    clusters: mapClusters(profile),
    agendas: mapAgendas(profile),
    sdg_addressed: profile.sdg_addressed,
    mandated_academic_program: profile.college_mandated_program,
    rationale,
    significance,
    general_objectives: generalObjectives,
    specific_objectives: specificObjectives,
    methodology: [{ phase: 'Methodology', activities: toStringArray(methodology) }],
    expected_output_6ps: mapExpectedOutput(expectedOutput),
    sustainability_plan: sustainabilityPlan,
    org_and_staffing: mapOrgStaffing(orgStaffing),
    workplan: mapWorkplanRows(workplan),
    budget_requirements: mapProgramBudgetRows(programBudget),
  };
}

export function buildProjectPayload(
  title: string,
  parentId: number,
  profile: ProfileData,
  rationale: string,
  significance: string,
  generalObjectives: string,
  specificObjectives: string,
  methodology: string,
  expectedOutput: ExpectedOutput6Ps,
  sustainabilityPlan: string,
  orgStaffing: OrgStaffingItem[],
  workplan: WorkplanRow[],
  budgetRows: BudgetRows,
): ProjectProposalPayload {
  return {
    title,
    program_proposal_id: Number(parentId),
    project_title: profile.project_title,
    project_leader: profile.project_leader,
    members: toStringArray(profile.members),
    duration_months: Number(profile.project_duration_months) || 0,
    start_date: profile.project_start_date,
    end_date: profile.project_end_date,
    implementing_agency: toStringArray(profile.implementing_agency),
    cooperating_agencies: toStringArray(profile.cooperating_agencies),
    extension_sites: mapSitesToStrings(profile),
    tags: mapTags(profile),
    clusters: mapClusters(profile),
    agendas: mapAgendas(profile),
    sdg_addressed: profile.sdg_addressed,
    mandated_academic_program: profile.college_mandated_program,
    rationale,
    significance,
    general_objectives: generalObjectives,
    specific_objectives: specificObjectives,
    methodology: [{ phase: 'Methodology', activities: toStringArray(methodology) }],
    expected_output_6ps: mapExpectedOutput(expectedOutput),
    sustainability_plan: sustainabilityPlan,
    org_and_staffing: mapOrgStaffing(orgStaffing),
    workplan: mapWorkplanRows(workplan),
    budget_requirements: mapBudgetRows(budgetRows),
  };
}

export function buildActivityPayload(
  title: string,
  parentId: number,
  profile: ProfileData,
  rationale: string,
  significance: string,
  generalObjectives: string,
  methodology: string,
  expectedOutput: ExpectedOutput6Ps,
  sustainabilityPlan: string,
  orgStaffing: OrgStaffingItem[],
  activitySchedule: ActivityScheduleData,
  budgetRows: BudgetRows,
): ActivityProposalPayload {
  return {
    title,
    project_proposal_id: Number(parentId),
    activity_title: profile.activity_title,
    project_leader: profile.project_leader,
    members: toStringArray(profile.members),
    activity_duration_hours: Number(profile.activity_duration) || 8,
    activity_date: profile.activity_date,
    implementing_agency: toStringArray(profile.implementing_agency),
    cooperating_agencies: toStringArray(profile.cooperating_agencies),
    extension_sites: mapSitesToStrings(profile),
    tags: mapTags(profile),
    clusters: mapClusters(profile),
    agendas: mapAgendas(profile),
    sdg_addressed: profile.sdg_addressed,
    mandated_academic_program: profile.college_mandated_program,
    rationale,
    significance,
    objectives_of_activity: generalObjectives,
    methodology,
    expected_output_6ps: mapExpectedOutput(expectedOutput),
    sustainability_plan: sustainabilityPlan,
    org_and_staffing: mapOrgStaffing(orgStaffing),
    plan_of_activity: activitySchedule.schedule
      .filter((s) => s.activity.trim())
      .map((s) => ({ time: s.time, activity: `${s.activity}${s.speaker ? ` — ${s.speaker}` : ''}` })),
    budget_requirements: mapBudgetRows(budgetRows),
  };
}