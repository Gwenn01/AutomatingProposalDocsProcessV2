// ─────────────────────────────────────────────
// reviewer-api.ts
// ─────────────────────────────────────────────

import { authFetch, BASE_URL, handleResponse } from "./api-client";


// ─────────────────────────────────────────────
// AUTH HELPERS
// ─────────────────────────────────────────────
export type ApiProjectListResponse = {
  id: number;
  program_title: string;
  //projects: ApiProject[];
  projects: ReviewerProjectList[];
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

export type ReviewerProjectList = {
  assignment: number;
  proposal: number;
  child_id: number;
  implementor: number;
  title: string;
  type: string;
  status: string;
  reviewer_count: number;
  version_no: number;
  is_reviewed: boolean;
  assigned_at: string | null;
  child_title: string;
  activities?: ApiActivity[];
}

export type ApiActivity = {
  id: number;
  activity_title: string;
  project_leader: string;
  members: string[];
  activity_duration_hours: number;
  activity_date: string | null;
};


// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface ReviewerProposal {
  assignment: number;
  proposal: number;
  child_id: number;
  implementor: number;
  title: string;
  type: 'Program' | 'Project' | 'Activity';
  status: string;
  reviewer_count: number;
  version_no: number;
  is_reviewed: boolean;
  assigned_at: string;
  child_title: string;
  implementor_name: string;
}

export interface ReviewerNotification {
  id: string;
  is_read: boolean;
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
// PROPOSAL REVIEW TYPES
// ─────────────────────────────────────────────

export type ProposalReviewDecision = 'needs_revision' | 'approved';
export type ProposalReviewType = 'program' | 'project' | 'activity';

export interface ProposalReviewBasePayload {
  proposal_reviewer?: number;
  proposal_node: number;
  decision: ProposalReviewDecision;
  review_round: string | number;   // API expects a string e.g. "1"
  proposal_type: ProposalReviewType;
}

export interface ProgramReviewPayload extends ProposalReviewBasePayload {
  proposal_type: 'program';
  profile_feedback?: string;
  implementing_agency_feedback?: string;
  extension_site_feedback?: string;
  tagging_cluster_extension_feedback?: string;
  sdg_academic_program_feedback?: string;
  rationale_feedback?: string;
  significance_feedback?: string;
  objectives_feedback?: string;
  general_objectives_feedback?: string;
  specific_objectives_feedback?: string;
  methodology_feedback?: string;
  expected_output_feedback?: string;
  sustainability_plan_feedback?: string;
  org_staffing_feedback?: string;
  work_plan_feedback?: string;
  budget_requirements_feedback?: string;
}

export interface ProjectReviewPayload extends ProposalReviewBasePayload {
  proposal_type: 'project';
  profile_feedback?: string;
  implementing_agency_feedback?: string;
  extension_site_feedback?: string;
  tagging_cluster_extension_feedback?: string;
  sdg_academic_program_feedback?: string;
  rationale_feedback?: string;
  significance_feedback?: string;
  objectives_feedback?: string;
  general_objectives_feedback?: string;
  specific_objectives_feedback?: string;
  methodology_feedback?: string;
  expected_output_feedback?: string;
  sustainability_plan_feedback?: string;
  org_staffing_feedback?: string;
  work_plan_feedback?: string;
  budget_requirements_feedback?: string;
}

export interface ActivityReviewPayload extends ProposalReviewBasePayload {
  proposal_type: 'activity';
  profile_feedback?: string;
  implementing_agency_feedback?: string;
  extension_site_feedback?: string;
  tagging_cluster_extension_feedback?: string;
  sdg_academic_program_feedback?: string;
  rationale_feedback?: string;
  objectives_feedback?: string;
  methodology_feedback?: string;
  expected_output_feedback?: string;
  work_plan_feedback?: string;
  budget_requirements_feedback?: string;
}

export type ProposalReviewPayload =
  | ProgramReviewPayload
  | ProjectReviewPayload
  | ActivityReviewPayload;

export interface ProposalReviewResponse {
  id?: number;
  proposal_node?: number;
  decision?: ProposalReviewDecision;
  review_round?: number;
  proposal_type?: ProposalReviewType;
  created_at?: string;
  [key: string]: any; // allow additional fields from the API
}

// ─────────────────────────────────────────────
// API FUNCTIONS
// ─────────────────────────────────────────────

/**
 * GET /api/reviewer-proposals/
 * Returns all proposals assigned to the current reviewer.
 */
export async function fetchReviewerProposals(): Promise<ReviewerProposal[]> {
  const res = await authFetch(`${BASE_URL}/reviewer-proposals/program`);
  const data = await handleResponse<ReviewerProposal[]>(res);
  if (import.meta.env.DEV) {
    console.log('[fetchReviewerProposals]', JSON.stringify(data, null, 2));
  }
  return data;
}

export async function fetchReviewerProjectProposal(child_id: number): Promise<ReviewerProjectList[]> {
  const res = await authFetch(`${BASE_URL}/reviewer-proposals/project/${child_id}`);
  const data = await handleResponse<ReviewerProposal[]>(res);
  if (import.meta.env.DEV){
    console.log('[fetchReviewerProjectProposal', JSON.stringify(data, null,2))
  }
  return data;
}
export async function fetchReviewerActivityProposal(child_id: number): Promise<ApiActivity[]> {
  const res = await authFetch(`${BASE_URL}/reviewer-proposals/activity/${child_id}`);
  const data = await handleResponse<ApiActivity[]>(res);
  if (import.meta.env.DEV) {
    console.log('[fetchReviewerActivityProposal]', JSON.stringify(data, null, 2));
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

// ─── Proposal Detail Fetchers ────────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// PROPOSAL REVIEW — POST /api/proposal-review/
// ─────────────────────────────────────────────

/**
 * POST /api/proposal-review/
 *
 * Submits a review (needs_revision or approved) for a Program, Project,
 * or Activity proposal node.
 *
 * @param payload  - Built by `buildPayload()` in ReviewerCommentModal
 * @returns        - The created review record from the API
 */
export async function submitProposalReview(
  payload: ProposalReviewPayload,
): Promise<ProposalReviewResponse> {
  if (import.meta.env.DEV) {
    console.log('[submitProposalReview] POST /api/proposal-review/', JSON.stringify(payload, null, 2));
  }

  const res = await authFetch(`${BASE_URL}/proposal-review/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const data = await handleResponse<ProposalReviewResponse>(res);

  if (import.meta.env.DEV) {
    console.log('[submitProposalReview] Response:', JSON.stringify(data, null, 2));
  }

  return data;
}

/**
 * PATCH /api/proposal-review-update/{proposal_node}/{proposal_reviewer}/
 * Used for all subsequent reviews after the first submission.
 */
export async function updateProposalReview(
  proposalNode: number,
  proposalReviewer: number,
  payload: ProposalReviewPayload,
): Promise<ProposalReviewResponse> {
  if (import.meta.env.DEV) {
    console.log(
      `[updateProposalReview] PUT /api/proposal-review-update/${proposalNode}/${proposalReviewer}/`,
      JSON.stringify(payload, null, 2),
    );
  }

  const res = await authFetch(
    `${BASE_URL}/proposal-review-update/${proposalNode}/${proposalReviewer}/`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  );

  const data = await handleResponse<ProposalReviewResponse>(res);

  if (import.meta.env.DEV) {
    console.log('[updateProposalReview] Response:', JSON.stringify(data, null, 2));
  }

  return data;
}

