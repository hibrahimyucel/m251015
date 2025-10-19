import sql from "mssql";
import { get } from "@/lib/dbmssql";
import { sendEmail } from "@/lib/email";
import { hashSync } from "bcrypt-ts";

export async function getQuery() {
  const db = await get("MMBIS", `${process.env.MMBISDATABASE}`);
  return db.request();
}

export async function checkUserExists(email: string) {
  const sqlSelectUser: string = `select * from auth_user where email = @email`;

  const query = await getQuery();

  query.input("email", sql.VarChar(100), email.trim());
  const result = await query.query(sqlSelectUser);

  return result.recordset.length > 0;
}
export async function sendVerificationCode(email: string) {
  const sqlDeleteVerify = `DELETE auth_verify WHERE expiresAt<=GETDATE() or email = @email`;
  const sqlInsertVerify = `INSERT auth_verify SELECT @email AS email,
       cast(round(rand() * 1000000, 6) AS varchar(6)) AS value,
       DATEADD(MINUTE, 5, GETDATE()) AS expiresAt`;
  const sqlSelectVerify = `SELECT value FROM auth_verify WHERE expiresAt>=GETDATE() AND email = @email`;

  const query = await getQuery();

  query.input("email", sql.VarChar(100), email.trim());
  await query.query(sqlDeleteVerify);
  await query.query(sqlInsertVerify);
  const result = await query.query(sqlSelectVerify);

  const success = await sendEmail({
    name: "",
    email: email,
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
  const query = await getQuery();

  query.input("email", sql.VarChar(100), email.trim());
  query.input("value", sql.VarChar(100), value.trim());

  const result = await query.query(sqlSelectVerify);

  return result.rowsAffected[0] > 0;
}

export async function saveNewSignUp(
  username: string,
  email: string,
  password: string,
) {
  const sqlInsertUser: string = `INSERT INTO auth_user (name,email,password) VALUES (@name,@email,@password)`;

  const query = await getQuery();

  query.input("name", sql.VarChar(100), username.trim());
  query.input("email", sql.VarChar(100), email.trim());
  query.input("password", sql.VarChar(100), password);
  const result = await query.query(sqlInsertUser);

  return result;
}

export async function saveForgottenPassword(email: string) {
  const sqlGetPassword = `select cast (round(rand()*1000000,6) as varchar(6)) as value`;
  const sqlUpdatePassword = `update auth_user set password = @password WHERE email = @email`;
  const query = await getQuery();
  const resPwd = await query.query(sqlGetPassword);
  const password = hashSync(resPwd.recordset[0].value);

  query.input("email", sql.VarChar(100), email.trim());
  query.input("password", sql.VarChar(100), password.trim());
  await query.query(sqlUpdatePassword);

  const success = await sendEmail({
    name: "",
    email: email,
    subject: "Şifre yenileme",
    description: `Platforma giriş için yeni şifreniz : <b> ${resPwd.recordset[0].value}<b>`,
  });

  return success;
}
export async function saveNewPassword(
  user: string,
  password: string,
  username: string,
) {
  const sqlUpdatePassword = `update auth_user set name= @name, password = @password WHERE pk_user = @id`;
  const resPwd = hashSync(password);

  const query = await getQuery();
  query.input("id", sql.Int, user);
  query.input("name", sql.VarChar(100), username);
  query.input("password", sql.VarChar(100), resPwd);
  await query.query(sqlUpdatePassword);

  return true;
}
export async function getUserByMail(email: string) {
  const sqlSelectUser: string = `SELECT * FROM auth_user where email = @email`;
  const query = await getQuery();
  query.input("email", sql.VarChar(100), email);

  const result = await query.query(sqlSelectUser);

  return result.recordset;
}
export async function getUserById(id: string) {
  const sqlSelectUser: string = `SELECT * FROM auth_user where pk_user = @id`;

  const query = await getQuery();

  query.input("id", sql.Int, id);

  const result = await query.query(sqlSelectUser);

  return result.recordset;
}

export async function saveAdminStatus(pk_user: string, admin: boolean) {
  const sqlUpdateAdmin = `update auth_user set admin = ${admin ? "pk_user" : "null"} WHERE pk_user = @pk_user`;
  const query = await getQuery();

  query.input("pk_user", sql.Int, pk_user.trim());
  await query.query(sqlUpdateAdmin);

  return { success: true };
}
export async function saveMemberStatus(pk_user: string, admin: boolean) {
  const sqlUpdateMember = `update auth_user set member = ${admin ? "pk_user" : "null"} WHERE pk_user = @pk_user`;
  const query = await getQuery();

  query.input("pk_user", sql.Int, pk_user.trim());
  await query.query(sqlUpdateMember);

  return { success: true };
}
