"use client";
import React from "react";
import Link from "next/link";

type props = {
  Name: string;
  Desc: string;
  Href: string;
};
export default function HomePageCard({ Name, Desc, Href }: props) {
  return (
    <div className="bg-diffcolor hover:bg-editboxfocus relative max-h-40 w-full rounded-lg border p-2 pb-2 shadow-sm sm:w-70">
      <Link href={Href}>
        <div className="mb-2 flex justify-center">
          <h5 className="rounded-sm text-2xl font-semibold">{Name}</h5>
        </div>
        <div className="max-h-40 overflow-y-auto border-t p-3 text-center">
          <p className="mb-4 block max-w-lg leading-normal font-light">
            {Desc}
          </p>
        </div>
      </Link>
    </div>
  );
}
