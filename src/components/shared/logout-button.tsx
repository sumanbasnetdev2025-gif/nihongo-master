'use client'

import { LogOut } from 'lucide-react'
import { signOut } from '@/features/auth/api'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut()
    // Full page reload guarantees all cached session state is cleared,
    // not just what React's in-memory state happens to know about
    window.location.href = '/login'
  }

  return (
    <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Log out" className="sm:w-auto sm:px-3">
      <LogOut className="h-4 w-4 sm:mr-1.5" />
      <span className="hidden sm:inline">Log out</span>
    </Button>
  )
}