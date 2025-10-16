"use client";
import { useState } from "react";
import { SignUpForm } from "./signUp";
import { SignInForm } from "./signIn";
import { useAuth } from "../context/authProvider";
import { redirect } from "next/navigation";
import TextButton from "@/app/components/textButton";
export default function LoginForm() {
  const [mode, setMode] = useState<number>(0); // SignIn, SignUp, Forgotten Password
  const { user } = useAuth();

  const inf = {
    SignUp: "Kayıt ol",
    signIn: "Giriş",
    forgotPassword: "Şifremi unuttum.!",
  };

  if (user) redirect("/dashboard");
  return (
    <div className="flex flex-col gap-2 place-self-center pt-1">
      {mode == 0 && <SignInForm />}
      {mode == 1 && <SignUpForm />}

      <div className="border-buttoncolor grid grid-cols-2 gap-0.5 rounded-md border p-0.5">
        {mode != 0 && (
          <TextButton
            type="button"
            text={inf.signIn}
            onClick={() => setMode(0)}
          />
        )}

        {mode != 1 && (
          <TextButton
            onClick={() => setMode(1)}
            text={inf.SignUp}
            type="button"
          />
        )}
        {mode != 2 && (
          <TextButton
            onClick={() => setMode(2)}
            text={inf.forgotPassword}
            type="button"
          />
        )}
      </div>
    </div>
  );
}
