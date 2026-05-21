import type { Metadata } from "next";
import "../globals.css";
import { WebThemeProviders } from "@/components/common/themeProviders";
import Header from "@/components/layout/Header/Header";

export const metadata: Metadata = {
  title: "GwiGa",
  description: "A Next.js web app starter built with TypeScript and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <WebThemeProviders>
          <Header />
          <section className="mx-auto w-full max-w-6xl flex-1 px-6 sm:px-8 lg:px-10">
            {children}
          </section>
        </WebThemeProviders>
      </body>
    </html>
  );
}
