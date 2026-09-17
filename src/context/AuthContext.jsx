import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../utils/apiClient";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Try to restore user session on first load
    const bootstrapAuth = async () => {
      try {
        const { data } = await apiClient.get("/auth/me");
        setUser(data.user || null);
      } catch (_err) {
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    bootstrapAuth();
  }, []);

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (_err) {
      // ignore
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    initializing,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};


