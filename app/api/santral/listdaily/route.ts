import { getDailyList } from "@/app/santral/db";
import { checkAuth } from "@/auth/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (await checkAuth())
      return NextResponse.json("Yetkiniz yok...", { status: 401 });
    const result = await getDailyList();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}

export const PATCH = async () => {
  return GET();
};

export const OPTIONS = async () => {
  return NextResponse.json({ status: 200 });
};
