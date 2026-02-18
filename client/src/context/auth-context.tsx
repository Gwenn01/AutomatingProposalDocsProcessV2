import React, { createContext, useContext, useState, useEffect } from "react";
import { clearAuthData } from "@/utils/auth-api";

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

// ================= CONTEXT =================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ================= PROVIDER =================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Rehydrate from localStorage on first load (optional: remove if you want pure in-memory)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccess = localStorage.getItem("access_token");
    const storedRefresh = localStorage.getItem("refresh_token");

    if (storedUser && storedAccess && storedRefresh) {
      try {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
      } catch {
        // Corrupted data — clear it
        clearAuthData();
      }
    }
  }, []);

  const login = (user: AuthUser, accessToken: string, refreshToken: string) => {
    // Store in context state (in-memory)
    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    // Also persist to localStorage so data survives page refresh
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    clearAuthData(); // wipe localStorage
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