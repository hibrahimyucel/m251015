import { createAccessToken, getUser } from "@/auth/session";
import { NextResponse } from "next/server";
import { tryCatch } from "@/lib/utils";
import { getUserById } from "@/auth/mssqlAuth";

export async function GET() {
  const [data, error] = await tryCatch(getUser());
  if (error) return NextResponse.json(error, { status: 401 });
  const token = await createAccessToken();
  if (data) {
    const [dataUser, errorUser] = await tryCatch(getUserById(data));
    if (dataUser) {
      const name = dataUser[0].name;
      const admin = dataUser[0].admin == dataUser[0].pk_user;
      const member = dataUser[0].member == dataUser[0].pk_user;

      const result = { user: data, name, admin, member, accessToken: token };

      return NextResponse.json(result, { status: 200 });
    }
    if (errorUser)
      return NextResponse.json(errorUser.message, {
        status: 500,
      });
  }
  return NextResponse.json("Kullanıcı/oturum bilgileri sorgulanamadı. ", {
    status: 500,
  });
}

export const PATCH = async () => {
  return GET();
};
