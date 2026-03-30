import React, { createContext, useContext, useState, useEffect } from "react";
import { clearAuthData } from "@/api/auth-api";

// ================= TYPES =================

interface AuthUser {
  user_id: number;
  email: string;
  username: string;
  fullname: string;
  role: "admin" | "implementor" | "reviewer";
  campus: string;
  department: string;
  position: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
}

// ================= CONSTANTS =================

// Global keys (not tied to a specific user)
const GLOBAL_KEYS = [
  "user",
  "access_token",
  "refresh_token",
  // ReviewProposal UI state (not user-scoped)
  "rp_viewMode",
  "rp_showViewerModal",
  "rp_showReviewerModal",
  "rp_showReviewerList",
  "rp_selectedDocId",
  "rp_selectedProposalId",
  // Legacy flat keys (kept for safety in case old keys still exist)
  "activeMenu",
  "activeDraftId",
] as const;

// Per-user key prefixes (scoped to user_id in Home.tsx)
// Pattern: `activeMenu_${userId}` and `activeDraftId_${userId}`
const USER_KEY_PREFIXES = ["activeMenu_", "activeDraftId_"] as const;

/**
 * Clears all localStorage keys belonging to the given user,
 * plus all global app keys.
 */
function clearAllPersistedState(userId?: number | string) {
  // 1. Remove global keys
  GLOBAL_KEYS.forEach((key) => localStorage.removeItem(key));

  // 2. Remove per-user keys for the logged-out user
  if (userId !== undefined) {
    USER_KEY_PREFIXES.forEach((prefix) => {
      localStorage.removeItem(`${prefix}${userId}`);
    });
  }
}

// ================= CONTEXT =================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ================= PROVIDER =================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]               = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Rehydrate from localStorage on first load
  useEffect(() => {
    const storedUser    = localStorage.getItem("user");
    const storedAccess  = localStorage.getItem("access_token");
    const storedRefresh = localStorage.getItem("refresh_token");

    if (storedUser && storedAccess && storedRefresh) {
      try {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
      } catch {
        // Corrupted data — wipe everything
        clearAllPersistedState();
        clearAuthData();
      }
    }
  }, []);

  const login = (user: AuthUser, accessToken: string, refreshToken: string) => {
    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  };

  const logout = () => {
    const currentUserId = user?.user_id;

    // 1. Clear React state
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    // 2. Wipe all persisted keys (global + this user's scoped keys)
    clearAllPersistedState(currentUserId);

    // 3. Any additional API-level cleanup (token blacklisting, cookies, etc.)
    clearAuthData();
  };

  const updateTokens = (newAccess: string, newRefresh: string) => {
    setAccessToken(newAccess);
    setRefreshToken(newRefresh);
    localStorage.setItem("access_token", newAccess);
    localStorage.setItem("refresh_token", newRefresh);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken && !!user,
        login,
        logout,
        updateTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ================= HOOK =================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return context;
};

export default AuthContext;