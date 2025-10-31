import {
  checkVerificationCode,
  isUserExists,
  saveSignUpData,
  sendVerificationCode,
} from "@/auth/mssqlAuth";
import { base64to } from "@/lib/utils";
import { hashSync } from "bcrypt-ts";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const dataStr = req.headers.get("data");
    const data = JSON.parse(base64to(dataStr as string));

    if (data) {
      if (await isUserExists(data.email))
        return NextResponse.json("Bu e-mail daha önce kaydedilmiş.!", {
          status: 201,
        });
      const verified = await checkVerificationCode(
        data.email,
        data.emailverify,
      );

      if (!verified) {
        const sendVerificationCodeResult = await sendVerificationCode(
          data.email,
        );
        if (!sendVerificationCodeResult.success)
          throw sendVerificationCodeResult.message;

        return NextResponse.json(
          "Onay kodunuz gönderildi. e-posta hesabınızı kontrol edin",
          {
            status: 201,
          },
        );
      }
      data.password = hashSync(data.password1.trim());

      if (verified) {
        await saveSignUpData(data);
        return NextResponse.json({
          status: 200,
        });
      }
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
