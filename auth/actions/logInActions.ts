"use server";
import { z } from "zod";
import { createSession, deleteSession, getUser } from "../session";
import { compareSync } from "bcrypt-ts";
import { signInDB } from "../mssqlAuth";
import { apiPath, externalAuth } from "@/app/api/api";
import { base64from } from "@/lib/utils";

const signUpSchema = z
  .object({
    username: z
      .string("Kullanıcı adı en az 3 karakter olmalı")
      .min(3, { message: "Kullanıcı adı en az 3 karakter olmalı" }),
    email: z.email({ message: "Geçersiz e-posta" }).trim(),
    emailverify: z.string(),
    password: z
      .string()
      .min(1, { message: "Şifre en az 3 karakter olmalı" })
      .trim(),
    password1: z
      .string()
      .min(1, { message: "Şifre en az 3 karakter olmalı" })
      .trim(),
  })
  .refine((data) => data.password === data.password1, {
    message: "Şifre eşleşmiyor.",
    path: ["password1"],
  });

export async function signUp(prevState: unknown, formData: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(formData));

  if (!result.success)
    return {
      data: Object.fromEntries(formData),
      errors: z.treeifyError(result.error),
    };

  const dataFields = result.data;
  const x = base64from(await JSON.stringify(dataFields));

  try {
    const response = await fetch(externalAuth() + apiPath.user.signUp, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        data: x,
      },
    });
    console.log(response);
    if (response.status == 200)
      return {
        data: dataFields,
        success: true,
      };
    if (response.status == 201)
      return {
        data: dataFields,
        error: response.json(),
      };
  } catch (error) {
    return {
      data: dataFields,
      error: (error as Error).message,
    };
  }
}

const signInSchema = z.object({
  email: z.email({ message: "Geçersiz e-posta" }).trim(),
  password: z
    .string()
    .min(1, { message: "Şifre en az 1 karakter olmalı" })
    .trim(),
});
const forgotPasswordSchema = z.object({
  email: z.email({ message: "Geçersiz e-posta" }).trim(),
  emailverify: z.string(),
});

const changePasswordSchema = z
  .object({
    username: z
      .string("Kullanıcı adınızı yazın.")
      .min(1, { message: "Kullanıcı adınızı yazın." }),
    passwordold: z
      .string("Mevcut şifrenizi yazın.")
      .min(1, { message: "Mevcut şifrenizi yazın." }),
    password: z.string().min(1, { message: "Yeni şifrenizi yazın." }).trim(),
    password1: z
      .string()
      .min(1, { message: "Yeni şifrenizi tekrar yazın." })
      .trim(),
  })
  .refine((data) => data.password === data.password1, {
    message: "Yeni şifre eşleşmiyor.",
    path: ["password1"],
  });

export async function signIn(prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData);
  const result = signInSchema.safeParse(data);

  if (!result.success) {
    return {
      data: data,
      errors: z.treeifyError(result.error),
    };
  }

  const dataFields = result.data;
  const x = base64from(await JSON.stringify(dataFields));
  const { email, password } = result.data;
  try {
    const response = await fetch(externalAuth() + apiPath.user.signIn, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        data: x,
      },
    });
    if (response.status == 201)
      return {
        data: dataFields,
        error: response.json(),
      };
    const users = await response.json();

    if (!compareSync(password, users[0].password))
      return {
        data: dataFields,
        error: "Geçersiz kullanıcı adı veya şifre.!",
      };

    await createSession(users[0].pk_user);

    return { success: true, user: users[0].pk_user };
  } catch (error) {
    return {
      data: data,
      error: (error as Error).message,
    };
  }
}

export async function sendForgottenPassword(
  prevState: unknown,
  formData: FormData,
) {
  const data = Object.fromEntries(formData);
  const result = forgotPasswordSchema.safeParse(data);

  if (!result.success) {
    return {
      data: data,
      errors: z.treeifyError(result.error),
    };
  }

  const dataFields = result.data;
  const x = base64from(await JSON.stringify(dataFields));

  try {
    const response = await fetch(
      externalAuth() + apiPath.user.forgottenPassword,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          data: x,
        },
      },
    );
    if (response.status == 201)
      return {
        data: dataFields,
        error: response.json(),
      };
  } catch (error) {
    return {
      data: data,
      error: (error as Error).message,
    };
  }

  return { success: true };
}

export async function changePassword(prevState: unknown, formData: FormData) {
  const user = await getUser();
  if (!user) throw Error("Şifrenizi değiştirebilmek için oturum açmalısınız.");

  const data = Object.fromEntries(formData);
  const result = changePasswordSchema.safeParse(data);

  if (!result.success) {
    return {
      data: data,
      errors: z.treeifyError(result.error),
    };
  }

  const dataFields = result.data;
  const x = base64from(await JSON.stringify({ ...dataFields, user: user }));

  try {
    const response = await fetch(externalAuth() + apiPath.user.changePassword, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        data: x,
      },
    });

    if (response.status == 201)
      return {
        data: dataFields,
        error: response.json(),
      };
  } catch (error) {
    return {
      data: data,
      error: (error as Error).message,
    };
  }

  await logout();
  return { success: true };
}

export async function logout() {
  await deleteSession();
  return;
}
