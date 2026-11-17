import Link from "next/link";
import { CookiePreferencesButton } from "@/components/consent/cookie-consent";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/dmca", label: "DMCA & Removal" },
  { href: "/contact", label: "Contact" },
];

const FOOTER_ITEM_CLASS =
  "inline-flex min-h-11 items-center rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-5 gap-y-1"
          >
            {FOOTER_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={FOOTER_ITEM_CLASS}>
                {label}
              </Link>
            ))}
            <CookiePreferencesButton className={`${FOOTER_ITEM_CLASS} cursor-pointer`} />
          </nav>
          <a
            href="mailto:arter@instarchiver.net"
            className={`${FOOTER_ITEM_CLASS} shrink-0 self-start sm:self-auto`}
          >
            arter@instarchiver.net
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          InstArchiver is an independent public archive and is not affiliated
          with Instagram or Meta.
        </p>
      </div>
    </footer>
  );
}
