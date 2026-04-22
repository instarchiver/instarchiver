"use client";

import { useState } from "react";
import { SUGGESTED_TAGS } from "@/lib/config";
import { useTheme } from "@/providers/ThemeProvider";

// ── Background decoration assets ─────────────────────────────────────────────
const BG_LIGHT_GRADIENT =
  "https://www.figma.com/api/mcp/asset/66293d29-cbad-42dd-a92a-1751f532beaa";
const BG_LIGHT_PATTERN =
  "https://www.figma.com/api/mcp/asset/e4dcbbf0-de74-44e7-9525-f4b4d2c396e7";
const BG_DARK_MAIN =
  "https://www.figma.com/api/mcp/asset/134a0591-10cd-47be-bd9d-aa7ebf14ecef";
const BG_DARK_PATTERN =
  "https://www.figma.com/api/mcp/asset/230dcb1c-27ca-4106-b102-40ee164b50ee";

const FONT_VAR =
  "'GRAD' 0, 'XOPQ' 96, 'XTRA' 468, 'YOPQ' 79, 'YTAS' 750, 'YTDE' -203, 'YTFI' 738, 'YTLC' 514, 'YTUC' 712, 'wdth' 100";

export default function StoriesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="relative flex flex-col items-center w-full min-h-full">
      {/* ── Decorative background (top-right) ─────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[min(694px,50%)] h-[610px] pointer-events-none overflow-hidden"
      >
        {isDark ? (
          <>
            <img
              src={BG_DARK_MAIN}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <img
              src={BG_DARK_PATTERN}
              alt=""
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
            />
          </>
        ) : (
          <>
            <img
              src={BG_LIGHT_GRADIENT}
              alt=""
              className="absolute inset-0 w-full h-full object-cover rotate-180"
            />
            <img
              src={BG_LIGHT_PATTERN}
              alt=""
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
            />
          </>
        )}
      </div>

      {/* ── Hero: title + search + example hint + suggested tags ──────────── */}
      <div className="relative flex flex-col gap-6 items-center w-full max-w-[660px] mt-0 lg:mt-[84px] px-6 lg:px-4">
        <h1
          className="text-[48px] font-extrabold leading-[56px] text-on-surface whitespace-normal lg:whitespace-nowrap text-center lg:text-left"
          style={{ fontVariationSettings: FONT_VAR }}
        >
          Explore Stories
        </h1>

        {/* Search bar */}
        <div className="flex items-center justify-between w-full px-5 py-4 border border-outline rounded-sm shadow-hard-sm bg-surface">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for stories..."
            className="flex-1 bg-transparent text-base font-medium text-on-surface placeholder:text-on-surface/50 outline-none"
          />
          <button
            className="flex-none flex items-center justify-center w-8 h-8 bg-primary border border-black rounded-sm"
            aria-label="Search"
          >
            <span className="material-icons text-base leading-none text-black">search</span>
          </button>
        </div>

        {/* "For example" hint */}
        <div className="flex gap-1.5 items-center justify-center text-sm text-on-surface whitespace-nowrap">
          <span className="font-normal">For example</span>
          <span className="font-bold">Startup founder journey</span>
        </div>

        {/* Suggested tags — hidden on mobile */}
        <div className="hidden lg:flex flex-wrap gap-1.5 items-center justify-center">
          {SUGGESTED_TAGS.map((tag) => (
            <button
              key={tag}
              className="px-2 py-1 rounded-[2px] bg-on-surface text-surface text-xs font-bold leading-4 whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content sections (empty for now) ─────────────────────────────── */}
      <div className="relative flex flex-col items-start px-6 lg:px-[70px] w-full gap-6 mt-6 pb-8" />
    </div>
  );
}
