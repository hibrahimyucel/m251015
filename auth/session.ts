/* muhasip.auth.session 15.10.2025 -> 15.10.2025 
   createSession
   deleteSession 
   createAccessToken 
   getUser  
*/

import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { tryCatch } from "@/lib/utils";

type SessionPayload = {
  user: string;
  expiresAt: Date;
};

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createAccessToken() {
  const user = await getUser();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  return new SignJWT({ user, expiresAt })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15 m")
    .sign(encodedKey);
}

async function createRefreshToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function createSession(user: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await createRefreshToken({ user, expiresAt });

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
}
export async function checkAuth() {
  const [data, error] = await tryCatch(getUser());
  if (error) return false;
  else return true;
}
export async function getUser(): Promise<string | null> {
  const cookie = (await cookies()).get("session")?.value;

  const payload = await payloadFrom(cookie);
  if (payload?.user) return payload?.user as string;
  else return null;
}

export async function deleteSession() {
  return (await cookies()).delete("session");
}

async function payloadFrom(session: string | undefined = "") {
  const { payload } = await jwtVerify(session, encodedKey, {
    algorithms: ["HS256"],
  });
  return payload;
}
