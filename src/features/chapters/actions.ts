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

export async function getChaptersByLevel(levelId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('level_id', levelId)
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

export async function getChapterQuestionStats(levelId?: string) {
  const supabase = await createClient()

  let chapterQuery = supabase
    .from('chapters')
    .select('id, title, level_id, levels(code)')
    .order('sort_order')

  if (levelId) chapterQuery = chapterQuery.eq('level_id', levelId)

  const [{ data: chapters, error: chError }, { data: categories, error: catError }] =
    await Promise.all([
      chapterQuery,
      supabase.from('categories').select('id, name, code').order('sort_order'),
    ])

  if (chError) throw chError
  if (catError) throw catError

  const stats = await Promise.all(
    (chapters ?? []).map(async (chapter) => {
      const byCategory: Record<string, number> = {}

      await Promise.all(
        (categories ?? []).map(async (cat) => {
          const { count } = await supabase
            .from('questions')
            .select('id', { count: 'exact', head: true })
            .eq('chapter_id', chapter.id)
            .eq('category_id', cat.id)

          byCategory[cat.id] = count ?? 0
        })
      )

      const total = Object.values(byCategory).reduce((sum, n) => sum + n, 0)

      return {
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        levelCode: (chapter as any).levels?.code ?? '—',
        total,
        byCategory,
      }
    })
  )

  let unassignedBaseQuery = supabase.from('questions').select('id', { count: 'exact', head: true }).is('chapter_id', null)
  if (levelId) unassignedBaseQuery = unassignedBaseQuery.eq('level_id', levelId)
  const { count: unassignedTotal } = await unassignedBaseQuery

  const unassignedByCategory: Record<string, number> = {}
  await Promise.all(
    (categories ?? []).map(async (cat) => {
      let q = supabase
        .from('questions')
        .select('id', { count: 'exact', head: true })
        .is('chapter_id', null)
        .eq('category_id', cat.id)
      if (levelId) q = q.eq('level_id', levelId)
      const { count } = await q
      unassignedByCategory[cat.id] = count ?? 0
    })
  )

  return {
    categories: categories ?? [],
    chapterStats: stats,
    unassigned: {
      total: unassignedTotal ?? 0,
      byCategory: unassignedByCategory,
    },
  }
}