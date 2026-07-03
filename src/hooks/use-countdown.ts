import { useEffect, useRef, useState } from 'react'

export function useCountdown(totalSeconds: number, onExpire: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpireRef.current()
      return
    }

    const timer = setTimeout(() => {
      setSecondsLeft((s) => s - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [secondsLeft])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`

  return { secondsLeft, formatted, isLow: secondsLeft <= 60 }
}