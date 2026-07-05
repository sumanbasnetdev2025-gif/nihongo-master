import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/features/auth/get-profile'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'

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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
<Header fullName={profile.full_name} avatarUrl={profile.avatar_url} mobileNav={<MobileNav />} />       
 <main className="flex-1 bg-muted/30 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}