"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/auth/context/authProvider";
import Image from "next/image";
import TextButton from "./textButton";
import Icons from "./icons";
export default function AppHeader() {
  const { UserData } = useAuth();

  useEffect(() => {}, [UserData]);

  return (
    <div className="border-bordercolor flex w-full rounded-sm border px-1">
      <div className="content-center">
        <Link href="/">
          <Image
            src="/logo.jpg"
            width={194}
            height={194}
            alt=""
            priority={false}
            className="h-10 w-10 rounded-md"
          />
        </Link>
      </div>
      <div className="content-center px-1">
        <Link href="/">
          <div className="font-serif">Muhasip</div>
          <div className="font-serif text-sm">{UserData.name}</div>
        </Link>
      </div>
      <div className="grow"></div>

      <div className="flex flex-row items-center gap-1 text-center">
        {!UserData.id && (
          <Link href="/login">
            <Icons icon="LogIn"></Icons>
          </Link>
        )}
        {UserData.member && (
          <>
            <Link href="/logo/invoicedaily">
              <TextButton text={"Sevk Takip"} />
            </Link>
            <Link href="/logo/invoicelist">
              <TextButton text={"İrsaliye Listesi"} />
            </Link>
            {/*<Link href="/logo/accounts">
              <TextButton text={"Cari Hesaplar"} />
            </Link>
*/}
            <Link href="/dashboard">
              <TextButton text={"Profil"} />
            </Link>
          </>
        )}
        {UserData.admin && (
          <Link href="/users">
            <TextButton text={"Ayarlar"} />
          </Link>
        )}
      </div>
    </div>
  );
}
