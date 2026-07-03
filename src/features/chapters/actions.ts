'use server'

import { createClient } from '@/lib/supabase/server'
import { chapterSchema, type ChapterInput } from './schemas'
import { revalidatePath } from 'next/cache'

export async function getChapters() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('chapters')
    .select('*, levels(code, name)')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data
}

export async function getLevels() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('levels')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data
}

export async function createChapter(input: ChapterInput) {
  const parsed = chapterSchema.parse(input)
  const supabase = await createClient()

  const { error } = await supabase.from('chapters').insert({
    level_id: parsed.levelId,
    title: parsed.title,
    description: parsed.description || null,
    sort_order: parsed.sortOrder,
  })

  if (error) throw error
  revalidatePath('/admin/chapters')
}

export async function updateChapter(id: string, input: ChapterInput) {
  const parsed = chapterSchema.parse(input)
  const supabase = await createClient()

  const { error } = await supabase
    .from('chapters')
    .update({
      level_id: parsed.levelId,
      title: parsed.title,
      description: parsed.description || null,
      sort_order: parsed.sortOrder,
    })
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/chapters')
}

export async function deleteChapter(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('chapters').delete().eq('id', id)

  if (error) throw error
  revalidatePath('/admin/chapters')
}