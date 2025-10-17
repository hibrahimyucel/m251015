"use client";
import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { sqlInvoiceDaily, sqlInvoiceDailyTotal } from "./invoicedaily";
import { invoiceData } from "./invoicedaily";
import { base64from } from "@/lib/utils";

const initInvoiceData = [
  {
    LOGICALREF: 1,
    FICHENO: "12345678901234",
    DATE_: "12.12.2025",
    FTIME: "",
    SAAT: "00:00",
    AMOUNT: 8,
    URUN: "C 30 0000 0000 0000 0000 0000",
    BIRIM: "M3",
    HESAP: "FİRMA ADI FİRMA ADI FİRMA ADI FİRMA ADI ",
    ADDR: "FİRMA ADRESİ FİRMA ADRESİ FİRMA ADRESİ FİRMA ADRESİ ",
    TIP: "..... .... .... .....",
  },
  {
    LOGICALREF: 1,
    FICHENO: "12345678901234",
    DATE_: "12.12.2025",
    FTIME: "",
    SAAT: "00:00",
    AMOUNT: 8,
    URUN: "C 30 0000 0000 0000 0000 0000",
    BIRIM: "M3",
    HESAP: "FİRMA ADI FİRMA ADI FİRMA ADI FİRMA ADI ",
    ADDR: "FİRMA ADRESİ FİRMA ADRESİ FİRMA ADRESİ FİRMA ADRESİ ",
    TIP: "..... .... .... .....",
  },
];
type invoiceDataTotal = {
  TOPLAM: string;
  URUN: string;
  BIRIM: string;
};

export default function InvoiceDailyTable() {
  const [data, setData] = useState<invoiceData[]>([]);
  const [dataTotal, setDataTotal] = useState<invoiceDataTotal[]>([]);
  async function getData() {
    const sql = sqlInvoiceDaily;
    const x = base64from(await JSON.stringify({ Sql: sql, Params: [] }));

    fetch("/api/runlkssql", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        data: x,
      },
    })
      .then((response) => response.json())
      .then((d) => {
        setData(d);
      });
    const sql1 = sqlInvoiceDailyTotal;
    const y = base64from(await JSON.stringify({ Sql: sql1, Params: [] }));

    fetch("/api/runlkssql", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        data: y,
      },
    })
      .then((response) => response.json())
      .then((d) => {
        console.log(d);
        setDataTotal(d);
      });
  }

  const [changer, setchanger] = useState<boolean>(true);
  const debChanger = useDebounce(changer, 15000);
  const datetime = new Date().toLocaleTimeString();
  useEffect(() => {
    getData();

    setchanger(!changer);
  }, [debChanger]);

  return (
    <>
      <div className="flex w-full flex-col">
        <h1 className="bg-buttoncolor w-full pt-0.5 pl-2 text-sm font-bold">
          Güncel İrsaliye Listesi {datetime}
        </h1>

        <div className="flex w-full justify-center gap-0.5 pt-0.5 pr-4 font-bold">
          <div className="flex shrink-0 basis-30 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Tarih-Saat
          </div>
          <div className="flex shrink-0 basis-20 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Plaka
          </div>
          <div className="flex shrink-0 basis-12 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Metraj
          </div>
          <div className="flex shrink-0 basis-12 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Birim
          </div>
          <div className="flex grow-1 basis-60 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Sınıfı
          </div>
          <div className="flex grow-2 basis-60 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Firma
          </div>
          <div className="flex grow-1 basis-60 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Adres
          </div>
          {/*   <div className="flex basis-30 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Fiş No
          </div>
          <div className="flex basis-30 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Tip
          </div>*/}
        </div>

        {data?.length && (
          <div className="flex w-full grow flex-col overflow-y-scroll border">
            {data.map((data: invoiceData, index) => (
              <div
                key={index}
                className={`flex w-full gap-0.5 border-b ${index % 2 ? "bg-background" : "bg-diffcolor"} `}
              >
                <div className="flex shrink-0 basis-30 overflow-hidden text-nowrap text-clip">
                  {data.DATE_.substring(0, 10).concat(" ").concat(data.SAAT)}
                </div>
                <div className="flex shrink-0 basis-20 overflow-hidden text-nowrap text-clip">
                  {data.PLAKA}
                </div>
                <div className="flex shrink-0 basis-12 justify-end overflow-hidden pr-0.5 text-nowrap text-clip">
                  {data.AMOUNT}
                </div>
                <div className="flex shrink-0 basis-12 overflow-hidden text-nowrap text-clip">
                  {data.BIRIM}
                </div>
                <div className="flex grow-1 basis-60 overflow-hidden text-nowrap text-clip">
                  {data.URUN}
                </div>
                <div className="flex grow-2 basis-60 truncate">
                  {data.HESAP}
                </div>
                <div className="flex grow-1 basis-60 overflow-hidden text-nowrap text-clip">
                  {data.ADDR}
                </div>
                {/* <div className="flex basis-30 justify-end overflow-hidden text-nowrap text-clip">
                  {data.FICHENO}
                </div>
                <div className="flex basis-30 overflow-hidden text-nowrap text-clip">
                  {data.TIP}
                </div>*/}
              </div>
            ))}
          </div>
        )}
        {dataTotal.length && (
          <table className="border-buttoncolor min-w-full border-collapse border">
            <caption className="font-bold">Toplamlar</caption>
            <tbody>
              {dataTotal.map((item: invoiceDataTotal, index) => (
                <tr
                  key={index}
                  className={`border-b ${index % 2 ? "bg-background" : "bg-diffcolor"} `}
                >
                  <td className="pl-1">{index + 1}</td>
                  <td className="pl-1">Toplam</td>
                  <td className="pl-1 text-end">{item.TOPLAM}</td>
                  <td className="pl-1">{item.BIRIM}</td>
                  <td className="grow pl-1">{item.URUN}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
