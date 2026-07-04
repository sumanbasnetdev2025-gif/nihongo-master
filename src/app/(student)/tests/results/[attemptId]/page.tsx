import Link from "next/link";
import { CheckCircle2, XCircle, Clock, Target, TrendingUp } from "lucide-react";
import { getTestResult } from "@/features/results/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Celebration } from "@/features/results/celebration";

function formatTime(seconds: number | null) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const {
    attempt,
    answers,
    categoryScores,
    totalQuestions,
    score,
    percentage,
    passed,
  } = await getTestResult(attemptId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header summary */}
      <Card>
        <CardContent className="space-y-6 pt-6">
          <Celebration passed={passed} />
          <div className="flex flex-col items-center gap-3 text-center">
            {passed && <p className="text-2xl">🎉🌸🎉</p>}
            <Badge
              className={cn(
                "px-4 py-1 text-sm",
                passed
                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
              )}
            >
              {passed ? "PASS" : "NEEDS IMPROVEMENT"}
            </Badge>
            <div className="text-5xl font-bold">{percentage}%</div>
            <p className="font-medium">
              {passed
                ? `Great job! You scored ${score} out of ${totalQuestions}. 🌸`
                : `You scored ${score} out of ${totalQuestions} — keep practicing, you'll get there!`}
            </p>
            <p className="text-sm text-muted-foreground">
              {attempt.levels?.code} · {attempt.categories?.name ?? "Mixed"} ·{" "}
              {attempt.mode === "exam" ? "Exam Mode" : "Practice Mode"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t pt-6 text-center">
            <div>
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                <Target className="h-4 w-4" />
                <span className="text-xs">Score</span>
              </div>
              <p className="mt-1 font-semibold">
                {score} / {totalQuestions}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Time Taken</span>
              </div>
              <p className="mt-1 font-semibold">
                {formatTime(attempt.time_taken_seconds)}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">Accuracy</span>
              </div>
              <p className="mt-1 font-semibold">{percentage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category breakdown */}
      {categoryScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryScores.map((cat) => {
              const catPercentage =
                cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground">
                      {cat.correct} / {cat.total}
                    </span>
                  </div>
                  <Progress value={catPercentage} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link href="/tests" passHref className="flex-1">
          <Button variant="outline" className="w-full">
            Take Another Test
          </Button>
        </Link>
        <Link href="/dashboard" passHref className="flex-1">
          <Button className="w-full">Go to Dashboard</Button>
        </Link>
      </div>

      {/* Full question review */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Question Review</h2>
        {answers.map((answer, i) => {
          const q = answer.questions;
          if (!q) return null;
          const isCorrect = answer.is_correct;
          const letters = ["a", "b", "c", "d"] as const;

          return (
            <Card
              key={answer.id}
              className={cn(
                "border-l-4",
                isCorrect ? "border-l-green-500" : "border-l-red-500",
              )}
            >
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Question {i + 1} · {q.categories?.name}
                  </p>
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                  )}
                </div>

                <p className="font-medium">{q.question_text}</p>

                <div className="space-y-1.5">
                  {letters.map((letter) => {
                    const text = q[`option_${letter}` as const];
                    const isCorrectAnswer = q.correct_option === letter;
                    const isStudentAnswer = answer.selected_option === letter;

                    return (
                      <div
                        key={letter}
                        className={cn(
                          "rounded-md border px-3 py-2 text-sm",
                          isCorrectAnswer &&
                            "border-green-500 bg-green-50 dark:bg-green-950/30",
                          isStudentAnswer &&
                            !isCorrectAnswer &&
                            "border-red-500 bg-red-50 dark:bg-red-950/30",
                        )}
                      >
                        <span className="mr-2 font-semibold uppercase">
                          {letter}.
                        </span>
                        {text}
                        {isStudentAnswer && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (your answer)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {(q.explanation ||
                  q.grammar_notes ||
                  q.vocabulary_meaning ||
                  q.kanji_reading) && (
                  <div className="space-y-1 border-t pt-3 text-sm">
                    {q.explanation && (
                      <p>
                        <span className="font-medium">Explanation: </span>
                        {q.explanation}
                      </p>
                    )}
                    {q.grammar_notes && (
                      <p>
                        <span className="font-medium">Grammar notes: </span>
                        {q.grammar_notes}
                      </p>
                    )}
                    {q.vocabulary_meaning && (
                      <p>
                        <span className="font-medium">Vocabulary: </span>
                        {q.vocabulary_meaning}
                      </p>
                    )}
                    {q.kanji_reading && (
                      <p>
                        <span className="font-medium">Kanji reading: </span>
                        {q.kanji_reading}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
