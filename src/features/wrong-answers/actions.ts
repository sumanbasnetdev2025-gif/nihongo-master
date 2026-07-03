'use server'

import { createClient } from '@/lib/supabase/server'

// Supabase sometimes infers joined relations as arrays even for
// one-to-one joins. This safely unwraps either shape into a single item.
function firstOrSelf<T>(value: T | T[] | null | undefined): T | undefined {
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : value
}

export async function getWrongAnswerQuestions() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Step 1: get this student's own attempt IDs
  const { data: attempts, error: attemptsError } = await supabase
    .from('test_attempts')
    .select('id')
    .eq('student_id', user.id)

  if (attemptsError) throw attemptsError
  if (!attempts || attempts.length === 0) return []

  const attemptIds = attempts.map((a) => a.id)

  // Step 2: get incorrect answers within just those attempts
  const { data: wrongAnswers, error: answersError } = await supabase
    .from('test_answers')
    .select(
      `question_id,
       questions(
         id, level_id, question_text, option_a, option_b, option_c, option_d,
         correct_option, explanation, grammar_notes, vocabulary_meaning,
         kanji_reading, image_url, audio_url, is_published,
         levels(id, code), categories(name)
       )`
    )
    .in('attempt_id', attemptIds)
    .eq('is_correct', false)

  if (answersError) throw answersError

  // De-duplicate — a question missed more than once should only appear once
  const uniqueMap = new Map()
  for (const row of wrongAnswers) {
    const question = firstOrSelf(row.questions)
    if (question?.is_published && !uniqueMap.has(row.question_id)) {
      uniqueMap.set(row.question_id, question)
    }
  }

  return Array.from(uniqueMap.values())
}