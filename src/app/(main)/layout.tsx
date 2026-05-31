import type { Metadata } from "next";
import "../globals.css";
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

  const session = await auth();
  const is_login = !!session?.user;

  return (
    <>
          <Header session={session} />
          <section className="mx-auto w-full max-w-6xl flex-1 px-6 sm:px-8 lg:px-10">
            {children}
          </section>
    </>
  );
}
