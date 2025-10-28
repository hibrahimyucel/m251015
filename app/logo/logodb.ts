import { get } from "../../lib/dbmssql";
export async function LKSConn() {
  return await get("LKS", `${process.env.LOGO_DATABASE}`);
}
