'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAllUsers(search?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (search) {
    query = query.ilike('full_name', `%${search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getUserStats(userId: string) {
  const supabase = await createClient()

  const { data: attempts, error } = await supabase
    .from('test_attempts')
    .select('score, total_questions, status')
    .eq('student_id', userId)
    .eq('status', 'completed')

  if (error) throw error

  const totalTests = attempts.length
  const totalScore = attempts.reduce((sum, a) => sum + (a.score ?? 0), 0)
  const totalQuestions = attempts.reduce((sum, a) => sum + (a.total_questions ?? 0), 0)
  const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0

  return { totalTests, accuracy }
}

export async function updateUserRole(userId: string, role: 'student' | 'admin') {
  const supabase = await createClient()

  // Safety check: prevent an admin from accidentally demoting themselves
  // and locking themselves out of the admin panel
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (currentUser?.id === userId && role === 'student') {
    throw new Error('You cannot remove your own admin access')
  }

  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
  if (error) throw error
  revalidatePath('/admin/users')
}
export async function updateUserName(userId: string, fullName: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', userId)

  if (error) throw error
  revalidatePath('/admin/users')
}