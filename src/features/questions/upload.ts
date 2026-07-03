'use client'

import { createClient } from '@/lib/supabase/client'

export async function uploadQuestionImage(file: File): Promise<string> {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`

  const { error } = await supabase.storage
    .from('question-images')
    .upload(fileName, file)

  if (error) throw error

  const { data } = supabase.storage.from('question-images').getPublicUrl(fileName)
  return data.publicUrl
}

export async function uploadQuestionAudio(file: File): Promise<string> {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`

  const { error } = await supabase.storage
    .from('question-audio')
    .upload(fileName, file)

  if (error) throw error

  const { data } = supabase.storage.from('question-audio').getPublicUrl(fileName)
  return data.publicUrl
}