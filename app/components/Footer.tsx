"use client";

import { useTheme } from "@/app/providers/ThemeProvider";
import { FOOTER_LINKS } from "@/app/lib/config";

export function Footer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="hidden lg:flex items-center justify-between px-10 xl:px-[70px] py-4 shrink-0">
      <div className="flex gap-6 items-center text-on-surface">
        <button className="flex gap-1.5 items-center text-xs font-bold">
          <span className="material-icons text-base leading-none">language</span>
          English
        </button>
        <div className="flex gap-6 text-xs font-bold">
          {FOOTER_LINKS.map((link) => (
            <span key={link.label} className="cursor-pointer hover:text-primary transition-colors">
              {link.label}
            </span>
          ))}
        </div>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="flex items-center border border-outline rounded-sm overflow-hidden"
        aria-label="Toggle theme"
      >
        <span
          className={`flex items-center justify-center p-1.5 transition-colors ${
            theme === "light" ? "bg-primary text-black" : "text-on-surface"
          }`}
        >
          <span className="material-icons text-base leading-none">brightness_5</span>
        </span>
        <span
          className={`flex items-center justify-center p-1.5 transition-colors ${
            theme === "dark" ? "bg-primary text-black" : "text-on-surface"
          }`}
        >
          <span className="material-icons text-base leading-none">brightness_4</span>
        </span>
      </button>
    </footer>
  );
}
