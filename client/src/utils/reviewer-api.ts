// ─────────────────────────────────────────────
// reviewer-api.ts
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