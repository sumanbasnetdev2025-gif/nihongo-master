import { createClient } from '@/lib/supabase/client'
import type { LoginInput, RegisterInput } from './schemas'

export async function signUp({ fullName, email, password }: RegisterInput) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }, // picked up by our DB trigger
    },
  })
  if (error) throw error
  return data
}

export async function signIn({ email, password }: LoginInput) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}