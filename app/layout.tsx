import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "ECO GIRLS COLLECTIVE Dashboard",
  description: "Impact tracking dashboard for the Girl in Bloom Global Ambassadors Program 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className={`${geist.className} min-h-full flex flex-col`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
