"use client";
import React, { useEffect, useState } from "react";
import InvoiceListTable from "./components/invoicelisttable";
import InvoiceListHeader from "./components/invoicelistheader";
import MemberRoute from "@/components/authMember";

export default function InvoiceListPage() {
  return (
    <MemberRoute>
      <div className="w-full">
        <h1 className="bg-buttoncolor pt-0.5 pl-2 text-sm font-bold">
          İrsaliye Listesi
        </h1>
        <InvoiceListHeader />
        <InvoiceListTable />
      </div>
    </MemberRoute>
  );
}
