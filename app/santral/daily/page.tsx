"use client";
import { apiPath, externalApi } from "@/app/api/api";
import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { santralData, santralDataTotal } from "../types";

export default function InvoiceDailyTable() {
  const [data, setData] = useState<santralData[]>([]);
  const [dataTotal, setDataTotal] = useState<santralDataTotal[]>([]);

  async function getData() {
    fetch(externalApi() + apiPath.santral.listDaily, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((d) => {
        setData(d);
      });

    fetch(externalApi() + apiPath.santral.listDailyTotal, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((d) => {
        setDataTotal(d);
      });
  }

  const [changer, setchanger] = useState<boolean>(true);
  const debChanger = useDebounce(changer, 30000);
  const datetime = new Date().toLocaleTimeString();

  useEffect(() => {
    getData();
    setchanger(!debChanger);
  }, [debChanger]);

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full flex-col overflow-hidden overflow-y-scroll border">
      <h1 className="bg-buttoncolor w-full pt-0.5 pl-2 text-sm font-bold">
        Güncel İrsaliye Listesi {datetime}
      </h1>

      <InvoiceHeader />
      {data?.length && <InvoiceData d={data} />}
      {dataTotal?.length && <TotalData dt={dataTotal} />}
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
function InvoiceData({ d }: { d: santralData[] }) {
  return (
    <div className="flex flex-col border">
      {d.map((data: santralData, index) => (
        <div
          key={index}
          className={`flex border-b ${index % 2 ? "bg-background" : "bg-diffcolor"} `}
        >
          <div className="flex w-30 shrink-0 overflow-hidden px-0.5 text-nowrap text-clip">
            {data.TARIH}
          </div>
          <div className="flex w-20 shrink-0 overflow-hidden text-nowrap text-clip">
            {data.PLAKA}
          </div>

          <div className="flex w-10 shrink-0 justify-end overflow-hidden px-0.5 text-nowrap text-clip">
            {data.MIKTAR}
          </div>

          <div className="flex w-12 shrink-0 items-center overflow-hidden px-0.5 text-xs text-nowrap text-clip">
            m3
          </div>
          <div className="flex w-50 overflow-hidden text-xs text-nowrap text-clip">
            {data.SINIF}
          </div>
          <div className="flex grow basis-75 truncate text-[10px]">
            {data.HESAP}
          </div>
          <div className="flex grow basis-25 overflow-hidden text-[10px] text-nowrap text-clip">
            {data.SANTIYE}
          </div>
        </div>
      ))}
    </div>
  );
}
function TotalData({ dt }: { dt: santralDataTotal[] }) {
  return (
    <table className="border-buttoncolor min-w-full border-collapse border text-xs">
      <thead>
        <tr className={`bg-buttoncolor border font-bold`}>
          <td className="grow pl-1">Araç</td>
          <td className="border-r pr-1 text-end">Toplam</td>
          <td className="grow pl-1">Ürün</td>
          <td className="pl-1 text-end">Toplam</td>

          <td className="border-r pl-1">Birim</td>
          <td className="grow pl-1">Hesap</td>
          <td className="border-r pr-1 text-end">Toplam</td>
        </tr>
      </thead>

      <tbody>
        {dt.map((item: santralDataTotal, index) => (
          <tr
            key={index}
            className={`border-b ${index % 2 ? "bg-background" : "bg-diffcolor"} `}
          >
            <td className="grow pl-1">{item.PLAKA}</td>
            <td className="border-r pr-1 text-end">
              {item.PLAKATOPLAM && item.PLAKATOPLAM.toLocaleString()}
            </td>
            <td className="grow pl-1">{item.URUN}</td>
            <td className="pl-1 text-end">
              {item.URUNTOPLAM && item.URUNTOPLAM.toLocaleString()}
            </td>

            <td className="border-r pl-1">m³</td>
            <td className="grow pl-1">{item.HESAP}</td>
            <td className="border-r pr-1 text-end">
              {item.HESAPTOPLAM && item.HESAPTOPLAM.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
