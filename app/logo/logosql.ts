import { get } from "../../lib/dbmssql";

export async function LKSRequest() {
  const Conn = await get("LKS", `${process.env.LOGO_DATABASE}`);
  if (!Conn.connected) await Conn.connect();
  return Conn.request();
}
export async function SantralRequest() {
  const Conn = await get("SNT", `${process.env.SANTRALDATABASE}`);
  if (!Conn.connected) await Conn.connect();
  return Conn.request();
}

const firma = "020";
const donem = "01";

export interface invoiceData {
  LOGICALREF: number;
  FICHENO: string;
  DATE_: string;
  FTIME: string;
  SAAT: string;
  AMOUNT: number;
  URUN: string;
  BIRIM: string;
  HESAP: string;
  ADDR: string;
  TIP: string;
  PLAKA: string;
}

export const sqlInvoiceDaily = `SELECT STF.LOGICALREF
	,STF.FICHENO
	, CONVERT(varchar, STF.DATE_, 23) DATE_
	,STF.FTIME, P.CODE PLAKA
	,RIGHT('0' + CAST((STF.FTIME / 65536 / 256) AS VARCHAR(2)), 2) + ':' + RIGHT('0' + CAST((((STF.FTIME / 65536) - ((STF.FTIME / 65536 / 256) * 256))) AS VARCHAR(2)), 2)  AS SAAT
	,STL.AMOUNT
	,ITM.name URUN
	,ul.name BIRIM
	,clc.DEFINITION_ HESAP
	,stl.LINEEXP ADDR
	,CASE STF.TRCODE
		WHEN 1
			THEN 'Mal alım irsaliyesi'
		WHEN 2
			THEN 'Per. sat. iade irs.'
		WHEN 3
			THEN 'Topt.sat. iade irs.'
		WHEN 4
			THEN 'Kons. çıkış iade irs.'
		WHEN 5
			THEN 'Konsinye giriş irs.'
		WHEN 6
			THEN 'Alım iade irs.'
		WHEN 7
			THEN 'Perakende satış irs.'
		WHEN 8
			THEN 'Toptan satış irs.'
		WHEN 9
			THEN 'Konsinye çıkış irs.'
		WHEN 10
			THEN 'Konsinye giriş iade irs.'
		WHEN 11
			THEN 'Fire fişi'
		WHEN 12
			THEN 'Sarf fişi'
		WHEN 13
			THEN 'üretimden giriş fişi'
		WHEN 14
			THEN 'Devir fişi'
		WHEN 25
			THEN 'Ambar fişi'
		WHEN 26
			THEN 'Mustahsil irs.'
		WHEN 50
			THEN 'Sayım Fazlası Fişi'
		WHEN 51
			THEN 'Sayım Eksiği Fişi'
		ELSE 'DİĞER'
		END AS TIP
FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON UL.LOGICALREF = STL.UOMREF
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
WHERE STF.CANCELLED=0 and STF.DATE_ =CAST (GETDATE() AS DATE ) and ul.name = 'M3' AND STL.INVOICEREF=0
ORDER BY STF.DATE_, STF.FTIME DESC`;

export const sqlInvoiceDailyTotal = `SELECT 
        SUM(STL.AMOUNT) TOPLAM
        ,ITM.name URUN
        ,ul.name BIRIM        
FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON UL.LOGICALREF = STL.UOMREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
WHERE  STF.CANCELLED=0 and STF.DATE_ = CAST (GETDATE() AS DATE ) and STF.TRCODe=8 and UL.Name LIKE 'M3'
AND STL.INVOICEREF=0
GROUP BY ITM.NAME  ,UL.NAME`;

export const sqlInvoice = `SELECT STF.LOGICALREF
	,STF.FICHENO,P.CODE PLAKA
	, CONVERT(varchar, STF.DATE_, 23) DATE_
	,STF.FTIME
	,RIGHT('0' + CAST((STF.FTIME / 65536 / 256) AS VARCHAR(2)), 2) + ':' + RIGHT('0' + CAST((((STF.FTIME / 65536) - ((STF.FTIME / 65536 / 256) * 256))) AS VARCHAR(2)), 2)  AS SAAT
	,STL.AMOUNT
	,ITM.name URUN
	,ul.name BIRIM
	,clc.DEFINITION_ HESAP
	,stl.LINEEXP ADDR,stl.OUTPUTIDCODE PLAKA
	,CASE STF.TRCODE
		WHEN 1
			THEN 'Mal alım irsaliyesi'
		WHEN 2
			THEN 'Per. sat. iade irs.'
		WHEN 3
			THEN 'Topt.sat. iade irs.'
		WHEN 4
			THEN 'Kons. çıkış iade irs.'
		WHEN 5
			THEN 'Konsinye giriş irs.'
		WHEN 6
			THEN 'Alım iade irs.'
		WHEN 7
			THEN 'Perakende satış irs.'
		WHEN 8
			THEN 'Toptan satış irs.'
		WHEN 9
			THEN 'Konsinye çıkış irs.'
		WHEN 10
			THEN 'Konsinye giriş iade irs.'
		WHEN 11
			THEN 'Fire fişi'
		WHEN 12
			THEN 'Sarf fişi'
		WHEN 13
			THEN 'üretimden giriş fişi'
		WHEN 14
			THEN 'Devir fişi'
		WHEN 25
			THEN 'Ambar fişi'
		WHEN 26
			THEN 'Mustahsil irs.'
		WHEN 50
			THEN 'Sayım Fazlası Fişi'
		WHEN 51
			THEN 'Sayım Eksiği Fişi'
		ELSE 'DİĞER'
		END AS TIP
FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON ul.LOGICALREF = STL.uomref
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
WHERE STF.CANCELLED=0 and UL.Name LIKE 'M3' AND STL.INVOICEREF=0 `;

export const sqlInvoicexls = `SELECT STF.LOGICALREF as 'Kayıt No'
	,STF.FICHENO as 'Fiş No' , P.CODE Plaka
	, CONVERT(varchar, STF.DATE_, 23) Tarih	
	,RIGHT('0' + CAST((STF.FTIME / 65536 / 256) AS VARCHAR(2)), 2) + ':' + RIGHT('0' + CAST((((STF.FTIME / 65536) - ((STF.FTIME / 65536 / 256) * 256))) AS VARCHAR(2)), 2)  AS Saat
	,STL.AMOUNT Metraj
	,ITM.name  as 'Sınıfı'
	,ul.name  Birim
	,clc.DEFINITION_  Firma
	,stl.LINEEXP Adres
	,CASE STF.TRCODE
		WHEN 1
			THEN 'Mal alım irsaliyesi'
		WHEN 2
			THEN 'Per. sat. iade irs.'
		WHEN 3
			THEN 'Topt.sat. iade irs.'
		WHEN 4
			THEN 'Kons. çıkış iade irs.'
		WHEN 5
			THEN 'Konsinye giriş irs.'
		WHEN 6
			THEN 'Alım iade irs.'
		WHEN 7
			THEN 'Perakende satış irs.'
		WHEN 8
			THEN 'Toptan satış irs.'
		WHEN 9
			THEN 'Konsinye çıkış irs.'
		WHEN 10
			THEN 'Konsinye giriş iade irs.'
		WHEN 11
			THEN 'Fire fişi'
		WHEN 12
			THEN 'Sarf fişi'
		WHEN 13
			THEN 'üretimden giriş fişi'
		WHEN 14
			THEN 'Devir fişi'
		WHEN 25
			THEN 'Ambar fişi'
		WHEN 26
			THEN 'Mustahsil irs.'
		WHEN 50
			THEN 'Sayım Fazlası Fişi'
		WHEN 51
			THEN 'Sayım Eksiği Fişi'
		ELSE 'DİĞER'
		END AS Tip
FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON ul.LOGICALREF = STL.uomref
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
WHERE STF.CANCELLED=0 and UL.Name LIKE 'M3' AND STL.INVOICEREF=0 `;

export const sqlUrunToplam = `SELECT 
  0 as SIRA, 
  CONVERT(varchar, STF.DATE_, 23) TARIH, 
  STL.AMOUNT METRAJ, 
  ITM.NAME URUN, 
  UL.NAME BIRIM, 
  CLC.DEFINITION_ HESAP, 
  STL.LINEEXP ADRES, 
  P.CODE PLAKA, 
  STF.TRCODE AS TIP, 
  1 as SEFER 
FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON ul.LOGICALREF = STL.UOMREF
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
WHERE 
  STF.CANCELLED = 0 
  and UL.NAME LIKE 'M3' 
  and STF.TRCODE = 8 AND STL.INVOICEREF=0
  AND (STF.DATE_ BETWEEN @dateStart AND @dateEnd)
UNION ALL 
SELECT 
  1, 
  NULL, 
  SUM(STL.AMOUNT), 
  ITM.NAME, 
  NULL, 
  'TOPLAM', 
  NULL, 
  NULL, 
  null, 
  COUNT(1) 
FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON ul.LOGICALREF = STL.UOMREF
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
WHERE 
  STF.CANCELLED = 0 
  and UL.NAME LIKE 'M3' 
  and STF.TRCODE = 8 AND STL.INVOICEREF=0 
  AND (STF.DATE_ BETWEEN @dateStart AND @dateEnd)
GROUP BY 
  ITM.NAME, 
  STF.TRCODE 
ORDER BY 
  URUN, 
  SIRA, 
  TARIH`;
export const sqlHesapToplam = `SELECT 
  0 as SIRA, 
  CONVERT(varchar, STF.DATE_, 23) TARIH, 
  STL.AMOUNT METRAJ, 
  ITM.NAME URUN, 
  UL.NAME BIRIM, 
  CLC.DEFINITION_ HESAP, 
  STL.LINEEXP ADRES, 
  P.CODE PLAKA, 
  STF.TRCODE AS TIP, 
  1 as SEFER 
FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON ul.LOGICALREF = STL.UOMREF
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
WHERE 
  STF.CANCELLED = 0 
  and UL.NAME LIKE 'M3' 
  and STF.TRCODE = 8 AND STL.INVOICEREF=0 
  AND (STF.DATE_ BETWEEN @dateStart AND @dateEnd)
UNION ALL 
SELECT 
  1, 
  null, 
  sum(STL.AMOUNT), 
  'TOPLAM', 
  null, 
  clc.DEFINITION_, 
  null, 
  NULL, 
  null, 
  count(1) 
FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON ul.LOGICALREF = STL.UOMREF
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
WHERE 
  STF.CANCELLED = 0 
  and UL.NAME LIKE 'M3' 
  and STF.TRCODE = 8 AND STL.INVOICEREF=0 
  AND (STF.DATE_ BETWEEN @dateStart AND @dateEnd)
group by 
  clc.DEFINITION_, 
  STF.TRCODE 
ORDER BY 
  HESAP, 
  SIRA, 
  TARIH`;
export const sqlPlakaToplam = `SELECT 
  0 as SIRA, 
  CONVERT(varchar, STF.DATE_, 23) TARIH, 
  STL.AMOUNT METRAJ, 
  ITM.NAME URUN, 
  UL.NAME BIRIM, 
  CLC.DEFINITION_ HESAP, 
  STL.LINEEXP ADRES, 
  P.CODE PLAKA, 
  STF.TRCODE AS TIP, 
  1 as SEFER 
FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON ul.LOGICALREF = STL.UOMREF
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
WHERE 
  STF.CANCELLED = 0 
  and UL.NAME LIKE 'M3' 
  and STF.TRCODE = 8 AND STL.INVOICEREF=0
  AND (STF.DATE_ BETWEEN @dateStart AND @dateEnd)
UNION ALL 
SELECT 
  1, 
  null, 
  sum(STL.AMOUNT), 
  'TOPLAM', 
  null, 
  NULL, 
  null, 
  P.CODE, 
  null, 
  count(1) 
FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON ul.LOGICALREF = STL.UOMREF
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
WHERE 
  STF.CANCELLED = 0 
  and UL.NAME LIKE 'M3' 
  and STF.TRCODE = 8 AND STL.INVOICEREF=0 
  AND (STF.DATE_ BETWEEN @dateStart AND @dateEnd)
group by 
  P.CODE, 
  STF.TRCODE 
ORDER BY 
  PLAKA, 
  SIRA, 
  TARIH`;
export const sqlInvoiceDailyTotal3 = `
SELECT *
FROM   (SELECT Row_number()
                 OVER (
                   ORDER BY P.code ASC) X,
               P.code                   PLAKA,
               Sum(STL.amount)          PLAKATOPLAM,
               UL.NAME                  BIRIM
                     FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON ul.LOGICALREF = STL.UOMREF
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
        WHERE  STF.cancelled = 0
               AND STF.date_ = Cast (Getdate() AS DATE)
               AND STF.trcode = 8 AND STL.INVOICEREF=0
               AND UL.NAME LIKE 'M3'
        GROUP  BY P.code,
                  UL.NAME) A
       FULL OUTER JOIN (SELECT Row_number()
                                 OVER (
                                   ORDER BY CLC.DEFINITION_ ASC) X,
                               CLC.DEFINITION_                   HESAP,
                               Sum(STL.amount)                   HESAPTOPLAM
                     FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON ul.LOGICALREF = STL.UOMREF
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
                        WHERE  STF.cancelled = 0
                               AND STF.date_ = Cast (Getdate() AS DATE)
                               AND STF.trcode = 8 AND STL.INVOICEREF=0
                               AND UL.NAME LIKE 'M3'
                        GROUP  BY CLC.DEFINITION_,
                                  UL.NAME) B
                    ON A.x = B.x
       FULL OUTER JOIN (SELECT Row_number()
                                 OVER (
                                   ORDER BY ITM.NAME ASC) X,
                               ITM.NAME                   URUN,
                               Sum(STL.amount)            URUNTOPLAM
                     FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON ul.LOGICALREF = STL.UOMREF
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
   WHERE  STF.cancelled = 0
                               AND STF.date_ = Cast (Getdate() AS DATE)
                               AND STF.trcode = 8 AND STL.INVOICEREF=0
                               AND UL.NAME LIKE 'M3'
                        GROUP  BY ITM.NAME,
                                  UL.NAME) C
                    ON A.x = C.x
UNION ALL
SELECT NULL,
       'TOPLAM',
       Sum(plakatoplam),
       NULL,
       NULL,
       'TOPLAM',
       Sum(hesaptoplam),
       NULL,
       'TOPLAM',
       Sum(uruntoplam)
FROM   (SELECT Row_number()
                 OVER (
                   ORDER BY P.code ASC) X,
               P.code                   PLAKA,
               Sum(STL.amount)          PLAKATOPLAM,
               UL.NAME                  BIRIM
                     FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON ul.LOGICALREF = STL.UOMREF
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
        WHERE  STF.cancelled = 0
               AND STF.date_ = Cast (Getdate() AS DATE)
               AND STF.trcode = 8 AND STL.INVOICEREF=0
               AND UL.NAME LIKE 'M3'
        GROUP  BY P.code,
                  UL.NAME) A
       FULL OUTER JOIN (SELECT Row_number()
                                 OVER (
                                   ORDER BY CLC.DEFINITION_ ASC) X,
                               CLC.DEFINITION_                   HESAP,
                               Sum(STL.amount)                   HESAPTOPLAM
                     FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON ul.LOGICALREF = STL.UOMREF
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
                        WHERE  STF.cancelled = 0
                               AND STF.date_ = Cast (Getdate() AS DATE)
                               AND STF.trcode = 8 AND STL.INVOICEREF=0 
                               AND UL.NAME LIKE 'M3'
                        GROUP  BY CLC.DEFINITION_,
                                  UL.NAME) B
                    ON A.x = B.x
       FULL OUTER JOIN (SELECT Row_number()
                                 OVER (
                                   ORDER BY ITM.NAME ASC) X,
                               ITM.NAME                   URUN,
                               Sum(STL.amount)            URUNTOPLAM
                     FROM LG_${firma}_${donem}_STFICHE STF
LEFT JOIN LG_${firma}_${donem}_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_${firma}_UNITSETL UL ON ul.LOGICALREF = STL.UOMREF
LEFT JOIN LG_${firma}_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_${firma}_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
                        WHERE  STF.cancelled = 0
                               AND STF.date_ = Cast (Getdate() AS DATE)
                               AND STF.trcode = 8 AND STL.INVOICEREF=0
                               AND UL.NAME LIKE 'M3'
                        GROUP  BY ITM.NAME,
                                  UL.NAME) C
                    ON A.x = C.x `;
