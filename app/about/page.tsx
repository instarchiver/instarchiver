import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "How Instarchiver works: a public, searchable archive of Instagram profiles, stories, posts, and historical profile changes.",
  alternates: { canonical: "/about" },
};

const LINK_CLASS =
  "font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm";

const FAQS = [
  {
    question: "Do I need an account to browse Instarchiver?",
    answer:
      "No. All archived profiles, stories, posts, and profile history timelines are publicly browsable without logging in. A Google account is only required when adding a new Instagram username to the archive.",
  },
  {
    question: "Can I view stories after 24 hours or posts that were deleted?",
    answer:
      "Yes, when they were archived while the profile was public. Each story page displays whether its original 24-hour Instagram window is still active or has expired.",
  },
  {
    question: "How do I request copyright removal or opt out a profile?",
    answer:
      "Send a request through the DMCA and content removal page or email arter@instarchiver.net with the specific Instarchiver URLs and proof of ownership or authorization.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        About Instarchiver
      </h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        Instarchiver is a public, searchable archive of Instagram profiles,
        stories, posts, and profile history. It preserves public snapshots over
        time so visitors can inspect records without needing an Instagram
        account.
      </p>

      <div className="mt-8 space-y-6">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            What the archive records
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">
                Stories beyond 24 hours:
              </span>{" "}
              Instagram stories expire after 24 hours. Instarchiver retains
              archived stories alongside their original publish time and archive
              timestamp.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Profile history diffs:
              </span>{" "}
              Each archived profile includes a timeline comparing consecutive
              snapshots, showing exact before-and-after changes to usernames,
              display names, bios, avatars, verification and privacy flags, and
              follower, following, and post counts.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Posts and media variants:
              </span>{" "}
              Single images, carousels, and videos captured while an account is
              public remain browsable in the archive even if the post is later
              deleted or the account becomes private.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Public browsing without login:
              </span>{" "}
              Searching and viewing archived profiles, stories, and posts does
              not require an account.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            How snapshots and recommendations work
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              Signed-in visitors can submit a public Instagram username using the{" "}
              <Link href="/users" className={LINK_CLASS}>
                Users
              </Link>{" "}
              directory. The backend fetches the public profile and records an
              initial snapshot, then tracks subsequent updates over time.
            </p>
            <p>
              On individual post and story pages, the &ldquo;Similar posts&rdquo;
              and &ldquo;Similar stories&rdquo; sections are generated on the
              backend using vector embeddings to surface archived items with
              related visual or caption characteristics.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Frequently asked questions
          </h2>
          <dl className="mt-4 space-y-4">
            {FAQS.map(({ question, answer }) => (
              <div key={question}>
                <dt className="text-sm font-semibold text-foreground">
                  {question}
                </dt>
                <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                  {answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Independence and non-affiliation
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Instarchiver is an independent public archive and is not affiliated
            with, endorsed by, or connected to Instagram or Meta Platforms, Inc.
            All trademarks, profile names, and archived media belong to their
            respective owners.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            If you are a copyright owner or account holder and want content
            removed or excluded from the archive, please see our{" "}
            <Link href="/dmca" className={LINK_CLASS}>
              DMCA &amp; Content Removal
            </Link>{" "}
            policy, review our{" "}
            <Link href="/privacy" className={LINK_CLASS}>
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className={LINK_CLASS}>
              Terms
            </Link>
            , or reach out via our{" "}
            <Link href="/contact" className={LINK_CLASS}>
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
