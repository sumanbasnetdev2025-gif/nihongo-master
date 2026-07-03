'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Supabase sometimes infers joined relations as arrays even for
// one-to-one joins. This safely unwraps either shape into a single item.
function firstOrSelf<T>(value: T | T[] | null | undefined): T | undefined {
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : value
}

export async function toggleBookmark(questionId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('student_id', user.id)
    .eq('question_id', questionId)
    .maybeSingle()

  if (existing) {
    await supabase.from('bookmarks').delete().eq('id', existing.id)
    revalidatePath('/bookmarks')
    return { bookmarked: false }
  } else {
    await supabase.from('bookmarks').insert({ student_id: user.id, question_id: questionId })
    revalidatePath('/bookmarks')
    return { bookmarked: true }
  }
}

export async function getBookmarkedQuestionIds() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('bookmarks')
    .select('question_id')
    .eq('student_id', user.id)

  return data?.map((b) => b.question_id) ?? []
}

export async function getBookmarkedQuestions() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('bookmarks')
    .select(
      `id, created_at,
       questions(
         id, question_text, option_a, option_b, option_c, option_d,
         correct_option, explanation, grammar_notes, vocabulary_meaning,
         kanji_reading, image_url, audio_url, is_published,
         levels(code), categories(name)
       )`
    )
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error


  return data
    .map((b) => ({ ...b, questions: firstOrSelf(b.questions) }))
    .filter((b) => b.questions?.is_published)
}