import ToggleTheme from "@/components/ui/ToggleTheme/ToggleTheme";


export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <h1 className="text-[40px] font-bold text-primary">GwiGa</h1>
        <div className="flex items-center gap-4">
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}