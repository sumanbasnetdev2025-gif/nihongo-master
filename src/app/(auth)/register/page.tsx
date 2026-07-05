'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerSchema, type RegisterInput } from '@/features/auth/schemas'
import { signUp } from '@/features/auth/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Mail, Lock, User, LogIn, Sparkles, UserPlus, CheckCircle2, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

const onSubmit = async (values: RegisterInput) => {
  setServerError(null)
  setLoading(true)
  try {
    await signUp(values)
    window.location.href = '/dashboard'
  } catch (err) {
    setServerError(err instanceof Error ? err.message : 'Something went wrong')
    setLoading(false)
  }
}

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-4 py-8 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-72 w-72 sm:h-96 sm:w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-[95%] sm:max-w-sm overflow-hidden border-0 shadow-2xl shadow-primary/10 backdrop-blur-sm bg-background/95">
        {/* Decorative top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
        
        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary/5" />
        <div className="absolute -bottom-12 -left-12 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-purple-500/5" />

        <CardHeader className="relative space-y-0.5 text-center pt-5 sm:pt-6 px-4 sm:px-6 pb-2">
          <div className="mx-auto mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10 backdrop-blur-sm">
            <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
           <Link href="/" className="text-lg font-bold tracking-tight">
          日本語 Master
        </Link>
          <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Create account
          </CardTitle>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Start your JLPT journey today
          </p>
        </CardHeader>

        <CardContent className="relative space-y-3 sm:space-y-4 pt-1 sm:pt-2 px-4 sm:px-6 pb-4 sm:pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5 sm:space-y-3">
            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="fullName" className="text-[10px] sm:text-xs font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Yuki Tanaka"
                  className="h-8 sm:h-9 pl-10 pr-3 text-xs sm:text-sm rounded-lg border-muted/40 bg-background text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition-all duration-200 focus:border-primary/50 focus:shadow-[0_0_0_3px] focus:shadow-primary/10"
                  {...register('fullName')}
                />
              </div>
              {errors.fullName && (
                <p className="text-[10px] sm:text-xs text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="email" className="text-[10px] sm:text-xs font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-8 sm:h-9 pl-10 pr-3 text-xs sm:text-sm rounded-lg border-muted/40 bg-background text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition-all duration-200 focus:border-primary/50 focus:shadow-[0_0_0_3px] focus:shadow-primary/10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] sm:text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="password" className="text-[10px] sm:text-xs font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-8 sm:h-9 pl-10 pr-10 text-xs sm:text-sm rounded-lg border-muted/40 bg-background text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition-all duration-200 focus:border-primary/50 focus:shadow-[0_0_0_3px] focus:shadow-primary/10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] sm:text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-[10px] sm:text-xs font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-8 sm:h-9 pl-10 pr-10 text-xs sm:text-sm rounded-lg border-muted/40 bg-background text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition-all duration-200 focus:border-primary/50 focus:shadow-[0_0_0_3px] focus:shadow-primary/10"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[10px] sm:text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {serverError && (
              <div className="rounded-lg bg-red-50/80 p-2 sm:p-2.5 text-[10px] sm:text-xs text-red-500 backdrop-blur-sm dark:bg-red-950/20">
                {serverError}
              </div>
            )}

            <Button 
              type="submit" 
              className="relative h-8 sm:h-9 w-full rounded-lg bg-gradient-to-r from-primary to-primary/90 text-xs sm:text-sm text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] group" 
              disabled={loading}
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Creating...
                  </div>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-1.5 sm:ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </form>

          <div className="text-center text-[10px] sm:text-xs">
            <span className="text-muted-foreground">Already have an account?</span>{' '}
            <Link
              href="/login"
              className="inline-flex items-center font-semibold text-primary transition-all hover:gap-2 group"
            >
              <LogIn className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:scale-110" />
              Sign in
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted/30" />
            </div>
            <div className="relative flex justify-center text-[8px] sm:text-[10px] uppercase">
              <span className="bg-background/80 px-1.5 sm:px-2 text-muted-foreground backdrop-blur-sm">
                Join thousands of JLPT learners
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5 sm:gap-1">
              <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
              Free forever
            </span>
            <span className="flex items-center gap-0.5 sm:gap-1">
              <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
              Unlimited practice
            </span>
            <span className="flex items-center gap-0.5 sm:gap-1">
              <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
              Track progress
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}