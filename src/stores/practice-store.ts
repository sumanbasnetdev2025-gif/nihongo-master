import { create } from 'zustand'

interface Question {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: 'a' | 'b' | 'c' | 'd'
  explanation: string | null
  grammar_notes: string | null
  vocabulary_meaning: string | null
  kanji_reading: string | null
  image_url: string | null
  audio_url: string | null
}

interface PracticeState {
  attemptId: string | null
  questions: Question[]
  currentIndex: number
  selectedOption: string | null
  revealed: boolean
  correctCount: number
  startTime: number | null
  setSession: (attemptId: string, questions: Question[]) => void
  selectOption: (option: string) => void
  reveal: () => void
  next: () => void
  reset: () => void
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  attemptId: null,
  questions: [],
  currentIndex: 0,
  selectedOption: null,
  revealed: false,
  correctCount: 0,
  startTime: null,

  setSession: (attemptId, questions) =>
    set({
      attemptId,
      questions,
      currentIndex: 0,
      selectedOption: null,
      revealed: false,
      correctCount: 0,
      startTime: Date.now(),
    }),

  selectOption: (option) => set({ selectedOption: option }),

  reveal: () => {
    const { questions, currentIndex, selectedOption, correctCount } = get()
    const isCorrect = selectedOption === questions[currentIndex].correct_option
    set({ revealed: true, correctCount: isCorrect ? correctCount + 1 : correctCount })
  },

  next: () =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
      selectedOption: null,
      revealed: false,
    })),

  reset: () =>
    set({
      attemptId: null,
      questions: [],
      currentIndex: 0,
      selectedOption: null,
      revealed: false,
      correctCount: 0,
      startTime: null,
    }),
}))