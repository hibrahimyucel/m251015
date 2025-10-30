"use client";
import { logout } from "@/auth/actions/logInActions";
import React from "react";
import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/auth/context/authProvider";
import Image from "next/image";
import TextButton from "./textButton";
import Icons from "./icons";
import { info } from "@/project/project";
import { redirect } from "next/navigation";
export default function AppHeader() {
  const { UserData } = useAuth();

  useEffect(() => {}, [UserData]);

  return (
    <div className="flex w-full flex-row px-0.5">
      <div className="content-center px-0.5">
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
      <div>
        <Link href="/">
          <div className="font-serif">{info.project.caption}</div>
          <div className="font-serif text-sm text-nowrap">{UserData.name}</div>
        </Link>
      </div>
      <div className="grow"></div>

      <div className="hidden items-center gap-1 text-center sm:flex sm:flex-row">
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
        {UserData.id && (
          <TextButton
            text="Çıkış"
            onClick={() => {
              logout().then(() => redirect("/"));
            }}
          />
        )}
      </div>
    </div>
  );
}
