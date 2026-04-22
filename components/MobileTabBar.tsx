"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_TABS } from "@/lib/config";

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden flex flex-col items-center shrink-0 bg-surface border-t border-outline pb-safe">
      <div className="flex items-start justify-between w-full px-3">
        {MOBILE_TABS.map((tab) => {
          const isActive =
            tab.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className="flex items-center justify-center h-[76px] w-14"
              aria-label={tab.label}
            >
              <span
                className={`material-icons text-[22px] leading-none transition-colors ${
                  isActive ? "text-primary" : "text-on-surface"
                }`}
              >
                {tab.icon}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
