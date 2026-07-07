'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Clock } from 'lucide-react'
import { useCountdown } from '@/hooks/use-countdown'
import { recordAnswer, completeTestAttempt } from './actions'
import { QuestionCard } from './question-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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
import { useExamStore } from '@/stores/exam-store'

interface ExamSessionProps {
  attemptId: string
}

export function ExamSession({ attemptId }: ExamSessionProps) {
  const router = useRouter()
  const {
    attemptId: storedAttemptId,
    questions,
    currentIndex,
    answers,
    durationSeconds,
    startTime,
    submitted,
    selectOption,
    goTo,
    next,
    prev,
    markSubmitted,
    reset,
  } = useExamStore()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (storedAttemptId !== attemptId) {
      router.replace('/tests')
    }
  }, [storedAttemptId, attemptId, router])

  const handleSubmit = async () => {
    if (submitting || submitted) return
    setSubmitting(true)
    try {
      const entries = Object.entries(answers)
      for (const [questionId, selectedOption] of entries) {
        const question = questions.find((q) => q.id === questionId)
        if (!question) continue
        await recordAnswer({
          attemptId,
          questionId,
          selectedOption,
          isCorrect: selectedOption === question.correct_option,
        })
      }

      const correctCount = entries.filter(([qId, opt]) => {
        const q = questions.find((q) => q.id === qId)
        return q?.correct_option === opt
      }).length

      const timeTakenSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0
      await completeTestAttempt({ attemptId, score: correctCount, timeTakenSeconds })
    } catch {
      // Proceed to results regardless
    } finally {
      markSubmitted()
      router.push(`/tests/results/${attemptId}`)
      // Clear the store slightly after navigation kicks off, so this
      // component shows the "Calculating..." state instead of a blank flash
      setTimeout(() => reset(), 300)
    }
  }

  const { formatted, isLow } = useCountdown(durationSeconds, () => {
    if (!submitted) handleSubmit()
  })

  if (storedAttemptId !== attemptId || questions.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Calculating your results…</p>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Timer bar */}
      <div
        className={cn(
          'flex items-center justify-between rounded-lg border p-3',
          isLow && 'border-red-500 bg-red-50 dark:bg-red-950/30'
        )}
      >
        <span className="text-sm font-medium">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className={cn('flex items-center gap-2 font-mono text-lg font-bold', isLow && 'text-red-600')}>
          <Clock className="h-4 w-4" />
          {formatted}
        </div>
      </div>

      {/* Question navigator */}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, i) => {
          const isAnswered = !!answers[q.id]
          const isCurrent = i === currentIndex
          return (
            <button
              key={q.id}
              onClick={() => goTo(i)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium',
                isCurrent && 'ring-2 ring-primary',
                isAnswered ? 'border-primary bg-primary/10' : 'border-border text-muted-foreground'
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      <QuestionCard
        question={currentQuestion}
        selectedOption={answers[currentQuestion.id] ?? null}
        revealed={false}
        onSelect={(option) => selectOption(currentQuestion.id, option)}
      />

      <div className="flex justify-between gap-2">
        <Button variant="outline" onClick={prev} disabled={currentIndex === 0}>
          Previous
        </Button>

        {currentIndex === questions.length - 1 ? (
          <Button onClick={() => setConfirmOpen(true)}>Submit Exam</Button>
        ) : (
          <Button onClick={next}>Next</Button>
        )}
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Submit your exam?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ve answered {Object.keys(answers).length} of {questions.length} questions.
              You won&apos;t be able to change your answers after submitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Reviewing</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}