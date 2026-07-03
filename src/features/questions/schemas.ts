import { z } from 'zod'

export const questionSchema = z.object({
  levelId: z.string().uuid('Please select a level'),
  chapterId: z.string().uuid('Please select a chapter').optional().or(z.literal('')),
  categoryId: z.string().uuid('Please select a category'),

  questionText: z.string().min(3, 'Question text is required'),
  optionA: z.string().min(1, 'Option A is required'),
  optionB: z.string().min(1, 'Option B is required'),
  optionC: z.string().min(1, 'Option C is required'),
  optionD: z.string().min(1, 'Option D is required'),
  correctOption: z.enum(['a', 'b', 'c', 'd'], {
    message: 'Select the correct answer',
  }),

  explanation: z.string().optional(),
  grammarNotes: z.string().optional(),
  vocabularyMeaning: z.string().optional(),
  kanjiReading: z.string().optional(),

  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  tags: z.string().optional(), // comma-separated in the form, converted to array before saving

  imageUrl: z.string().optional(),
  audioUrl: z.string().optional(),

  isPublished: z.boolean().default(false),
})

export type QuestionInput = z.infer<typeof questionSchema>