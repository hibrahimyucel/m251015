export function externalApi(path: string) {
  return process.env.NEXT_PUBLIC_EXTERNAL
    ? process.env.NEXT_PUBLIC_EXTERNAL
    : "" + path;
}
export function externalAuth(path: string) {
  return process.env.NEXT_PUBLIC_AUTH
    ? process.env.NEXT_PUBLIC_AUTH
    : process.env.NEXT_PUBLIC_SELF + path;
}
export const apiPath = {
  dailyInvoice: "/api/logo/dailyinvoice",
  dailyInvoiceTotal: "/api/logo/dailyinvoicetotal",
  invoiceList: "/api/logo/invoicelist",
  invoiceListXLS: "/api/logo/invoicelistxls",
  invoiceTotalXLS: "/api/logo/invoicetotalxls",
  santral: {
    listDaily: "/api/santral/listdaily",
    listDailyTotal: "/api/santral/listdailytotal",
    list: "/api/santral/list",
  },
  user: {
    signUp: "/api/user/signup",
    signIn: "/api/user/signin",
    changePassword: "/api/user/changepassword",
    forgottenPassword: "/api/user/forgottenpassword",
    list: "/api/user/list",
    me: "/api/me",
  },
};
