"use client";
import { useActionState, useEffect } from "react";
import { redirect } from "next/navigation";
import { sendForgottenPassword } from "../actions/logInActions";
import TextButton from "@/components/textButton";

export function ForgottenPasswordForm() {
  const [state, sendForgottenPasswordAction, isPending] = useActionState(
    sendForgottenPassword,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      alert("Şifreniz e-posta hesabınıza gönderildi.");
      redirect("/login");
    }
  }, [state]);
  return (
    <form
      action={sendForgottenPasswordAction}
      className="border-buttoncolor flex w-[300px] max-w-[300px] flex-col rounded-md border p-1 text-nowrap"
    >
      <p className="pt-1">e-Posta</p>
      <input
        name="email"
        type="email"
        defaultValue={state?.data?.email.toString()}
      />
      {state?.errors?.properties?.email && (
        <p className="text-red-500">
          {state?.errors?.properties?.email.errors}
        </p>
      )}
      <p className="pt-1">Onay kodu</p>

      <input
        name="emailverify"
        placeholder={"Adresinize gönderilen onay kodu"}
        defaultValue={state?.data?.emailverify?.toString()}
      />
      {state?.errors?.properties?.emailverify && (
        <p className="text-red-500">
          {state?.errors?.properties?.emailverify.errors}
        </p>
      )}
      {state?.error && <p className="text-red-500">{state?.error}</p>}

      <p className="p-2"></p>
      <TextButton disabled={isPending} type="submit" text="Şifre Gönder" />
    </form>
  );
}
