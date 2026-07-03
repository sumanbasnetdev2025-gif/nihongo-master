import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/theme-toggle'

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          日本語 Master
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="#features" className="hover:text-foreground">Features</Link>
          <Link href="#levels" className="hover:text-foreground">JLPT Levels</Link>
          <Link href="#how-it-works" className="hover:text-foreground">How It Works</Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="no-underline">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/register" className="no-underline">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}