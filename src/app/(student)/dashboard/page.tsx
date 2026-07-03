import { getCurrentProfile } from '@/features/auth/get-profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Target, TrendingUp, Award } from 'lucide-react'
import { getPerformanceAnalytics } from '@/features/analytics/action'

export default async function DashboardPage() {
  const [profile, analytics] = await Promise.all([
    getCurrentProfile(),
    getPerformanceAnalytics(),
  ])

  const stats = [
    { label: 'Tests Taken', value: analytics.totalTests.toString(), icon: BookOpen },
    { label: 'Average Score', value: analytics.hasData ? `${analytics.overallAccuracy}%` : '—', icon: Target },
    { label: 'JLPT Readiness', value: analytics.hasData ? analytics.readiness.label : '—', icon: TrendingUp },
    { label: 'Recommended Focus', value: analytics.recommendedChapters[0]?.title ?? '—', icon: Award },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {profile?.full_name ?? 'Student'} 👋
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your JLPT N5 progress.
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
              <div className="truncate text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {analytics.hasData
              ? 'Keep up the momentum — take another practice test to boost your readiness.'
              : "You haven't taken any tests yet. Head to the Tests page to begin your first JLPT N5 practice session."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}