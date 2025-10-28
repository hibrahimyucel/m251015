import { LKSConn } from "@/app/logo/logodb";
import { base64to } from "@/lib/utils";
import { NextResponse, NextRequest } from "next/server";
import logodata from "@/app/logo/logodata.json";
export async function GET(req: NextRequest) {
  try {
    /*
    const dataStr = req.headers.get("data");

    const data = JSON.parse(base64to(dataStr as string));
    
    const Sql = data.Sql;

    if (!LKSConn.connected) await LKSConn.connect();
    const request = LKSConn.request();

    const result = await request.query(Sql);

    return NextResponse.json(result.recordset, { status: 200 });*/
    return NextResponse.json(logodata, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}

export const PATCH = async (request: NextRequest) => {
  return GET(request);
};

export const OPTIONS = async (request: NextRequest) => {
  return GET(request);
};
