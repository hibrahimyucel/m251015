import { getUserById, mmbisRequest } from "@/auth/mssqlAuth";
import { base64to } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const dataStr = req.headers.get("data");
    if (dataStr) {
      const data = JSON.parse(base64to(dataStr as string));
      if (data) {
        const result = await getUserById(data.id);
        return NextResponse.json(result, { status: 200 });
      }
    }
    const sqlSelectUsers = `select pk_user as id,name,email,admin,member from auth_user`;

    const request = await mmbisRequest();

    const result = await request.query(sqlSelectUsers);

    return NextResponse.json(result.recordset, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export const PATCH = async (req: NextRequest) => {
  return GET(req);
};

export const OPTIONS = async () => {
  return NextResponse.json({ status: 200 });
};
