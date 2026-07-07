'use server'

import { createClient } from '@/lib/supabase/server'
import { questionSchema, type QuestionInput } from './schemas'
import { revalidatePath } from 'next/cache'

export async function getQuestions(filters?: {
  levelId?: string
  chapterId?: string
  categoryId?: string
  status?: 'published' | 'draft' | 'all'
  search?: string
}) {
  const supabase = await createClient()
  let query = supabase
    .from('questions')
    .select('*, levels(code), chapters(title), categories(name)')
    .order('created_at', { ascending: false })

  if (filters?.levelId) query = query.eq('level_id', filters.levelId)
  if (filters?.chapterId) query = query.eq('chapter_id', filters.chapterId)
  if (filters?.categoryId) query = query.eq('category_id', filters.categoryId)
  if (filters?.status === 'published') query = query.eq('is_published', true)
  if (filters?.status === 'draft') query = query.eq('is_published', false)

  if (filters?.search?.trim()) {
    const term = `%${filters.search.trim()}%`
    query = query.or(
      `question_text.ilike.${term},option_a.ilike.${term},option_b.ilike.${term},option_c.ilike.${term},option_d.ilike.${term}`
    )
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

export async function getChaptersByLevel(levelId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('level_id', levelId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

function toTagsArray(tags?: string): string[] | null {
  if (!tags?.trim()) return null
  return tags.split(',').map((t) => t.trim()).filter(Boolean)
}

export async function createQuestion(input: QuestionInput) {
  const parsed = questionSchema.parse(input)
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const stripStar = (text: string) => text.replace(/^\*|\*$/g, '').trim()

  const { error } = await supabase.from('questions').insert({
    level_id: parsed.levelId,
    chapter_id: parsed.chapterId || null,
    category_id: parsed.categoryId,
    question_text: stripStar(parsed.questionText),
    option_a: stripStar(parsed.optionA),
    option_b: stripStar(parsed.optionB),
    option_c: stripStar(parsed.optionC),
    option_d: stripStar(parsed.optionD),
    correct_option: parsed.correctOption,
    explanation: parsed.explanation || null,
    grammar_notes: parsed.grammarNotes || null,
    vocabulary_meaning: parsed.vocabularyMeaning || null,
    kanji_reading: parsed.kanjiReading || null,
    difficulty: parsed.difficulty,
    tags: toTagsArray(parsed.tags),
    image_url: parsed.imageUrl || null,
    audio_url: parsed.audioUrl || null,
    is_published: parsed.isPublished,
    created_by: user?.id,
  })

  if (error) throw error
  revalidatePath('/admin/questions')
}

export async function updateQuestion(id: string, input: QuestionInput) {
  const parsed = questionSchema.parse(input)
  const supabase = await createClient()

  const { error } = await supabase
    .from('questions')
    .update({
      level_id: parsed.levelId,
      chapter_id: parsed.chapterId || null,
      category_id: parsed.categoryId,
      question_text: parsed.questionText,
      option_a: parsed.optionA,
      option_b: parsed.optionB,
      option_c: parsed.optionC,
      option_d: parsed.optionD,
      correct_option: parsed.correctOption,
      explanation: parsed.explanation || null,
      grammar_notes: parsed.grammarNotes || null,
      vocabulary_meaning: parsed.vocabularyMeaning || null,
      kanji_reading: parsed.kanjiReading || null,
      difficulty: parsed.difficulty,
      tags: toTagsArray(parsed.tags),
      image_url: parsed.imageUrl || null,
      audio_url: parsed.audioUrl || null,
      is_published: parsed.isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/questions')
}

export async function deleteQuestion(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('questions').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/admin/questions')
}

export async function toggleQuestionPublish(id: string, isPublished: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('questions')
    .update({ is_published: isPublished })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/admin/questions')
}
export async function createQuestionsBulk(input: {
  levelId: string
  chapterId?: string
  categoryId: string
  isPublished: boolean
  questions: {
    questionText: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    correctOption: 'a' | 'b' | 'c' | 'd'
    difficulty?: 'easy' | 'medium' | 'hard'
    explanation?: string
  }[]
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()


const stripStar = (text: string) => text.replace(/^\*|\*$/g, '').trim()

const rows = input.questions.map((q) => ({
  level_id: input.levelId,
  chapter_id: input.chapterId || null,
  category_id: input.categoryId,
  question_text: stripStar(q.questionText),
  option_a: stripStar(q.optionA),
  option_b: stripStar(q.optionB),
  option_c: stripStar(q.optionC),
  option_d: stripStar(q.optionD),
  correct_option: q.correctOption,
  difficulty: q.difficulty || 'medium',
  explanation: q.explanation || null,
  is_published: input.isPublished,
  created_by: user?.id,
}))
  const { error, count } = await supabase.from('questions').insert(rows, { count: 'exact' })

  if (error) throw error
  revalidatePath('/admin/questions')
  return { inserted: count ?? rows.length }
}
export async function deleteQuestionsBulk(ids: string[]) {
  const supabase = await createClient()
  const { error, count } = await supabase
    .from('questions')
    .delete({ count: 'exact' })
    .in('id', ids)

  if (error) throw error
  revalidatePath('/admin/questions')
  return { deleted: count ?? ids.length }
}