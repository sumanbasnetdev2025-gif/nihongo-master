import Link from 'next/link'
import { FileQuestion, Users, BookMarked, TrendingUp } from 'lucide-react'
import { getAdminAnalytics } from '@/features/admin-analytics/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function AdminOverviewPage() {
  const analytics = await getAdminAnalytics()

  const stats = [
    { label: 'Total Questions', value: analytics.totalQuestions.toString(), icon: FileQuestion },
    { label: 'Published Questions', value: analytics.publishedQuestions.toString(), icon: TrendingUp },
    { label: 'Total Students', value: analytics.totalStudents.toString(), icon: Users },
    { label: 'Chapters', value: analytics.totalChapters.toString(), icon: BookMarked },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground">
          Manage content, questions, and monitor platform activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/admin/chapters" passHref>
            <Button variant="outline">Manage Chapters</Button>
          </Link>
          <Link href="/admin/questions" passHref>
            <Button variant="outline">Manage Questions</Button>
          </Link>
          <Link href="/admin/analytics" passHref>
            <Button variant="outline">View Analytics</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}