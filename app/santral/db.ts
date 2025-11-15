import { SantralRequest } from "../logo/logosql";

export async function getDailyList() {
  const request = await SantralRequest();
  const sql = `SELECT 
      A.SantralNo AS SANTRAL, 
      A.X AS ID, 
      A.IrsaliyeNo AS IRSALIYE, 
      A.STrhSaat AS TARIH, 
      A.ArcAdi AS PLAKA, 
      A.SofAdi AS SOFOR, 
      A.MusAdi AS HESAP, 
      A.RecAdi AS SINIF, 
      A.SanAdi AS SANTIYE, 
      A.FIrsMik AS MIKTAR 
    FROM 
      Onay A 
    WHERE 
      A.STarih = CAST (
        GETDATE() AS DATE
      ) 
    ORDER BY 
      a.STrhSaat DESC`;
  const result = await request.query(sql);
  return result.recordset;
}
export async function getDailyListTotal() {
  const sqlPlaka = `SELECT ROW_NUMBER() OVER (ORDER BY A.ArcAdi ASC) ID, A.ArcAdi AS PLAKA, SUM(A.FIrsMik) AS PLAKATOPLAM FROM Onay A 
  WHERE A.STarih = CAST ( GETDATE() AS DATE) GROUP BY A.ArcAdi`;
  const sqlUrun = `SELECT ROW_NUMBER() OVER (ORDER BY A.RecAdi ASC) ID, A.RecAdi AS URUN, SUM(A.FIrsMik) AS URUNTOPLAM FROM Onay A 
  WHERE A.STarih = CAST (GETDATE() AS DATE) GROUP BY A.RecAdi`;
  const sqlHesap = `SELECT ROW_NUMBER() OVER (ORDER BY A.MusAdi ASC) ID, A.MusAdi AS HESAP, SUM(A.FIrsMik) AS HESAPTOPLAM FROM Onay A 
  WHERE A.STarih = CAST (GETDATE() AS DATE) GROUP BY A.MusAdi`;

  const sqlToplam = `SELECT * FROM ( ${sqlPlaka} ) A
  FULL OUTER JOIN (${sqlUrun}) B ON A.ID = B.ID
  FULL OUTER JOIN (${sqlHesap}) C ON A.ID = C.ID
  UNION ALL
     SELECT NULL, 'TOPLAM', SUM(PLAKATOPLAM), NULL, 'TOPLAM', SUM(URUNTOPLAM), NULL, 'TOPLAM', SUM(HESAPTOPLAM)
     FROM (
     SELECT ISNULL( A.ID,ISNULL(B.ID,C.ID)) AS ID,A.PLAKA,A.PLAKATOPLAM, B.URUN,B.URUNTOPLAM,C.HESAP,C.HESAPTOPLAM FROM (
  ${sqlPlaka}) A
  FULL OUTER JOIN (${sqlUrun}) B ON A.ID = B.ID
  FULL OUTER JOIN (${sqlHesap}) C ON A.ID = C.ID
  ) FFF`;
  console.log(sqlToplam);
  const request = await SantralRequest();
  const result = await request.query(sqlToplam);

  return result.recordset;
}
