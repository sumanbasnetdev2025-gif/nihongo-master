import { getLevels } from '@/features/chapters/actions'
import { getCategories } from '@/features/questions/actions'
import { TestSetupForm } from '@/features/tests/test-setup-form'

export default async function TestsPage() {
  const [levels, categories] = await Promise.all([getLevels(), getCategories()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tests</h1>
        <p className="text-muted-foreground">Choose what you&apos;d like to practice.</p>
      </div>
      <TestSetupForm levels={levels} categories={categories} />
    </div>
  )
}