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
  username: string;
  email: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  name: string;
  campus: string;
  department: string;
  position: string;
}

interface RegisterResponse {
  message: string;
  user_id: number;
  username: string;
  email: string;
}

interface ProfileData {
  role: "admin" | "implementor" | "reviewer";
  name: string;
  campus: string;
  department: string;
  position: string;
  created_at: string;
}

interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  profile: ProfileData;
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
 * Register a new user
 * @param userData - User registration data
 * @returns Promise with registration response
 */
export const registerUser = async (
  userData: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle validation errors
      if (errorData.email) {
        throw {
          message: Array.isArray(errorData.email) 
            ? errorData.email[0] 
            : "Email is already registered",
          status: response.status,
        } as ApiError;
      }
      
      if (errorData.username) {
        throw {
          message: Array.isArray(errorData.username) 
            ? errorData.username[0] 
            : "Username is already taken",
          status: response.status,
        } as ApiError;
      }
      
      throw {
        message: errorData.detail || errorData.message || "Registration failed",
        status: response.status,
      } as ApiError;
    }

    const data: RegisterResponse = await response.json();
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
export const getUserProfile = async (userId: number): Promise<UserProfileResponse> => {
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
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.detail || "Failed to fetch user profile",
        status: response.status,
      } as ApiError;
    }

    const data: UserProfileResponse = await response.json();
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