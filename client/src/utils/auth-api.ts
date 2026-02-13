// ================= API BASE URL =================
const API_BASE_URL = "http://127.0.0.1:8000/api";

// ================= TYPE DEFINITIONS =================

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  refresh: string;
  access: string;
  user_id: number;
  email: string;
}

interface UserProfile {
  user_id: number;
  email: string;
  fullname: string;
  role: "admin" | "implementor" | "reviewer";
  campus: string;
  department: string;
  position: string;
}

interface ApiError {
  message: string;
  status?: number;
}

// ================= API FUNCTIONS =================

/**
 * Login user and get JWT tokens + full user profile
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise with tokens and complete user data
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      } as LoginRequest),
    });

    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.detail || errorData.message || "Invalid email or password",
        status: response.status,
      } as ApiError;
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    // Network errors or parsing errors
    if (error instanceof TypeError) {
      throw {
        message: "Network error. Please check your connection.",
        status: 0,
      } as ApiError;
    }
    // Re-throw API errors
    throw error;
  }
};

/**
 * Store authentication tokens in localStorage
 * @param accessToken - JWT access token
 * @param refreshToken - JWT refresh token
 */
export const storeTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
};

/**
 * Get stored access token
 * @returns Access token or null
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem("access_token");
};

/**
 * Get stored refresh token
 * @returns Refresh token or null
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh_token");
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

/**
 * Check if user is authenticated
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

/**
 * Get user profile data
 * @param userId - User ID
 * @returns Promise with user profile data
 */
export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const token = getAccessToken();
  
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw {
        message: "Failed to fetch user profile",
        status: response.status,
      } as ApiError;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw {
        message: "Network error. Please check your connection.",
        status: 0,
      } as ApiError;
    }
    throw error;
  }
};