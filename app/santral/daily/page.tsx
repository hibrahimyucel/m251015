"use client";
import { apiPath, externalApi } from "@/app/api/api";
import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { santralData, santralDataTotal } from "../types";

export default function SantralDailyPage() {
  const [data, setData] = useState<santralData[]>([]);
  const [dataTotal, setDataTotal] = useState<santralDataTotal[]>([]);

  async function getData() {
    fetch(externalApi(apiPath.santral.listDaily), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((d) => {
        setData(d);
      });

    fetch(externalApi(apiPath.santral.listDailyTotal), {
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
    <div className="flex h-[calc(100vh-6rem)] w-full flex-col overflow-hidden overflow-y-scroll">
      <h1 className="bg-buttoncolor w-full pt-0.5 pl-2 text-sm font-bold">
        Güncel Sevk Listesi {datetime}
      </h1>

      {data?.length && <SantralData d={data} />}
      <h1 className="bg-buttoncolor w-full pt-0.5 pl-2 text-sm font-bold">
        Toplamlar
      </h1>
      {dataTotal?.length && <SantralDataTotal dt={dataTotal} />}
    </div>
  );
}

function SantralData({ d }: { d: santralData[] }) {
  return (
    <table className="border-diffcolor min-w-full border text-sm">
      <thead>
        <tr
          className={`bg-buttoncolor border-diffcolor h-6 border text-center font-bold`}
        >
          <td className="">Tarih-Saat</td>
          <td className="">Plaka</td>
          <td className="">Metraj</td>

          <td className="">Sınıfı</td>
          <td className="">Hesap</td>
          <td>Şantiye</td>
        </tr>
      </thead>
      <tbody>
        {d.map((data: santralData, index) => (
          <tr
            key={index}
            className={` ${index % 2 ? "bg-background" : "bg-diffcolor"} `}
          >
            <td className="border-buttoncolor overflow-hidden border-r px-0.5 text-nowrap text-clip">
              {data.TARIH
                ? data.TARIH.substring(0, 10).concat(
                    " ",
                    data.TARIH.substring(11, 16),
                  )
                : ""}
            </td>
            <td className="border-buttoncolor overflow-hidden border-r px-0.5 text-nowrap text-clip">
              {data.PLAKA}
            </td>

            <td className="border-buttoncolor overflow-hidden border-r pr-1 text-end text-nowrap text-clip">
              {data.MIKTAR}
            </td>

            <td className="border-buttoncolor overflow-hidden border-r px-0.5 text-nowrap text-clip">
              {data.SINIF}
            </td>
            <td className="border-buttoncolor truncate overflow-hidden border-r px-0.5 text-nowrap text-clip">
              {data.HESAP}
            </td>
            <td className="overflow-hidden px-0.5 text-nowrap text-clip">
              {data.SANTIYE}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function SantralDataTotal({ dt }: { dt: santralDataTotal[] }) {
  return (
    <table className="min-w-full border-collapse text-sm">
      <thead>
        <tr className={`bg-buttoncolor border-diffcolor h-6 border font-bold`}>
          <td className="grow px-1">Araç</td>
          <td className="px-1 text-end">Toplam</td>
          <td className="grow pl-1">Ürün</td>
          <td className="px-1 text-end">Toplam</td>
          <td className="grow px-1">Hesap</td>
          <td className="px-1 text-end">Toplam</td>
        </tr>
      </thead>

      <tbody>
        {dt.map((item: santralDataTotal, index) => (
          <tr
            key={index}
            className={` ${index % 2 ? "bg-background" : "bg-diffcolor"} ${index == dt.length - 1 ? "font-bold" : ""} `}
          >
            <td className="grow px-1">{item.PLAKA}</td>
            <td className="border-buttoncolor border-r px-1 text-end">
              {item.PLAKATOPLAM && item.PLAKATOPLAM.toLocaleString()}
            </td>
            <td className="grow pl-1">{item.URUN}</td>
            <td className="border-buttoncolor border-r px-1 text-end">
              {item.URUNTOPLAM && item.URUNTOPLAM.toLocaleString()}
            </td>

            <td className="grow px-1">{item.HESAP}</td>
            <td className="px-1 text-end">
              {item.HESAPTOPLAM && item.HESAPTOPLAM.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
