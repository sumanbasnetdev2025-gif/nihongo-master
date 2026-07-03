'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { bulkFormSchema, type BulkFormValues, type BulkRowValues } from '@/features/questions/bulk-schema'
import { createQuestionsBulk, getCategories, getChaptersByLevel } from '@/features/questions/actions'
import { getLevels } from '@/features/chapters/actions'
import { BulkQuestionRow } from '@/features/questions/bulk-question-row'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { NativeSelect } from '@/components/ui/native-select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const emptyRow: BulkRowValues = {
  questionText: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctOption: undefined as unknown as 'a' | 'b' | 'c' | 'd',
  explanation: '',
}

export default function BulkAddQuestionsPage() {
  const router = useRouter()
  const [levels, setLevels] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [chapters, setChapters] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BulkFormValues>({
    resolver: zodResolver(bulkFormSchema),
    defaultValues: {
      levelId: '',
      chapterId: '',
      categoryId: '',
      isPublished: false,
      // Start with 10 empty rows, per your request — admin can add/remove freely
      questions: Array.from({ length: 10 }, () => ({ ...emptyRow })),
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'questions' })

  const levelId = watch('levelId')

  useEffect(() => {
    Promise.all([getLevels(), getCategories()]).then(([l, c]) => {
      setLevels(l)
      setCategories(c)
    })
  }, [])

  useEffect(() => {
    if (levelId) {
      getChaptersByLevel(levelId).then((data) =>
        setChapters(data.map((c: any) => ({ id: c.id, name: c.title })))
      )
    } else {
      setChapters([])
    }
  }, [levelId])

  const onSubmit = async (values: BulkFormValues) => {
    const parsed = bulkFormSchema.parse(values)
    setSubmitting(true)
    try {
      const result = await createQuestionsBulk(parsed)
      toast.success(`${result.inserted} questions created successfully`)
      router.push('/admin/questions')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create questions')
    } finally {
      setSubmitting(false)
    }
  }

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
        <h1 className="text-2xl font-bold tracking-tight">Bulk Add Questions</h1>
        <p className="text-muted-foreground">
          Add many questions at once. You can edit or update each one individually later.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Shared classification for the whole batch */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Applies to All Questions Below</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Level</Label>
              <NativeSelect
                value={watch('levelId')}
                onChange={(e) => setValue('levelId', e.target.value)}
                placeholder="Select level"
              >
                {levels.map((l) => (
                  <option key={l.id} value={l.id}>{l.code ?? l.name}</option>
                ))}
              </NativeSelect>
              {errors.levelId && <p className="text-xs text-red-500">{errors.levelId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Chapter (optional)</Label>
              <NativeSelect
                value={watch('chapterId') || ''}
                onChange={(e) => setValue('chapterId', e.target.value)}
                disabled={!levelId}
                placeholder="All chapters"
              >
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </NativeSelect>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <NativeSelect
                value={watch('categoryId')}
                onChange={(e) => setValue('categoryId', e.target.value)}
                placeholder="Select category"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </NativeSelect>
              {errors.categoryId && (
                <p className="text-xs text-red-500">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 sm:col-span-3">
              <div>
                <Label>Publish all questions immediately</Label>
                <p className="text-xs text-muted-foreground">
                  You can also leave these as drafts and publish individually later.
                </p>
              </div>
              <Switch
                checked={watch('isPublished')}
                onCheckedChange={(v) => setValue('isPublished', v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dynamic question rows */}
        <div className="space-y-4">
          {fields.map((field, index) => (
            <BulkQuestionRow
              key={field.id}
              index={index}
              register={register}
              errors={errors}
              correctOption={watch(`questions.${index}.correctOption`)}
              onCorrectOptionChange={(v) => setValue(`questions.${index}.correctOption`, v)}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ ...emptyRow })}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Question
        </Button>

        <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            {fields.length} question{fields.length !== 1 ? 's' : ''} ready to submit
          </p>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : `Create ${fields.length} Questions`}
          </Button>
        </div>
      </form>
    </div>
  )
}