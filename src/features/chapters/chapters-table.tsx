'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChapterFormDialog } from './chapter-form-dialog'
import { DeleteChapterDialog } from './delete-chapter-dialog'

interface Chapter {
  id: string
  level_id: string
  title: string
  description: string | null
  sort_order: number
  levels: { code: string; name: string } | null
}

interface Level {
  id: string
  code: string
  name: string
}

interface ChaptersTableProps {
  chapters: Chapter[]
  levels: Level[]
}

export function ChaptersTable({ chapters, levels }: ChaptersTableProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [deletingChapter, setDeletingChapter] = useState<Chapter | null>(null)

  const handleCreate = () => {
    setEditingChapter(null)
    setFormOpen(true)
  }

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter)
    setFormOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Chapter
        </Button>
      </div>

      {chapters.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No chapters yet. Create your first chapter to get started.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chapters.map((chapter) => (
                <TableRow key={chapter.id}>
                  <TableCell>
                    <Badge variant="secondary">{chapter.levels?.code}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{chapter.title}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {chapter.description || '—'}
                  </TableCell>
                  <TableCell>{chapter.sort_order}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(chapter)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingChapter(chapter)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ChapterFormDialog
        levels={levels}
        open={formOpen}
        onOpenChange={setFormOpen}
        editingChapter={editingChapter}
      />

      {deletingChapter && (
        <DeleteChapterDialog
          chapterId={deletingChapter.id}
          chapterTitle={deletingChapter.title}
          open={!!deletingChapter}
          onOpenChange={(open) => !open && setDeletingChapter(null)}
        />
      )}
    </div>
  )
}