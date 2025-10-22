import { invoiceData } from "@/app/logo/invoicedaily/components/invoicedaily";
import { exportxls } from "@/app/logo/logoxls";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    //    const dataStr = await req.headers.get("data");

    //  const data = JSON.parse(base64to(dataStr as string));

    //const Data: invoiceData[] = [];
    const data: invoiceData[] = [
      {
        LOGICALREF: 1,
        FICHENO: "1",
        DATE_: "111",
        FTIME: "string;",
        SAAT: "string;",
        AMOUNT: 1,
        URUN: "string;",
        BIRIM: "string;",
        HESAP: "string;",
        ADDR: "string;",
        TIP: "string;",
        PLAKA: "string;",
      },
    ];

    const xdata = await exportxls(data);
    return NextResponse.json(xdata, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${"rapor1"}.txt"`,
        "Content-Type": "text/csv",
      },
    });
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
