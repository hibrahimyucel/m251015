"use client";
import React, { useEffect, useState } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import Icons from "@/components/icons";
export type invoicedbFilters = {
  dateStart: Date;
  dateEnd: Date;
  plaka: string;
  metraj: string;
  birim: string;

  firma: string;
  fisno: string;
  adres: string;
  tarih: string;
};
function initdbFilters(): invoicedbFilters {
  const s = new Date();
  const e = new Date();
  e.setMonth(e.getMonth() + 1);
  s.setMonth(s.getMonth() - 1);
  return {
    dateStart: s,
    dateEnd: e,
    plaka: "",
    metraj: "",
    birim: "",
    firma: "",
    fisno: "",
    adres: "",
    tarih: "",
  };
}
type invoiceListHeaderProps = {
  func: (filter: invoicedbFilters) => void;
};
export default function InvoiceListHeader({ func }: invoiceListHeaderProps) {
  const [dbFilter, setdbFilter] = useState<invoicedbFilters>(initdbFilters);

  const s = new Date();
  const e = new Date();
  s.setFullYear(s.getFullYear() - 30);
  e.setFullYear(e.getFullYear() + 1);

  const debdbFilter = useDebounce(dbFilter, 500);
  //  useEffect(() => {}, [DateStart]);
  console.log(dbFilter);
  function listele() {
    func(dbFilter);
  }

  return (
    <div className="flex w-full justify-center gap-1 rounded-sm text-center font-bold">
      <div className="border-diffcolor flex basis-60 flex-col justify-center rounded-sm border">
        Tarih aralığı
        <div className="grid grid-cols-2">
          <input
            type="date"
            name="DateStart"
            min={s.toISOString().substring(0, 10)}
            max={dbFilter.dateEnd.toISOString().substring(0, 10)}
            defaultValue={dbFilter.dateStart.toISOString().substring(0, 10)}
            onChange={(e) => {
              if (e.target.value)
                setdbFilter({
                  ...dbFilter,
                  dateStart: e.target.valueAsDate as Date,
                });
            }}
            className="focus:bg-editboxfocus bg-editbox w-full rounded-sm outline-0 focus:outline-0"
          />
          <input
            type="date"
            name="DateEnd"
            min={dbFilter.dateStart.toISOString().substring(0, 10)}
            max={e.toISOString().substring(0, 10)}
            defaultValue={dbFilter.dateEnd.toISOString().substring(0, 10)}
            onChange={(e) => {
              if (e.target.value)
                setdbFilter({
                  ...dbFilter,
                  dateEnd: e.target.valueAsDate as Date,
                });
            }}
            className="focus:bg-editboxfocus bg-editbox w-full rounded-sm outline-0 focus:outline-0"
          />
        </div>
      </div>
      <div className="border-diffcolor flex basis-25 flex-col justify-center rounded-sm border">
        Plaka
        <input
          type="text"
          name="plaka"
          defaultValue={dbFilter.plaka}
          onChange={(e) =>
            setdbFilter({
              ...dbFilter,
              plaka: e.target.value,
            })
          }
          className="focus:bg-editboxfocus bg-editbox w-full rounded-sm outline-0 focus:outline-0"
        />
      </div>
      <div className="border-diffcolor flex shrink-0 basis-25 flex-col justify-center rounded-sm border">
        Metraj
        <input
          type="text"
          name="metraj"
          defaultValue={dbFilter.metraj}
          onChange={(e) =>
            setdbFilter({
              ...dbFilter,
              metraj: e.target.value,
            })
          }
        />
      </div>
      <div className="border-diffcolor flex shrink-0 basis-25 flex-col justify-center rounded-sm border">
        Birim
        <input
          type="text"
          name="birim"
          defaultValue={dbFilter.birim}
          onChange={(e) =>
            setdbFilter({
              ...dbFilter,
              birim: e.target.value,
            })
          }
        />
      </div>

      <div className="border-diffcolor flex grow-2 basis-60 flex-col justify-center rounded-sm border">
        Firma
        <input
          type="text"
          name="birim"
          defaultValue={dbFilter.firma}
          onChange={(e) =>
            setdbFilter({
              ...dbFilter,
              firma: e.target.value,
            })
          }
        />
      </div>
      <div className="border-diffcolor flex basis-30 flex-col justify-center rounded-sm border">
        Fiş No
        <input
          type="text"
          name="birim"
          defaultValue={dbFilter.fisno}
          onChange={(e) =>
            setdbFilter({
              ...dbFilter,
              fisno: e.target.value,
            })
          }
        />
      </div>
      <div className="border-editbox hover:bg-editboxfocus bg-buttoncolor flex w-15 flex-col content-center justify-center rounded-sm border">
        <button
          type="button"
          className="h-full place-self-center"
          onClick={listele}
        >
          <Icons icon="List" />
        </button>
      </div>
    </div>
  );
}
