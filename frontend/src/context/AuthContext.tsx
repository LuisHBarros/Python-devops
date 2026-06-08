import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { getMe, login as apiLogin, logout as apiLogout, register as apiRegister } from "../api/auth";
import { getAccessToken } from "../api/client";

import { AuthContext } from "./auth-context";

import type { LoginPayload, RegisterPayload, User } from "../types/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getAccessToken()));

  useEffect(() => {
    if (!getAccessToken()) {
      return;
    }

    let active = true;

    getMe()
      .then((profile) => {
        if (active) {
          setUser(profile);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    await apiLogin(payload);
    const profile = await getMe();
    setUser(profile);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    await apiRegister(payload);
    await apiLogin({ email: payload.email, password: payload.password });
    const profile = await getMe();
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
