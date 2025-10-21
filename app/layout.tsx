import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/auth/context/authProvider";
import { FooterTimer } from "../components/footerTimer";
import AppHeader from "../components/appHeader";
import { info } from "@/project/project";
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
  metadata.title = info.project.caption;
  metadata.description = info.project.description;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
      >
        <AuthProvider>
          <div className="bg-background grid w-full grid-rows-[48px_1fr_24px] p-0.5">
            <div className="content-center rounded-t-sm border border-slate-500">
              <AppHeader />
            </div>
            <div className="h-[calc(100vh-5rem)] overflow-y-auto border-r border-l border-slate-500">
              {children}
            </div>
            <div className="content-center rounded-b-sm border border-slate-500">
              <FooterTimer />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
