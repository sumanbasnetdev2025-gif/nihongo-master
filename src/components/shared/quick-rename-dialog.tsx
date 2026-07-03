'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { updateProfile } from '@/features/profile/action'

interface QuickRenameDialogProps {
  currentName: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickRenameDialog({ currentName, open, onOpenChange }: QuickRenameDialogProps) {
  const router = useRouter()
  const [name, setName] = useState(currentName ?? '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters')
      return
    }
    setLoading(true)
    try {
      await updateProfile({ fullName: name.trim() })
      toast.success('Name updated')
      onOpenChange(false)
      router.refresh() // refreshes server-rendered name in header/sidebar
    } catch {
      toast.error('Failed to update name')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Your Name</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="quickName">Full Name</Label>
          <Input id="quickName" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}