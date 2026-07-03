import { z } from 'zod'

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
})

export const passwordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type ProfileInput = z.infer<typeof profileSchema>
export type PasswordInput = z.infer<typeof passwordSchema>