import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Invalid user in storage", err);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  return { user, loadingUser };
};
