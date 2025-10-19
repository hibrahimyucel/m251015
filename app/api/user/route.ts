import { NextResponse } from "next/server";
import { getQuery } from "@/auth/authDb";

export async function GET() {
  try {
    const sqlSelectUsers = `select *,pk_user as id from auth_user`;

    const request = await getQuery();

    const result = await request.query(sqlSelectUsers);

    return NextResponse.json(result.recordset, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export const PATCH = async () => {
  return GET();
};

export const OPTIONS = async () => {
  return GET();
};
