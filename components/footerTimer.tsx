"use client";
import { useAuth } from "@/auth/context/authProvider";
import { useState, useEffect } from "react";
export function FooterTimer() {
  const [time, setTime] = useState("");
  const { statusMessage, setStatusMessage } = useAuth();
  useEffect(() => {
    const opt: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const timeout = setTimeout(() => {
      setTime(new Intl.DateTimeFormat("tr-TR", opt).format(new Date()));
    }, 2000);
    return () => clearTimeout(timeout);
  }, [time, statusMessage]);

  return (
    <div className="flex w-full flex-row px-0.5">
      <p className="justify-start">Muhasip Modüler Bilgi işlem sistemi</p>
      <p className="grow text-center font-bold text-nowrap text-red-500">
        {statusMessage}
      </p>
      <p className="justify-end">{time}</p>
    </div>
  );
}
