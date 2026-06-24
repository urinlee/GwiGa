import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-12 px-6 py-16 sm:px-8 lg:px-10">
        <h1 className="text-[40px] font-bold text-primary">
          술마실땐?{" "}
          <span className="bg-linear-to-bl from-violet-500 to-fuchsia-500 bg-clip-text text-transparent dark:from-purple-500 dark:to-pink-500">
            GwiGa
          </span>
        </h1>
        <Link
          className="flex items-center gap-2 rounded-md bg-button-bg px-4 py-2 font-semibold text-text-force-primary transition-opacity hover:opacity-90"
          href="/my"
        >
          <ExternalLink className="size-5" />
          <span className="leading-none">시작하기</span>
        </Link>
      </section>
    </main>
  );
}
