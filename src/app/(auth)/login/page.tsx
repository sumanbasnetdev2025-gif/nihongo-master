"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import { signIn } from "@/features/auth/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Mail,
  Lock,
  UserPlus,
  Sparkles,
  GraduationCap,
  Eye,
  EyeOff,
} from "lucide-react";
import { createClient } from '@/lib/supabase/client'
export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

const onSubmit = async (values: LoginInput) => {
  setServerError(null)
  setLoading(true)
  try {
    const { user } = await signIn(values)

    if (user) {
      const supabase = createClient()
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } else {
      router.push('/dashboard')
    }

    router.refresh()
  } catch (err) {
    setServerError(err instanceof Error ? err.message : 'Invalid email or password')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="relative flex min-h-screen items-center justify-center px-3 sm:px-4 py-8 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-72 w-72 sm:h-96 sm:w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-[95%] sm:max-w-md overflow-hidden border-0 shadow-2xl shadow-primary/10 backdrop-blur-sm bg-background/95">
        {/* Decorative top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-primary/5" />
        <div className="absolute -bottom-16 -left-16 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-purple-500/5" />

        <CardHeader className="relative space-y-1 text-center pt-6 sm:pt-8 px-4 sm:px-6 pb-2 sm:pb-3">
          <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10 backdrop-blur-sm">
            <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
           <Link href="/" className="text-lg font-bold tracking-tight">
          日本語 Master
        </Link>

          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome back
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sign in to continue your JLPT journey
          </p>
        </CardHeader>

        <CardContent className="relative space-y-4 sm:space-y-6 pt-2 px-4 sm:px-6 pb-4 sm:pb-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4"
          >
            <div className="space-y-1.5 space-y-2">
              <Label htmlFor="email">Email</Label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 pl-10 rounded-xl border-muted bg-background"
                  {...register("email")}
                />
              </div>

              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 pl-10 pr-10 rounded-xl border-muted bg-background"
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <div className="rounded-lg sm:rounded-xl bg-red-50/80 p-2 sm:p-3 text-xs sm:text-sm text-red-500 backdrop-blur-sm dark:bg-red-950/20">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              className="relative h-9 sm:h-11 w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary/90 text-xs sm:text-sm text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] group"
              disabled={loading}
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </form>

          <div className="text-center text-xs sm:text-sm">
            <span className="text-muted-foreground">
              Don't have an account?
            </span>{" "}
            <Link
              href="/register"
              className="inline-flex items-center font-semibold text-primary transition-all hover:gap-2 group"
            >
              <UserPlus className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:scale-110" />
              Sign up free
              <Sparkles className="ml-1 h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted/30" />
            </div>
            <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
              <span className="bg-background/80 px-2 sm:px-3 text-muted-foreground backdrop-blur-sm">
                Start your JLPT journey
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-primary/60" />
              Track progress
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-primary/60" />
              Unlimited practice
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-primary/60" />
              Exam simulation
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
