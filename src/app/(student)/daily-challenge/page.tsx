"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flame, CheckCircle2 } from "lucide-react";
import {
  getDailyChallengeStatus,
  getDailyChallengeQuestions,
} from "@/features/daily-challenge/actions";
import { startTestAttempt } from "@/features/tests/actions";
import { getLevels } from "@/features/chapters/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePracticeStore } from "@/stores/practice-store";

export default function DailyChallengePage() {
  const router = useRouter();
  const setSession = usePracticeStore((s) => s.setSession);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [status, setStatus] = useState<{
    completedToday: boolean;
    completedAttemptId: string | null;
  } | null>(null);

  useEffect(() => {
    getDailyChallengeStatus()
      .then(setStatus)
      .finally(() => setLoading(false));
  }, []);

  const handleStart = async () => {
    setStarting(true);
    try {
      const levels = await getLevels();
      const n5 = levels.find((l) => l.code === "N5") ?? levels[0];
      if (!n5) {
        toast.error("No levels available yet");
        return;
      }

      const questions = await getDailyChallengeQuestions(n5.id);
      if (questions.length === 0) {
        toast.error(
          "No published questions available for today's challenge yet",
        );
        return;
      }

      const attempt = await startTestAttempt({
        levelId: n5.id,
        mode: "daily_challenge",
        totalQuestions: questions.length,
      });

      setSession(attempt.id, questions as any);
      router.push(`/tests/practice/${attempt.id}`);
    } catch {
      toast.error("Could not start today's challenge");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Daily Challenge</h1>
        <p className="text-muted-foreground">
          A fresh set of 10 questions every day. Come back tomorrow for a new
          one.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Flame className="h-8 w-8 text-primary" />
          </div>

          {status?.completedToday ? (
            <>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <p className="font-medium">Today&apos;s challenge complete!</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Come back tomorrow for a new set.
              </p>
              {status.completedAttemptId && (
                <Link
                  href={`/tests/results/${status.completedAttemptId}`}
                  passHref
                >
                  <Button variant="outline">View Results</Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <p className="font-medium">Today&apos;s challenge is ready</p>
              <p className="text-sm text-muted-foreground">
                10 questions, practice-style — see explanations as you go.
              </p>
              <Button onClick={handleStart} disabled={starting}>
                {starting ? "Starting..." : "Start Today's Challenge"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
