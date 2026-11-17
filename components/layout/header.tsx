"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  UsersThree,
  CirclesFour,
  GridFour,
} from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: House },
  { href: "/users", label: "Users", icon: UsersThree },
  { href: "/stories", label: "Stories", icon: CirclesFour },
  { href: "/posts", label: "Posts", icon: GridFour },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-lg text-lg font-semibold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto sm:justify-start sm:px-2"
        >
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            priority
            className="h-8 w-8 shrink-0 object-contain"
            aria-hidden="true"
          />
          <span className="sr-only sm:not-sr-only">Instarchiver</span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-1 py-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            const visibilityClass =
              href === "/" ? "hidden sm:flex" : "flex";
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                // The logo already links home, so Home gives up its slot on phones.
                className={`${visibilityClass} min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon
                  size={18}
                  weight={isActive ? "fill" : "regular"}
                  aria-hidden="true"
                />
                <span className="sr-only sm:not-sr-only">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center sm:gap-1">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
