// ─────────────────────────────────────────────
// reviewer-api.ts
// ─────────────────────────────────────────────

const BASE_URL = 'http://127.0.0.1:8000/api';

// ─────────────────────────────────────────────
// AUTH HELPERS
// ─────────────────────────────────────────────
// Add these type exports to reviewer-api.ts
export type ApiProjectListResponse = {
  id: number;
  program_title: string;
  projects: ApiProject[];
};

export type ApiActivityListResponse = {
  id: number;
  project_title: string;
  activities: ApiActivity[];
};

export type ApiProject = {
  id: number;
  project_title: string;
  project_leader: string;
  members: string[];
  duration_months: number;
  start_date: string | null;
  end_date: string | null;
};

export type ApiActivity = {
  id: number;
  activity_title: string;
  project_leader: string;
  members: string[];
  activity_duration_hours: number;
  activity_date: string | null;
};

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
        message =
          errorBody?.detail ??
          errorBody?.message ??
          JSON.stringify(errorBody) ??
          message;
      } catch {
        message = text.slice(0, 300) || message;
        errorBody = { raw: text };
      }
    } catch {
      /* ignore read errors */
    }
    if (import.meta.env.DEV) {
      console.error(
        `[reviewer-api] ${res.status} ${res.url}\n`,
        'Error body:',
        JSON.stringify(errorBody, null, 2),
      );
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const makeRequest = () =>
    fetch(url, {
      ...options,
      headers: { ...getAuthHeaders(), ...(options.headers ?? {}) },
    });

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
// TYPES
// ─────────────────────────────────────────────

export interface ReviewerProposal {
  assignment: number;
  proposal: number;
  program: number;
  implementor: number;
  title: string;
  type: 'Program' | 'Project' | 'Activity';
  status: string;
  reviewer_count: number;
  version_no: number;
  is_reviewed: boolean;
  assigned_at: string;
}

export interface ReviewerNotification {
  id: string;
  is_read: number;
  message: string;
  created_at: string;
}

export interface ProposalHistory {
  history_id: string;
  proposal_id: string;
  status: string;
  version_no: number;
  created_at: string;
}

// ─────────────────────────────────────────────
// API FUNCTIONS
// ─────────────────────────────────────────────

/**
 * GET /api/reviewer-proposals/
 * Returns all proposals assigned to the current reviewer.
 */
export async function fetchReviewerProposals(): Promise<ReviewerProposal[]> {
  const res = await authFetch(`${BASE_URL}/reviewer-proposals/`);
  const data = await handleResponse<ReviewerProposal[]>(res);
  if (import.meta.env.DEV) {
    console.log('[fetchReviewerProposals]', JSON.stringify(data, null, 2));
  }
  return data;
}

/**
 * GET /api/reviewer-notifications/
 * Returns notifications for the current reviewer.
 */
export async function fetchReviewerNotifications(): Promise<ReviewerNotification[]> {
  const res = await authFetch(`${BASE_URL}/reviewer-notifications/`);
  return handleResponse<ReviewerNotification[]>(res);
}

/**
 * PATCH /api/reviewer-notifications/{id}/read/
 * Marks a notification as read.
 */
export async function markNotificationRead(id: string): Promise<void> {
  const res = await authFetch(`${BASE_URL}/reviewer-notifications/${id}/read/`, {
    method: 'PATCH',
  });
  await handleResponse<any>(res);
}

/**
 * GET /api/proposals/{proposalId}/cover/
 * Returns the cover page data for a proposal.
 */
export async function fetchProposalCoverPage(proposalId: string): Promise<any> {
  const res = await authFetch(`${BASE_URL}/proposals/${proposalId}/cover/`);
  return handleResponse<any>(res);
}

/**
 * GET /api/proposals/{proposalId}/content/
 * Returns the full content for a proposal.
 */
export async function fetchProposalContent(proposalId: string): Promise<any> {
  const res = await authFetch(`${BASE_URL}/proposals/${proposalId}/content/`);
  return handleResponse<any>(res);
}

/**
 * GET /api/proposals/{proposalId}/history/
 * Returns the version history for a proposal.
 */
export async function fetchProposalHistory(proposalId: string): Promise<ProposalHistory[]> {
  const res = await authFetch(`${BASE_URL}/proposals/${proposalId}/history/`);
  return handleResponse<ProposalHistory[]>(res);
}

export async function fetchProgramProposalDetail(childId: number | string): Promise<any> {
  const res = await authFetch(`${BASE_URL}/program-proposal/${childId}/`);
  return handleResponse<any>(res);
}

export async function fetchProposalNodeByChildId(childId: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/proposals-node/Program`);
  const list: any[] = await handleResponse<any[]>(res);
  return list.find((p) => p.child_id === childId) ?? null;
}

// ─── Proposal Detail Fetchers (mirrored from implementor-api) ───────────────

/** GET /api/project-proposal/{projectId}/ */
export async function fetchProjectProposalDetail(projectId: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/project-proposal/${projectId}/`);
  return handleResponse<any>(res);
}

/** GET /api/activity-proposal/{activityId}/ */
export async function fetchActivityProposalDetail(activityId: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/activity-proposal/${activityId}/`);
  return handleResponse<any>(res);
}

/** GET /api/program-proposal/{childId}/projects/ */
export async function fetchProjectList(childId: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/program-proposal/${childId}/projects/`);
  return handleResponse<any>(res);
}

/** GET /api/project-proposal/{projectId}/activities/ */
export async function fetchActivityList(projectId: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/project-proposal/${projectId}/activities/`);
  return handleResponse<any>(res);
}