'use server'

import { createClient } from '@/lib/supabase/server'

function getTodayDateString() {
  return new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
}

export async function getDailyChallengeStatus() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const today = getTodayDateString()
  const startOfDay = `${today}T00:00:00.000Z`
  const endOfDay = `${today}T23:59:59.999Z`

  // Check if the student already completed a daily-challenge attempt today.
  // We tag daily challenge attempts by using mode='practice' plus a specific
  // marker — simplest approach: check test_attempts created today with no
  // category filter (a genuine daily-challenge signature). For clarity and
  // scalability, we use a dedicated flag column approach below instead.
  const { data: existingAttempt } = await supabase
    .from('test_attempts')
    .select('id, score, total_questions, status')
    .eq('student_id', user.id)
    .gte('started_at', startOfDay)
    .lte('started_at', endOfDay)
    .eq('mode', 'daily_challenge')
    .maybeSingle()

  return {
    completedToday: existingAttempt?.status === 'completed',
    inProgressAttemptId:
      existingAttempt?.status === 'in_progress' ? existingAttempt.id : null,
    completedAttemptId:
      existingAttempt?.status === 'completed' ? existingAttempt.id : null,
  }
}

export async function getDailyChallengeQuestions(levelId: string) {
  const supabase = await createClient()

  // Deterministic daily selection: seed by today's date so every student
  // sees the same 10 questions on the same day, and it's stable if they refresh
  const today = getTodayDateString()
  const { data: allQuestions, error } = await supabase
    .from('questions')
    .select('*')
    .eq('level_id', levelId)
    .eq('is_published', true)

  if (error) throw error
  if (!allQuestions || allQuestions.length === 0) return []

  // Simple deterministic shuffle seeded by date string, so results are
  // consistent for everyone on the same calendar day
  const seed = today.split('-').reduce((acc, n) => acc + parseInt(n), 0)
  const shuffled = [...allQuestions].sort((a, b) => {
    const hashA = (a.id.charCodeAt(0) + seed) % 100
    const hashB = (b.id.charCodeAt(0) + seed) % 100
    return hashA - hashB
  })

  return shuffled.slice(0, Math.min(10, shuffled.length))
}