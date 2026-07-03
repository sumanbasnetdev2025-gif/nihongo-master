import { FileQuestion, Users, BookMarked, ClipboardCheck, Eye, EyeOff } from 'lucide-react'
import { getAdminAnalytics } from '@/features/admin-analytics/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CategoryDistributionChart } from '@/features/admin-analytics/category-distribution-chart'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default async function AdminAnalyticsPage() {
  const analytics = await getAdminAnalytics()

  const stats = [
    { label: 'Total Students', value: analytics.totalStudents, icon: Users },
    { label: 'Total Questions', value: analytics.totalQuestions, icon: FileQuestion },
    { label: 'Published', value: analytics.publishedQuestions, icon: Eye },
    { label: 'Draft', value: analytics.draftQuestions, icon: EyeOff },
    { label: 'Chapters', value: analytics.totalChapters, icon: BookMarked },
    { label: 'Tests Completed', value: analytics.totalAttempts, icon: ClipboardCheck },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Platform-wide activity and content overview.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Questions by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryDistributionChart data={analytics.questionsByCategory} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recently Joined Students</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.recentUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No students yet.</p>
            ) : (
              analytics.recentUsers.map((user) => {
                const initials = user.full_name
                  ? user.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                  : 'U'
                return (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {user.avatar_url && <AvatarImage src={user.avatar_url} />}
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user.full_name ?? 'Unnamed User'}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(user.created_at)}</span>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}