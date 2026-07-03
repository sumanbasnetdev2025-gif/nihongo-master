'use client'

import { useEffect, useState } from 'react'
import { getQuestions, getCategories } from '@/features/questions/actions'
import { getLevels } from '@/features/chapters/actions'
import { QuestionsTable } from '@/features/questions/questions-table'

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [levels, setLevels] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [filters, setFilters] = useState<{ levelId?: string; categoryId?: string; status?: string }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getLevels(), getCategories()]).then(([l, c]) => {
      setLevels(l)
      setCategories(c)
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    getQuestions(filters as any)
      .then(setQuestions)
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Questions</h1>
        <p className="text-muted-foreground">Create and manage JLPT questions.</p>
      </div>

      {loading ? (
        <div className="rounded-lg border p-12 text-center text-muted-foreground">
          Loading questions...
        </div>
      ) : (
        <QuestionsTable
          questions={questions}
          levels={levels}
          categories={categories}
          filters={filters}
          onFilterChange={setFilters}
        />
      )}
    </div>
  )
}