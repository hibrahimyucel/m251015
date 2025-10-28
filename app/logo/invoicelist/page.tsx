"use client";
import React, { useState, useRef } from "react";
import InvoiceListTable from "./components/invoicelisttable";
import InvoiceListHeader, {
  initdbFilters,
  invoicedbFilters,
} from "./components/invoicelistheader";
import MemberRoute from "@/components/authMember";
import {
  invoiceData,
  sqlInvoiceData,
} from "../invoicedaily/components/invoicedaily";
import { base64from } from "@/lib/utils";

export default function InvoiceListPage() {
  const [data, setData] = useState<invoiceData[]>([]);
  const localFilter = useRef<Partial<invoiceData>>({});
  const dbFilter = useRef<invoicedbFilters>(initdbFilters());
  function setdbFilter(filter: invoicedbFilters) {
    dbFilter.current = filter;
  }
  function setlocalFilter(filter: Partial<invoiceData>) {
    localFilter.current = filter;
  }
  function geFileName() {
    const d = new Date();
    const s = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getMilliseconds()}.xlsx`;
    return s;
  }
  async function getXlsxFile(filter: invoicedbFilters) {
    try {
      setdbFilter(filter);
      console.log(dbFilter.current, localFilter.current);
      const x = base64from(
        await JSON.stringify({ db: dbFilter, local: localFilter }),
      );
      fetch("/api/fileirsaliye", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          data: x,
        },
      }).then((response) => {
        response.blob().then((blob) => {
          const fileURL = window.URL.createObjectURL(blob);
          let alink = document.createElement("a");
          alink.href = fileURL;
          alink.download = geFileName();
          alink.click();
        });
      });
    } catch (error) {
      alert((error as Error).message);
    }
  }

  async function getData(filter: invoicedbFilters) {
    let sql = sqlInvoiceData;

    sql += ` AND (STF.DATE_ BETWEEN '${filter.dateStart.toISOString()}' AND '${filter.dateEnd.toISOString()}' )`;
    if (filter.firma.trim())
      sql += ` AND CLC.DEFINITION_ LIKE '${filter.firma.trim()}%' `;
    if (filter.fisno.trim())
      sql += ` AND STF.FICHENO LIKE '%${filter.fisno.trim()}%' `;

    if (filter.metraj.trim())
      sql += ` AND ITM.NAME LIKE '%${filter.metraj.trim()}%' `;

    if (filter.plaka.trim())
      sql += ` AND P.CODE LIKE '%${filter.plaka.trim()}%' `;

    const x = base64from(await JSON.stringify({ Sql: sql, Params: [] }));
    //https://sponge-prepared-commonly.ngrok-free.app
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
  }
  return (
    <MemberRoute>
      <div className="w-full">
        <h1 className="bg-buttoncolor pt-0.5 pl-2 text-sm font-bold">
          İrsaliye Listesi
        </h1>
        <InvoiceListHeader func={getData} downloadxlsx={getXlsxFile} />
        <InvoiceListTable data={data} setlocalFilter={setlocalFilter} />
      </div>
    </MemberRoute>
  );
}
