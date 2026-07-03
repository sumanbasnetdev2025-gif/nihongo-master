import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/features/auth/get-profile'
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { Header } from '@/components/layout/header'
import { AdminMobileNav } from '@/components/layout/admin-mobile-nav'

export const metadata = {
  title: 'Admin — Nihongo Master',
}
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  if (profile.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <Header
  fullName={profile.full_name}
  avatarUrl={profile.avatar_url}
  mobileNav={<AdminMobileNav />}
  brandLabel="Nihongo Master Admin"
/>
        <main className="flex-1 bg-muted/30 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}