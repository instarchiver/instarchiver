import Link from "next/link";
import { DecorativePanel } from "@/components/auth/DecorativePanel";
import { PasswordField } from "@/components/auth/PasswordField";
import { ThemeToggle } from "@/components/auth/ThemeToggle";
import { APP_NAME } from "@/lib/config";

export const metadata = { title: `Sign up — ${APP_NAME}+` };

export default function RegisterPage() {
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
              Sign up
            </h1>
            <p className="text-sm text-muted">
              Before we start, please enter your current location.
            </p>
          </div>

          <form className="flex flex-col gap-6">
            {/* Country / Area of Residence */}
            <div className="flex flex-col gap-3">
              <label htmlFor="country" className="text-xs font-bold text-on-surface">
                Country/Area of Residence
              </label>
              <div className="relative">
                <select
                  id="country"
                  name="country"
                  defaultValue="US"
                  className="w-full appearance-none py-5 px-5 pr-14 bg-white dark:bg-black border border-outline text-sm font-bold text-on-surface outline-none focus:border-primary cursor-pointer transition-colors"
                >
                  <option value="US">United States</option>
                  <option value="ID">Indonesia</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="CA">Canada</option>
                  <option value="SG">Singapore</option>
                  <option value="JP">Japan</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="NL">Netherlands</option>
                </select>
                <span className="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-xl text-on-surface pointer-events-none leading-none">
                  expand_more
                </span>
              </div>
            </div>

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

            {/* Checkboxes */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <span className="relative shrink-0">
                  <input
                    type="checkbox"
                    name="email_updates"
                    defaultChecked
                    className="auth-checkbox sr-only"
                  />
                  <span className="auth-checkbox-box flex w-5 h-5 border border-outline bg-white dark:bg-black items-center justify-center transition-colors">
                    <span className="auth-checkbox-icon material-icons text-xs text-black leading-none opacity-0">
                      check
                    </span>
                  </span>
                </span>
                <span className="text-xs font-bold text-on-surface">
                  I agree to receive email updates
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <span className="relative shrink-0">
                  <input
                    type="checkbox"
                    name="terms"
                    className="auth-checkbox sr-only"
                  />
                  <span className="auth-checkbox-box flex w-5 h-5 border border-outline bg-white dark:bg-black items-center justify-center transition-colors">
                    <span className="auth-checkbox-icon material-icons text-xs text-black leading-none opacity-0">
                      check
                    </span>
                  </span>
                </span>
                <span className="text-xs font-bold text-on-surface">
                  I have read and agree to Terms of Service
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary border border-black py-[14px] font-bold text-base text-black shadow-hard-sm cursor-pointer hover:opacity-90 transition-opacity"
            >
              Create account
            </button>
          </form>
        </div>

        {/* Footer link */}
        <div className="flex items-center gap-1.5 text-sm text-on-surface">
          <span className="font-normal">Already registered?</span>
          <Link
            href="/login"
            className="font-bold hover:text-primary transition-colors"
          >
            Sign in to your account
          </Link>
        </div>
      </div>

      {/* ── Decorative panel ── */}
      <DecorativePanel />
    </div>
  );
}
