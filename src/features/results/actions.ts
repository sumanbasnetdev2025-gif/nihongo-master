'use server'

import { createClient } from '@/lib/supabase/server'

export async function getTestResult(attemptId: string) {
  const supabase = await createClient()

  const { data: attempt, error: attemptError } = await supabase
    .from('test_attempts')
    .select('*, levels(code, name), chapters(title), categories(name)')
    .eq('id', attemptId)
    .single()

  if (attemptError) throw attemptError

  const { data: answers, error: answersError } = await supabase
    .from('test_answers')
    .select(
      `*, questions(
        id, question_text, option_a, option_b, option_c, option_d,
        correct_option, explanation, grammar_notes, vocabulary_meaning,
        kanji_reading, category_id, categories(name)
      )`
    )
    .eq('attempt_id', attemptId)

  if (answersError) throw answersError

  // Group scores by category
  const categoryMap = new Map<string, { name: string; correct: number; total: number }>()

  for (const answer of answers) {
    const category = answer.questions?.categories
    const categoryId = answer.questions?.category_id
    if (!category || !categoryId) continue

    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, { name: category.name, correct: 0, total: 0 })
    }
    const entry = categoryMap.get(categoryId)!
    entry.total += 1
    if (answer.is_correct) entry.correct += 1
  }

  const categoryScores = Array.from(categoryMap.values())

  const totalQuestions = attempt.total_questions ?? answers.length
  const score = attempt.score ?? 0
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  const passed = percentage >= 60 // JLPT-style pass threshold, adjustable

  return {
    attempt,
    answers,
    categoryScores,
    totalQuestions,
    score,
    percentage,
    passed,
  }
}