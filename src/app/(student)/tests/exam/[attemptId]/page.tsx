import { ExamSession } from '@/features/tests/exam-session'

export default async function ExamTestPage({
  params,
}: {
  params: Promise<{ attemptId: string }>
}) {
  const { attemptId } = await params

  return (
    <div className="space-y-6">
      <ExamSession attemptId={attemptId} />
    </div>
  )
}