// // ─────────────────────────────────────────────
// // implementor-api.ts
// // ─────────────────────────────────────────────

import { authFetch, BASE_URL, handleResponse } from "./api-client";

// const BASE_URL = 'http://127.0.0.1:8000/api';

// // ─────────────────────────────────────────────
// // AUTH HELPERS
// // ─────────────────────────────────────────────

// function getAccessToken(): string | null {
//   return localStorage.getItem('access_token');
// }

// function getRefreshToken(): string | null {
//   return localStorage.getItem('refresh_token');
// }

// function storeAccessToken(token: string): void {
//   localStorage.setItem('access_token', token);
// }

// function forceLogout(): void {
//   localStorage.removeItem('access_token');
//   localStorage.removeItem('refresh_token');
//   localStorage.removeItem('user');
//   window.location.href = '/';
// }

// async function refreshAccessToken(): Promise<string | null> {
//   const refresh = getRefreshToken();
//   if (!refresh) return null;
//   try {
//     const res = await fetch(`${BASE_URL}/token/refresh/`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ refresh }),
//     });
//     if (!res.ok) return null;
//     const data: { access: string } = await res.json();
//     storeAccessToken(data.access);
//     return data.access;
//   } catch {
//     return null;
//   }
// }

// function getAuthHeaders(): HeadersInit {
//   const token = getAccessToken();
//   return {
//     'Content-Type': 'application/json',
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// }

// async function handleResponse<T>(res: Response): Promise<T> {
//   if (!res.ok) {
//     let errorBody: any = {};
//     let message = `Request failed with status ${res.status}`;
//     try {
//       const text = await res.text();
//       try {
//         errorBody = JSON.parse(text);
//         message = errorBody?.detail ?? errorBody?.message ?? JSON.stringify(errorBody) ?? message;
//       } catch {
//         // Not JSON — likely a Django HTML traceback
//         message = text.slice(0, 300) || message;
//         errorBody = { raw: text };
//       }
//     } catch { /* ignore read errors */ }
//     if (import.meta.env.DEV) {
//       console.error(`[implementor-api] ${res.status} ${res.url}\n`, 'Error body:', JSON.stringify(errorBody, null, 2));
//     }
//     throw new Error(message);
//   }
//   return res.json() as Promise<T>;
// }

// async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
//   const makeRequest = () =>
//     fetch(url, { ...options, headers: { ...getAuthHeaders(), ...(options.headers ?? {}) } });

//   let res = await makeRequest();

//   if (res.status === 401) {
//     const newToken = await refreshAccessToken();
//     if (!newToken) { forceLogout(); throw new Error('Session expired. Please log in again.'); }
//     res = await makeRequest();
//     if (res.status === 401) { forceLogout(); throw new Error('Session expired. Please log in again.'); }
//   }

//   return res;
// }

// ─────────────────────────────────────────────
// FORM DATA TYPES
// ─────────────────────────────────────────────
// ─── Common Types ─────────────────────────────────────

export interface Review {
  reviewer_name: string;
  comment: string;
}

// ─── Program Root ─────────────────────────────────────

export interface ProgramProposal {
  program_title: string;
  profile: ProfileSection;
  agencies: AgenciesSection;
  tagging_clustering_extension: TaggingClusteringExtension;
  rationale: TextSection;
  significance: TextSection;
  objectives: ObjectivesSection;
  methodology: MethodologySection;
  expected_output_6ps: ExpectedOutput6PS;
  sustainability_plan: TextSection;
  organization_and_staffing: OrganizationStaffingSection;
  work_plan: WorkPlanSection;
  budget_requirements: BudgetRequirementsSection;
}

// ─── Profile Section ───────────────────────────────────

export interface ProfileSection {
  program_title: string;
  program_leader: string;
  project_list: Project[];
  reviews: Review[];
}

export interface Project {
  project_title: string;
  project_leader: string;
  project_member: string[];
  project_duration: number;
  project_end_date: string;
  project_start_date: string;
}

// ─── Agencies Section ──────────────────────────────────

export interface AgenciesSection {
  implementing_agency: string[];
  cooperating_agency: string[];
  reviews: Review[];
}

// ─── Tagging / Clustering ──────────────────────────────

export interface TaggingClusteringExtension {
  tags: string[];
  clusters: string[];
  agendas: string[];
  reviews: Review[];
}

// ─── Generic Text Content Section ──────────────────────

export interface TextSection {
  content: string;
  reviews: Review[];
}

// ─── Objectives Section ────────────────────────────────

export interface ObjectivesSection {
  general: string;
  reviews_general: Review[];
  specific: string;
  reviews_specific: Review[];
}

// ─── Methodology Section ───────────────────────────────

export interface MethodologySection {
  content: MethodologyPhase[];
  reviews: Review[];
}

export interface MethodologyPhase {
  phase: string;
  activities: string[];
}

// ─── Expected Outputs (6Ps) ────────────────────────────

export interface ExpectedOutput6PS {
  content: string[];
  reviews: Review[];
}

// ─── Organization and Staffing ─────────────────────────

export interface OrganizationStaffingSection {
  content: StaffRole[];
  reviews: Review[];
}

export interface StaffRole {
  name: string;
  role: string;
}

// ─── Work Plan ─────────────────────────────────────────

export interface WorkPlanSection {
  content: WorkPlanItem[];
  reviews: Review[];
}

export interface WorkPlanItem {
  month: string;
  activity: string;
}

// ─── Budget Requirements ───────────────────────────────

export interface BudgetRequirementsSection {
  content: BudgetItem[];
  reviews: Review[];
}

export interface BudgetItem {
  item: string;
  amount: number;
}



// ─────────────────────────────────────────────
// MAPPING UTILITIES
// ─────────────────────────────────────────────

export function toStringArray(value: string): string[] {
  if (!value?.trim()) return [];
  return value.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}


// ─────────────────────────────────────────────
// API FUNCTIONS
// ─────────────────────────────────────────────



// ─────────────────────────────────────────────
// ADDITIONAL FETCH HELPERS
// ─────────────────────────────────────────────

export type ProposalNodeType = 'Program' | 'Project' | 'Activity';

export async function fetchProgramHistoryData(proposal_id: number, history_id: number, version: number): Promise<any> {
    const res = await authFetch(`${BASE_URL}/proposal-review/proposal-history/${proposal_id}/${history_id}/${version}/program/`);
    return handleResponse<any>(res);
}

export async function fetchProjectHistoryData(proposal_id: number, history_id: number, version: number): Promise<any> {
    const res = await authFetch(`${BASE_URL}/proposal-review/proposal-history/${proposal_id}/${history_id}/${version}/project/`);
    return handleResponse<any>(res);
}

export async function fetchActivityHistoryData(proposal_id: number, history_id: number, version: number): Promise<any> {
    const res = await authFetch(`${BASE_URL}/proposal-review/proposal-history/${proposal_id}/${history_id}/${version}/activity/`);
    return handleResponse<any>(res);
}