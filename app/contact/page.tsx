import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact InstArchiver for general inquiries, bug reports, privacy questions, or content removal requests.",
  alternates: { canonical: "/contact" },
};

const LINK_CLASS =
  "font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Contact
      </h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        Reach the InstArchiver operator directly by email for support, bug
        reports, privacy questions, or content removal notices.
      </p>

      <div className="mt-8 space-y-6">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Direct email
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Send all inquiries to:
          </p>
          <p className="mt-3">
            <a
              href="mailto:arter@instarchiver.net"
              className="inline-flex min-h-11 items-center rounded-lg border border-border bg-muted px-4 text-sm font-medium text-foreground transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              arter@instarchiver.net
            </a>
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            What to include
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">
                General questions and feedback:
              </span>{" "}
              A brief description of your question and any relevant links.
            </li>
            <li>
              <span className="font-medium text-foreground">Bug reports:</span>{" "}
              The InstArchiver page URL, your browser or device, and what you
              expected versus what happened.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Privacy and account data requests:
              </span>{" "}
              The email address associated with your Google Sign-In session. See
              our{" "}
              <Link href="/privacy" className={LINK_CLASS}>
                Privacy Policy
              </Link>{" "}
              for details.
            </li>
            <li>
              <span className="font-medium text-foreground">
                DMCA, copyright, or profile removal requests:
              </span>{" "}
              Please include the verification details listed on our{" "}
              <Link href="/dmca" className={LINK_CLASS}>
                DMCA &amp; Content Removal
              </Link>{" "}
              page so your request can be processed promptly.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
