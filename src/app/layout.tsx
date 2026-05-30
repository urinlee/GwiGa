import type { Metadata } from "next";
import "./globals.css";
import { WebThemeProviders } from "@/components/common/themeProviders";
import Header from "@/components/layout/Header/Header";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "GwiGa",
  description: "A Next.js web app starter built with TypeScript and Tailwind CSS.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <WebThemeProviders>
            {children}
        </WebThemeProviders>
      </body>
    </html>
  );
}