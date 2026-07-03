import Link from 'next/link'
import { TrendingUp, Target, BookOpen, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CategoryChart } from '@/features/analytics/category-chart'
import { TrendChart } from '@/features/analytics/trend-chart'
import { getPerformanceAnalytics } from '@/features/analytics/action'

export default async function ProgressPage() {
  const analytics = await getPerformanceAnalytics()

  if (!analytics.hasData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Progress</h1>
          <p className="text-muted-foreground">Your performance analytics will appear here.</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <TrendingUp className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">No test data yet</p>
              <p className="text-sm text-muted-foreground">
                Take your first test to start seeing your progress here.
              </p>
            </div>
            <Link href="/tests">
              <Button>Take a Test</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { totalTests, overallAccuracy, readiness, categoryStrengths, weakChapters, recommendedChapters, recentTrend } =
    analytics

  const readinessColor =
    readiness.percentage >= 80
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
      : readiness.percentage >= 60
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Progress</h1>
        <p className="text-muted-foreground">Your performance analytics across all tests.</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tests Taken</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAccuracy}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">JLPT Readiness</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={readinessColor}>{readiness.label}</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Trend chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={recentTrend} />
        </CardContent>
      </Card>

      {/* Category breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Strength by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryChart data={categoryStrengths} />
        </CardContent>
      </Card>

      {/* Weak chapters + recommendations */}
      {weakChapters.length > 0 && (
        <Card className="border-yellow-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Chapters to Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakChapters.map((chapter) => (
              <div key={chapter.title} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{chapter.title}</span>
                  <span className="text-muted-foreground">{chapter.accuracy}% accuracy</span>
                </div>
                <Progress value={chapter.accuracy} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {recommendedChapters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Based on your recent results, focus on these chapters next:
            </p>
            <div className="flex flex-wrap gap-2">
              {recommendedChapters.map((chapter) => (
                <Badge key={chapter.title} variant="secondary" className="px-3 py-1.5">
                  {chapter.title}
                </Badge>
              ))}
            </div>
            <Link href="/tests">
              <Button className="mt-4 w-full sm:w-auto">Practice Now</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}