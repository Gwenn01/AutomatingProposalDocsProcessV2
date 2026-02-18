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

const API_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found. Please login.");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
};

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
    const response = await fetch(`${API_URL}/api/users/admin/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to update user");
    }
    return response.json();
}