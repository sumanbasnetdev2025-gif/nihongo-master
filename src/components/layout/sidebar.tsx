'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  History,
  BarChart3,
  Settings,
  Flame,
  XCircle,
  PanelLeftClose,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '../shared/logo'
import { Button } from '../ui/button'
import { useUIStore } from '@/stores/ui-store'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tests', label: 'Tests', icon: BookOpen },
  { href: '/daily-challenge', label: 'Daily Challenge', icon: Flame },
  { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/wrong-answers', label: 'Wrong Answers', icon: XCircle },
  { href: '/history', label: 'Test History', icon: History },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
const toggleChrome = useUIStore((s) => s.toggleChrome)

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:flex md:flex-col">
    <div className="flex h-16 items-center justify-between border-b px-6">
  <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
    <Logo />
    Nihongo Master
  </span>
  <Button
    variant="ghost"
    size="icon"
    onClick={toggleChrome}
    className="h-7 w-7"
    aria-label="Hide menu"
    title="Hide menu"
  >
    <PanelLeftClose className="h-4 w-4" />
  </Button>
</div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}