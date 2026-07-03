'use client'

import { useState, useTransition } from 'react'
import { Bookmark } from 'lucide-react'
import { toggleBookmark } from './actions'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface BookmarkButtonProps {
  questionId: string
  initialBookmarked: boolean
}

export function BookmarkButton({ questionId, initialBookmarked }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    // Optimistic update — flip the icon instantly, before the server confirms
    setBookmarked((prev) => !prev)
    startTransition(async () => {
      try {
        const result = await toggleBookmark(questionId)
        setBookmarked(result.bookmarked)
      } catch {
        setBookmarked((prev) => !prev) // revert on failure
        toast.error('Could not update bookmark')
      }
    })
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isPending}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-primary text-primary')} />
    </Button>
  )
}