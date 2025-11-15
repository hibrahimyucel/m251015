export type santralData = {
  ID: number;
  SANTRAL: string;
  IRSALIYE: string;
  TARIH: string;
  PLAKA: string;
  SOFOR: string;
  HESAP: string;
  SINIF: string;
  SANTIYE: string;
  MIKTAR: number;
};
export type santralDataList = santralData[] | null;
export type santralDataTotal = {
  ID: number;
  PLAKA: string;
  PLAKATOPLAM: number;
  HESAP: string;
  HESAPTOPLAM: number;
  URUN: string;
  URUNTOPLAM: number;
};
export type santralDataFilters = Partial<santralData> & {
  TARIH1: Date;
  TARIH2: Date;
};
export type santralLocalFilters = Partial<santralData>;
export function initSantralDataFilters(): santralDataFilters {
  const s = new Date();
  const e = new Date();
  e.setMonth(e.getMonth() + 1);
  s.setMonth(s.getMonth() - 1);
  return {
    TARIH1: s,
    TARIH2: e,
  };
}
