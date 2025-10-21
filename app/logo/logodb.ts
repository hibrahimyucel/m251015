import { get } from "../../lib/dbmssql";
export const LKSConn = await get("LKS", `${process.env.LOGO_DATABASE}`);
