'use client'

import { createClient } from '@/lib/supabase/client'

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/avatar.${fileExt}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
  // Cache-bust so the new image shows immediately instead of a stale cached one
  return `${data.publicUrl}?t=${Date.now()}`
}