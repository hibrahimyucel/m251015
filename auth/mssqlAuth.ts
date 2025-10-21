import sql from "mssql";
import { get } from "@/lib/dbmssql";
import { sendEmail } from "@/lib/email";
import { hashSync } from "bcrypt-ts";

export const mmbisConn = await get("MMBIS", `${process.env.MMBISDATABASE}`);

type signUpData = {
  username: string;
  email: string;
  password: string;
};

export async function isUserExists(value: string) {
  const sqlSelectUser: string = `select * from auth_user where email = @email`;

  if (!mmbisConn.connected) await mmbisConn.connect();
  const request = mmbisConn.request();

  request.input("email", sql.VarChar(100), value.trim());
  const result = await request.query(sqlSelectUser);

  return result.recordset.length > 0;
}
export async function sendVerificationCode(value: string) {
  const sqlDeleteVerify = `DELETE auth_verify WHERE expiresAt<=GETDATE() or email = @email`;
  const sqlInsertVerify = `INSERT auth_verify SELECT @email AS email,
       cast(round(rand() * 1000000, 6) AS varchar(6)) AS value,
       DATEADD(MINUTE, 5, GETDATE()) AS expiresAt`;
  const sqlSelectVerify = `SELECT value FROM auth_verify WHERE expiresAt>=GETDATE() AND email = @email`;

  if (!mmbisConn.connected) await mmbisConn.connect();
  const request = mmbisConn.request();

  request.input("email", sql.VarChar(100), value.trim());
  await request.query(sqlDeleteVerify);
  await request.query(sqlInsertVerify);
  const result = await request.query(sqlSelectVerify);

  const success = await sendEmail({
    name: "",
    email: value,
    subject: "e-posta onay kodu",
    description: `e-Posta onay kodunuz : <b> ${result.recordset[0].value}<b>`,
  });

  return success;
}

export async function checkVerificationCode(email: string, value: string) {
  const sqlSelectVerify = `SELECT * FROM auth_verify
 WHERE expiresAt>=GETDATE()
  AND email = @email
  AND value = @value`;

  if (!mmbisConn.connected) await mmbisConn.connect();
  const request = mmbisConn.request();

  request.input("email", sql.VarChar(100), email.trim());
  request.input("value", sql.VarChar(100), value.trim());

  const result = await request.query(sqlSelectVerify);

  return result.rowsAffected[0] > 0;
}

export async function saveSignUpData(value: signUpData) {
  const sqlInsertUser: string = `INSERT INTO auth_user (name,email,password) VALUES (@name,@email,@password)`;

  if (!mmbisConn.connected) await mmbisConn.connect();
  const request = mmbisConn.request();

  request.input("name", sql.VarChar(100), value.username.trim());
  request.input("email", sql.VarChar(100), value.email.trim());
  request.input("password", sql.VarChar(100), value.password);
  const result = await request.query(sqlInsertUser);

  return result;
}

export async function sendPassword(email: string) {
  const sqlGetPassword = `select cast (round(rand()*1000000,6) as varchar(6)) as value`;
  const sqlUpdatePassword = `update auth_user set password = @password WHERE email = @email`;
  if (!mmbisConn.connected) await mmbisConn.connect();
  const request = mmbisConn.request();

  const resPwd = await request.query(sqlGetPassword);
  const password = hashSync(resPwd.recordset[0].value);

  request.input("email", sql.VarChar(100), email.trim());
  request.input("password", sql.VarChar(100), password.trim());
  await request.query(sqlUpdatePassword);

  const success = await sendEmail({
    name: "",
    email: email,
    subject: "Şifre yenileme",
    description: `Platforma giriş için yeni şifreniz : <b> ${resPwd.recordset[0].value}<b>`,
  });

  return success;
}
export async function changePasswordDB(
  user: string,
  password: string,
  username: string,
) {
  const sqlUpdatePassword = `update auth_user set name= @name, password = @password WHERE pk_user = @id`;
  const resPwd = hashSync(password);

  if (!mmbisConn.connected) await mmbisConn.connect();
  const request = mmbisConn.request();

  request.input("id", sql.Int, user);
  request.input("name", sql.VarChar(100), username);
  request.input("password", sql.VarChar(100), resPwd);
  await request.query(sqlUpdatePassword);

  return true;
}
export async function signInDB(value: signUpData) {
  const sqlSelectUser: string = `SELECT * FROM auth_user where email = @email`;

  if (!mmbisConn.connected) await mmbisConn.connect();
  const request = mmbisConn.request();

  request.input("email", sql.VarChar(100), value.email);

  const result = await request.query(sqlSelectUser);

  return result.recordset;
}
export async function getUserById(id: string) {
  const sqlSelectUser: string = `SELECT * FROM auth_user where pk_user = @id`;

  if (!mmbisConn.connected) await mmbisConn.connect();
  const request = mmbisConn.request();

  request.input("id", sql.Int, id);

  const result = await request.query(sqlSelectUser);

  return result.recordset;
}

export async function saveAdminStatus(pk_user: string, admin: boolean) {
  const sqlUpdateAdmin = `update auth_user set admin = ${admin ? "pk_user" : "null"} WHERE pk_user = @pk_user`;
  if (!mmbisConn.connected) await mmbisConn.connect();
  const request = mmbisConn.request();

  request.input("pk_user", sql.Int, pk_user.trim());
  await request.query(sqlUpdateAdmin);

  return { success: true };
}
export async function saveMemberStatus(pk_user: string, admin: boolean) {
  const sqlUpdateMember = `update auth_user set member = ${admin ? "pk_user" : "null"} WHERE pk_user = @pk_user`;
  if (!mmbisConn.connected) await mmbisConn.connect();
  const request = mmbisConn.request();

  request.input("pk_user", sql.Int, pk_user.trim());
  await request.query(sqlUpdateMember);

  return { success: true };
}
