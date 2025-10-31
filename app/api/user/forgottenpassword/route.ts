import {
  checkVerificationCode,
  isUserExists,
  sendPassword,
  sendVerificationCode,
} from "@/auth/mssqlAuth";
import { base64to } from "@/lib/utils";

import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const dataStr = req.headers.get("data");
    const data = JSON.parse(base64to(dataStr as string));

    if (data) {
      const { email, emailverify } = data;
      const userExists = await isUserExists(email);
      if (!userExists)
        return NextResponse.json("Hesap bulunamadı.!", {
          status: 201,
        });
      const verified = await checkVerificationCode(email, emailverify);
      if (!verified) {
        const sendVerificationCodeResult = await sendVerificationCode(email);
        if (!sendVerificationCodeResult.success)
          throw sendVerificationCodeResult.message;

        return NextResponse.json(
          "Onay kodunuz gönderildi. e-posta hesabınızı kontrol edin",
          {
            status: 201,
          },
        );
      }
      await sendPassword(email);
      return NextResponse.json("Hesap bulunamadı.!", {
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
