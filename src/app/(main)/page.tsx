import Button from "@/components/ui/Button/Button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";




export default function Home() {

  


  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center items-center gap-12 px-6 py-16 sm:px-8 lg:px-10">
        <h1 className="text-[40px] font-bold text-primary">술마실땐? <span className="bg-linear-to-bl from-violet-500 to-fuchsia-500 bg-clip-text dark:from-purple-500 dark:to-pink-500 text-transparent">GwiGa</span></h1>
          <Link href="/RUOK"><Button title="시작하기" icon={<ExternalLink />} /></Link>
      </section>
    </main>
  );
}
