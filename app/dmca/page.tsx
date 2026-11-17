import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DMCA & Content Removal",
  description:
    "How copyright owners and Instagram account holders can request content takedown or profile removal from InstArchiver.",
  alternates: { canonical: "/dmca" },
};

const LINK_CLASS =
  "font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm";

export default function DmcaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        DMCA &amp; Content Removal
      </h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        InstArchiver respects the rights of content creators, copyright
        holders, and Instagram account owners. You can request removal of
        specific posts or stories, or opt an entire profile out of the archive.
      </p>

      <div className="mt-8 space-y-6">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            1. Copyright takedown notices (DMCA)
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            If you are a copyright owner or authorized agent and believe
            material on InstArchiver infringes your copyright, send a written
            notice containing:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            <li>
              Identification of the copyrighted work claimed to have been
              infringed.
            </li>
            <li>
              The exact InstArchiver URL(s) where the material appears (for
              example,{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">
                https://instarchiver.net/posts/...
              </code>{" "}
              or{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">
                https://instarchiver.net/stories/...
              </code>
              ).
            </li>
            <li>
              Your full name, organization (if applicable), and a valid contact
              email address.
            </li>
            <li>
              A statement that you have a good-faith belief that the disputed
              use is not authorized by the copyright owner, its agent, or the
              law.
            </li>
            <li>
              A statement, made under penalty of perjury, that the information in
              your notice is accurate and that you are the copyright owner or
              authorized to act on the owner&apos;s behalf, along with your
              physical or electronic signature.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            2. Account owner opt-out and profile removal
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            If you own an Instagram account indexed on InstArchiver and want
            your profile, posts, stories, or profile history removed and
            excluded from future archiving, please provide:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            <li>
              Your Instagram username and the exact InstArchiver profile URL(s)
              to remove.
            </li>
            <li>
              A contact email address where we can confirm removal or verify
              account ownership (for example, emailing from a domain listed on
              your public profile or completing a brief verification check).
            </li>
            <li>
              Whether you are requesting removal of specific URLs or full
              exclusion of the profile.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Where to send requests
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Email your request to{" "}
            <a href="mailto:arter@instarchiver.net" className={LINK_CLASS}>
              arter@instarchiver.net
            </a>{" "}
            with the subject line{" "}
            <span className="font-medium text-foreground">
              DMCA Takedown Request
            </span>{" "}
            or{" "}
            <span className="font-medium text-foreground">
              Profile Removal Request
            </span>
            . Valid requests are reviewed and acted on promptly.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            For general questions, see our{" "}
            <Link href="/contact" className={LINK_CLASS}>
              Contact page
            </Link>{" "}
            or{" "}
            <Link href="/terms" className={LINK_CLASS}>
              Terms of Service
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
