'use client'

import { useState } from 'react'
import { Camera } from 'lucide-react'
import { toast } from 'sonner'
import { uploadAvatar } from './upload'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { updateAvatarUrl } from './action'

interface AvatarUploadProps {
  userId: string
  fullName: string | null
  currentAvatarUrl: string | null
}

export function AvatarUpload({ userId, fullName, currentAvatarUrl }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl)
  const [uploading, setUploading] = useState(false)

  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB')
      return
    }

    setUploading(true)
    try {
      const url = await uploadAvatar(file, userId)
      await updateAvatarUrl(url)
      setAvatarUrl(url)
      toast.success('Profile photo updated')
    } catch {
      toast.error('Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className="h-24 w-24">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName ?? 'Profile'} />}
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <label
          className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Camera className="h-4 w-4" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>
      {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
    </div>
  )
}