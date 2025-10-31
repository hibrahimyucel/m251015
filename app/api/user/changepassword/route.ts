import {
  changePasswordDB,
  checkVerificationCode,
  getUserById,
  isUserExists,
  saveSignUpData,
  sendVerificationCode,
} from "@/auth/mssqlAuth";
import { base64to } from "@/lib/utils";
import { compareSync, hashSync } from "bcrypt-ts";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const dataStr = req.headers.get("data");
    const data = JSON.parse(base64to(dataStr as string));

    if (data) {
      const { username, passwordold, password, password1, user } = data;
      const users = await getUserById(user);

      if (!users.length)
        return NextResponse.json("Hesap bulunamadı.!", {
          status: 201,
        });

      if (!compareSync(passwordold, users[0].password))
        return NextResponse.json("Geçersiz kullanıcı adı veya şifre.!", {
          status: 201,
        });
      await changePasswordDB(user, password, username);
      return NextResponse.json({
        status: 200,
      });
    } else throw "Sorgu bilgileri eksik...";
  } catch (error) {
    console.error(error);
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}

export const PATCH = async (request: NextRequest) => {
  return GET(request);
};

export const OPTIONS = async (request: NextRequest) => {
  return NextResponse.json({ status: 200 });
};
