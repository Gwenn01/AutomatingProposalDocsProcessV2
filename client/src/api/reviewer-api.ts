import type { ProposalHistory, ProposalReviewPayload, ProposalReviewResponse, ReviewerNotification, ReviewerProjectList, ReviewerProposal } from "@/types/reviewer-types";
import { authFetch, BASE_URL, handleResponse } from "./api-client";
import type { ApiActivity } from "@/types/shared-types";

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

export async function fetchReviewerNotifications(): Promise<ReviewerNotification[]> {
  const res = await authFetch(`${BASE_URL}/reviewer-notifications/`);
  return handleResponse<ReviewerNotification[]>(res);
}

export async function markNotificationRead(id: string): Promise<void> {
  const res = await authFetch(`${BASE_URL}/reviewer-notifications/${id}/read/`, {
    method: 'PATCH',
  });
  await handleResponse<any>(res);
}

export async function fetchProposalCoverPage(proposalId: string): Promise<any> {
  const res = await authFetch(`${BASE_URL}/proposals/${proposalId}/cover/`);
  return handleResponse<any>(res);
}

export async function fetchProposalContent(proposalId: string): Promise<any> {
  const res = await authFetch(`${BASE_URL}/proposals/${proposalId}/content/`);
  return handleResponse<any>(res);
}

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

export async function fetchProjectProposalDetail(projectId: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/project-proposal/${projectId}/`);
  return handleResponse<any>(res);
}

export async function fetchActivityProposalDetail(activityId: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/activity-proposal/${activityId}/`);
  return handleResponse<any>(res);
}

export async function fetchProjectList(childId: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/program-proposal/${childId}/projects/`);
  return handleResponse<any>(res);
}

export async function fetchActivityList(projectId: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/project-proposal/${projectId}/activities/`);
  return handleResponse<any>(res);
}

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


export async function fetchExistingReview(
  proposalNodeId: number,
): Promise<ProposalReviewResponse | null> {
  try {
    const res = await authFetch(`${BASE_URL}/proposal-review/${proposalNodeId}/`);
    if (res.status === 404) return null;
    if (res.status === 500) return null;
    return await handleResponse<ProposalReviewResponse>(res);
  } catch {
    return null;
  }
}

export async function approveProposal( proposalNode: number ): Promise<any> {
    const res = await authFetch(`${BASE_URL}/reviewer-approve/${proposalNode}/`, { method: 'PUT'});
    return handleResponse<any>(res);
}