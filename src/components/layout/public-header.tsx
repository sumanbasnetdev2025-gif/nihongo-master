import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Logo } from "@/components/shared/logo";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full overflow-hidden border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 md:px-6">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2 text-base font-bold tracking-tight sm:text-lg"
        >
          <Logo className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
          <span className="truncate">日本語 Master</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="#features" className="hover:text-foreground">
            Features
          </Link>
          <Link href="#levels" className="hover:text-foreground">
            JLPT Levels
          </Link>
          <Link href="#how-it-works" className="hover:text-foreground">
            How It Works
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="px-2 sm:px-3"
            nativeButton={false}
            render={<Link href="/login">Log in</Link>}
          />
          <Button
            size="sm"
            className="px-2.5 sm:px-3"
            nativeButton={false}
            render={<Link href="/register">Get Started</Link>}
          />
        </div>
      </div>
    </header>
  );
}
