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

interface Answer {
  questionId: string
  selectedOption: 'a' | 'b' | 'c' | 'd' | null
}

interface ExamState {
  attemptId: string | null
  questions: Question[]
  currentIndex: number
  answers: Record<string, 'a' | 'b' | 'c' | 'd'>
  durationSeconds: number
  startTime: number | null
  submitted: boolean
  setSession: (attemptId: string, questions: Question[], durationSeconds: number) => void
  selectOption: (questionId: string, option: 'a' | 'b' | 'c' | 'd') => void
  goTo: (index: number) => void
  next: () => void
  prev: () => void
  markSubmitted: () => void
  reset: () => void
}

export const useExamStore = create<ExamState>((set, get) => ({
  attemptId: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  durationSeconds: 0,
  startTime: null,
  submitted: false,

  setSession: (attemptId, questions, durationSeconds) =>
    set({
      attemptId,
      questions,
      currentIndex: 0,
      answers: {},
      durationSeconds,
      startTime: Date.now(),
      submitted: false,
    }),

  selectOption: (questionId, option) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: option },
    })),

  goTo: (index) => set({ currentIndex: index }),

  next: () =>
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1),
    })),

  prev: () =>
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
    })),

  markSubmitted: () => set({ submitted: true }),

  reset: () =>
    set({
      attemptId: null,
      questions: [],
      currentIndex: 0,
      answers: {},
      durationSeconds: 0,
      startTime: null,
      submitted: false,
    }),
}))