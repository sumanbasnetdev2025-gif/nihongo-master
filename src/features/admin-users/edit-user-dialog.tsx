'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { updateUserName } from './actions'
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

interface EditUserDialogProps {
  user: { id: string; full_name: string | null } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function EditUserDialog({ user, open, onOpenChange, onUpdated }: EditUserDialogProps) {
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFullName(user?.full_name ?? '')
  }, [user])

  const handleSave = async () => {
    if (!user) return
    if (fullName.trim().length < 2) {
      toast.error('Name must be at least 2 characters')
      return
    }
    setLoading(true)
    try {
      await updateUserName(user.id, fullName.trim())
      toast.success('Name updated')
      onUpdated()
      onOpenChange(false)
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
          <DialogTitle>Edit User Name</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="editFullName">Full Name</Label>
          <Input
            id="editFullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}