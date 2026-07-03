'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { QuickRenameDialog } from '@/components/shared/quick-rename-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogoutButton } from '../ui/shared/logout-button'

interface HeaderProps {
  fullName: string | null
  avatarUrl?: string | null
  mobileNav: React.ReactNode
  brandLabel?: string
}

export function Header({ fullName, avatarUrl, mobileNav, brandLabel = 'Nihongo Master' }: HeaderProps) {
  const [renameOpen, setRenameOpen] = useState(false)

  const initials = fullName
    ? fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        {mobileNav}
<span className="truncate text-base font-bold tracking-tight sm:text-lg md:hidden">{brandLabel}</span>
      </div>

<div className="flex items-center gap-2 sm:gap-4">
          <button
          onClick={() => setRenameOpen(true)}
          className="group hidden items-center gap-1.5 text-sm font-medium md:flex"
        >
          {fullName ?? 'User'}
          <Pencil className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </button>

        <Avatar className="h-8 w-8">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName ?? 'Profile'} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <LogoutButton 
          variant="ghost" 
          size="sm" 
          label="Log out" 
          showIcon={true}
          className="text-muted-foreground hover:text-foreground"
        />
      </div>

      <QuickRenameDialog currentName={fullName} open={renameOpen} onOpenChange={setRenameOpen} />
    </header>
  )
}