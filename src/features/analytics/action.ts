'use server'

import { createClient } from '@/lib/supabase/server'

export async function getPerformanceAnalytics() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // Pull every completed attempt for this student
  const { data: attempts, error: attemptsError } = await supabase
    .from('test_attempts')
    .select('id, score, total_questions, mode, completed_at, level_id, levels(code)')
    .eq('student_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })

  if (attemptsError) throw attemptsError

  // No tests yet — return a clean empty state instead of dividing by zero
  if (!attempts || attempts.length === 0) {
    return {
      hasData: false,
      totalTests: 0,
      overallAccuracy: 0,
      readiness: { label: 'Not enough data', percentage: 0 },
      categoryStrengths: [],
      weakChapters: [],
      recommendedChapters: [],
      recentTrend: [],
    }
  }

  // Pull every answer across all of this student's attempts, joined to
  // question -> category and question -> chapter
  const attemptIds = attempts.map((a) => a.id)
  const { data: answers, error: answersError } = await supabase
    .from('test_answers')
    .select(
      `is_correct, attempt_id,
       questions(category_id, chapter_id, categories(name), chapters(title))`
    )
    .in('attempt_id', attemptIds)

  if (answersError) throw answersError

  // ---- Overall accuracy ----
  const totalAnswered = answers.length
  const totalCorrect = answers.filter((a) => a.is_correct).length
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0

  // ---- Category strengths ----
  const categoryMap = new Map<string, { name: string; correct: number; total: number }>()
  for (const answer of answers) {
    const cat = answer.questions?.categories
    const catId = answer.questions?.category_id
    if (!cat || !catId) continue
    if (!categoryMap.has(catId)) {
      categoryMap.set(catId, { name: cat.name, correct: 0, total: 0 })
    }
    const entry = categoryMap.get(catId)!
    entry.total += 1
    if (answer.is_correct) entry.correct += 1
  }
  const categoryStrengths = Array.from(categoryMap.values())
    .map((c) => ({ ...c, accuracy: Math.round((c.correct / c.total) * 100) }))
    .sort((a, b) => b.accuracy - a.accuracy)

  // ---- Chapter performance (for weak chapter detection) ----
  const chapterMap = new Map<string, { title: string; correct: number; total: number }>()
  for (const answer of answers) {
    const chapter = answer.questions?.chapters
    const chapterId = answer.questions?.chapter_id
    if (!chapter || !chapterId) continue
    if (!chapterMap.has(chapterId)) {
      chapterMap.set(chapterId, { title: chapter.title, correct: 0, total: 0 })
    }
    const entry = chapterMap.get(chapterId)!
    entry.total += 1
    if (answer.is_correct) entry.correct += 1
  }
  const chapterPerformance = Array.from(chapterMap.values())
    .map((c) => ({ ...c, accuracy: Math.round((c.correct / c.total) * 100) }))
    // Only consider chapters with enough attempts to be meaningful
    .filter((c) => c.total >= 3)

  const weakChapters = chapterPerformance
    .filter((c) => c.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5)

  const recommendedChapters = weakChapters.slice(0, 3)

  // ---- Recent trend (last 10 attempts, oldest to newest, for a sparkline) ----
  const recentTrend = [...attempts]
    .slice(0, 10)
    .reverse()
    .map((a, i) => ({
      attempt: i + 1,
      accuracy:
        a.total_questions && a.total_questions > 0
          ? Math.round(((a.score ?? 0) / a.total_questions) * 100)
          : 0,
    }))

  // ---- JLPT readiness estimate ----
  // Simple weighted model: recent performance matters more than old performance
  const recentAccuracies = recentTrend.map((t) => t.accuracy)
  const weightedSum = recentAccuracies.reduce((sum, acc, i) => {
    const weight = i + 1 // later (more recent) attempts weigh more
    return sum + acc * weight
  }, 0)
  const weightTotal = recentAccuracies.reduce((sum, _, i) => sum + (i + 1), 0)
  const readinessPercentage =
    weightTotal > 0 ? Math.round(weightedSum / weightTotal) : overallAccuracy

  let readinessLabel = 'Just Getting Started'
  if (readinessPercentage >= 80) readinessLabel = 'Exam Ready'
  else if (readinessPercentage >= 60) readinessLabel = 'On Track'
  else if (readinessPercentage >= 40) readinessLabel = 'Needs Practice'

  return {
    hasData: true,
    totalTests: attempts.length,
    overallAccuracy,
    readiness: { label: readinessLabel, percentage: readinessPercentage },
    categoryStrengths,
    weakChapters,
    recommendedChapters,
    recentTrend,
  }
}