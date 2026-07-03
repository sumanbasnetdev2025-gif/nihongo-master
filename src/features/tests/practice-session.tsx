'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle } from 'lucide-react'
import { usePracticeStore } from '@/store/practice-store'
import { recordAnswer, completeTestAttempt } from './actions'
import { QuestionCard } from './question-card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getBookmarkedQuestionIds } from '@/features/bookmarks/actions'

interface PracticeSessionProps {
  attemptId: string
}

export function PracticeSession({ attemptId }: PracticeSessionProps) {
  const router = useRouter()
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  
  useEffect(() => {
    getBookmarkedQuestionIds().then(setBookmarkedIds)
  }, [])
  
  const {
    attemptId: storedAttemptId,
    questions,
    currentIndex,
    selectedOption,
    revealed,
    correctCount,
    startTime,
    selectOption,
    reveal,
    next,
    reset,
  } = usePracticeStore()

  // If the store doesn't match this URL (e.g. the page was refreshed and
  // memory was cleared), send the student back to set up a fresh session
  useEffect(() => {
    if (storedAttemptId !== attemptId) {
      router.replace('/tests')
    }
  }, [storedAttemptId, attemptId, router])

  if (storedAttemptId !== attemptId || questions.length === 0) {
    return null
  }

  const isFinished = currentIndex >= questions.length
  const currentQuestion = questions[currentIndex]

  const handleReveal = async () => {
    if (!selectedOption) return
    reveal()
    const isCorrect = selectedOption === currentQuestion.correct_option
    try {
      await recordAnswer({
        attemptId,
        questionId: currentQuestion.id,
        selectedOption: selectedOption as 'a' | 'b' | 'c' | 'd',
        isCorrect,
      })
    } catch {
      // A save hiccup shouldn't interrupt the student's practice flow
    }
  }

  const handleNext = async () => {
    const isLast = currentIndex === questions.length - 1
    if (isLast) {
      const timeTakenSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0
      try {
        await completeTestAttempt({ attemptId, score: correctCount, timeTakenSeconds })
      } catch {
        // Score still shows on screen even if this save fails
      }
    }
    next()
  }

  if (isFinished) {
    const percentage = Math.round((correctCount / questions.length) * 100)
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>Practice Complete 🎉</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="text-4xl font-bold">{percentage}%</div>
            <p className="mt-1 text-muted-foreground">
              {correctCount} / {questions.length} correct
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={() => { reset(); router.push('/tests') }}>
              Back to Tests
            </Button>
            <Button onClick={() => { reset(); router.push('/dashboard') }}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{correctCount} correct so far</span>
        </div>
        <Progress value={(currentIndex / questions.length) * 100} />
      </div>

      <QuestionCard
        question={currentQuestion}
        selectedOption={selectedOption}
        revealed={revealed}
        onSelect={(option) => !revealed && selectOption(option)}
        bookmarked={bookmarkedIds.includes(currentQuestion.id)}
      />

      {revealed && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-center gap-2 font-medium">
              {selectedOption === currentQuestion.correct_option ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Correct!
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  Not quite — the correct answer is {currentQuestion.correct_option.toUpperCase()}
                </>
              )}
            </div>
            {currentQuestion.explanation && (
              <p className="text-sm"><span className="font-medium">Explanation: </span>{currentQuestion.explanation}</p>
            )}
            {currentQuestion.grammar_notes && (
              <p className="text-sm"><span className="font-medium">Grammar notes: </span>{currentQuestion.grammar_notes}</p>
            )}
            {currentQuestion.vocabulary_meaning && (
              <p className="text-sm"><span className="font-medium">Vocabulary: </span>{currentQuestion.vocabulary_meaning}</p>
            )}
            {currentQuestion.kanji_reading && (
              <p className="text-sm"><span className="font-medium">Kanji reading: </span>{currentQuestion.kanji_reading}</p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-2">
        {!revealed ? (
          <Button onClick={handleReveal} disabled={!selectedOption}>
            Reveal Answer
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
          </Button>
        )}
      </div>
    </div>
  )
}