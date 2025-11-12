import { LKSRequest, sqlInvoice } from "@/app/logo/logosql";
import { checkAuth } from "@/auth/session";
import { base64to } from "@/lib/utils";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    if (await checkAuth())
      return NextResponse.json("Yetkiniz yok...", { status: 401 });
    const dataStr = req.headers.get("data");
    const data = JSON.parse(base64to(dataStr as string));

    if (data) {
      const dbFilter = data;
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
        params.push({ key: "firma", value: `%${dbFilter.firma.trim()}%` });
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

      const Sql =
        sqlInvoice + whereSql + " ORDER BY STF.DATE_, CLC.DEFINITION_ ";
      const request = await LKSRequest();
      params.map((item) => request.input(item.key, item.value));
      const result = await request.query(Sql);

      return NextResponse.json(result.recordset, { status: 200 });
    } else throw "Sorgu bilgileri eksik...";
  } catch (error) {
    console.error(error);
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}

export const PATCH = async (request: NextRequest) => {
  return GET(request);
};

export const OPTIONS = async () => {
  return NextResponse.json({ status: 200 });
};
