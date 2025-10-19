"use client";
import React, { useState } from "react";

import MemberRoute from "@/components/authMember";
import AccountListHeader, {
  accountdbFilters,
} from "./components/accountListHeader";
import AccountListTable from "./components/accountListTable";
import { base64from } from "@/lib/utils";
import { invoiceData, sqlInvoiceData } from "../logodb";

export default function AccountsPage() {
  const [data, setData] = useState<invoiceData[]>([]);
  async function getData(filter: accountdbFilters) {
    let sql = sqlInvoiceData;
    sql += ` AND (STF.DATE_ BETWEEN ${filter.dateStart.toISOString()} AND ${filter.dateEnd.toISOString()} )`;
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
  }
  return (
    <MemberRoute>
      <div className="w-full">
        <h1 className="bg-buttoncolor pt-0.5 pl-2 text-sm font-bold">
          Hesap Listesi
        </h1>
        <AccountListHeader func={getData} />
        <AccountListTable data={data} />
      </div>
    </MemberRoute>
  );
}
