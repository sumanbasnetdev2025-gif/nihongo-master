'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service worker registered:', registration.scope)

          // If a new service worker takes control, force a reload so the
          // user immediately gets the latest code instead of a stuck cache
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                window.location.reload()
              }
            })
          })
        })
        .catch((error) => {
          console.error('Service worker registration failed:', error)
        })
    }
  }, [])

  return null
}