// Define a User type (adjust fields based on your actual user structure)
export interface User {
  id: string;
  name: string;
  email: string;
  // add other fields if needed
}

// Get stored user
export const getUser = (): User | null => {
  const user = localStorage.getItem("user");

  if (!user) return null;

  try {
    return JSON.parse(user) as User;
  } catch (error) {
    console.error("Invalid user data in localStorage");
    return null;
  }
};

// Check authentication
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("user");
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
