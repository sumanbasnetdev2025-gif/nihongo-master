'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface CelebrationProps {
  passed: boolean
}

export function Celebration({ passed }: CelebrationProps) {
  useEffect(() => {
    if (!passed) return

    // Two bursts from either side, like party poppers
    const duration = 1500
    const end = Date.now() + duration

    const colors = ['#4F46E5', '#818CF8', '#34D399', '#FBBF24']

    ;(function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.7 },
        colors,
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.7 },
        colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    })()
  }, [passed])

  return null
}