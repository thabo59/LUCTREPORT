import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchOrCreateProfile, login, logout, registerWithProfile, watchAuthState } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = watchAuthState(async (nextUser) => {
      setUser(nextUser || null);
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const nextProfile = await fetchOrCreateProfile(nextUser);
      setProfile(nextProfile);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      login: (email, password) => login(email, password),
      register: (input) => registerWithProfile(input),
      logout: () => logout(),
      setProfile,
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
