"use server";
import { z } from "zod";
import { hashSync, compareSync } from "bcrypt-ts";
import {
  checkUserExists,
  checkVerificationCode,
  saveForgottenPassword,
  saveNewPassword,
  sendVerificationCode,
  saveNewSignUp,
  getUserByMail,
  getUserById,
} from "./authDb";
import {
  getUserFromSession,
  createSession,
  deleteSession,
} from "./authSession";

const infVerifyCodeSended =
  "Onay kodunuz gönderildi. e-posta hesabınızı kontrol edin";
const errInvalidIdentity = "Geçersiz kullanıcı adı veya şifre.!";
const errNotFound = "Hesap bulunamadı.!";
export async function signUpAction(prevState: unknown, formData: FormData) {
  const errMailExists = "Bu e-mail daha önce kaydedilmiş.!";
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

  const result = signUpSchema.safeParse(Object.fromEntries(formData));

  if (!result.success)
    return {
      data: Object.fromEntries(formData),
      errors: z.treeifyError(result.error),
    };

  const data = result.data;

  try {
    if (await checkUserExists(data.email)) throw new Error(errMailExists);

    const verified = await checkVerificationCode(
      result.data.email,
      result.data.emailverify,
    );

    if (!verified) {
      await sendVerificationCode(data.email);
      throw new Error(infVerifyCodeSended);
    }
    data.password = hashSync(data.password1.trim());
    if (verified) await saveNewSignUp(data.username, data.email, data.password);
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

export async function signInAction(prevState: unknown, formData: FormData) {
  const signInSchema = z.object({
    email: z.email({ message: "Geçersiz e-posta" }).trim(),
    password: z
      .string()
      .min(1, { message: "Şifre en az 1 karakter olmalı" })
      .trim(),
  });

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
    const users = await getUserByMail(email);

    if (!users.length) throw Error(errNotFound);

    if (!compareSync(password, users[0].password))
      throw Error(errInvalidIdentity);

    await createSession(users[0].pk_user);

    return { success: true, user: users[0].pk_user };
  } catch (error) {
    return {
      data: data,
      error: (error as Error).message,
    };
  }
}

export async function sendForgottenPasswordAction(
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
    const userExists = await checkUserExists(email);
    if (!userExists) throw new Error(errNotFound);
    const verified = await checkVerificationCode(email, emailverify);
    if (!verified) {
      await sendVerificationCode(email);
      throw new Error(infVerifyCodeSended);
    }
    await saveForgottenPassword(email);
  } catch (error) {
    return {
      data: data,
      error: (error as Error).message,
    };
  }

  return { success: true };
}

export async function changePasswordAction(
  prevState: unknown,
  formData: FormData,
) {
  const errSession = "Şifrenizi değiştirebilmek için oturum açmalısınız.";
  const data = Object.fromEntries(formData);
  const result = changePasswordSchema.safeParse(data);

  if (!result.success) {
    return {
      data: data,
      errors: z.treeifyError(result.error),
    };
  }

  try {
    const user = await getUserFromSession();
    if (!user) throw Error(errSession);
    const users = await getUserById(user);
    if (!users.length) throw Error(errNotFound);

    const { username, passwordold, password } = result.data;
    if (!compareSync(passwordold, users[0].password))
      throw Error(errInvalidIdentity);

    await saveNewPassword(user, password, username);
  } catch (error) {
    return {
      data: data,
      error: (error as Error).message,
    };
  }
  await logOutAction();
  return { success: true };
}

export async function logOutAction() {
  await deleteSession();
  return;
}
