"use client";
import { useState } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { invoiceData } from "../../invoicedaily/components/invoicedaily";

type totalData = { AMOUNT: number; URUN: string; BIRIM: string; ID: string };
function calculateTotal(data: invoiceData[]) {
  const totalData: totalData[] = [];
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
type invoiceListTableProps = {
  data: invoiceData[];
  setlocalFilter: (filter: Partial<invoiceData>) => void;
};

export default function InvoiceListTable({
  data,
  setlocalFilter,
}: invoiceListTableProps) {
  const [localFilter, setLocalFilter] = useState<Partial<invoiceData>>({});
  const xlocalfilter = useDebounce(localFilter, 500);

  function setFilter(filter: Partial<invoiceData>) {
    setlocalFilter(filter);
    setLocalFilter(filter);
  }

  let localData: invoiceData[] = [];
  const entries = Object.entries(xlocalfilter).filter((item) =>
    item ? item : false,
  );

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
        <div className="flex w-30 shrink-0 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Tarih-Saat
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value.trim()) {
                setFilter({ DATE_: e.target.value });
              } else {
                setFilter({});
              }
            }}
          />
        </div>
        <div className="flex w-20 shrink-0 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Plaka
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value.trim()) {
                setFilter({ PLAKA: e.target.value });
              } else {
                setFilter({});
              }
            }}
          />
        </div>
        <div className="flex w-12 shrink-0 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Metraj
        </div>
        <div className="flex w-10 shrink-0 flex-col overflow-hidden rounded-t-md border text-nowrap text-clip">
          Birim
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value.trim()) {
                setFilter({ BIRIM: e.target.value });
              } else {
                setFilter({});
              }
            }}
          />
        </div>
        <div className="flex w-50 shrink-0 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Sınıfı
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value.trim()) {
                setFilter({ URUN: e.target.value });
              } else {
                setFilter({});
              }
            }}
          />
        </div>
        <div className="flex grow basis-75 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Firma
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value.trim()) {
                setFilter({ HESAP: e.target.value });
              } else {
                setFilter({});
              }
            }}
          />
        </div>
        <div className="flex grow basis-25 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Adres
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value.trim()) {
                setFilter({ ADDR: e.target.value });
              } else {
                setFilter({});
              }
            }}
          />
        </div>
        <div className="flex w-25 shrink-0 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
          Fiş No
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value.trim()) {
                setFilter({ FICHENO: e.target.value });
              } else {
                setFilter({});
              }
            }}
          />
        </div>
      </div>
      <div className="flex h-[calc(100vh-14rem)] w-full flex-col overflow-hidden overflow-y-scroll border">
        {localData?.length &&
          localData.map((data: invoiceData, index) => (
            <div
              key={index}
              className={`flex w-full gap-0.5 border-b ${index % 2 ? "bg-background" : "bg-diffcolor"} `}
            >
              <div className="flex w-30 shrink-0 overflow-hidden text-nowrap text-clip">
                {data.DATE_.substring(0, 10).concat(" ").concat(data.SAAT)}
              </div>
              <div className="flex w-20 shrink-0 overflow-hidden text-nowrap text-clip">
                {data.PLAKA}
              </div>
              <div className="flex w-12 shrink-0 justify-end overflow-hidden pr-0.5 text-nowrap text-clip">
                {data.AMOUNT}
              </div>
              <div className="flex w-10 shrink-0 items-center overflow-hidden px-0.5 text-xs text-nowrap text-clip">
                {data.BIRIM}
              </div>
              <div className="flex w-50 shrink-0 overflow-hidden text-xs text-nowrap text-clip">
                {data.URUN}
              </div>
              <div className="flex grow basis-75 truncate text-[10px]">
                {data.HESAP}
              </div>
              <div className="flex grow basis-25 overflow-hidden text-[10px] text-nowrap text-clip">
                {data.ADDR}
              </div>
              <div className="flex w-25 shrink-0 justify-end overflow-hidden text-[10px] text-nowrap text-clip">
                {data.FICHENO}
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
                  <td className="pl-1 text-end">
                    {item.AMOUNT.toLocaleString()}
                  </td>
                  <td className="pl-1">{item.BIRIM}</td>
                  <td className="grow pl-1">{item.URUN}</td>
                </tr>
              ))}
              <tr key={-1} className={`bg-buttoncolor border-b font-bold`}>
                <td className="pl-1"></td>
                <td className="pl-1">Toplam Metraj</td>
                <td className="pl-1 text-end">
                  {totalAmount.toLocaleString()}
                </td>
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
