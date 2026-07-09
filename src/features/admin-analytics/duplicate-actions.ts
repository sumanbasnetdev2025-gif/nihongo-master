'use server'

import { createClient } from '@/lib/supabase/server'

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s　]+/g, '')
    .replace(/[、。！？「」『』（）()［］【】.,!?]/g, '')
    .trim()
}

export async function findDuplicateQuestions(levelId?: string) {
  const supabase = await createClient()

  const pageSize = 1000
  let from = 0
  let allQuestions: any[] = []

  while (true) {
    let query = supabase
      .from('questions')
      .select(`
        id,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        explanation,
        grammar_notes,
        vocabulary_meaning,
        kanji_reading,
        difficulty,
        tags,
        image_url,
        audio_url,
        is_published,
        chapter_id,
        chapters(title),
        level_id,
        levels(code),
        category_id,
        categories(name)
      `)
      .order('created_at')
      .range(from, from + pageSize - 1)

    if (levelId) {
      query = query.eq('level_id', levelId)
    }

    const { data, error } = await query

    if (error) throw error

    if (!data || data.length === 0) break

    allQuestions.push(...data)

    if (data.length < pageSize) break

    from += pageSize
  }

  const groups = new Map<string, any[]>()

  for (const q of allQuestions) {
    const normalized = normalize(q.question_text)

    if (!normalized) continue

    // Compare only inside the same category
    const key = `${q.category_id}:${normalized}`

    if (!groups.has(key)) {
      groups.set(key, [])
    }

    groups.get(key)!.push(q)
  }

  return Array.from(groups.values())
    .filter(group => group.length > 1)
    .map(group => ({
      questionText: group[0].question_text,
      count: group.length,
      questions: group.map(q => ({
        id: q.id,
        chapter_id: q.chapter_id,
        chapterTitle: q.chapters?.title ?? 'No chapter',
        level_id: q.level_id,
        levelCode: q.levels?.code ?? '—',
        category_id: q.category_id,
        categoryName: q.categories?.name ?? '—',
        isPublished: q.is_published,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option,
        explanation: q.explanation,
        grammar_notes: q.grammar_notes,
        vocabulary_meaning: q.vocabulary_meaning,
        kanji_reading: q.kanji_reading,
        difficulty: q.difficulty,
        tags: q.tags,
        image_url: q.image_url,
        audio_url: q.audio_url,
      })),
    }))
    .sort((a, b) => b.count - a.count)
}