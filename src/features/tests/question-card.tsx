'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { BookmarkButton } from '@/features/bookmarks/bookmark-button'

interface QuestionCardProps {
  question: {
    id: string
    question_text: string
    option_a: string
    option_b: string
    option_c: string
    option_d: string
    correct_option: 'a' | 'b' | 'c' | 'd'
    image_url: string | null
    audio_url: string | null
  }
  selectedOption: string | null
  revealed: boolean
  onSelect: (option: 'a' | 'b' | 'c' | 'd') => void
  bookmarked?: boolean
}

const letters = ['a', 'b', 'c', 'd'] as const

export function QuestionCard({
  question,
  selectedOption,
  revealed,
  onSelect,
  bookmarked,
}: QuestionCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        {bookmarked !== undefined && (
          <div className="flex justify-end">
            <BookmarkButton questionId={question.id} initialBookmarked={bookmarked} />
          </div>
        )}

        {question.image_url && (
          <img src={question.image_url} alt="Question" className="mx-auto max-h-64 rounded-lg" />
        )}
        {question.audio_url && <audio controls src={question.audio_url} className="w-full" />}

        <p className="text-lg font-medium">{question.question_text}</p>

        <div className="space-y-2">
          {letters.map((letter) => {
            const text = question[`option_${letter}` as const]
            const isSelected = selectedOption === letter
            const isCorrectAnswer = question.correct_option === letter

            let stateClass = 'border-border hover:bg-muted/50'
            if (revealed) {
              if (isCorrectAnswer) {
                stateClass = 'border-green-500 bg-green-50 dark:bg-green-950/30'
              } else if (isSelected && !isCorrectAnswer) {
                stateClass = 'border-red-500 bg-red-50 dark:bg-red-950/30'
              }
            } else if (isSelected) {
              stateClass = 'border-primary bg-primary/5'
            }

            return (
              <button
                key={letter}
                type="button"
                disabled={revealed}
                onClick={() => onSelect(letter)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default',
                  stateClass
                )}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold uppercase">
                  {letter}
                </span>
                {text}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}