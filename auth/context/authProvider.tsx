/* muhasip.auth.context.authProvider 15.10.2025 -> 15.10.2025
   AuthProvider
   useAuth
 */
"use client";
import { tryCatch } from "@/lib/utils";
import { createContext, useContext, useEffect, useState } from "react";

type AuthProviderContextValue = {
  user: string | null;
  setUser: (user: string | null) => void;
  token: unknown;
  setToken: (token: unknown) => void;
};

const AuthProviderContext = createContext<AuthProviderContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<unknown>();

  async function handleAuthState() {
    const [data, error] = await tryCatch(
      fetch("/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
    if (error) {
      setUser(null);
      setToken(null);
      return;
    }
    data.json().then((data) => {
      setUser(data.user);
      setToken(data.accessToken);
    });
  }

  useEffect(() => {
    handleAuthState();
  }, [user]);

  return (
    <AuthProviderContext
      value={{
        user,
        setUser,
        token,
        setToken,
      }}
    >
      {children}
    </AuthProviderContext>
  );
}

export function useAuth() {
  const context = useContext(AuthProviderContext);
  if (!context) {
    throw new Error("useAuth,  <AuthProvider> içinde kullanılabilir.!");
  }
  return context;
}
