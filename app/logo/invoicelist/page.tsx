"use client";
import React, { useEffect, useState } from "react";
import InvoiceListTable from "./components/invoicelisttable";
import InvoiceListHeader, {
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
      sql += ` AND STL.OUTPUTIDCODE LIKE '%${filter.plaka.trim()}%' `;

    const x = base64from(await JSON.stringify({ Sql: sql, Params: [] }));
    //
    fetch("https://sponge-prepared-commonly.ngrok-free.app/api/runlkssql", {
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
        <InvoiceListHeader func={getData} />
        <InvoiceListTable data={data} />
      </div>
    </MemberRoute>
  );
}
