import Link from "next/link";
import { Bookmark } from "lucide-react";
import { getBookmarkedQuestions } from "@/features/bookmarks/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/features/bookmarks/bookmark-button";

interface BookmarkedQuestion {
  correct_option: "a" | "b" | "c" | "d";
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

function getCorrectOptionText(q: BookmarkedQuestion): string {
  switch (q.correct_option) {
    case "a":
      return q.option_a;
    case "b":
      return q.option_b;
    case "c":
      return q.option_c;
    case "d":
      return q.option_d;
  }
}
export default async function BookmarksPage() {
  const bookmarks = await getBookmarkedQuestions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bookmarks</h1>
        <p className="text-muted-foreground">
          Questions you&apos;ve saved for later review.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <Bookmark className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">No bookmarks yet</p>
              <p className="text-sm text-muted-foreground">
                Tap the bookmark icon while practicing to save questions here.
              </p>
            </div>
            <Link href="/tests" passHref>
              <Button>Start Practicing</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((b) => {
            const q = b.questions;
            if (!q) return null;

            const level = Array.isArray(q.levels) ? q.levels[0] : q.levels;
            const category = Array.isArray(q.categories)
              ? q.categories[0]
              : q.categories;

            return (
              <Card key={b.id}>
                <CardContent className="space-y-3 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {level?.code && (
                        <Badge variant="secondary">{level.code}</Badge>
                      )}
                      {category?.name && (
                        <Badge variant="outline">{category.name}</Badge>
                      )}
                    </div>
                    <BookmarkButton
                      questionId={q.id}
                      initialBookmarked={true}
                    />
                  </div>
                  <p className="font-medium">{q.question_text}</p>
                  <p className="text-sm text-muted-foreground">
                    Correct answer:{" "}
                    <span className="font-medium text-foreground">
                      {q.correct_option.toUpperCase()}.{" "}
                      {getCorrectOptionText(q)}
                    </span>
                  </p>
                  {q.explanation && (
                    <p className="text-sm text-muted-foreground">
                      {q.explanation}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
