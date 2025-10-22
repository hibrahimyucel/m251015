import { type NextRequest } from "next/server";

// For loading example data
import Excel, { CsvWriteOptions, stream } from "exceljs";
import { invoiceData } from "./invoicedaily/components/invoicedaily";
import { date } from "zod";
import Stream from "stream";
import { GiConsoleController } from "react-icons/gi";
export async function exportxls(Data: invoiceData[]) {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet("Countries List");

  worksheet.columns = [
    { key: "LOGICALREF", header: "a" },
    { key: "FICHENO", header: "b" },
    { key: "DATE_", header: "c" },
    { key: "FTIME", header: "d" },
    { key: "SAAT", header: "e" },
    { key: "AMOUNT", header: "f" },
    { key: "URUN", header: "g" },
    { key: "BIRIM", header: "h" },
    { key: "HESAP", header: "ı" },
    { key: "ADDR", header: "i" },
    { key: "TIP", header: "j" },
    { key: "PLAKA", header: "k" },
  ];

  Data.forEach((item) => {
    worksheet.addRow(item);
  });

  //const exportPath = path.resolve("c1oun1tries.xlsx"); //__dirname,
  // console.log(exportPath);
  const s = await workbook.csv.writeFile("ss.csv");
  //console.log(s.byteLength);
  return s;
}
