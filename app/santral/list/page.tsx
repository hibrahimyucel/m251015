"use client";
import React, { useState, useRef } from "react";
import Icons from "@/components/icons";
import MemberRoute from "@/components/authMember";
import { apiPath, externalApi } from "@/app/api/api";
import { base64from } from "@/lib/utils";
import {
  initSantralDataFilters,
  santralData,
  santralDataFilters,
} from "../types";

export default function InvoiceListPage() {
  function getFileName() {
    const d = new Date();
    const s = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getMilliseconds()}.xlsx`;
    return s;
  } /*
  async function getXlsxFile(filterDB: santralDataFilters) {
    try {
      setdbFilter(filterDB);

      const x = await JSON.stringify({
        db: dbFilter.current,
        local: localFilter.current,
      });
      const x1 = base64from(x);
      fetch(externalApi() + apiPath.invoiceListXLS, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          data: x1,
        },
      })
        .then((response) => {
          response.blob().then((blob) => {
            const fileURL = window.URL.createObjectURL(blob);
            const alink = document.createElement("a");
            alink.href = fileURL;
            alink.download = getFileName();
            alink.click();
          });
        })
        .catch((error) => alert(error.message));
    } catch (error) {
      alert((error as Error).message);
    }
  }

  
  async function getTotalXlsxFile(filterDB: invoicedbFilters) {
    try {
      setdbFilter(filterDB);

      const x = await JSON.stringify({
        db: dbFilter.current,
        local: localFilter.current,
      });
      const x1 = base64from(x);
      fetch(externalApi() + apiPath.invoiceTotalXLS, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          data: x1,
        },
      })
        .then((response) => {
          response.blob().then((blob) => {
            const fileURL = window.URL.createObjectURL(blob);
            const alink = document.createElement("a");
            alink.href = fileURL;
            alink.download = getFileName();
            alink.click();
          });
        })
        .catch((error) => alert(error.message));
    } catch (error) {
      alert((error as Error).message);
    }
  }
*/
  return (
    <MemberRoute>
      <div className="w-full">
        <h1 className="bg-buttoncolor pt-0.5 pl-2 text-sm font-bold">
          İrsaliye Listesi
        </h1>
        {/*<InvoiceListHeader
          func={getData}
          downloadxlsx={getXlsxFile}
          downloadtotalxlsx={getTotalXlsxFile}
        />
        <InvoiceListTable data={data} setlocalFilter={setlocalFilter} />
      */}
      </div>
    </MemberRoute>
  );
}

type ListHeaderProps = {
  func: (filter: santralDataFilters) => void;
  downloadxlsx: (filter: santralDataFilters) => void;
  downloadtotalxlsx: (filter: santralDataFilters) => void;
};
function ListHeader({
  func,
  downloadxlsx,
  downloadtotalxlsx,
}: ListHeaderProps) {
  const [dbFilter, setdbFilter] = useState<santralDataFilters>(
    initSantralDataFilters,
  );
  const [changer, setChanger] = useState(false);

  const s = new Date();
  const e = new Date();
  s.setFullYear(s.getFullYear() - 30);
  e.setFullYear(e.getFullYear() + 1);

  function listele() {
    func(dbFilter);
  }
  function savexls() {
    downloadxlsx(dbFilter);
  }
  function saveTotalxls() {
    downloadtotalxlsx(dbFilter);
  }
  function handleSelectMonth(month: number) {
    const year = dbFilter.TARIH1.getFullYear();
    const sDate = new Date(0);
    sDate.setFullYear(year);
    sDate.setMonth(month - 1);
    sDate.setDate(2);
    const eDate = new Date(sDate);
    eDate.setMonth(eDate.getMonth() + 1);
    eDate.setDate(eDate.getDate() - 1);

    setdbFilter({ ...dbFilter, TARIH1: sDate, TARIH2: eDate });
    setChanger(!changer);
  }

  return (
    <div className="flex w-full flex-wrap gap-1 rounded-sm text-center font-bold">
      <div className="border-diffcolor flex shrink-0 basis-80 flex-col justify-center rounded-sm border sm:flex-col">
        Tarih aralığı
        <div className="grid grid-cols-3">
          <select
            id="month"
            name="month"
            className="border-0 outline-0"
            onChange={(e) => handleSelectMonth(Number(e.target.value))}
          >
            <option value="1">Ocak</option>
            <option value="2">Şubat</option>
            <option value="3">Mart</option>
            <option value="4">Nisan</option>
            <option value="5">Mayıs</option>
            <option value="6">Haziran</option>
            <option value="7">Temmuz</option>
            <option value="8">Ağustos</option>
            <option value="9">Eylül</option>
            <option value="10">Ekim</option>
            <option value="11">Kasım</option>
            <option value="12">Aralık</option>
          </select>
          <input
            type="date"
            name="DateStart"
            value={dbFilter.TARIH1.toISOString().substring(0, 10)}
            onChange={(e) => {
              if (e.target.value)
                setdbFilter({
                  ...dbFilter,
                  TARIH1: e.target.valueAsDate as Date,
                });
            }}
            className="focus:bg-editboxfocus bg-editbox w-full rounded-sm outline-0 focus:outline-0"
          />
          <input
            type="date"
            name="DateEnd"
            value={dbFilter.TARIH2.toISOString().substring(0, 10)}
            onChange={(e) => {
              if (e.target.value)
                setdbFilter({
                  ...dbFilter,
                  TARIH2: e.target.valueAsDate as Date,
                });
            }}
            className="focus:bg-editboxfocus bg-editbox w-full rounded-sm outline-0 focus:outline-0"
          />
        </div>
      </div>
      <div className="border-diffcolor flex basis-10 flex-col justify-center rounded-sm border">
        Plaka
        <input
          type="text"
          name="plaka"
          defaultValue={dbFilter.PLAKA}
          onChange={(e) =>
            setdbFilter({
              ...dbFilter,
              PLAKA: e.target.value,
            })
          }
          className="focus:bg-editboxfocus bg-editbox w-full rounded-sm outline-0 focus:outline-0"
        />
      </div>
      <div className="border-diffcolor flex basis-15 flex-col justify-center rounded-sm border">
        Sınıfı
        <input
          type="text"
          name="metraj"
          defaultValue={dbFilter.SINIF}
          onChange={(e) =>
            setdbFilter({
              ...dbFilter,
              SINIF: e.target.value,
            })
          }
        />
      </div>

      <div className="border-diffcolor flex grow basis-15 flex-col justify-center rounded-sm border">
        Firma
        <input
          type="text"
          name="firma"
          defaultValue={dbFilter.HESAP}
          onChange={(e) =>
            setdbFilter({
              ...dbFilter,
              HESAP: e.target.value,
            })
          }
        />
      </div>
      <div className="border-diffcolor hidden basis-15 flex-col justify-center rounded-sm border sm:flex">
        Fiş No
        <input
          type="text"
          name="fisno"
          defaultValue={dbFilter.IRSALIYE}
          onChange={(e) =>
            setdbFilter({
              ...dbFilter,
              IRSALIYE: e.target.value,
            })
          }
        />
      </div>
      <div className="border-editbox content-center justify-center rounded-sm border">
        <button
          type="button"
          className="flex h-full flex-row items-center p-1 font-bold"
          onClick={listele}
        >
          Listele
          <Icons icon="List" />
        </button>
      </div>
      <div className="border-editbox content-center justify-center rounded-sm border">
        <button
          type="button"
          className="flex h-full flex-row items-center p-1 font-bold"
          onClick={savexls}
        >
          Excel
          <Icons icon="Download" />
        </button>
      </div>
      <div className="border-editbox content-center justify-center rounded-sm border">
        <button
          type="button"
          className="flex h-full flex-row items-center p-1 font-bold"
          onClick={saveTotalxls}
        >
          Rapor
          <Icons icon="Download" />
        </button>
      </div>
    </div>
  );
}
