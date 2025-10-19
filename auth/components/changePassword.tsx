"use client";
import { useActionState, useEffect } from "react";
import TextButton from "@/components/textButton";
import { changePassword } from "../actions/logInActions";
import { useAuth } from "../context/authProvider";

export function ChangePasswordForm() {
  const inf = {
    UserName: "Kullanıcı Adı",
    PasswordOld: "Mevcut şifreniz",
    Password: "Yeni şifreniz",
    Password1: "Şifrenizi onaylayın",
    SignUp: "Şifre değiştir.",
    SignUpCompleted: "Şifreniz değiştirildi.",
  };

  const [state, changePasswordAction, isPending] = useActionState(
    changePassword,
    undefined,
  );
  const { UserData } = useAuth();

  const eprops = state?.errors?.properties;
  const data = state?.data;

  const errUserName = eprops?.username ? eprops?.username.errors : null;
  const UserName = data?.username.toString()
    ? data?.username.toString()
    : UserData.name;

  const errPasswordOld = eprops?.passwordold
    ? eprops?.passwordold.errors
    : null;
  const PasswordOld = data?.passwordold.toString();

  const errPassword = eprops?.password ? eprops?.password.errors : null;
  const Password = data?.password.toString();

  const errPassword1 = eprops?.password1 ? eprops?.password1.errors : null;
  const Password1 = data?.password1.toString();

  const { setUser } = useAuth();
  useEffect(() => {
    if (state?.success) {
      alert(inf.SignUpCompleted);
      setUser(null);
    }
  }, [state]);
  return (
    <form
      action={changePasswordAction}
      className="border-buttoncolor flex w-[300px] max-w-[300px] flex-col place-self-center-safe rounded-md border p-1"
    >
      <p className="pt-1">{inf.UserName}</p>
      <input name="username" defaultValue={UserName} />
      {errUserName && <p className="text-red-500">{errUserName}</p>}

      <p className="pt-1">{inf.PasswordOld}</p>
      <input name="passwordold" type="password" defaultValue={PasswordOld} />
      {errPasswordOld && <p className="text-red-500">{errPasswordOld}</p>}

      <p className="pt-1">{inf.Password}</p>
      <input name="password" type="password" defaultValue={Password} />
      {errPassword && <p className="text-red-500">{errPassword}</p>}

      <p className="pt-1">{inf.Password1}</p>
      <input name="password1" type="password" defaultValue={Password1} />
      {errPassword1 && <p className="text-red-500">{errPassword1}</p>}

      <p className="p-1"></p>
      {state?.error && <p className="text-red-500">{state?.error}</p>}
      <TextButton disabled={isPending} type="submit" text={inf.SignUp} />
    </form>
  );
}
