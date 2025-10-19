"use client";

import { useAuth } from "@/auth/context/authProvider";
import HomePageCard from "@/components/homePageCard";
export default function Home() {
  const { UserData } = useAuth();
  console.log(UserData);
  return (
    <div className="h-full w-full gap-2">
      {!UserData.id && (
        <div className="flex flex-wrap justify-center py-2 align-top">
          <HomePageCard Name={"Giriş Yap"} Href="/login" Desc={""} />
        </div>
      )}
      {UserData.member && (
        <div className="flex flex-wrap justify-center gap-2 py-2 align-top">
          <HomePageCard
            Name={"Sevk Takip"}
            Href="/logo/invoicedaily"
            Desc={"Sevk Takip"}
          />
          <HomePageCard
            Name={"İrsaliye Listesi"}
            Href="/logo/invoicelist"
            Desc={"İrsaliye Listesi"}
          />
          <HomePageCard
            Name="Profil"
            Href="/dashboard"
            Desc="Şifrenizi ve kullanıcı adınızı değiştirebilirsiniz."
          />
        </div>
      )}
      {UserData.admin && (
        <div className="flex flex-wrap justify-center gap-1 py-2 align-top">
          <HomePageCard Name="Ayarlar" Href="/users" Desc="" />
        </div>
      )}
    </div>
  );
}
