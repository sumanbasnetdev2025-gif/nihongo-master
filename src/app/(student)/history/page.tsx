'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { History, Trophy, XCircle } from 'lucide-react'
import { getTestHistory } from '@/features/history/actions'
import { getLevels } from '@/features/chapters/actions'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import { cn } from '@/lib/utils'

function formatDate(dateString: string | null) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(seconds: number | null) {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

const modeLabels: Record<string, string> = {
  practice: 'Practice',
  exam: 'Exam',
  daily_challenge: 'Daily Challenge',
}

export default function TestHistoryPage() {
  const [attempts, setAttempts] = useState<any[]>([])
  const [levels, setLevels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<string>('all')
  const [levelId, setLevelId] = useState<string>('all')

  useEffect(() => {
    getLevels().then(setLevels)
  }, [])

  useEffect(() => {
    setLoading(true)
    getTestHistory({
      mode: mode === 'all' ? undefined : (mode as any),
      levelId: levelId === 'all' ? undefined : levelId,
    })
      .then(setAttempts)
      .finally(() => setLoading(false))
  }, [mode, levelId])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Test History</h1>
        <p className="text-muted-foreground">Every test you&apos;ve completed, in one place.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <NativeSelect className="w-40" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="all">All Modes</option>
          <option value="practice">Practice</option>
          <option value="exam">Exam</option>
          <option value="daily_challenge">Daily Challenge</option>
        </NativeSelect>

        <NativeSelect className="w-36" value={levelId} onChange={(e) => setLevelId(e.target.value)}>
          <option value="all">All Levels</option>
          {levels.map((l) => (
            <option key={l.id} value={l.id}>{l.code}</option>
          ))}
        </NativeSelect>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Loading...</div>
      ) : attempts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <History className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">No test history yet</p>
              <p className="text-sm text-muted-foreground">
                Completed tests will show up here.
              </p>
            </div>
            <Link href="/tests" passHref>
              <Button>Take a Test</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => {
            const percentage =
              attempt.total_questions && attempt.total_questions > 0
                ? Math.round(((attempt.score ?? 0) / attempt.total_questions) * 100)
                : 0
            const passed = percentage >= 60

            return (
              <Link key={attempt.id} href={`/tests/results/${attempt.id}`}>
                <Card className="transition-colors hover:bg-muted/40">
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                          passed
                            ? 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400'
                            : 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'
                        )}
                      >
                        {passed ? <Trophy className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{attempt.levels?.code}</span>
                          <Badge variant="outline">{modeLabels[attempt.mode] ?? attempt.mode}</Badge>
                          {attempt.categories?.name && (
                            <span className="text-sm text-muted-foreground">
                              {attempt.categories.name}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(attempt.completed_at)} · {formatTime(attempt.time_taken_seconds)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold">{percentage}%</div>
                      <p className="text-xs text-muted-foreground">
                        {attempt.score} / {attempt.total_questions}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}