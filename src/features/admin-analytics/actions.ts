'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAdminAnalytics() {
  const supabase = await createClient()

  // Basic analytics
  const [
    { count: totalStudents },
    { count: totalQuestions },
    { count: publishedQuestions },
    { count: totalChapters },
    { count: totalAttempts },
    { data: recentUsers },
    { data: categories },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student'),

    supabase
      .from('questions')
      .select('*', { count: 'exact', head: true }),

    supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true),

    supabase
      .from('chapters')
      .select('*', { count: 'exact', head: true }),

    supabase
      .from('test_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed'),

    supabase
      .from('profiles')
      .select('id, full_name, avatar_url, created_at')
      .eq('role', 'student')
      .order('created_at', { ascending: false })
      .limit(5),

    supabase
      .from('categories')
      .select('id, name'),
  ])

  // Count questions for each category
  const questionsByCategory = await Promise.all(
    (categories ?? []).map(async (category) => {
      const { count } = await supabase
        .from('questions')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('category_id', category.id)

      return {
        name: category.name,
        count: count ?? 0,
      }
    })
  )

  return {
    totalStudents: totalStudents ?? 0,
    totalQuestions: totalQuestions ?? 0,
    publishedQuestions: publishedQuestions ?? 0,
    draftQuestions: (totalQuestions ?? 0) - (publishedQuestions ?? 0),
    totalChapters: totalChapters ?? 0,
    totalAttempts: totalAttempts ?? 0,
    questionsByCategory,
    recentUsers: recentUsers ?? [],
  }
}