"use client";
import { useState } from "react";
//import { SignInForm } from "@/authentication/components/signIn";
import { SignUpForm } from "./signUp";
import { useAuth } from "../context/authProvider";
import { redirect } from "next/navigation";
//import { ForgotPasswordForm } from "./forgotPassword";
import TextButton from "@/app/components/textButton";
export default function LoginForm() {
  const [newUser, setNewUser] = useState<number>(1);
  const { user } = useAuth();

  const inf = {
    SignUp: "Kayıt ol",
    signIn: "Giriş",
    forgotPassword: "Şifremi unuttum.!",
  };

  if (user) redirect("/dashboard");
  return (
    <div className="flex flex-col gap-2 place-self-center pt-1">
      <SignUpForm />
      {/* : newUser == 1 ? (
            <SignInForm />
          ) : (
            <ForgotPasswordForm />
          )}*/}

      <div className="border-buttoncolor grid grid-cols-2 gap-0.5 rounded-md border p-0.5">
        {newUser == 0 ? null : (
          <TextButton
            onClick={() => setNewUser(0)}
            text={inf.signIn}
            type="button"
          />
        )}
        {newUser == 1 ? null : (
          <TextButton
            onClick={() => setNewUser(1)}
            text={inf.SignUp}
            type="button"
          />
        )}
        {newUser == 2 ? null : (
          <TextButton
            onClick={() => setNewUser(2)}
            text={inf.forgotPassword}
            type="button"
          />
        )}
      </div>
    </div>
  );
}
