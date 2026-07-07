import Link from 'next/link'
import { BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChaptersTable } from '@/features/chapters/chapters-table'
import { getChapters, getLevels } from '@/features/chapters/actions'

export default async function AdminChaptersPage() {
  const [chapters, levels] = await Promise.all([getChapters(), getLevels()])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chapters</h1>
          <p className="text-muted-foreground">
            Organize questions into chapters for each JLPT level.
          </p>
        </div>
        <Button
          variant="outline"
          render={
            <Link href="/admin/chapters/stats">
              <BarChart3 className="mr-2 h-4 w-4" />
              Question Counts
            </Link>
          }
          nativeButton={false}
        />
      </div>

      <ChaptersTable chapters={chapters} levels={levels} />
    </div>
  )
}