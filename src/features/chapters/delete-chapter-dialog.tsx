'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { deleteChapter } from './actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DeleteChapterDialogProps {
  chapterId: string
  chapterTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteChapterDialog({
  chapterId,
  chapterTitle,
  open,
  onOpenChange,
}: DeleteChapterDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteChapter(chapterId)
      toast.success('Chapter deleted')
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete chapter')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{chapterTitle}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this chapter and all questions inside it. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}