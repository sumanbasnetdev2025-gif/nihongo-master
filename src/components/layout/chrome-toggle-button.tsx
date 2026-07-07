'use client'

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useUIStore } from '@/stores/ui-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ChromeToggleButton() {
  const { chromeHidden, toggleChrome } = useUIStore()

  if (!chromeHidden) return null

  return (
    <Button
      variant="default"
      size="icon"
      onClick={toggleChrome}
      className={cn(
        'fixed left-4 top-4 z-50 h-10 w-10 rounded-full shadow-lg'
      )}
      aria-label="Show menu"
      title="Show menu"
    >
      <PanelLeftOpen className="h-4 w-4" />
    </Button>
  )
}