import * as XLSX from "xlsx";
import { mmbisConn } from "@/auth/mssqlAuth";
import { NextResponse, NextRequest } from "next/server";
import data from "@/app/logo/logodata.json";
export async function GET() {
  try {
    const sqlSelectUsers = `select *,pk_user as id from auth_user`;
    if (!mmbisConn.connected) await mmbisConn.connect();
    const request = mmbisConn.request();

    const result = await request.query(sqlSelectUsers);

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "MySheet");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Create and send a new Response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${"users"}.xlsx"`,
        "Content-Type": "application/vnd.ms-excel",
      },
    });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export const PATCH = async (request: NextRequest) => {
  return GET();
};

export const OPTIONS = async (request: NextRequest) => {
  return GET();
};
