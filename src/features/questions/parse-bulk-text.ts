export interface ParsedQuestion {
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption?: 'a' | 'b' | 'c' | 'd'
}

const OPTION_LINE = /^(\*?)([A-Da-d])[.).]\s*(.+)$/
const LABEL_LINE = /^(もんだい|問題|Q\.?|Question)\s*\d*\s*[:.．]?\s*$/i

function isOptionA(line: string): boolean {
  const match = line.match(OPTION_LINE)
  return !!match && match[2].toLowerCase() === 'a'
}

function buildQuestionText(headerLines: string[]): string {
  // Drop pure label lines like "もんだい５" or "Question 5" — they carry no
  // actual question content, just a numbering marker
  const meaningful = headerLines.filter((line) => !LABEL_LINE.test(line))

  if (meaningful.length === 0) return headerLines.join(' ').trim()

  const joined = meaningful.join('\n').trim()

  // If the entire remaining text is just a single bracket-quoted term,
  // e.g. 「ぎんこういん」, unwrap the brackets for a cleaner question field
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
    .filter(Boolean) // blank lines are just visual spacing — ignore them entirely

  const results: ParsedQuestion[] = []
  let headerLines: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // A new question's options start once we hit an "A." line —
    // but only if we've actually collected some header/question text first
    if (isOptionA(line) && headerLines.length > 0) {
      const optionLines = lines.slice(i, i + 4)

      if (optionLines.length === 4) {
        const options: Record<'a' | 'b' | 'c' | 'd', string> = { a: '', b: '', c: '', d: '' }
        let correctOption: 'a' | 'b' | 'c' | 'd' | undefined
        let allMatched = true

        optionLines.forEach((optLine) => {
          const match = optLine.match(OPTION_LINE)
          if (!match) {
            allMatched = false
            return
          }
          const [, star, letter, text] = match
          const key = letter.toLowerCase() as 'a' | 'b' | 'c' | 'd'
          options[key] = text.trim()
          if (star === '*') correctOption = key
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