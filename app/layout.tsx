import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Muhasip",
  description: "Modüler Bilgi İşlem Sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dateStr = new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    /*hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",*/
  }).format(new Date());

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background min-h-dvh antialiased`}
      >
        <div className="flex min-h-dvh flex-col p-0.5 font-mono text-2xl sm:text-sm">
          <div className="flex grow">{children}</div>
          <div className="flex flex-row border-t">
            <p className="grow justify-start">
              Muhasip Modüler Bilgi işlem sistemi
            </p>
            <p className="justify-end">{dateStr}</p>
          </div>
        </div>
      </body>
    </html>
  );
}
