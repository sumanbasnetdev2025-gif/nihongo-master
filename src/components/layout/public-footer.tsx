import Link from "next/link";
import { Logo } from "../shared/logo";

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <Logo />
              Nihongo Master
            </span>
            <p className="mt-2 text-sm text-muted-foreground">
              Premium JLPT preparation, N5 through N1.
            </p>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <a
                href="mailto:cwsolutions2025@gmail.com"
                className="block hover:text-foreground"
              >
                cwsolutions2025@gmail.com
              </a>
              <a
                href="tel:+9779704738463"
                className="block hover:text-foreground"
              >
                +977-9704738463
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#levels" className="hover:text-foreground">
                  JLPT Levels
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Account</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/login" className="hover:text-foreground">
                  Log in
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nihongo Master. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
