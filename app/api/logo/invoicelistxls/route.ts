import * as XLSX from "xlsx";
import { LKSRequest, sqlInvoicexls } from "@/app/logo/logosql";
import { NextResponse, NextRequest } from "next/server";
import { base64to } from "@/lib/utils";
export async function GET(req: NextRequest) {
  try {
    const dataStr = req.headers.get("data");
    const data = JSON.parse(base64to(dataStr as string));

    if (data) {
      const dbFilter = data.db;

      let whereSql = "";
      const params = [];
      /** sorgu kriterleri */
      whereSql += ` AND (STF.DATE_ BETWEEN @dateStart AND @dateEnd)`;
      params.push({
        key: "dateStart",
        value: (dbFilter.dateStart as string).substring(0, 10),
      });
      params.push({
        key: "dateEnd",
        value: (dbFilter.dateEnd as string).substring(0, 10),
      });

      /** firma */
      if (dbFilter.firma.trim()) {
        whereSql += ` AND CLC.DEFINITION_ LIKE @firma`;
        params.push({ key: "firma", value: `${dbFilter.firma.trim()}%` });
      }
      if (dbFilter.fisno.trim()) {
        whereSql += ` AND STF.FICHENO LIKE @fisno`;
        params.push({ key: "fisno", value: `%${dbFilter.fisno.trim()}%` });
      }
      if (dbFilter.metraj.trim()) {
        whereSql += ` AND ITM.NAME LIKE @metraj`;
        params.push({ key: "metraj", value: `%${dbFilter.metraj.trim()}%` });
      }
      if (dbFilter.plaka.trim()) {
        whereSql += ` AND P.CODE LIKE @plaka`;
        params.push({ key: "plaka", value: `%${dbFilter.plaka.trim()}%` });
      }

      const filter = data.local;

      if (filter.PLAKA) {
        whereSql += ` AND P.CODE LIKE @plaka1`;
        params.push({ key: "plaka1", value: `%${filter.PLAKA.trim()}%` });
      }
      if (filter.BIRIM) {
        whereSql += ` AND UL.NAME LIKE @BIRIM`;
        params.push({ key: "BIRIM", value: `%${filter.BIRIM.trim()}%` });
      }
      if (filter.URUN) {
        whereSql += ` AND ITM.NAME LIKE @URUN`;
        params.push({ key: "URUN", value: `%${filter.URUN.trim()}%` });
      }

      if (filter.HESAP) {
        whereSql += ` AND CLC.DEFINITION_ LIKE @HESAP`;
        params.push({ key: "HESAP", value: `%${filter.HESAP.trim()}%` });
      }
      if (filter.ADDR) {
        whereSql += ` AND STL.LINEEXP LIKE @ADDR`;
        params.push({ key: "ADDR", value: `%${filter.ADDR.trim()}%` });
      }
      if (filter.FICHENO) {
        whereSql += ` AND STF.FICHENO LIKE @FICHENO`;
        params.push({ key: "FICHENO", value: `%${filter.FICHENO.trim()}%` });
      }

      const Sql =
        sqlInvoicexls + whereSql + " ORDER BY STF.DATE_, STF.FTIME DESC";

      const request = await LKSRequest();
      params.map((item) => request.input(item.key, item.value));
      const result = await request.query(Sql);

      const workbook = XLSX.utils.book_new();

      const worksheet = await XLSX.utils.json_to_sheet(result.recordset);
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
    } else throw "Sorgu bilgileri eksik...";
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
