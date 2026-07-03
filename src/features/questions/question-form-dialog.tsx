'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Upload, X } from 'lucide-react'
import { questionSchema, type QuestionInput } from './schemas'
import { createQuestion, updateQuestion, getChaptersByLevel } from './actions'
import { uploadQuestionImage, uploadQuestionAudio } from './upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { NativeSelect } from '@/components/ui/native-select'
import { Separator } from '@/components/ui/separator'

interface Option {
  id: string
  code?: string
  name: string
}

interface QuestionFormDialogProps {
  levels: Option[]
  categories: Option[]
  open: boolean
  onOpenChange: (open: boolean) => void
  editingQuestion?: any | null
}

export function QuestionFormDialog({
  levels,
  categories,
  open,
  onOpenChange,
  editingQuestion,
}: QuestionFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingAudio, setUploadingAudio] = useState(false)
  const [chapters, setChapters] = useState<Option[]>([])
  const isEditMode = !!editingQuestion

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuestionInput>({
    resolver: zodResolver(questionSchema),
    defaultValues: { difficulty: 'medium', isPublished: false },
  })

  const selectedLevelId = watch('levelId')
  const imageUrl = watch('imageUrl')
  const audioUrl = watch('audioUrl')

  // Load chapters whenever the selected level changes
  useEffect(() => {
    if (selectedLevelId) {
      getChaptersByLevel(selectedLevelId).then((data) =>
        setChapters(data.map((c) => ({ id: c.id, name: c.title })))
      )
    } else {
      setChapters([])
    }
  }, [selectedLevelId])

  // Pre-fill when editing
  useEffect(() => {
    if (editingQuestion) {
      reset({
        levelId: editingQuestion.level_id,
        chapterId: editingQuestion.chapter_id ?? '',
        categoryId: editingQuestion.category_id,
        questionText: editingQuestion.question_text,
        optionA: editingQuestion.option_a,
        optionB: editingQuestion.option_b,
        optionC: editingQuestion.option_c,
        optionD: editingQuestion.option_d,
        correctOption: editingQuestion.correct_option,
        explanation: editingQuestion.explanation ?? '',
        grammarNotes: editingQuestion.grammar_notes ?? '',
        vocabularyMeaning: editingQuestion.vocabulary_meaning ?? '',
        kanjiReading: editingQuestion.kanji_reading ?? '',
        difficulty: editingQuestion.difficulty ?? 'medium',
        tags: editingQuestion.tags?.join(', ') ?? '',
        imageUrl: editingQuestion.image_url ?? '',
        audioUrl: editingQuestion.audio_url ?? '',
        isPublished: editingQuestion.is_published ?? false,
      })
    } else {
      reset({
        levelId: '',
        chapterId: '',
        categoryId: '',
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: undefined,
        explanation: '',
        grammarNotes: '',
        vocabularyMeaning: '',
        kanjiReading: '',
        difficulty: 'medium',
        tags: '',
        imageUrl: '',
        audioUrl: '',
        isPublished: false,
      })
    }
  }, [editingQuestion, reset])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const url = await uploadQuestionImage(file)
      setValue('imageUrl', url)
      toast.success('Image uploaded')
    } catch (err) {
      toast.error('Image upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAudio(true)
    try {
      const url = await uploadQuestionAudio(file)
      setValue('audioUrl', url)
      toast.success('Audio uploaded')
    } catch (err) {
      toast.error('Audio upload failed')
    } finally {
      setUploadingAudio(false)
    }
  }

  const onSubmit = async (values: QuestionInput) => {
    setLoading(true)
    try {
      if (isEditMode) {
        await updateQuestion(editingQuestion.id, values)
        toast.success('Question updated')
      } else {
        await createQuestion(values)
        toast.success('Question created')
      }
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Question' : 'Create Question'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Classification */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              {errors.levelId && <p className="text-sm text-red-500">{errors.levelId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Chapter (optional)</Label>
              <NativeSelect
                value={watch('chapterId') || ''}
                onChange={(e) => setValue('chapterId', e.target.value)}
                disabled={!selectedLevelId}
                placeholder="Select chapter"
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
                <p className="text-sm text-red-500">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Question + Options */}
          <div className="space-y-2">
            <Label htmlFor="questionText">Question</Label>
            <Textarea id="questionText" rows={2} {...register('questionText')} />
            {errors.questionText && (
              <p className="text-sm text-red-500">{errors.questionText.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Options — select the correct one</Label>
            <RadioGroup
  value={watch('correctOption') || ''}
  onValueChange={(v) => setValue('correctOption', v as 'a' | 'b' | 'c' | 'd')}
  className="space-y-2"
>
              {(['a', 'b', 'c', 'd'] as const).map((letter) => (
                <div key={letter} className="flex items-center gap-3">
                  <RadioGroupItem value={letter} id={`option-${letter}`} />
                  <Input
                    placeholder={`Option ${letter.toUpperCase()}`}
                    {...register(
                      `option${letter.toUpperCase()}` as
                        | 'optionA'
                        | 'optionB'
                        | 'optionC'
                        | 'optionD'
                    )}
                  />
                </div>
              ))}
            </RadioGroup>
            {errors.correctOption && (
              <p className="text-sm text-red-500">{errors.correctOption.message}</p>
            )}
          </div>

          <Separator />

          {/* Learning content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation</Label>
              <Textarea id="explanation" rows={2} {...register('explanation')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grammarNotes">Grammar Notes</Label>
              <Textarea id="grammarNotes" rows={2} {...register('grammarNotes')} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vocabularyMeaning">Vocabulary Meaning</Label>
                <Input id="vocabularyMeaning" {...register('vocabularyMeaning')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kanjiReading">Kanji Reading</Label>
                <Input id="kanjiReading" {...register('kanjiReading')} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <NativeSelect
              value={watch('difficulty')}
              onChange={(e) => setValue('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </NativeSelect>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" placeholder="particles, te-form" {...register('tags')} />
          </div>

          <Separator />

          {/* Media Upload */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Image (optional)</Label>
              {imageUrl ? (
                <div className="relative">
                  <img src={imageUrl} alt="Question" className="h-32 w-full rounded-lg object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-7 w-7"
                    onClick={() => setValue('imageUrl', '')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground hover:bg-muted/50">
                  <Upload className="h-5 w-5" />
                  {uploadingImage ? 'Uploading...' : 'Upload image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
              )}
            </div>

            <div className="space-y-2">
              <Label>Audio (optional — Listening)</Label>
              {audioUrl ? (
                <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border">
                  <audio controls src={audioUrl} className="w-full px-2" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setValue('audioUrl', '')}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground hover:bg-muted/50">
                  <Upload className="h-5 w-5" />
                  {uploadingAudio ? 'Uploading...' : 'Upload audio'}
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleAudioUpload}
                    disabled={uploadingAudio}
                  />
                </label>
              )}
            </div>
          </div>

          <Separator />

          {/* Publish toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Publish this question</Label>
              <p className="text-sm text-muted-foreground">
                Published questions are visible to students immediately.
              </p>
            </div>
            <Switch
              checked={watch('isPublished')}
              onCheckedChange={(v) => setValue('isPublished', v)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploadingImage || uploadingAudio}>
              {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Question'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}