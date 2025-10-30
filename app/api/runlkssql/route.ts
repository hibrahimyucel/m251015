import { base64to } from "@/lib/utils";
import { NextResponse, NextRequest } from "next/server";
import { LKSRequest } from "@/app/logo/logosql";
export async function GET(req: NextRequest) {
  try {
    const dataStr = req.headers.get("data");

    const data = JSON.parse(base64to(dataStr as string));

    const Sql = data.Sql;

    const request = await LKSRequest();

    const result = await request.query(Sql);

    return NextResponse.json(result.recordset, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export const PATCH = async (request: NextRequest) => {
  return GET(request);
};

export const OPTIONS = async (request: NextRequest) => {
  return GET(request);
};
