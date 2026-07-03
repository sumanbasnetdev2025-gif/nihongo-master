import Link from 'next/link'
import { PublicHeader } from '@/components/layout/public-header'
import { PublicFooter } from '@/components/layout/public-footer'

export const metadata = {
  title: 'Terms of Service — Nihongo Master',
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 md:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

        <div className="prose prose-neutral mt-8 max-w-none space-y-6 text-sm leading-relaxed text-foreground dark:prose-invert">
          <section>
            <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
            <p className="mt-2 text-muted-foreground">
              By creating an account and using Nihongo Master, you agree to these Terms of
              Service. If you do not agree, please do not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Account Responsibility</h2>
            <p className="mt-2 text-muted-foreground">
              You are responsible for maintaining the confidentiality of your login
              credentials and for all activity that occurs under your account. Please notify
              us if you suspect unauthorized access to your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Acceptable Use</h2>
            <p className="mt-2 text-muted-foreground">
              You agree not to misuse the platform, including but not limited to- attempting
              to access administrator features without authorization, scraping or
              redistributing question content or interfering with other users&apos;
              accounts or experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Content Ownership</h2>
            <p className="mt-2 text-muted-foreground">
              All questions, explanations and learning materials on Nihongo Master are the
              property of Nihongo Master and may not be copied or redistributed without
              permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. No Guarantee of Exam Results</h2>
            <p className="mt-2 text-muted-foreground">
              Nihongo Master is a study and practice tool. While we aim to provide accurate,
              exam-style questions and helpful analytics, we do not guarantee any specific
              outcome on the official JLPT examination.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. Changes to These Terms</h2>
            <p className="mt-2 text-muted-foreground">
              We may update these terms from time to time. Continued use of the platform
              after changes are posted constitutes acceptance of the revised terms.
            </p>
          </section>

         <section>
  <h2 className="text-lg font-semibold">7. Contact</h2>
  <p className="mt-2 text-muted-foreground">
    Questions about these terms can be directed to us:
  </p>
  <ul className="mt-3 space-y-1 text-muted-foreground">
    <li>
      Email:{' '}
      <a href="mailto:cwsolutions2025@gmail.com" className="text-primary hover:underline">
        cwsolutions2025@gmail.com
      </a>
    </li>
    <li>
      Phone:{' '}
      <a href="tel:+9779704738463" className="text-primary hover:underline">
        +977-9704738463
      </a>{' '}
      (Suman Basnet)
    </li>
  </ul>
</section>
        </div>

        <Link href="/" className="mt-10 inline-block text-sm text-primary hover:underline">
          ← Back to home
        </Link>
      </main>
      <PublicFooter />
    </div>
  )
}