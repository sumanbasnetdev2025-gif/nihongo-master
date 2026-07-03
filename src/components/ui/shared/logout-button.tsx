'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { signOut } from '@/features/auth/api'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface LogoutButtonProps extends React.ComponentProps<typeof Button> {
  showIcon?: boolean
  label?: string
}

export function LogoutButton({ 
  className, 
  showIcon = true, 
  label = 'Log out',
  variant = 'ghost',
  size = 'sm',
  ...props 
}: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logged out successfully')
      router.push('/login')
      router.refresh()
    } catch (error) {
      toast.error('Failed to log out')
      console.error('Logout error:', error)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={cn(
        'text-muted-foreground hover:text-foreground transition-colors',
        className
      )}
      {...props}
    >
      {showIcon && <LogOut className="mr-1.5 h-4 w-4" />}
      {label}
    </Button>
  )
}