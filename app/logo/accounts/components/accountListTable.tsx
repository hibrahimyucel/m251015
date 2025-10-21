import { invoiceData } from "../../invoicedaily/components/invoicedaily";
export default function AccountListTable({ data }: { data: invoiceData[] }) {
  return (
    <>
      <div className="flex w-full flex-col py-1">
        <div className="flex w-full justify-center gap-0.5 pt-0.5 pr-4 text-center font-bold">
          <div className="flex shrink-0 basis-30 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Tarih-Saat
            <input type="text" />
          </div>
          <div className="flex shrink-0 basis-20 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Plaka
            <input type="text" />
          </div>
          <div className="flex shrink-0 basis-12 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Metraj
            <input type="text" />
          </div>
          <div className="flex shrink-0 basis-12 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Birim
            <input type="text" />
          </div>
          <div className="flex grow basis-60 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Sınıfı
            <input type="text" />
          </div>
          <div className="flex grow basis-60 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Firma
            <input type="text" />
          </div>
          <div className="flex grow basis-60 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Adres
          </div>
          <div className="flex basis-30 flex-col justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Fiş No
            <input type="text" />
          </div>
          <div className="flex basis-30 justify-center overflow-hidden rounded-t-md border text-nowrap text-clip">
            Tip
          </div>
        </div>

        {data?.length ? (
          <div className="flex w-full grow flex-col overflow-y-scroll border">
            {data.map((data: invoiceData, index) => (
              <div
                key={index}
                className={`flex w-full gap-0.5 border-b ${index % 2 ? "bg-background" : "bg-diffcolor"} `}
              >
                <div className="flex shrink-0 basis-30 overflow-hidden text-nowrap text-clip">
                  {data.DATE_.substring(0, 10).concat(" ").concat(data.SAAT)}
                </div>
                <div className="flex shrink-0 basis-20 overflow-hidden text-nowrap text-clip">
                  {"plaka?"}
                </div>
                <div className="flex shrink-0 basis-12 justify-end overflow-hidden pr-0.5 text-nowrap text-clip">
                  {data.AMOUNT}
                </div>
                <div className="flex shrink-0 basis-12 overflow-hidden text-nowrap text-clip">
                  {data.BIRIM}
                </div>
                <div className="flex grow basis-60 overflow-hidden text-nowrap text-clip">
                  {data.URUN}
                </div>
                <div className="flex grow-2 basis-60 truncate">
                  {data.HESAP}
                </div>
                <div className="flex grow basis-60 overflow-hidden text-nowrap text-clip">
                  {data.ADDR}
                </div>
                <div className="flex basis-30 justify-end overflow-hidden text-nowrap text-clip">
                  {data.FICHENO}
                </div>
                <div className="flex basis-30 overflow-hidden text-nowrap text-clip">
                  {data.TIP}
                </div>
              </div>
            ))}
          </div>
        ) : (
          "Kayıt bulunamadı"
        )}
      </div>
    </>
  );
}
