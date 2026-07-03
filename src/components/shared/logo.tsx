import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn('h-8 w-8', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="10" fill="var(--primary)" />
      <path
        d="M11 18h26M15 18v-3.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2V18M13.5 18l-2 16M34.5 18l2 16M20 24v10M28 24v10"
        stroke="var(--primary-foreground)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}