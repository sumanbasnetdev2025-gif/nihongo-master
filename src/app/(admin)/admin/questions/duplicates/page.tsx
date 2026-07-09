'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, ExternalLink, Pencil } from 'lucide-react'
import { findDuplicateQuestions } from '@/features/admin-analytics/duplicate-actions'
import { getLevels } from '@/features/chapters/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NativeSelect } from '@/components/ui/native-select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { QuestionFormDialog } from '@/features/questions/question-form-dialog'
import { getCategories } from '@/features/questions/actions'

export default function DuplicateQuestionsPage() {
  const [levels, setLevels] = useState<any[]>([])
  const [levelId, setLevelId] = useState('')
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [editingQuestion, setEditingQuestion] = useState<any>(null)
  const [formOpen, setFormOpen] = useState(false)

  // refetch-after-edit helper
  const refetch = () => {
    if (!levelId) return
    findDuplicateQuestions(levelId).then((data) => {
      // Deduplicate questions inside each group by id
      const processed = data.map((group) => ({
        ...group,
        questions: Array.from(
          new Map(group.questions.map((q: any) => [q.id, q])).values()
        ),
      }))
      setGroups(processed)
    })
  }

  useEffect(() => {
    getLevels().then((l) => {
      setLevels(l)
      if (l.length > 0) setLevelId(l[0].id)
    })
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    if (!levelId) return
    setLoading(true)
    findDuplicateQuestions(levelId)
      .then((data) => {
        // Deduplicate questions inside each group by id
        const processed = data.map((group) => ({
          ...group,
          questions: Array.from(
            new Map(group.questions.map((q: any) => [q.id, q])).values()
          ),
        }))
        setGroups(processed)
      })
      .finally(() => setLoading(false))
  }, [levelId])

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/questions"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Questions
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Duplicate Questions</h1>
        <p className="text-muted-foreground">
          Questions with matching or near-matching text, grouped so you can review and clean
          them up.
        </p>
      </div>

      <div className="w-40 space-y-1.5">
        <Label className="text-xs">Level</Label>
        <NativeSelect value={levelId} onChange={(e) => setLevelId(e.target.value)}>
          {levels.map((l) => (
            <option key={l.id} value={l.id}>{l.code ?? l.name}</option>
          ))}
        </NativeSelect>
      </div>

      {loading ? (
        <div className="rounded-lg border p-12 text-center text-muted-foreground">
          Scanning for duplicates...
        </div>
      ) : groups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Copy className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No duplicates found for this level</p>
            <p className="text-sm text-muted-foreground">
              Every question's text is unique.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {groups.length} duplicate group{groups.length !== 1 ? 's' : ''} found
          </p>
          {groups.map((group, i) => (
            <Card key={i} className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="line-clamp-1">{group.questionText}</span>
                  <Badge variant="secondary">{group.count} copies</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Questions are now deduplicated by id */}
                {group.questions.map((q: any) => (
                  <div
                    key={q.id} // fixed: use q.id as key (no index needed)
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{q.levelCode}</Badge>
                      <span className="font-medium">{q.chapterTitle}</span>
                      <span className="text-muted-foreground">· {q.categoryName}</span>
                      <Badge variant={q.isPublished ? 'default' : 'secondary'} className="text-xs">
                        {q.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingQuestion(q)
                          setFormOpen(true)
                        }}
                      >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        render={
                          <Link href={`/admin/questions?highlight=${q.id}`}>
                            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                            Open in Questions
                          </Link>
                        }
                        nativeButton={false}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <QuestionFormDialog
        levels={levels}
        categories={categories}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setEditingQuestion(null)
            refetch()
          }
        }}
        editingQuestion={
          editingQuestion
            ? {
                id: editingQuestion.id,
                level_id: editingQuestion.level_id,
                chapter_id: editingQuestion.chapter_id,
                category_id: editingQuestion.category_id,
                question_text: editingQuestion.question_text,
                option_a: editingQuestion.option_a,
                option_b: editingQuestion.option_b,
                option_c: editingQuestion.option_c,
                option_d: editingQuestion.option_d,
                correct_option: editingQuestion.correct_option,
                explanation: editingQuestion.explanation,
                grammar_notes: editingQuestion.grammar_notes,
                vocabulary_meaning: editingQuestion.vocabulary_meaning,
                kanji_reading: editingQuestion.kanji_reading,
                difficulty: editingQuestion.difficulty,
                tags: editingQuestion.tags,
                image_url: editingQuestion.image_url,
                audio_url: editingQuestion.audio_url,
                is_published: editingQuestion.isPublished,
              }
            : null
        }
      />
    </div>
  )
}