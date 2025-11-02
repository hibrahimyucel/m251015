import { createAccessToken, getUser } from "@/auth/session";
import { NextResponse } from "next/server";
import { base64from, tryCatch } from "@/lib/utils";
import { apiPath, externalAuth } from "../api";

export async function GET() {
  const [data, error] = await tryCatch(getUser());
  if (error) return NextResponse.json(error, { status: 401 });

  const token = await createAccessToken();
  if (data) {
    const x = base64from(await JSON.stringify({ id: data }));
    const response = await fetch(externalAuth() + apiPath.user.list, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        data: x,
      },
    });

    const dataUser = await response.json();

    if (dataUser) {
      const name = dataUser[0].name;
      const admin = dataUser[0].admin == data;
      const member = dataUser[0].member == data;

      const result = { user: data, name, admin, member, accessToken: token };

      return NextResponse.json(result, { status: 200 });
    }
    if (!dataUser)
      return NextResponse.json("Kullanıcı bulunamadı.", {
        status: 401,
      });
  }
  return NextResponse.json("Kullanıcı/oturum bilgileri sorgulanamadı. ", {
    status: 500,
  });
}

export const PATCH = async () => {
  return GET();
};
