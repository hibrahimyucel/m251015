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

export const sqlInvoiceDailyTotal = `SELECT 
        SUM(STL.AMOUNT) TOPLAM
        ,ITM.name URUN
        ,ul.name BIRIM
        
FROM LG_020_01_STFICHE STF
LEFT JOIN LG_020_01_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_020_UNITSETL UL ON ul.LOGICALREF = STL.uomref
LEFT JOIN LG_020_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
WHERE  STF.CANCELLED=0 and STF.DATE_ = CAST (GETDATE() AS DATE ) and STF.TRCODe=8 and UL.Name LIKE 'M3'
group by ITM.name
        ,ul.name`;

export const sqlInvoiceDaily = `SELECT STF.LOGICALREF
	,STF.FICHENO
	, CONVERT(varchar, STF.DATE_, 23) DATE_
	,STF.FTIME,P.CODE PLAKA
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
FROM LG_020_01_STFICHE STF
LEFT JOIN LG_020_01_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_020_UNITSETL UL ON ul.LOGICALREF = STL.uomref
LEFT JOIN LG_020_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_020_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
WHERE STF.CANCELLED=0 and STF.DATE_ =CAST (GETDATE() AS DATE ) and ul.name = 'M3' 
ORDER BY STF.DATE_
	,STF.FTIME DESC`;
export const sqlInvoiceData = `SELECT STF.LOGICALREF
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
FROM LG_020_01_STFICHE STF
LEFT JOIN LG_020_01_STLINE STL ON STF.LOGICALREF = STL.STFICHEREF
LEFT JOIN LG_020_UNITSETL UL ON ul.LOGICALREF = STL.uomref
LEFT JOIN LG_020_CLCARD CLC ON CLC.LOGICALREF = STF.CLIENTREF
LEFT JOIN LG_020_ITEMS ITM ON ITM.LOGICALREF = STL.STOCKREF
LEFT JOIN LG_SLSMAN P  ON P.LOGICALREF = STF.SALESMANREF
WHERE STF.CANCELLED=0 and UL.Name LIKE 'M3' `;
