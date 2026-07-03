import { getChapters, getLevels } from '@/features/chapters/actions'
import { ChaptersTable } from '@/features/chapters/chapters-table'

export default async function AdminChaptersPage() {
  const [chapters, levels] = await Promise.all([getChapters(), getLevels()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chapters</h1>
        <p className="text-muted-foreground">
          Organize questions into chapters for each JLPT level.
        </p>
      </div>

      <ChaptersTable chapters={chapters} levels={levels} />
    </div>
  )
}