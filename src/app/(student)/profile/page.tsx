import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile } from '@/features/auth/get-profile'
import { AvatarUpload } from '@/features/profile/avatar-upload'
import { ProfileForm } from '@/features/profile/profile-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const profile = await getCurrentProfile()

  if (!user || !profile) {
    redirect('/login')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <AvatarUpload
            userId={user.id}
            fullName={profile.full_name}
            currentAvatarUrl={profile.avatar_url}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm initialFullName={profile.full_name} email={user.email ?? ''} />
        </CardContent>
      </Card>
    </div>
  )
}