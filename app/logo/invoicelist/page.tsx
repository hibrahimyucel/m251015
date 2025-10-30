"use client";
import React, { useState, useRef } from "react";
import InvoiceListTable from "./components/invoicelisttable";
import InvoiceListHeader, {
  initdbFilters,
  invoicedbFilters,
} from "./components/invoicelistheader";
import MemberRoute from "@/components/authMember";
import { base64from } from "@/lib/utils";
import { invoiceData } from "../logosql";
import { apiPath } from "@/app/api/api";

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
  async function getXlsxFile(filterDB: invoicedbFilters) {
    try {
      setdbFilter(filterDB);

      const x = base64from(
        await JSON.stringify({
          db: dbFilter.current,
          local: localFilter.current,
        }),
      );
      fetch(apiPath.invoiceListXLS, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          data: x,
        },
      }).then((response) => {
        response.blob().then((blob) => {
          const fileURL = window.URL.createObjectURL(blob);
          const alink = document.createElement("a");
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
    const headerData = base64from(await JSON.stringify({ dbFilter: filter }));

    fetch(apiPath.invoiceList, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        data: headerData,
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
