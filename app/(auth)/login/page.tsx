import Link from "next/link";
import { DecorativePanel } from "@/app/components/auth/DecorativePanel";
import { PasswordField } from "@/app/components/auth/PasswordField";
import { ThemeToggle } from "@/app/components/auth/ThemeToggle";
import { APP_NAME } from "@/app/lib/config";

export const metadata = { title: `Sign in — ${APP_NAME}+` };

export default function LoginPage() {
  return (
    <div className="flex h-full">
      {/* ── Form panel ── */}
      <div className="flex flex-col w-full md:w-[40%] h-full bg-surface px-10 py-12 lg:px-14 xl:px-[72px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-[10px] h-[10px] shrink-0">
              <div className="absolute top-0 right-0 w-[6px] h-[6px] bg-primary" />
              <div className="absolute bottom-0 left-0 w-[6px] h-[6px] bg-red-accent" />
            </div>
            <span className="text-on-surface text-xl font-extrabold tracking-tight">
              {APP_NAME}<span className="text-primary">+</span>
            </span>
          </div>
          <ThemeToggle />
        </div>

        {/* Form — vertically centered */}
        <div className="flex-1 flex flex-col justify-center gap-12">
          <div className="flex flex-col gap-1">
            <h1 className="text-[48px] font-extrabold leading-[56px] text-on-surface">
              Sign in
            </h1>
            <p className="text-sm text-muted">
              Welcome back. Enter your credentials to continue.
            </p>
          </div>

          <form className="flex flex-col gap-6">
            {/* Email */}
            <div className="flex flex-col gap-3">
              <label htmlFor="email" className="text-xs font-bold text-on-surface">
                Email
              </label>
              <div className="flex items-center border border-outline bg-white dark:bg-black focus-within:border-primary transition-colors">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="flex-1 py-5 px-5 bg-transparent text-sm font-bold text-on-surface outline-none placeholder:text-muted placeholder:font-normal"
                />
                <span className="material-icons text-xl px-4 text-on-surface leading-none pointer-events-none">
                  email
                </span>
              </div>
            </div>

            {/* Password */}
            <PasswordField label="Password" name="password" placeholder="Enter your password" />

            {/* Forgot password */}
            <div className="flex justify-end -mt-2">
              <Link
                href="#"
                className="text-xs text-muted hover:text-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary border border-black py-[14px] font-bold text-base text-black shadow-hard-sm cursor-pointer hover:opacity-90 transition-opacity"
            >
              Sign in
            </button>
          </form>
        </div>

        {/* Footer link */}
        <div className="flex items-center gap-1.5 text-sm text-on-surface">
          <span className="font-normal">Don&apos;t have an account?</span>
          <Link
            href="/register"
            className="font-bold hover:text-primary transition-colors"
          >
            Create one
          </Link>
        </div>
      </div>

      {/* ── Decorative panel ── */}
      <DecorativePanel />
    </div>
  );
}
