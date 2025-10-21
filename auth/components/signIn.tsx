"use client";
import { useActionState, useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "../context/authProvider";
import { signIn } from "../actions/logInActions";
import TextButton from "@/components/textButton";

export function SignInForm() {
  const [state, signInAction, isPending] = useActionState(signIn, undefined);
  const { user, setUser } = useAuth();
  if (user) redirect("/dashboard");

  const eprops = state?.errors?.properties;
  const data = state?.data;

  const errMail = eprops?.email ? eprops?.email.errors : null;
  const mail = data?.email.toString();

  const errPassword = eprops?.password ? eprops?.password.errors : null;
  const password = data?.password.toString();

  const error = state?.error ? state.error : null;

  useEffect(() => {
    if (state?.success) {
      setUser(state?.user);
      redirect("/");
    }
  }, [state]);

  return (
    <form
      action={signInAction}
      className="border-buttoncolor flex w-[300px] max-w-[300px] flex-col rounded-md border p-1 text-nowrap"
    >
      <p className="pt-1"> e-Posta</p>
      <input name="email" type="email" defaultValue={mail} />
      {errMail && <p className="text-red-500">{errMail}</p>}

      <p className="pt-1">Şifre</p>
      <input name="password" type="password" defaultValue={password} />
      {errPassword && <p className="text-red-500">{errPassword}</p>}

      {error && <p className="text-red-500">{error}</p>}

      <p className="p-2"></p>
      <TextButton text="Giriş" disabled={isPending} type="submit" />
    </form>
  );
}
