import { NextResponse } from "next/server";
import { tryCatch } from "@/lib/utils";
import { getUserById } from "@/auth/authDb";
import { createAccessToken, getUserFromSession } from "@/auth/authSession";

export async function GET() {
  const [data, error] = await tryCatch(getUserFromSession());
  if (error) return NextResponse.json(error, { status: 401 });

  if (data) {
    const [dataUser, errorUser] = await tryCatch(getUserById(data));
    if (errorUser)
      return NextResponse.json(errorUser.message, {
        status: 500,
      });

    const token = await createAccessToken();
    if (dataUser) {
      const name = dataUser[0].name;
      const admin = dataUser[0].admin == dataUser[0].pk_user;
      const member = dataUser[0].member == dataUser[0].pk_user;
      const result = { user: data, name, admin, member, accessToken: token };
      return NextResponse.json(result, { status: 200 });
    }
  }
  return NextResponse.json("Kullanıcı/Oturum bilgileri alınamadı. ", {
    status: 500,
  });
}

export const PATCH = async () => {
  return GET();
};
