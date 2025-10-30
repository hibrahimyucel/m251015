import { get } from "../../lib/dbmssql";

export async function LKSRequest() {
  const Conn = await get("LKS", `${process.env.LOGO_DATABASE}`);
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
WHERE STF.CANCELLED=0 and STF.DATE_ =CAST (GETDATE() AS DATE ) and ul.name = 'M3' 
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
WHERE STF.CANCELLED=0 and UL.Name LIKE 'M3' `;

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
WHERE STF.CANCELLED=0 and UL.Name LIKE 'M3' `;
