import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  authLogin,
  authLogout,
  authMe,
  authRegister,
  deleteAccount as apiDeleteAccount,
  fetchMyOrders,
  fetchMyTripPlans,
  setClientCsrfToken,
} from "@/lib/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const data = await authMe();
      setUser(data?.user || null);
      if (data?.csrfToken) {
        setCsrfToken(data.csrfToken);
        setClientCsrfToken(data.csrfToken);
      } else {
        setClientCsrfToken(null);
        setCsrfToken(null);
      }
      return data?.user || null;
    } catch {
      setUser(null);
      setCsrfToken(null);
      setClientCsrfToken(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = useCallback(async (payload) => {
    const data = await authLogin(payload);
    setUser(data?.user || null);
    if (data?.csrfToken) { setCsrfToken(data.csrfToken); setClientCsrfToken(data.csrfToken); }
    else await refresh();
    return data?.user || null;
  }, [refresh]);

  const register = useCallback(async (payload) => {
    const data = await authRegister(payload);
    setUser(data?.user || null);
    if (data?.csrfToken) { setCsrfToken(data.csrfToken); setClientCsrfToken(data.csrfToken); }
    else await refresh();
    return data?.user || null;
  }, [refresh]);

  const logout = useCallback(async () => {
    try { await authLogout(); } finally {
      setUser(null);
      setCsrfToken(null);
      setClientCsrfToken(null);
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    await apiDeleteAccount();
    setUser(null);
    setCsrfToken(null);
    setClientCsrfToken(null);
  }, []);

  const loadOrders = useCallback(async () => {
    const data = await fetchMyOrders();
    return data?.orders || [];
  }, []);

  const loadTripPlans = useCallback(async () => {
    const data = await fetchMyTripPlans();
    return data?.plans || [];
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    csrfToken,
    refresh,
    login,
    register,
    logout,
    deleteAccount,
    loadOrders,
    loadTripPlans,
  }), [user, loading, csrfToken, refresh, login, register, logout, deleteAccount, loadOrders, loadTripPlans]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
