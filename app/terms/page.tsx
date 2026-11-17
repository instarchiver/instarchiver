import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing access to InstArchiver, fair-use limits, intellectual property, and disclaimers.",
  alternates: { canonical: "/terms" },
};

const LINK_CLASS =
  "font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: November 2026
      </p>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        By accessing or using InstArchiver, you agree to these Terms of Service.
        If you do not agree with these terms, please do not use the service.
      </p>

      <div className="mt-8 space-y-6">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            1. Use of the archive
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            InstArchiver provides a public, read-only web archive of public
            Instagram profiles, stories, posts, and historical profile changes
            for informational, journalistic, and research reference. You agree
            to use the service only for lawful purposes and in compliance with
            applicable laws.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            2. Fair use and prohibited conduct
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            To keep InstArchiver reliable for all visitors, you may not:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            <li>
              Run automated scrapers, bots, or bulk downloaders against
              InstArchiver pages, media assets, or backend APIs.
            </li>
            <li>
              Attempt to bypass authentication, rate limits, or access controls.
            </li>
            <li>
              Use archived content to harass, stalk, impersonate, or dox any
              individual.
            </li>
            <li>
              Redistribute or resell bulk archive data as a competing dataset or
              service.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            3. Submitting usernames
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Signed-in users may submit public Instagram usernames for archiving,
            subject to daily rate limits (currently up to 3 users per day). We
            reserve the right to limit, pause, or revoke submission privileges
            for accounts that abuse the feature or repeatedly submit removed
            profiles.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            4. Intellectual property and content removal
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Archived images, videos, captions, and profile information remain
            the intellectual property of their respective creators and owners.
            If you believe content on InstArchiver infringes your copyright or
            wish to opt a profile out of the archive, follow the instructions on
            our{" "}
            <Link href="/dmca" className={LINK_CLASS}>
              DMCA &amp; Content Removal
            </Link>{" "}
            page.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            5. Non-affiliation
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            InstArchiver is an independent project and is not affiliated with,
            associated with, authorized by, endorsed by, or in any way
            officially connected with Instagram or Meta Platforms, Inc.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            6. Disclaimer of warranties and availability
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            InstArchiver is provided on an &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; basis without warranties of any kind, whether
            express or implied. We do not guarantee uninterrupted uptime,
            completeness of any profile&apos;s history, or continued retention
            of any archived record. We may modify, suspend, or remove content or
            features at any time without notice.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            7. Contact
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Questions about these terms can be sent to{" "}
            <a href="mailto:arter@instarchiver.net" className={LINK_CLASS}>
              arter@instarchiver.net
            </a>
            . See also our{" "}
            <Link href="/privacy" className={LINK_CLASS}>
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
