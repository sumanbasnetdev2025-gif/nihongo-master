import { PracticeSession } from "../../practice-session"

export default async function PracticeTestPage({
  params,
}: {
  params: Promise<{ attemptId: string }>
}) {
  const { attemptId } = await params

  return (
    <div className="space-y-6">
      <PracticeSession attemptId={attemptId} />
    </div>
  )
}