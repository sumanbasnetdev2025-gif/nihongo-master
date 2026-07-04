'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getTestQuestions, startTestAttempt } from './actions'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePracticeStore } from '@/stores/practice-store'
import { getChaptersByLevel } from '../questions/actions'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useExamStore } from '@/stores/exam-store'

interface Option {
  id: string
  code?: string
  name: string
}

interface TestSetupFormProps {
  levels: Option[]
  categories: Option[]
}

export function TestSetupForm({ levels, categories }: TestSetupFormProps) {
  const router = useRouter()
  const setSession = usePracticeStore((s) => s.setSession)
  const setExamSession = useExamStore((s) => s.setSession)

  const [levelId, setLevelId] = useState('')
  const [categoryId, setCategoryId] = useState('mixed')
  const [chapterId, setChapterId] = useState('')
  const [chapters, setChapters] = useState<Option[]>([])
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'practice' | 'exam'>('practice')
  const [duration, setDuration] = useState('20')
  const [questionCount, setQuestionCount] = useState('20')

  useEffect(() => {
    if (levelId) {
      getChaptersByLevel(levelId).then((data) =>
        setChapters(data.map((c: any) => ({ id: c.id, name: c.title })))
      )
    } else {
      setChapters([])
    }
    setChapterId('')
  }, [levelId])

  useEffect(() => {
    if (mode === 'exam') {
      setCategoryId('mixed')
    }
  }, [mode])

  const handleStart = async () => {
    if (!levelId || !categoryId) {
      toast.error('Please select a level and category')
      return
    }
    setLoading(true)
    try {
      const actualCategoryId = categoryId === 'mixed' ? undefined : categoryId
      const limit = parseInt(questionCount, 10)

  const questions = await getTestQuestions({
  levelId,
  categoryId: actualCategoryId,
  chapterId: chapterId || undefined,
  limit: Number(questionCount),
})

if (questions.length === 0) {
  toast.error('No published questions found for this selection yet')
  return
}

if (questions.length < Number(questionCount)) {
  toast.info(
    `Only ${questions.length} published questions available for this selection — starting with all of them.`
  )
}
      const attempt = await startTestAttempt({
        levelId,
        categoryId: actualCategoryId,
        chapterId: chapterId || undefined,
        mode,
        totalQuestions: questions.length, // or limit if you prefer
      })

      if (mode === 'exam') {
        setExamSession(attempt.id, questions as any, Number(duration) * 60)
        router.push(`/tests/exam/${attempt.id}`)
      } else {
        setSession(attempt.id, questions as any)
        router.push(`/tests/practice/${attempt.id}`)
      }
    } catch {
      toast.error('Could not start test. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start a Practice Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Mode</Label>
          <RadioGroup
            value={mode}
            onValueChange={(v) => setMode(v as 'practice' | 'exam')}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <label
              className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-4 ${
                mode === 'practice' ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="practice" />
                <span className="font-medium">Practice Mode</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Learn as you go — see answers and explanations immediately.
              </p>
            </label>

            <label
              className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-4 ${
                mode === 'exam' ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="exam" />
                <span className="font-medium">Exam Mode</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Timed and realistic, answers are revealed only at the end.
              </p>
            </label>
          </RadioGroup>
        </div>

        {mode === 'exam' && (
          <div className="space-y-2 sm:w-48">
            <Label>Time Limit</Label>
            <NativeSelect value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="10">10 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
            </NativeSelect>
          </div>
        )}

        {/* Updated grid: 4 columns */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <Label>Level</Label>
            <NativeSelect
              value={levelId}
              onChange={(e) => setLevelId(e.target.value)}
              placeholder="Select level"
            >
              {levels.map((l) => (
                <option key={l.id} value={l.id}>{l.code ?? l.name}</option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <NativeSelect
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={mode === 'exam'}
            >
              <option value="mixed">Mixed (All Categories)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </NativeSelect>
            {mode === 'exam' && (
              <p className="text-xs text-muted-foreground">
                Exam mode always draws random questions from every category of selected chapters.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Chapter (optional)</Label>
            <NativeSelect
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              disabled={!levelId}
              placeholder="All chapters"
            >
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </NativeSelect>
          </div>

          {/* New field: Number of Questions */}
          <div className="space-y-2">
            <Label>Number of Questions</Label>
            <NativeSelect
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
            >
              <option value="10">10 Questions</option>
              <option value="20">20 Questions</option>
              <option value="30">30 Questions</option>
              <option value="40">40 Questions</option>
              <option value="50">50 Questions</option>
            </NativeSelect>
          </div>
        </div>

        <Button onClick={handleStart} disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Starting...' : mode === 'exam' ? 'Start Exam' : 'Start Practice Test'}
        </Button>
      </CardContent>
    </Card>
  )
}