import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/features/auth/get-profile'
import { StudentShell } from '@/components/layout/student-shell'

export const metadata = {
  title: 'Dashboard — Nihongo Master',
}

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  return (
    <StudentShell fullName={profile.full_name} avatarUrl={profile.avatar_url}>
      {children}
    </StudentShell>
  )
}