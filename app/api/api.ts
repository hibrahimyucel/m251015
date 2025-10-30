export function externalApi() {
  return process.env.NEXT_PUBLIC_EXTERNAL
    ? process.env.NEXT_PUBLIC_EXTERNAL
    : "";
}
export const apiPath = {
  dailyInvoice: "/api/logo/dailyinvoice",
  dailyInvoiceTotal: "/api/logo/dailyinvoicetotal",
  invoiceList: "/api/logo/invoicelist",
  invoiceListXLS: "/api/logo/invoicelistxls",
};
