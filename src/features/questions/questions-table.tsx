'use client'

import { useState, useTransition } from 'react'
import { Pencil, Trash2, Plus, ClipboardPaste } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { NativeSelect } from '@/components/ui/native-select'
import { QuestionFormDialog } from './question-form-dialog'
import { deleteQuestion, toggleQuestionPublish, deleteQuestionsBulk } from './actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import Link from 'next/link'

interface QuestionsTableProps {
  questions: any[]
  levels: any[]
  categories: any[]
  filters: { levelId?: string; categoryId?: string; status?: string }
  onFilterChange: (filters: any) => void
  onRefresh: () => void
}

export function QuestionsTable({
  questions,
  levels,
  categories,
  filters,
  onFilterChange,
  onRefresh,
}: QuestionsTableProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<any>(null)
  const [deletingQuestion, setDeletingQuestion] = useState<any>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleCreate = () => {
    setEditingQuestion(null)
    setFormOpen(true)
  }

  const handleEdit = (q: any) => {
    setEditingQuestion(q)
    setFormOpen(true)
  }

  const handleTogglePublish = (q: any) => {
    startTransition(async () => {
      try {
        await toggleQuestionPublish(q.id, !q.is_published)
        toast.success(q.is_published ? 'Unpublished' : 'Published')
        onRefresh()
      } catch {
        toast.error('Failed to update status')
      }
    })
  }

  const handleDelete = async () => {
    if (!deletingQuestion) return
    try {
      await deleteQuestion(deletingQuestion.id)
      toast.success('Question deleted')
      setDeletingQuestion(null)
      onRefresh()
    } catch {
      toast.error('Failed to delete question')
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === questions.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(questions.map((q) => q.id))
    }
  }

  const handleBulkDelete = async () => {
    setBulkDeleting(true)
    try {
      const result = await deleteQuestionsBulk(selectedIds)
      toast.success(`${result.deleted} questions deleted`)
      setSelectedIds([])
      setBulkDeleteOpen(false)
      onRefresh()
    } catch {
      toast.error('Failed to delete selected questions')
    } finally {
      setBulkDeleting(false)
    }
  }

  const allSelected = questions.length > 0 && selectedIds.length === questions.length

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <NativeSelect
          className="w-36"
          value={filters.levelId || 'all'}
          onChange={(e) => onFilterChange({ ...filters, levelId: e.target.value === 'all' ? undefined : e.target.value })}
        >
          <option value="all">All Levels</option>
          {levels.map((l) => (
            <option key={l.id} value={l.id}>{l.code}</option>
          ))}
        </NativeSelect>

        <NativeSelect
          className="w-44"
          value={filters.categoryId || 'all'}
          onChange={(e) => onFilterChange({ ...filters, categoryId: e.target.value === 'all' ? undefined : e.target.value })}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </NativeSelect>

        <NativeSelect
          className="w-36"
          value={filters.status || 'all'}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value === 'all' ? undefined : e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </NativeSelect>

        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            render={<Link href="/admin/questions/bulk"><ClipboardPaste className="mr-2 h-4 w-4" />Bulk Add</Link>}
            nativeButton={false}
          />
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Question
          </Button>
        </div>
      </div>

      {/* Bulk action bar — only shows when something is selected */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-2.5">
          <p className="text-sm font-medium">
            {selectedIds.length} question{selectedIds.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
              Clear
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setBulkDeleteOpen(true)}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {questions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No questions match these filters.</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
                </TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q) => (
                <TableRow key={q.id} data-state={selectedIds.includes(q.id) ? 'selected' : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(q.id)}
                      onCheckedChange={() => toggleSelect(q.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{q.levels?.code}</Badge>
                  </TableCell>
                  <TableCell>{q.categories?.name}</TableCell>
                  <TableCell className="max-w-sm truncate">{q.question_text}</TableCell>
                  <TableCell className="capitalize">{q.difficulty}</TableCell>
                  <TableCell>
                    <Switch
                      checked={q.is_published}
                      onCheckedChange={() => handleTogglePublish(q)}
                      disabled={isPending}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(q)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingQuestion(q)}
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

      <QuestionFormDialog
        levels={levels}
        categories={categories}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) onRefresh()
        }}
        editingQuestion={editingQuestion}
      />

      {/* Single delete confirmation */}
      {deletingQuestion && (
        <AlertDialog open={!!deletingQuestion} onOpenChange={(o) => !o && setDeletingQuestion(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this question?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Students who bookmarked this question will lose
                access to it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

     {/* Bulk delete confirmation */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.length} questions?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all selected questions. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} disabled={bulkDeleting}>
              {bulkDeleting ? 'Deleting...' : 'Delete All'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}