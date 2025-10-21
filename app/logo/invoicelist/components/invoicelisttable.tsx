"use client";
import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { invoiceData } from "../../invoicedaily/components/invoicedaily";
/*
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
];*/

type invoiceLocalFilters = invoiceData;
type totalData = { AMOUNT: number; URUN: string; BIRIM: string; ID: string };
function calculateTotal(data: invoiceData[]) {
  let totalData: totalData[] = [];
  let totalAmount: number = 0;
  function add(item: totalData) {
    const i = totalData.findIndex((f: totalData) => f.ID == item.ID);
    if (i == -1) totalData.push(item);
    else totalData[i].AMOUNT += item.AMOUNT;
    totalAmount += item.AMOUNT;
  }

  data.map((item: invoiceData) =>
    add({
      AMOUNT: item.AMOUNT,
      URUN: item.URUN,
      BIRIM: item.BIRIM,
      ID: item.URUN + item.BIRIM,
    }),
  );
  totalData.sort((a, b) => a.ID.localeCompare(b.ID));
  return { totalData, totalAmount };
}

export default function InvoiceListTable({ data }: { data: invoiceData[] }) {
  const [localFilter, setLocalFilter] = useState<Partial<invoiceLocalFilters>>(
    {},
  );
  const xlocalfilter = useDebounce(localFilter, 500);

  let localData: invoiceData[] = [];
  const entries = Object.entries(xlocalfilter).filter((item) =>
    item ? item : false,
  );
  console.log("xlocalfilter ", xlocalfilter, entries);
  if (entries.length)
    localData = data.filter((item) =>
      entries.every(([key, value]) =>
        item[key as keyof typeof item]
          ? item[key as keyof typeof item]
              .toString()
              .toLocaleLowerCase()
              .includes(value.toString().toLocaleLowerCase())
          : false,
      ),
    );
  else localData = data;

  const { totalData, totalAmount } = calculateTotal(localData);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full justify-center gap-0.5 pt-0.5 pr-4 text-center font-bold">
        <div className="flex shrink-0 basis-30 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Tarih-Saat
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value.trim()) {
                setLocalFilter({ DATE_: e.target.value });
              } else {
                setLocalFilter({});
              }
            }}
          />
        </div>
        <div className="flex shrink-0 basis-20 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Plaka
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value.trim()) {
                setLocalFilter({ PLAKA: e.target.value });
              } else {
                setLocalFilter({});
              }
            }}
          />
        </div>
        <div className="flex shrink-0 basis-12 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Metraj
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value.trim()) {
                setLocalFilter({ URUN: e.target.value });
              } else {
                setLocalFilter({});
              }
            }}
          />
        </div>
        <div className="flex shrink-0 basis-12 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Birim
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value.trim()) {
                setLocalFilter({ BIRIM: e.target.value });
              } else {
                setLocalFilter({});
              }
            }}
          />
        </div>

        <div className="flex grow-2 basis-60 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Firma
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value.trim()) {
                setLocalFilter({ HESAP: e.target.value });
              } else {
                setLocalFilter({});
              }
            }}
          />
        </div>
        <div className="flex grow-2 basis-60 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Adres
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value.trim()) {
                setLocalFilter({ ADDR: e.target.value });
              } else {
                setLocalFilter({});
              }
            }}
          />
        </div>
        <div className="flex basis-30 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Fiş No
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value.trim()) {
                setLocalFilter({ FICHENO: e.target.value });
              } else {
                setLocalFilter({});
              }
            }}
          />
        </div>
        <div className="flex basis-30 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Tip
        </div>
      </div>
      <div className="flex h-[calc(100vh-12rem)] w-full flex-col overflow-hidden overflow-y-scroll border">
        {localData?.length &&
          localData.map((data: invoiceData, index) => (
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
              <div className="flex grow-2 basis-60 truncate">{data.HESAP}</div>
              <div className="flex grow-1 basis-60 overflow-hidden text-nowrap text-clip">
                {data.ADDR}
              </div>
              <div className="flex basis-30 justify-end overflow-hidden text-nowrap text-clip">
                {data.FICHENO}
              </div>
              <div className="flex basis-30 overflow-hidden text-nowrap text-clip">
                {data.TIP}
              </div>
            </div>
          ))}

        {totalData.length && (
          <table className="border-buttoncolor min-w-full border-collapse border">
            <caption className="font-bold">Toplamlar</caption>
            <tbody>
              {totalData.map((item: totalData, index) => (
                <tr
                  key={index}
                  className={`border-b ${index % 2 ? "bg-background" : "bg-diffcolor"} `}
                >
                  <td className="pl-1">{index + 1}</td>
                  <td className="pl-1"> </td>
                  <td className="pl-1 text-end">{item.AMOUNT}</td>
                  <td className="pl-1">{item.BIRIM}</td>
                  <td className="grow pl-1">{item.URUN}</td>
                </tr>
              ))}
              <tr key={-1} className={`bg-buttoncolor border-b font-bold`}>
                <td className="pl-1"></td>
                <td className="pl-1">Toplam Metraj</td>
                <td className="pl-1 text-end">{totalAmount}</td>
                <td className="pl-1"></td>
                <td className="grow pl-1"></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
