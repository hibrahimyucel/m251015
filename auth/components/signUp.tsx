"use client";
import { useActionState, useEffect } from "react";
import { redirect } from "next/navigation";
import { signUp } from "../actions/logInActions";
import TextButton from "@/components/textButton";

export function SignUpForm() {
  const inf = {
    UserName: "Kullanıcı adınız",
    eMail: "e-Posta adresiniz",
    eMailVerify: "Adresinize gönderilen onay kodu",
    Password: "Şifre belirleyin",
    Password1: "Şifrenizi onaylayın",
    SignUp: "Kayıt",
    SignUpCompleted: "Kayıt işlemi tamamlandı.",
  };

  const [state, signUpAction, isPending] = useActionState(signUp, undefined);

  const eprops = state?.errors?.properties;
  const data = state?.data;

  const errUserName = eprops?.username ? eprops?.username.errors : null;
  const UserName = data?.username.toString();

  const errMail = eprops?.email ? eprops?.email.errors : null;
  const mail = data?.email.toString();

  const errPassword = eprops?.password ? eprops?.password.errors : null;
  const Password = data?.password.toString();

  const errPassword1 = eprops?.password1 ? eprops?.password1.errors : null;
  const Password1 = data?.password1.toString();

  const errmailverify = eprops?.emailverify ? eprops?.emailverify.errors : null;
  const mailverify = data?.emailverify.toString();

  useEffect(() => {
    if (state?.success) {
      alert(inf.SignUpCompleted);
      redirect("/login");
    }
  }, [state]);
  return (
    <form
      action={signUpAction}
      className="border-buttoncolor flex w-[300px] max-w-[300px] flex-col place-self-center-safe rounded-md border p-1"
    >
      <p className="pt-1">{inf.UserName}</p>
      <input name="username" defaultValue={UserName} />
      {errUserName && <p className="text-red-500">{errUserName}</p>}

      <p className="pt-1">{inf.eMail}</p>
      <input name="email" type="email" defaultValue={mail} />
      {errMail && <p className="text-red-500">{errMail}</p>}

      <p className="pt-1">{inf.Password}</p>
      <input name="password" type="password" defaultValue={Password} />
      {errPassword && <p className="text-red-500">{errPassword}</p>}

      <p className="pt-1">{inf.Password1}</p>
      <input name="password1" type="password" defaultValue={Password1} />
      {errPassword1 && <p className="text-red-500">{errPassword1}</p>}

      <p className="p-1"></p>
      {state?.error && <p className="text-red-500">{state?.error}</p>}
      <TextButton disabled={isPending} type="submit" text={inf.SignUp} />

      <p className="pt-1"></p>
      <input
        name="emailverify"
        placeholder={inf.eMailVerify}
        defaultValue={mailverify}
      />
      {errmailverify && <p className="text-red-500">{errmailverify}</p>}
    </form>
  );
}
