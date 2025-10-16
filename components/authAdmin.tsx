"use client";
import { PropsWithChildren, useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/auth/context/authProvider";

type ProtectedRouteProps = PropsWithChildren;

export default function AdminRoute({ children }: ProtectedRouteProps) {
  const { UserData } = useAuth();
  useEffect(() => {
    if (!UserData.id) redirect("/login");

    if (!UserData.admin) redirect("/");
  }, [UserData]);

  return children;
}
