"use client";
import { useState } from "react";
import { SignUpForm } from "./signUp";
import { SignInForm } from "./signIn";
import { ForgottenPasswordForm } from "./forgottenPassword";
import { useAuth } from "../context/authProvider";
import { redirect } from "next/navigation";
import TextButton from "@/components/textButton";
import { info } from "@/project/project";
export default function LoginForm() {
  const [mode, setMode] = useState<number>(0); // SignIn, SignUp, Forgotten Password
  const { user } = useAuth();

  if (user) redirect("/dashboard");
  return (
    <div className="flex flex-col gap-2 place-self-center pt-1">
      {mode == 0 && <SignInForm />}
      {mode == 1 && <SignUpForm />}
      {mode == 2 && <ForgottenPasswordForm />}

      <div className="border-buttoncolor grid grid-cols-2 gap-0.5 rounded-md border p-0.5">
        {mode != 0 && (
          <TextButton
            type="button"
            text={info.logIn.actions?.signIn.caption}
            onClick={() => setMode(0)}
          />
        )}

        {mode != 1 && (
          <TextButton
            onClick={() => setMode(1)}
            text={info.logIn.actions?.signUp.caption}
            type="button"
          />
        )}
        {mode != 2 && (
          <TextButton
            onClick={() => setMode(2)}
            text={info.logIn.actions?.forgottenPassword.caption}
            type="button"
          />
        )}
      </div>
    </div>
  );
}
