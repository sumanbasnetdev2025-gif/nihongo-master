import { z } from 'zod'

export const chapterSchema = z.object({
  levelId: z.string().uuid('Please select a level'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
})

export type ChapterFormValues = z.input<typeof chapterSchema>

export type ChapterInput = z.output<typeof chapterSchema>