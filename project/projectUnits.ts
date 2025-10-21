import { projectUnit, publicRoles } from "./projectTypes";

export const project: projectUnit = {
  name: "muhasip",
  type: "scope",
  caption: "Muhasip",
  description: "Modüler Bilgi İşlem Sistemi",
  actions: null,
  path: null,
  roles: null,
  modules: {},
  apis: {},
};

const signIn: projectUnit = {
  name: "signIn",
  type: "module",
  caption: "Giriş yap",
  roles: publicRoles,
};
const signUp: projectUnit = {
  name: "signIn",
  type: "module",
  caption: "Kayıt ol",
  roles: publicRoles,
};

const forgottenPassword: projectUnit = {
  name: "forgottenPassword",
  type: "module",
  caption: "Şifremi unuttum",
  roles: ["member", "admin"],
};
export const logIn: projectUnit = {
  name: "login",
  type: "scope",
  actions: { signIn, signUp, forgottenPassword },
};

const changePassword: projectUnit = {
  name: "changePassword",
  type: "module",
  caption: "Şifre değiştir",
  roles: ["member", "admin"],
};
const logOut: projectUnit = {
  name: "dashboard",
  type: "action",
  actions: { changePassword },
};
export const dashboard: projectUnit = {
  name: "dashboard",
  type: "module",
  actions: { changePassword, logOut },
};

const invoiceDaily: projectUnit = {
  name: "invoiceDaily",
  type: "module",
};
const invoiceList: projectUnit = {
  name: "invoiceDaily",
  type: "module",
};
export const logo: projectUnit = {
  name: "logo",
  type: "scope",
  modules: { invoiceDaily, invoiceList },
};
const userList: projectUnit = {
  name: "userList",
  type: "module",
};
export const adminPanel: projectUnit = {
  name: "adminPanel",
  type: "scope",
  modules: { userList },
};
