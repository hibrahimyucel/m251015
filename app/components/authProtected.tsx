"use client";
import { PropsWithChildren, useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/auth/context/authProvider";

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, token } = useAuth();
  useEffect(() => {
    if (!user) {
      redirect("/login");
    }
  }, [user]);

  return children;
}
