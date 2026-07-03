'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Target, Timer, TrendingUp, CheckCircle2, Sparkles, ChevronRight, Award, BarChart3, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PublicHeader } from '@/components/layout/public-header'
import { PublicFooter } from '@/components/layout/public-footer'
import { motion } from 'framer-motion'
import { Logo } from '@/components/shared/logo'

const levels = [
  { 
    name: 'N5', 
    color: 'from-green-500 to-emerald-600',
    borderColor: 'border-green-500/30',
    shadowColor: 'shadow-green-500/20',
    bgGradient: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10'
  },
  { 
    name: 'N4', 
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500/30',
    shadowColor: 'shadow-blue-500/20',
    bgGradient: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10'
  },
  { 
    name: 'N3', 
    color: 'from-purple-500 to-violet-600',
    borderColor: 'border-purple-500/30',
    shadowColor: 'shadow-purple-500/20',
    bgGradient: 'bg-gradient-to-br from-purple-500/10 to-violet-500/10'
  },
  { 
    name: 'N2', 
    color: 'from-orange-500 to-amber-600',
    borderColor: 'border-orange-500/30',
    shadowColor: 'shadow-orange-500/20',
    bgGradient: 'bg-gradient-to-br from-orange-500/10 to-amber-500/10'
  },
  { 
    name: 'N1', 
    color: 'from-red-500 to-rose-600',
    borderColor: 'border-red-500/30',
    shadowColor: 'shadow-red-500/20',
    bgGradient: 'bg-gradient-to-br from-red-500/10 to-rose-500/10'
  },
]

const features = [
  {
    icon: BookOpen,
    title: 'Full Question Coverage',
    description: 'Grammar, Vocabulary, Kanji, Reading, and Picture questions, all in one place.',
    color: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-500',
  },
  {
    icon: Target,
    title: 'Practice & Exam Modes',
    description: 'Learn at your own pace, or simulate the real JLPT under exam conditions.',
    color: 'from-purple-500/20 to-purple-600/20',
    iconColor: 'text-purple-500',
  },
  {
    icon: Timer,
    title: 'Real Exam Simulation',
    description: 'Countdown timer, auto-submit, and instant scoring just like the real test.',
    color: 'from-orange-500/20 to-orange-600/20',
    iconColor: 'text-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Performance Analytics',
    description: 'See your weak chapters, strengths, and estimated JLPT readiness at a glance.',
    color: 'from-green-500/20 to-green-600/20',
    iconColor: 'text-green-500',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section with Animated Background */}
        <section className="relative mx-auto max-w-6xl px-4 py-20 text-center md:px-6 md:py-32 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl animate-pulse delay-500" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
              Now open for JLPT N5 preparation
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-ping" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-6xl bg-gradient-to-r from-foreground via-primary/80 to-foreground bg-clip-text text-transparent"
          >
            Master the JLPT, one question at a time
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
          >
            Practice tests, real exam simulation and detailed analytics built for serious
            JLPT learners — starting with N5, scaling all the way to N1.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <Link href="/register">
              <Button size="lg" className="group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Start Practicing Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="hover:bg-primary/10">
                Log in
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>Built by JLPT experts</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span>Track your progress</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>Pass with confidence</span>
            </div>
          </motion.div>
        </section>

        {/* Features with hover cards */}
        <section id="features" className="relative py-20 bg-gradient-to-b from-muted/20 to-background">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
          <div className="mx-auto max-w-6xl px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight">Everything you need to pass</h2>
              <p className="mt-3 text-muted-foreground">
                Built like a real exam platform, not just a flashcard app.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="group relative border-0 bg-gradient-to-br shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <CardContent className="relative pt-6">
                      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                      </div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Levels with gradient boxes */}
        <section id="levels" className="py-20">
          <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight">Every JLPT level, one platform</h2>
              <p className="mt-3 text-muted-foreground">
                Start with N5 today. N4 through N1 unlock as you're ready.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              {levels.map((level, i) => (
                <motion.div
                  key={level.name}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: [0, -5, 5, -5, 0] 
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400,
                    rotate: { duration: 0.5, type: "tween" }
                  }}
                  className={`flex h-24 w-24 items-center justify-center rounded-2xl border-2 text-lg font-bold transition-all duration-300 md:h-28 md:w-28 md:text-xl ${
                    i === 0
                      ? `border-${level.name === 'N5' ? 'green' : 'blue'}-500/30 bg-gradient-to-br ${level.color} text-white shadow-lg ${level.shadowColor}`
                      : `border-${level.name === 'N5' ? 'green' : level.name === 'N4' ? 'blue' : level.name === 'N3' ? 'purple' : level.name === 'N2' ? 'orange' : 'red'}-500/30 ${level.bgGradient} text-foreground hover:shadow-lg ${level.shadowColor} hover:border-${level.name === 'N5' ? 'green' : level.name === 'N4' ? 'blue' : level.name === 'N3' ? 'purple' : level.name === 'N2' ? 'orange' : 'red'}-500/50`
                  }`}
                >
                  {level.name}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-muted/20 py-20">
          <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
            <Logo className="mx-auto mb-6 h-12 w-12" />
            <h2 className="text-3xl font-bold tracking-tight">Ready to start your JLPT journey?</h2>
            <p className="mt-3 text-muted-foreground">
              Create a free account and take your first practice test in minutes.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8"
            >
              <Link href="/register">
                <Button size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}