import { mmbisRequest } from "@/auth/mssqlAuth";
import { base64to } from "@/lib/utils";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const dataStr = req.headers.get("data");

    const data = JSON.parse(base64to(dataStr as string));
    /* const Params = data.Params.map((e: unknown) =>
      typeof e === "string" ? decodeURIComponent(e) : e,
    );*/
    const Sql = data.Sql;

    const request = await mmbisRequest();

    const result = await request.query(Sql);

    return NextResponse.json(result.rowsAffected, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}

export const PATCH = async (request: NextRequest) => {
  return GET(request);
};

export const OPTIONS = async (request: NextRequest) => {
  return NextResponse.json({ status: 200 });
};
