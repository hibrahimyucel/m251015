import { signInDB } from "@/auth/mssqlAuth";
import { base64to } from "@/lib/utils";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const dataStr = req.headers.get("data");

    const data = JSON.parse(base64to(dataStr as string));

    if (data) {
      const users = await signInDB({
        username: "",
        email: data.email,
        password: data.password,
      });

      if (!users.length)
        return NextResponse.json("Hesap bulunamadı.!", {
          status: 201,
        });
      return NextResponse.json(users, {
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

export const OPTIONS = async () => {
  return NextResponse.json({ status: 200 });
};
