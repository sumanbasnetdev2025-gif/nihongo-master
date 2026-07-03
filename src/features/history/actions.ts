'use server'

import { createClient } from '@/lib/supabase/server'

export async function getTestHistory(filters?: {
  mode?: 'practice' | 'exam' | 'daily_challenge'
  levelId?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  let query = supabase
    .from('test_attempts')
    .select('*, levels(code), chapters(title), categories(name)')
    .eq('student_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })

  if (filters?.mode) query = query.eq('mode', filters.mode)
  if (filters?.levelId) query = query.eq('level_id', filters.levelId)

  const { data, error } = await query
  if (error) throw error
  return data
}