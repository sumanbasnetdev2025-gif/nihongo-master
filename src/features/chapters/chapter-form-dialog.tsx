'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { chapterSchema, type ChapterFormValues, type ChapterInput } from './schemas'
import { createChapter, updateChapter } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { NativeSelect } from '@/components/ui/native-select'
interface Level {
  id: string
  code: string
  name: string
}

interface ChapterFormDialogProps {
  levels: Level[]
  open: boolean
  onOpenChange: (open: boolean) => void
  editingChapter?: {
    id: string
    level_id: string
    title: string
    description: string | null
    sort_order: number
  } | null
}

export function ChapterFormDialog({
  levels,
  open,
  onOpenChange,
  editingChapter,
}: ChapterFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const isEditMode = !!editingChapter

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
 } = useForm<ChapterFormValues>({
  resolver: zodResolver(chapterSchema),
  defaultValues: { sortOrder: 0 },
})
  // Pre-fill form when editing
  useEffect(() => {
    if (editingChapter) {
      reset({
        levelId: editingChapter.level_id,
        title: editingChapter.title,
        description: editingChapter.description ?? '',
        sortOrder: editingChapter.sort_order,
      })
    } else {
      reset({ levelId: '', title: '', description: '', sortOrder: 0 })
    }
  }, [editingChapter, reset])

const onSubmit = async (values: ChapterFormValues) => {
  setLoading(true)
  try {
    // Run Zod's coercion client-side too, so the type passed to the
    // Server Action matches exactly what it expects (sortOrder as a real number)
    const parsed = chapterSchema.parse(values)

    if (isEditMode) {
      await updateChapter(editingChapter.id, parsed)
      toast.success('Chapter updated successfully')
    } else {
      await createChapter(parsed)
      toast.success('Chapter created successfully')
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Chapter' : 'Create Chapter'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
  <Label>Level</Label>
  <NativeSelect
    value={watch('levelId')}
    onChange={(e) => setValue('levelId', e.target.value)}
    placeholder="Select a level"
  >
    {levels.map((level) => (
      <option key={level.id} value={level.id}>{level.name}</option>
    ))}
  </NativeSelect>
  {errors.levelId && (
    <p className="text-sm text-red-500">{errors.levelId.message}</p>
  )}
</div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Chapter 1: Greetings" {...register('title')} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" rows={3} {...register('description')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input id="sortOrder" type="number" {...register('sortOrder')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Chapter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}