"use client";
import React, { useEffect, useState } from "react";

import MemberRoute from "@/components/authMember";
import AccountListHeader from "./components/accountListHeader";
import AccountListTable from "./components/accountListTable";

export default function AccountsPage() {
  return (
    <MemberRoute>
      <div className="w-full">
        <h1 className="bg-buttoncolor pt-0.5 pl-2 text-sm font-bold">
          Hesap Listesi
        </h1>
        <AccountListHeader />
        <AccountListTable />
      </div>
    </MemberRoute>
  );
}
