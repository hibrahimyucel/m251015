"use client";
import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { sqlInvoiceDaily, sqlInvoiceDailyTotal } from "./invoicedaily";
import { invoiceData } from "./invoicedaily";
import { base64from } from "@/lib/utils";

type invoiceDataTotal = {
  TOPLAM: number;
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
  let toplam = 0;
  if (dataTotal.length)
    dataTotal.map(
      (i: invoiceDataTotal) => (toplam = toplam + Number(i.TOPLAM)),
    );

  const [changer, setchanger] = useState<boolean>(true);
  const debChanger = useDebounce(changer, 15000);
  const datetime = new Date().toLocaleTimeString();
  useEffect(() => {
    getData();

    setchanger(!changer);
  }, [debChanger]);

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full flex-col overflow-hidden overflow-y-scroll border">
      <h1 className="bg-buttoncolor w-full pt-0.5 pl-2 text-sm font-bold">
        Güncel İrsaliye Listesi {datetime}
      </h1>

      <InvoiceHeader />
      {data?.length && <InvoiceData d={data} />}
      <div>
        {dataTotal.length && false && (
          <TotalData dt={dataTotal} toplam={toplam} />
        )}
      </div>
    </div>
  );
}
function InvoiceHeader() {
  return (
    <div className="flex w-full justify-center pt-0.5 pr-4 font-bold">
      <div className="flex w-30 shrink-0 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
        Tarih-Saat
      </div>
      <div className="flex w-20 shrink-0 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
        Plaka
      </div>
      <div className="flex w-12 shrink-0 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
        Metraj
      </div>
      <div className="flex w-10 shrink-0 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
        Birim
      </div>
      <div className="flex w-50 shrink-0 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
        Sınıfı
      </div>
      <div className="flex grow basis-75 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
        Firma
      </div>
      <div className="flex grow basis-25 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
        Adres
      </div>
    </div>
  );
}
function InvoiceData({ d }: { d: invoiceData[] }) {
  return (
    <div className="flex flex-col border">
      {d.map((data: invoiceData, index) => (
        <div
          key={index}
          className={`flex border-b ${index % 2 ? "bg-background" : "bg-diffcolor"} `}
        >
          <div className="flex w-30 shrink-0 overflow-hidden px-0.5 text-nowrap text-clip">
            {data.DATE_.substring(0, 10).concat(" ").concat(data.SAAT)}
          </div>
          <div className="flex w-20 shrink-0 overflow-hidden text-nowrap text-clip">
            {data.PLAKA}
          </div>

          <div className="flex w-10 shrink-0 justify-end overflow-hidden px-0.5 text-nowrap text-clip">
            {data.AMOUNT}
          </div>

          <div className="flex w-12 shrink-0 items-center overflow-hidden px-0.5 text-xs text-nowrap text-clip">
            {data.BIRIM}
          </div>
          <div className="flex w-50 overflow-hidden text-xs text-nowrap text-clip">
            {data.URUN}
          </div>
          <div className="flex grow basis-75 truncate text-[10px]">
            {data.HESAP}
          </div>
          <div className="flex grow basis-25 overflow-hidden text-[10px] text-nowrap text-clip">
            {data.ADDR}
          </div>
        </div>
      ))}
    </div>
  );
}
function TotalData({ dt, toplam }: { dt: invoiceDataTotal[]; toplam: number }) {
  return (
    <table className="border-buttoncolor min-w-full border-collapse border">
      <caption className="font-bold">Toplamlar</caption>
      <tbody>
        {dt.map((item: invoiceDataTotal, index) => (
          <tr
            key={index}
            className={`border-b ${index % 2 ? "bg-background" : "bg-diffcolor"} `}
          >
            <td className="pl-1">{index + 1}</td>
            <td className="pl-1"> </td>
            <td className="pl-1 text-end">{item.TOPLAM.toLocaleString()}</td>
            <td className="pl-1">{item.BIRIM}</td>
            <td className="grow pl-1">{item.URUN}</td>
          </tr>
        ))}
        <tr key={-1} className={`bg-buttoncolor border-b font-bold`}>
          <td className="pl-1"></td>
          <td className="pl-1">Günün Metrajı</td>
          <td className="pl-1 text-end">{toplam.toLocaleString()}</td>
          <td className="pl-1"></td>
          <td className="grow pl-1"></td>
        </tr>
      </tbody>
    </table>
  );
}
