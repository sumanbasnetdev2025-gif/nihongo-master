"use client";

import { Trash2 } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { BulkFormValues } from "./bulk-schema";

interface BulkQuestionRowProps {
  index: number;
  register: UseFormRegister<BulkFormValues>;
  errors: FieldErrors<BulkFormValues>;
  correctOption: "a" | "b" | "c" | "d" | undefined;
  onCorrectOptionChange: (value: "a" | "b" | "c" | "d") => void;
  onRemove: () => void;
  canRemove: boolean;
}

const letters = ["a", "b", "c", "d"] as const;

export function BulkQuestionRow({
  index,
  register,
  errors,
  correctOption,
  onCorrectOptionChange,
  onRemove,
  canRemove,
}: BulkQuestionRowProps) {
  const rowErrors = errors.questions?.[index];

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">
          Question {index + 1}
        </span>
        {canRemove && (
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>

      <div className="space-y-1.5">
        <Textarea
          rows={2}
          placeholder="Question text"
          {...register(`questions.${index}.questionText`)}
        />
        {rowErrors?.questionText && (
          <p className="text-xs text-red-500">
            {rowErrors.questionText.message}
          </p>
        )}
      </div>

      <RadioGroup
        value={correctOption ?? ""}
        onValueChange={(v) => onCorrectOptionChange(v as "a" | "b" | "c" | "d")}
        className="space-y-2"
      >
        {letters.map((letter) => (
          <div key={letter} className="flex items-center gap-2">
            <RadioGroupItem value={letter} id={`q${index}-${letter}`} />
            <Input
              placeholder={`Option ${letter.toUpperCase()}`}
              {...register(
                `questions.${index}.option${letter.toUpperCase() as "A" | "B" | "C" | "D"}`,
              )}
            />
          </div>
        ))}
      </RadioGroup>
      {rowErrors?.correctOption && (
        <p className="text-xs text-red-500">
          {rowErrors.correctOption.message}
        </p>
      )}

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">
          Explanation (optional)
        </Label>
        <Textarea
          rows={2}
          placeholder="Explanation shown to students after answering"
          {...register(`questions.${index}.explanation`)}
        />
      </div>
    </div>
  );
}
