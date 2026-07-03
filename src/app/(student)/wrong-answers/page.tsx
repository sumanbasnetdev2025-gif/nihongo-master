'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { getWrongAnswerQuestions } from '@/features/wrong-answers/actions'
import { startTestAttempt } from '@/features/tests/actions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { usePracticeStore } from '@/stores/practice-store'

export default function WrongAnswersPage() {
  const router = useRouter()
  const setSession = usePracticeStore((s) => s.setSession)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    getWrongAnswerQuestions()
      .then(setQuestions)
      .finally(() => setLoading(false))
  }, [])

  const handleStart = async () => {
    if (questions.length === 0) return
    setStarting(true)
    try {
      // Wrong-answer practice isn't tied to one level/category, so we
      // just record it as a generic practice attempt on the first question's level
      const attempt = await startTestAttempt({
        levelId: questions[0].level_id ?? questions[0].levels?.id,
        mode: 'practice',
        totalQuestions: questions.length,
      })
      setSession(attempt.id, questions)
      router.push(`/tests/practice/${attempt.id}`)
    } catch {
      toast.error('Could not start practice session')
    } finally {
      setStarting(false)
    }
  }

  if (loading) {
    return <div className="text-center text-muted-foreground py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Wrong Answer Practice</h1>
        <p className="text-muted-foreground">
          Questions you&apos;ve previously gotten wrong — practice them until they stick.
        </p>
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <XCircle className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">No wrong answers yet</p>
              <p className="text-sm text-muted-foreground">
                Great job! Once you get a question wrong, it&apos;ll show up here for review.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <p className="text-3xl font-bold">{questions.length}</p>
            <p className="text-muted-foreground">
              question{questions.length !== 1 ? 's' : ''} to review
            </p>
            <Button onClick={handleStart} disabled={starting}>
              {starting ? 'Starting...' : 'Practice These Questions'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}