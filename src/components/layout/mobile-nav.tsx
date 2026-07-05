'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  History,
  BarChart3,
  Settings,
  Flame,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { LogoutButton } from '@/components/shared/logout-button'

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

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="left-0 top-0 h-full w-64 translate-x-0 translate-y-0 rounded-none p-0">
          <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
          <div className="flex h-16 items-center border-b px-6">
            <span className="text-lg font-bold tracking-tight">Nihongo Master</span>
          </div>
          <nav className="flex h-[calc(100%-4rem)] flex-col justify-between">
            <div className="space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
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
            </div>
            <div className="border-t p-4">
              <LogoutButton />
            </div>
          </nav>
        </DialogContent>
      </Dialog>
    </>
  )
}