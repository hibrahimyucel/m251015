"use server";
import { z } from "zod";
import { createSession, deleteSession, getUser } from "../session";
import { hashSync, compareSync } from "bcrypt-ts";
import {
  isUserExists,
  sendVerificationCode,
  checkVerificationCode,
  saveSignUpData,
  sendPassword,
  signInDB,
  getUserById,
  changePasswordDB,
} from "../mssqlAuth";

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

  const data = result.data;

  try {
    if (await isUserExists(data.email))
      throw new Error("Bu e-mail daha önce kaydedilmiş.!");

    const verified = await checkVerificationCode(
      result.data.email,
      result.data.emailverify,
    );

    if (!verified) {
      await sendVerificationCode(data.email);
      throw new Error(
        "Onay kodunuz gönderildi. e-posta hesabınızı kontrol edin",
      );
    }
    data.password = hashSync(data.password1.trim());
    if (verified) await saveSignUpData(data);
    return {
      data: data,
      success: true,
    };
  } catch (error) {
    return {
      data: data,
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
  try {
    const { email, password } = result.data;
    const users = await signInDB({ username: "", email, password });

    if (!users.length) throw Error("Hesap bulunamadı.!");

    if (!compareSync(password, users[0].password))
      throw Error("Geçersiz kullanıcı adı veya şifre.!");

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

  const { email, emailverify } = result.data;

  try {
    const userExists = await isUserExists(email);
    if (!userExists) throw new Error("Hesap bulunamadı.!");
    const verified = await checkVerificationCode(email, emailverify);
    if (!verified) {
      await sendVerificationCode(email);
      throw new Error(
        "Onay kodunuz gönderildi. e-posta hesabınızı kontrol edin",
      );
    }
    await sendPassword(email);
  } catch (error) {
    return {
      data: data,
      error: (error as Error).message,
    };
  }

  return { success: true };
}

export async function changePassword(prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData);
  const result = changePasswordSchema.safeParse(data);

  if (!result.success) {
    return {
      data: data,
      errors: z.treeifyError(result.error),
    };
  }

  try {
    const user = await getUser();
    if (!user)
      throw Error("Şifrenizi değiştirebilmek için oturum açmalısınız.");
    const users = await getUserById(user);

    const { username, passwordold, password, password1 } = result.data;

    if (!users.length) throw Error("Hesap bulunamadı.!");

    if (!compareSync(passwordold, users[0].password))
      throw Error("Geçersiz kullanıcı adı veya şifre.!");
    await changePasswordDB(user, password, username);
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
