'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Fisher-Yates shuffle — ensures a genuinely random order/selection every call
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
export async function getTestQuestions(params: {
  levelId: string
  categoryId?: string
  chapterId?: string
  limit?: number
}) {
  const supabase = await createClient()
  let query = supabase
    .from('questions')
    .select('*')
    .eq('level_id', params.levelId)
    .eq('is_published', true)

  if (params.categoryId) query = query.eq('category_id', params.categoryId)
  if (params.chapterId) query = query.eq('chapter_id', params.chapterId)

  const { data, error } = await query.limit(200)
  if (error) throw error

  const shuffled = shuffleArray(data ?? [])
  return shuffled.slice(0, params.limit ?? 20)
}

export async function startTestAttempt(params: {
  levelId: string
  chapterId?: string
  categoryId?: string
  mode: 'practice' | 'exam' | 'daily_challenge'
  totalQuestions: number
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('test_attempts')
    .insert({
      student_id: user.id,
      level_id: params.levelId,
      chapter_id: params.chapterId || null,
      category_id: params.categoryId || null,
      mode: params.mode,
      status: 'in_progress',
      total_questions: params.totalQuestions,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function recordAnswer(params: {
  attemptId: string
  questionId: string
  selectedOption: 'a' | 'b' | 'c' | 'd'
  isCorrect: boolean
}) {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('test_answers')
    .select('id')
    .eq('attempt_id', params.attemptId)
    .eq('question_id', params.questionId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('test_answers')
      .update({ selected_option: params.selectedOption, is_correct: params.isCorrect })
      .eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('test_answers').insert({
      attempt_id: params.attemptId,
      question_id: params.questionId,
      selected_option: params.selectedOption,
      is_correct: params.isCorrect,
    })
    if (error) throw error
  }
}

export async function completeTestAttempt(params: {
  attemptId: string
  score: number
  timeTakenSeconds: number
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('test_attempts')
    .update({
      status: 'completed',
      score: params.score,
      time_taken_seconds: params.timeTakenSeconds,
      completed_at: new Date().toISOString(),
    })
    .eq('id', params.attemptId)

  if (error) throw error
  revalidatePath('/dashboard')
}