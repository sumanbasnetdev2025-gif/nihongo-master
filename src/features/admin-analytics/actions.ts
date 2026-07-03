'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAdminAnalytics() {
  const supabase = await createClient()

  const [
    { count: totalStudents },
    { count: totalQuestions },
    { count: publishedQuestions },
    { count: totalChapters },
    { count: totalAttempts },
    { data: questions },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('questions').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('chapters').select('*', { count: 'exact', head: true }),
    supabase.from('test_attempts').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('questions').select('category_id, categories(name)'),
    supabase
      .from('profiles')
      .select('id, full_name, avatar_url, created_at')
      .eq('role', 'student')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // Question distribution by category
  const categoryMap = new Map<string, number>()
  for (const q of questions ?? []) {
    const name = (q as any).categories?.name
    if (!name) continue
    categoryMap.set(name, (categoryMap.get(name) ?? 0) + 1)
  }
  const questionsByCategory = Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count,
  }))

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