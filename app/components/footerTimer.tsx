"use client";
import { useState, useEffect } from "react";
export function FooterTimer() {
  const [time, setTime] = useState("");

  const opt: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTime(new Intl.DateTimeFormat("tr-TR", opt).format(new Date()));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [time]);

  return (
    <div className="flex flex-row border-t">
      <p className="grow justify-start">Muhasip Modüler Bilgi işlem sistemi</p>
      <p className="justify-end">{time}</p>
    </div>
  );
}
