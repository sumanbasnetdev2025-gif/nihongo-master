import { create } from 'zustand'

interface UIState {
  chromeHidden: boolean
  hideChrome: () => void
  showChrome: () => void
  toggleChrome: () => void
}

export const useUIStore = create<UIState>((set) => ({
  chromeHidden: false,
  hideChrome: () => set({ chromeHidden: true }),
  showChrome: () => set({ chromeHidden: false }),
  toggleChrome: () => set((state) => ({ chromeHidden: !state.chromeHidden })),
}))