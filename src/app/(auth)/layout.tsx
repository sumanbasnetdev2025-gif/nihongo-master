import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Log in or Sign up — Nihongo Master',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}