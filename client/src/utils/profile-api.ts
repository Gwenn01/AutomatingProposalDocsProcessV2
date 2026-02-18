import { getAccessToken, clearAuthData } from "./auth-api";

const API_URL = "http://127.0.0.1:8000/api";

export interface Profile {
  role: string;
  name: string;
  campus: string;
  department: string;
  position: string;
  created_at: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  profile: Profile;
}

export interface UpdateProfilePayload {
  username: string;
  email: string;
  role: string;
  name: string;
  campus: string;
  department: string;
  position: string;
}

export const fetchProfile = async (): Promise<UserData> => {
    const token= getAccessToken();
    if (!token) throw new Error("No access token");

    const res = await fetch(`${API_URL}/users/profile/me/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });

    if (res.status === 401) {
        clearAuthData();
        throw new Error("Unauthorized: Session expired.");
    }

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.detail || "Failed to fetch profile");
    }

    const data = await res.json();
    return data;
}

export const updateProfile = async (formData: UpdateProfilePayload): Promise<UpdateProfilePayload> => {
    const token = getAccessToken();
    if (!token) throw new Error("No access token");

    const res = await fetch(`${API_URL}/users/profile/update/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
    });

    if (res.status === 401) {
        clearAuthData();
        throw new Error("Unauthorized: Session expired.");
    } 

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.detail || "Failed to update profile");
    }

    const data = await res.json();
    return data;
};