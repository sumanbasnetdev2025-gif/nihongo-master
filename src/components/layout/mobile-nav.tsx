'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BookMarked,
  BarChart3,
  Settings,
  FileQuestion,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { LogoutButton } from '@/components/ui/shared/logout-button'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/questions', label: 'Questions', icon: FileQuestion },
  { href: '/admin/chapters', label: 'Chapters', icon: BookOpen },
  { href: '/admin/bookmarks', label: 'Bookmarks', icon: BookMarked },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
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
          <DialogTitle className="sr-only">Admin Navigation Menu</DialogTitle>
          <div className="flex h-16 items-center border-b px-6">
            <span className="text-lg font-bold tracking-tight">Nihongo Master Admin</span>
          </div>
          <nav className="flex h-[calc(100%-4rem)] flex-col justify-between">
            <div className="space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
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
              <LogoutButton 
                variant="ghost" 
                size="sm" 
                label="Log out" 
                showIcon={true}
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              />
            </div>
          </nav>
        </DialogContent>
      </Dialog>
    </>
  )
}