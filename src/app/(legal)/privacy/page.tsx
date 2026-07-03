import Link from 'next/link'
import { PublicHeader } from '@/components/layout/public-header'
import { PublicFooter } from '@/components/layout/public-footer'

export const metadata = {
  title: 'Privacy Policy — Nihongo Master',
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 md:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

        <div className="prose prose-neutral mt-8 max-w-none space-y-6 text-sm leading-relaxed text-foreground dark:prose-invert">
          <section>
            <h2 className="text-lg font-semibold">1. Information We Collect</h2>
            <p className="mt-2 text-muted-foreground">
              When you create an account with Nihongo Master, we collect your name, email
              address and any profile photo you choose to upload. We also record your test
              attempts, answers, scores and progress data so we can show you accurate
              analytics and let you resume your learning where you left off.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. How We Use Your Information</h2>
            <p className="mt-2 text-muted-foreground">
              Your data is used solely to operate the platform- authenticating your account,
              tracking your test performance, generating your personal analytics and
              improving the questions and features we offer. We do not sell your personal
              information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Data Storage</h2>
            <p className="mt-2 text-muted-foreground">
              Your data is stored securely using our database and authentication
              provider. Passwords are never stored in plain text. Row-level security policies
              restrict access so that only you can view your own test history and personal
              information and only authorized administrators can manage platform content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Cookies</h2>
            <p className="mt-2 text-muted-foreground">
              We use essential cookies to keep you signed in and to remember your
              light/dark theme preference. We do not use third-party advertising or
              tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Your Rights</h2>
            <p className="mt-2 text-muted-foreground">
              You can update your profile information at any time from your account
              settings. If you would like your account and associated data deleted, please
              contact us using the details below.
            </p>
          </section>

         <section>
  <h2 className="text-lg font-semibold">6. Contact</h2>
  <p className="mt-2 text-muted-foreground">
    If you have questions about this policy, please reach out to us:
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