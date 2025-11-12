import * as XLSX from "xlsx";
import {
  LKSRequest,
  sqlUrunToplam,
  sqlPlakaToplam,
  sqlHesapToplam,
} from "@/app/logo/logosql";
import { NextResponse, NextRequest } from "next/server";
import { base64to } from "@/lib/utils";
export async function GET(req: NextRequest) {
  try {
    const dataStr = req.headers.get("data");
    const data = JSON.parse(base64to(dataStr as string));

    if (data) {
      const dbFilter = data.db;

      const params = [];
      /** sorgu kriterleri */
      params.push({
        key: "dateStart",
        value: (dbFilter.dateStart as string).substring(0, 10),
      });
      params.push({
        key: "dateEnd",
        value: (dbFilter.dateEnd as string).substring(0, 10),
      });

      const workbook = XLSX.utils.book_new();

      const request = await LKSRequest();
      params.map((item) => request.input(item.key, item.value));

      const result = await request.query(sqlHesapToplam);
      const worksheet = await XLSX.utils.json_to_sheet(result.recordset);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Hesaplar");

      const result1 = await request.query(sqlPlakaToplam);
      const worksheet1 = await XLSX.utils.json_to_sheet(result1.recordset);
      XLSX.utils.book_append_sheet(workbook, worksheet1, "Araçlar");

      const result2 = await request.query(sqlUrunToplam);
      const worksheet2 = await XLSX.utils.json_to_sheet(result2.recordset);
      XLSX.utils.book_append_sheet(workbook, worksheet2, "Sınıf");

      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      // Create and send a new Response
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="${"users"}.xlsx"`,
          "Content-Type": "application/vnd.ms-excel",
        },
      });
    } else throw "Sorgu bilgileri eksik...";
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}

export const PATCH = async (request: NextRequest) => {
  return GET(request);
};

export const OPTIONS = async () => {
  return NextResponse.json({ status: 200 });
};
