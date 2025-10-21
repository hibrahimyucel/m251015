/* muhasip.auth.context.authProvider 15.10.2025 -> 15.10.2025
   AuthProvider
   useAuth
 */
"use client";
import { tryCatch } from "@/lib/utils";
import { createContext, useContext, useEffect, useState } from "react";
type userData = { id: string; name: string; admin: boolean; member: boolean };
type AuthProviderContextValue = {
  user: string | null;
  setUser: (user: string | null) => void;
  token: unknown;
  setToken: (token: unknown) => void;
  UserData: Partial<userData>;
  /* statusMessage: string;
  setStatusMessage: (StatusMessage: string) => void;*/
};

const AuthProviderContext = createContext<AuthProviderContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<unknown>();
  const [statusMessage, setStatusMessageHook] = useState("");
  const [UserData, setUserData] = useState<Partial<userData>>({
    id: "0",
    name: "",
    admin: false,
    member: false,
  });
  function setStatusMessage(statusMessage: string) {
    setStatusMessageHook(statusMessage);
    const timeOut = setTimeout(() => setStatusMessageHook(""), 5000);
    return () => clearTimeout(timeOut);
  }
  async function handleAuthState() {
    const [data, error] = await tryCatch(
      fetch("/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    if (error || !data.ok) {
      setUser(null);
      setToken(null);
      setUserData({});
      return;
    }
    data.json().then((data) => {
      const uData: userData = {
        id: data.user,
        name: data.name,
        admin: data.admin,
        member: data.member,
      };
      setUserData(uData);
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
        UserData,
        /* statusMessage,
        setStatusMessage,*/
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
