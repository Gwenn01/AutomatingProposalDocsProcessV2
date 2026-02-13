export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("user");
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
