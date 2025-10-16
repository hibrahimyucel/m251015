import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/auth/context/authProvider";
import { FooterTimer } from "./components/footerTimer";

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background min-h-dvh antialiased`}
      >
        <AuthProvider>
          <div className="flex min-h-dvh flex-col p-0.5 text-2xl sm:text-sm">
            <div className="grow">{children}</div>
            <FooterTimer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
