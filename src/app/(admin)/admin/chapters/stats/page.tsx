'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { getChapterQuestionStats, getLevels } from '@/features/chapters/actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import { Label } from '@/components/ui/label'

export default function ChapterQuestionStatsPage() {
  const [levels, setLevels] = useState<any[]>([])
  const [levelId, setLevelId] = useState('')
  const [chapterFilter, setChapterFilter] = useState('all')
  const [data, setData] = useState<{
    categories: any[]
    chapterStats: any[]
    unassigned: { total: number; byCategory: Record<string, number> }
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLevels().then((l) => {
      setLevels(l)
      if (l.length > 0) setLevelId(l[0].id) // default to first level, e.g. N5
    })
  }, [])

  const fetchStats = useCallback(() => {
    if (!levelId) return
    setLoading(true)
    getChapterQuestionStats(levelId)
      .then(setData)
      .finally(() => setLoading(false))
  }, [levelId])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const visibleChapters =
    chapterFilter === 'all'
      ? data?.chapterStats ?? []
      : (data?.chapterStats ?? []).filter((c) => c.chapterId === chapterFilter)

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/chapters"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Chapters
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Question Counts by Chapter</h1>
            <p className="text-muted-foreground">
              See how many questions exist per chapter and category. Updates live as you add
              questions.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading}>
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="w-40 space-y-1.5">
          <Label className="text-xs">Level</Label>
          <NativeSelect value={levelId} onChange={(e) => setLevelId(e.target.value)}>
            {levels.map((l) => (
              <option key={l.id} value={l.id}>{l.code ?? l.name}</option>
            ))}
          </NativeSelect>
        </div>

        <div className="w-56 space-y-1.5">
          <Label className="text-xs">Chapter (optional)</Label>
          <NativeSelect value={chapterFilter} onChange={(e) => setChapterFilter(e.target.value)}>
            <option value="all">All Chapters</option>
            {(data?.chapterStats ?? []).map((c) => (
              <option key={c.chapterId} value={c.chapterId}>{c.chapterTitle}</option>
            ))}
          </NativeSelect>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border p-12 text-center text-muted-foreground">
          Loading question counts...
        </div>
      ) : !data || visibleChapters.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No chapters found for this level.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Chapter</TableHead>
                {data.categories.map((c) => (
                  <TableHead key={c.id} className="text-center">{c.name}</TableHead>
                ))}
                <TableHead className="text-center font-bold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleChapters.map((row) => (
                <TableRow key={row.chapterId}>
                  <TableCell>
                    <Badge variant="secondary">{row.levelCode}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{row.chapterTitle}</TableCell>
                  {data.categories.map((c) => {
                    const count = row.byCategory[c.id] ?? 0
                    return (
                      <TableCell
                        key={c.id}
                        className={`text-center ${count === 0 ? 'text-muted-foreground' : ''}`}
                      >
                        {count}
                      </TableCell>
                    )
                  })}
                  <TableCell className="text-center font-bold">{row.total}</TableCell>
                </TableRow>
              ))}

              {chapterFilter === 'all' && data.unassigned.total > 0 && (
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={2} className="italic text-muted-foreground">
                    No chapter assigned
                  </TableCell>
                  {data.categories.map((c) => (
                    <TableCell key={c.id} className="text-center text-muted-foreground">
                      {data.unassigned.byCategory[c.id] ?? 0}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-bold">{data.unassigned.total}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}