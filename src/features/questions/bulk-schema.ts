import { z } from 'zod'

export const bulkRowSchema = z.object({
  questionText: z.string().min(3, 'Required'),
  optionA: z.string().min(1, 'Required'),
  optionB: z.string().min(1, 'Required'),
  optionC: z.string().min(1, 'Required'),
  optionD: z.string().min(1, 'Required'),
  correctOption: z.enum(['a', 'b', 'c', 'd'], { message: 'Select correct answer' }),
  explanation: z.string().optional(),
})

export const bulkFormSchema = z.object({
  levelId: z.string().uuid('Select a level'),
  chapterId: z.string().optional(),
  categoryId: z.string().uuid('Select a category'),
  isPublished: z.boolean().default(false),
  questions: z.array(bulkRowSchema).min(1, 'Add at least one question'),
})

export type BulkRowValues = z.input<typeof bulkRowSchema>
export type BulkFormValues = z.input<typeof bulkFormSchema>
export type BulkFormOutput = z.output<typeof bulkFormSchema>