import { sqlInvoiceDaily, LKSRequest } from "@/app/logo/logosql";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const request = await LKSRequest();

    const result = await request.query(sqlInvoiceDaily);
    return NextResponse.json(result.recordset, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}

export const PATCH = async () => {
  return GET();
};

export const OPTIONS = async () => {
  return GET();
};
