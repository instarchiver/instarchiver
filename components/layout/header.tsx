"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, UsersThree, CirclesFour, GridFour } from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: House },
  { href: "/users", label: "Users", icon: UsersThree },
  { href: "/stories", label: "Stories", icon: CirclesFour },
  { href: "/posts", label: "Posts", icon: GridFour },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-backdrop-blur:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            IA
          </span>
          <span className="hidden sm:inline">InstArchiver</span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={18} weight={isActive ? "fill" : "regular"} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
