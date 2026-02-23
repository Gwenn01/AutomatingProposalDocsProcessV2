import { type ProposalStatus } from "./statusStyles";
export interface ApiUser {
  id: number;
  username: string;
  email: string;
  profile: {
    role: string;
    name: string;
    campus: string;
    department: string;
    position: string;
    created_at: string;
  };
}

export interface UsersOverview {
  total_user: number;
  implementor: number;
  reviewer: number;
  admin: number;
}

export interface ProposalsOverview {
  proposal: {
    total_proposals: number;
    total_program: number;
    total_project: number;
    total_activity: number;
  };
  status: {
    total_under_review: number;
    total_for_review: number;
    total_for_revision: number;
    total_for_approval: number;
    total_approved: number;
    total_rejected: number;
  }
}

export interface CreateAdminUserPayload {
  username: string;
  email: string;
  password: string;
  role: "admin" | "reviewer" | "implementor";
  name: string;
  campus: string;
  department: string;
  position: string;
}

export interface CreateAdminUserResponse {
  username: string;
  email: string;
}

export interface UpdateAdminUserPayload {
  name?: string;
  campus?: string;
  department?: string;
  position?: string;
  role?: "admin" | "reviewer" | "implementor";
}

export interface ProgramProposal {
  id: number;
  child_id: number;
  reviewer_count: number;
  title: string;
  file_path: string | null;
  proposal_type: "Program";
  status: ProposalStatus;
  version_no: number;
  created_at: string;
  user: number;
}

export interface ReviewerAssignment {
  id: number;
  proposal: number;
  reviewer: ApiUser;
  assigned_by: number;
  is_review: boolean;
  assigned_at: string;
}

export interface AssignReviewerPayload {
  proposal: number;
  reviewer: number;
}

export interface CreateCoverPagePayload {
  proposal: number;
  cover_page_body: string;
  submission_date: string; 
}

export interface CreateCoverPageResponse {
  message: string;
}

const API_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found. Please login.");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
};

// Get Users Overview
export const getUsersOverview = async (): Promise<UsersOverview> => {
  const response = await fetch(`${API_URL}/users/admin/overview-users/`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch users overview");
  }

  return response.json();
}

// Get Proposals Overview
export const getProposalsOverview = async (): Promise<ProposalsOverview> => {
  const response = await fetch(`${API_URL}/admin/overview-proposals/`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch proposals overview");
  }

  return response.json()
}

// Get All Proposals
export const getProposals = async (): Promise<ProgramProposal[]> => {
  const response = await fetch(`${API_URL}/admin/proposals-node/Program/`, {
    method: "GET",
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch program proposals")
  }

  return response.json();
}

// Get All Reviewers
export const getAllReviewers = async (): Promise<ApiUser[]> => {
  const response = await fetch(`${API_URL}/reviewers/`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch reviewers");
  }

  return response.json()
}

// Get All Reviewer Assignments
export const getAllReviewerAssignments = async (): Promise<ReviewerAssignment[]> => {
  const response = await fetch(`${API_URL}/assign-reviewer/`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch reviewer assignments");
  }

  return response.json();
}

// Get Assigned Reviewers by Proposal ID
export const getAssignedReviewers = async (proposalId: number): Promise<ReviewerAssignment[]> => {
  const response = await fetch(`${API_URL}/assigned-reviewer/${proposalId}/`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch assigned reviewers");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

// Assign Reviewer
export const assignReviewer = async (payload: AssignReviewerPayload): Promise<ReviewerAssignment> => {
  const response = await fetch(`${API_URL}/assign-reviewer/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });

  const resJson = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to assign reviewer");
  }

  return resJson.data as ReviewerAssignment;
}

// Unassign Revieweer
export const unassignReviewer = async (proposalId: number ): Promise<void> => {
  const response = await fetch(`${API_URL}/unassign-reviewer/${proposalId}/`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to unassign reviewer");
  }
}

// Create Cover Page
export const createCoverPage = async (payload: CreateCoverPagePayload): Promise<CreateCoverPageResponse> => {
  const response = await fetch(`${API_URL}/cover-pages/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })

  const resJson = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(resJson.detail || "Failed to create cover page");
  }

  return resJson as CreateCoverPageResponse;
}

// Get All Accounts (Manage Account)
export const getAllAccounts = async (): Promise<ApiUser[]> => {
  const response = await fetch(`${API_URL}/users/admin/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

//Admin Create Account
export const createAdminAccount = async (payload: CreateAdminUserPayload): Promise<CreateAdminUserResponse> => {
    const response = await fetch(`${API_URL}/users/admin/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create account");
    }

    return response.json();
};

//Admin Update User Profiles
export const updateAdminAccount = async (userId: number,  payload: UpdateAdminUserPayload): Promise<ApiUser> => {
    const response = await fetch(`${API_URL}/users/admin/${userId}/`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to update user");
    }
    return response.json();
}

// Admin Delete Account
export const deleteAdminAccount = async (userId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/users/admin/${userId}/`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to delete account");
  }
}