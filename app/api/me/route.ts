import { createAccessToken, getUser } from "@/auth/session";
import { NextResponse, NextRequest } from "next/server";
import { tryCatch } from "@/lib/utils";
export async function GET(request: NextRequest) {
  const [data, error] = await tryCatch(getUser());
  if (error) return NextResponse.json(error, { status: 401 });
  const token = await createAccessToken();
  const result = { user: data ? data : null, accessToken: token };

  return NextResponse.json(result, { status: 200 });
}

export const PATCH = async (request: NextRequest) => {
  return GET(request);
};
