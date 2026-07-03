'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  LayoutDashboard,
  BookMarked,
  Layers,
  FileQuestion,
  Users,
  BarChart3,
  ArrowLeftRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/chapters', label: 'Chapters', icon: BookMarked },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/questions', label: 'Questions', icon: FileQuestion },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export function AdminMobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="left-0 top-0 h-full w-64 translate-x-0 translate-y-0 rounded-none p-0">
          <DialogTitle className="sr-only">Admin Navigation Menu</DialogTitle>
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <span className="text-lg font-bold tracking-tight">Nihongo Master</span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
              ADMIN
            </span>
          </div>
          <nav className="space-y-1 p-4">
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
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeftRight className="h-4 w-4" />
              Switch to Student View
            </Link>
          </nav>
        </DialogContent>
      </Dialog>
    </>
  )
}