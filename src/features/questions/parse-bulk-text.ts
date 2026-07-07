export interface ParsedQuestion {
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption?: 'a' | 'b' | 'c' | 'd'
}

// Matches lettered options with an optional * at the START or END:
// "A. text", "*B. text", "C. text*" — all valid
const LETTER_OPTION = /^(\*?)([A-Da-d])[.).]\s*(.+?)(\*?)$/
// Same idea for numbered options: "1. text", "*2. text", "3. text*"
const NUMBER_OPTION = /^(\*?)([1-4])[.).]\s*(.+?)(\*?)$/

const LABEL_LINE = /^(もんだい|問題|Q\.?|Question)\s*\d*\s*[:.．]?\s*$/i

function matchOption(line: string): { letter: 'a' | 'b' | 'c' | 'd'; text: string; isCorrect: boolean } | null {
  const letterMatch = line.match(LETTER_OPTION)
  if (letterMatch) {
    const [, leadingStar, letter, text, trailingStar] = letterMatch
    return {
      letter: letter.toLowerCase() as 'a' | 'b' | 'c' | 'd',
      text: text.trim(),
      isCorrect: leadingStar === '*' || trailingStar === '*',
    }
  }

  const numberMatch = line.match(NUMBER_OPTION)
  if (numberMatch) {
    const [, leadingStar, num, text, trailingStar] = numberMatch
    const letterFromNumber = (['a', 'b', 'c', 'd'] as const)[Number(num) - 1]
    return {
      letter: letterFromNumber,
      text: text.trim(),
      isCorrect: leadingStar === '*' || trailingStar === '*',
    }
  }

  return null
}

function isFirstOption(line: string): boolean {
  const match = matchOption(line)
  return match?.letter === 'a'
}

function buildQuestionText(headerLines: string[]): string {
  const meaningful = headerLines.filter((line) => !LABEL_LINE.test(line))

  if (meaningful.length === 0) return headerLines.join(' ').trim()

  const joined = meaningful.join('\n').trim()

  const bracketMatch = joined.match(/^[「『](.+)[」』]$/)
  if (bracketMatch && meaningful.length === 1) {
    return bracketMatch[1].trim()
  }

  return joined
}

export function parseBulkQuestionText(raw: string): ParsedQuestion[] {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const results: ParsedQuestion[] = []
  let headerLines: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (isFirstOption(line) && headerLines.length > 0) {
      const optionLines = lines.slice(i, i + 4)

      if (optionLines.length === 4) {
        const options: Record<'a' | 'b' | 'c' | 'd', string> = { a: '', b: '', c: '', d: '' }
        let correctOption: 'a' | 'b' | 'c' | 'd' | undefined
        let allMatched = true

        optionLines.forEach((optLine) => {
          const matched = matchOption(optLine)
          if (!matched) {
            allMatched = false
            return
          }
          options[matched.letter] = matched.text
          if (matched.isCorrect) correctOption = matched.letter
        })

        if (allMatched) {
          results.push({
            questionText: buildQuestionText(headerLines),
            optionA: options.a,
            optionB: options.b,
            optionC: options.c,
            optionD: options.d,
            correctOption,
          })
          headerLines = []
          i += 4
          continue
        }
      }
    }

    headerLines.push(line)
    i++
  }

  return results
}