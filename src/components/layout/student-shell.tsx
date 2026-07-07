'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { ChromeToggleButton } from '@/components/layout/chrome-toggle-button'
import { useUIStore } from '@/stores/ui-store'

interface StudentShellProps {
  fullName: string | null
  avatarUrl: string | null
  children: React.ReactNode
}


const FOCUS_ROUTE_PREFIXES = ['/tests/practice/', '/tests/exam/']

export function StudentShell({ fullName, avatarUrl, children }: StudentShellProps) {
  const pathname = usePathname()
  const { chromeHidden, hideChrome } = useUIStore()

 useEffect(() => {
  const shouldAutoHide = FOCUS_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  if (shouldAutoHide) {
    hideChrome()
  }
}, [pathname, hideChrome])

  return (
    <div className="flex min-h-screen">
      <ChromeToggleButton />

      {!chromeHidden && <Sidebar />}

      <div className="flex flex-1 flex-col">
        {!chromeHidden && (
          <Header fullName={fullName} avatarUrl={avatarUrl} mobileNav={<MobileNav />} />
        )}
        <main className={`flex-1 bg-muted/30 p-4 md:p-6 ${chromeHidden ? 'pt-16' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
}