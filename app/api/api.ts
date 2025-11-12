export function externalApi() {
  return process.env.NEXT_PUBLIC_EXTERNAL
    ? process.env.NEXT_PUBLIC_EXTERNAL
    : "";
}
export function externalAuth() {
  return process.env.NEXT_PUBLIC_AUTH
    ? process.env.NEXT_PUBLIC_AUTH
    : process.env.NEXT_PUBLIC_SELF;
}
export const apiPath = {
  dailyInvoice: "/api/logo/dailyinvoice",
  dailyInvoiceTotal: "/api/logo/dailyinvoicetotal",
  invoiceList: "/api/logo/invoicelist",
  invoiceListXLS: "/api/logo/invoicelistxls",
  invoiceTotalXLS: "/api/logo/invoicetotalxls",
  user: {
    signUp: "/api/user/signup",
    signIn: "/api/user/signin",
    changePassword: "/api/user/changepassword",
    forgottenPassword: "/api/user/forgottenpassword",
    list: "/api/user/list",
    me: "/api/me",
  },
};
