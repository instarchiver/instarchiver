import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How InstArchiver handles analytics, advertising cookies, Google Sign-In via Firebase Authentication, browser storage, and public archive data.",
  alternates: { canonical: "/privacy" },
};

const LINK_CLASS =
  "font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: November 2026
      </p>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        This Privacy Policy explains what information InstArchiver collects, how
        cookies and local browser storage are used, and the choices available to
        you when browsing or signing in.
      </p>

      <div className="mt-8 space-y-6">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            1. Public archive data
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            InstArchiver indexes and displays publicly available Instagram
            profile metadata, posts, stories, and historical profile snapshots.
            Browsing the archive does not require registration or login. Account
            owners and rights holders may request removal or exclusion at any
            time under our{" "}
            <Link href="/dmca" className={LINK_CLASS}>
              DMCA &amp; Content Removal
            </Link>{" "}
            process.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            2. Google Sign-In and Firebase Authentication
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Signing in is optional and required only if you want to submit a new
            Instagram username to the archive. Sign-in is handled through
            Firebase Authentication using Google Sign-In. When you authenticate,
            we receive basic account information provided by Google (such as
            your name, email address, and profile photo URL) and issue a session
            token for your requests.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            3. Browser storage (localStorage and cookies)
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            InstArchiver uses local browser storage and cookies for essential
            site functionality and, where permitted, analytics and advertising:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">
                Authentication tokens:
              </span>{" "}
              Your access and refresh tokens are stored in{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">
                localStorage
              </code>{" "}
              when you sign in, and removed when you log out.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Theme preference:
              </span>{" "}
              Your selected light or dark theme preference is saved in{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">
                localStorage
              </code>
              .
            </li>
            <li>
              <span className="font-medium text-foreground">
                Cookie consent state:
              </span>{" "}
              Your analytics and advertising consent choices are stored locally
              so your preferences persist across visits. You can update them at
              any time from the &ldquo;Cookie preferences&rdquo; button in the
              site footer.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            4. Google Analytics
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            InstArchiver uses Google Analytics (measurement ID{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">
              G-6CJW2BM9NS
            </code>
            ) to understand aggregate traffic patterns, page performance, and
            how visitors use the site. Analytics storage honors your consent
            selection via Google Consent Mode.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            5. Google AdSense and advertising cookies
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              InstArchiver uses or may use Google AdSense to display
              advertisements. Third-party vendors, including Google, use cookies
              (such as the DoubleClick / DART cookie) to serve ads based on a
              visitor&apos;s prior visits to InstArchiver or other websites on
              the internet.
            </p>
            <p>
              Depending on your region and consent settings, Google may serve
              either personalized ads or non-personalized ads. Personalized
              advertising is only enabled when you grant advertising consent.
            </p>
            <p>
              You may opt out of personalized advertising by visiting{" "}
              <a
                href="https://adssettings.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
              >
                Google Ads Settings
              </a>
              . You can also opt out of third-party vendors&apos; use of cookies
              for personalized advertising by visiting{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
              >
                aboutads.info/choices
              </a>
              , or adjust your consent choices on InstArchiver using the
              &ldquo;Cookie preferences&rdquo; link in the footer.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            6. Your rights and contact
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Depending on your jurisdiction (including the EEA, UK, and
            California), you may have rights to access, correct, or delete
            personal data associated with your signed-in account, or to withdraw
            consent for analytics and advertising cookies.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            For privacy questions or data deletion requests, email{" "}
            <a href="mailto:arter@instarchiver.net" className={LINK_CLASS}>
              arter@instarchiver.net
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
