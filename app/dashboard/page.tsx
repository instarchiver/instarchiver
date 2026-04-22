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

// ── Trending category images ─────────────────────────────────────────────────
const IMG_DATA_SCIENCE =
  "https://www.figma.com/api/mcp/asset/0f332cad-983c-45b6-b43b-c39a4d1b30d9";
const IMG_BUSINESS =
  "https://www.figma.com/api/mcp/asset/68115d6f-3d81-44bc-96e0-aacb01697f28";
const IMG_TECHNOLOGIES =
  "https://www.figma.com/api/mcp/asset/9e82736e-04c6-437a-8b4d-aac1ba59d5e5";
const IMG_DEVELOPMENT =
  "https://www.figma.com/api/mcp/asset/3c55a79c-da49-4b04-85a2-ffaf92666ae2";
const IMG_COMPUTER_SCIENCE =
  "https://www.figma.com/api/mcp/asset/828ea9c8-ec22-4acd-8dd4-54a95546ab69";

// ── Degree card images ────────────────────────────────────────────────────────
const IMG_DEGREE_MBA =
  "https://www.figma.com/api/mcp/asset/c6c9e0bd-3dcb-43d6-a709-710ae58ec568";
const IMG_DEGREE_CS =
  "https://www.figma.com/api/mcp/asset/b2c2d4a8-cb93-47ea-8ac2-21e236e2ad31";

// ── Provider logos ────────────────────────────────────────────────────────────
const LOGO_GOOGLE =
  "https://www.figma.com/api/mcp/asset/c196c1da-9df2-47aa-83e9-695b805b7d31";
const LOGO_SERVICES =
  "https://www.figma.com/api/mcp/asset/d2434114-1781-45e2-a76c-0bcf2eb18b5c";
const LOGO_SHAPE =
  "https://www.figma.com/api/mcp/asset/5c81bbf3-09a0-49dd-aaeb-ab637c9c53d5";

const TOTAL_PAGES = 10;

const FONT_VAR =
  "'GRAD' 0, 'XOPQ' 96, 'XTRA' 468, 'YOPQ' 79, 'YTAS' 750, 'YTDE' -203, 'YTFI' 738, 'YTLC' 514, 'YTUC' 712, 'wdth' 100";

export default function DashboardPage() {
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

      {/* ── Hero: title + search + example hint + suggested tags (172-4821) ─ */}
      <div className="relative flex flex-col gap-6 items-center w-full max-w-[660px] mt-0 lg:mt-[84px] px-6 lg:px-4">
        <h1
          className="text-[48px] font-extrabold leading-[56px] text-on-surface whitespace-normal lg:whitespace-nowrap text-center lg:text-left"
          style={{ fontVariationSettings: FONT_VAR }}
        >
          Explore Topics and Skills
        </h1>

        {/* Search bar */}
        <div className="flex items-center justify-between w-full px-5 py-4 border border-outline rounded-sm shadow-hard-sm bg-surface">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="What do you want to learn?"
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
          <span className="font-bold">UI and UX development</span>
        </div>

        {/* Suggested tags — 172-4821, hidden on mobile */}
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

      {/* ── Content sections ──────────────────────────────────────────────── */}
      <div className="relative flex flex-col items-start px-6 lg:px-[70px] w-full gap-6 mt-6 pb-8">

        {/* ── Trending today ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3.5 w-full">
          <h2 className="text-sm font-bold text-on-surface">Trending today</h2>

          <div className="flex flex-col lg:flex-row gap-5 items-start w-full">
            {/* Left: tall Data Science card — desktop only */}
            <div className="hidden lg:block lg:flex-1 h-[296px] relative rounded-[2px] overflow-hidden shrink-0">
              <img
                src={IMG_DATA_SCIENCE}
                alt=""
                className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-[2px]"
              />
              <div className="absolute bottom-0 left-0 right-0 h-[99px] bg-gradient-to-t from-black/[0.62] to-transparent rounded-[2px]" />
              <div className="absolute inset-0 border border-outline rounded-[2px]" />
              <div className="absolute bottom-3.5 left-4 flex flex-col gap-px text-white whitespace-nowrap">
                <p className="text-xl font-extrabold leading-7" style={{ fontVariationSettings: FONT_VAR }}>
                  Data Science
                </p>
                <p className="text-xs font-medium leading-4">18 – 36 months</p>
              </div>
              <div className="absolute top-4 right-4 bg-black rounded-[2px] px-2 py-1">
                <span className="text-xs font-bold text-white leading-4">64 Courses</span>
              </div>
            </div>

            {/* Middle column: Business Management + Technologies — full width on mobile */}
            <div className="w-full lg:flex-1 flex flex-col gap-5 self-stretch min-w-0 h-[296px] lg:h-auto">
              <TrendingCard
                title="Business Management"
                duration="12 – 18 months"
                count="56 Courses"
                image={IMG_BUSINESS}
              />
              <TrendingCard
                title="Technologies"
                duration="6 – 12 months"
                count="35 Courses"
                image={IMG_TECHNOLOGIES}
              />
            </div>

            {/* Right column: Development + Computer Science — desktop only */}
            <div className="hidden lg:flex lg:flex-1 flex-col gap-5 self-stretch min-w-0">
              <TrendingCard
                title="Development"
                duration="18 – 24 months"
                count="78 Courses"
                image={IMG_DEVELOPMENT}
              />
              <TrendingCard
                title="Computer Science"
                duration="18 – 36 months"
                count="46 Courses"
                image={IMG_COMPUTER_SCIENCE}
              />
            </div>
          </div>
        </div>

        {/* ── Earn Your Degree ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-3.5 w-full">
          <h2 className="text-sm font-bold text-on-surface">Earn Your Degree</h2>

          <div className="flex gap-5 items-start w-full">
            {/* Mobile: full width; Desktop: flex-1 */}
            <div className="flex-1 min-w-0">
              <DegreeCard
                image={IMG_DEGREE_MBA}
                title="Master of Business Administration"
                university="University of Urbana-Champaign"
                logo={LOGO_GOOGLE}
              />
            </div>
            {/* Desktop only */}
            <div className="hidden lg:block flex-1 min-w-0">
              <DegreeCard
                image={IMG_DEGREE_CS}
                title="Online Master of Computer Science"
                university="Arizona State University"
                logo={LOGO_SERVICES}
              />
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <DegreeCard
                image={IMG_DEGREE_MBA}
                title="Global Master of Public Health and Science"
                university="Imperial College London"
                logo={LOGO_SHAPE}
              />
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between w-full mt-1 text-on-surface text-xs font-bold whitespace-nowrap">
            <button className="flex gap-1.5 items-center justify-center p-2 border border-outline rounded-sm bg-surface hover:opacity-80 transition-opacity">
              <span className="material-icons text-base leading-none">chevron_left</span>
              Prev
            </button>
            <span>Page 1 of {TOTAL_PAGES}</span>
            <button className="flex gap-1.5 items-center justify-center p-2 border border-outline rounded-sm bg-surface hover:opacity-80 transition-opacity">
              Next
              <span className="material-icons text-base leading-none">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TrendingCard: half-height image card used in the 2×2 columns ─────────────
function TrendingCard({
  title,
  duration,
  count,
  image,
}: {
  title: string;
  duration: string;
  count: string;
  image: string;
}) {
  return (
    <div className="flex-1 min-h-0 relative rounded-[2px] overflow-hidden" style={{ minHeight: "128px" }}>
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-[2px]"
      />
      <div className="absolute bottom-0 left-0 right-0 h-[99px] bg-gradient-to-t from-black/[0.62] to-transparent rounded-[2px]" />
      <div className="absolute inset-0 border border-outline rounded-[2px]" />
      <div className="absolute bottom-3.5 left-4 flex flex-col gap-px text-white whitespace-nowrap">
        <p
          className="text-xl font-extrabold leading-7"
          style={{ fontVariationSettings: FONT_VAR }}
        >
          {title}
        </p>
        <p className="text-xs font-medium leading-4">{duration}</p>
      </div>
      <div className="absolute top-4 right-4 bg-black rounded-[2px] px-2 py-1">
        <span className="text-xs font-bold text-white leading-4">{count}</span>
      </div>
    </div>
  );
}

// ── DegreeCard: white card with image, title, university, badge + logo ────────
function DegreeCard({
  image,
  title,
  university,
  logo,
}: {
  image: string;
  title: string;
  university: string;
  logo: string;
}) {
  return (
    <article className="w-full flex flex-col gap-4 overflow-hidden border border-black rounded-sm bg-white pb-5 min-w-0">
      <div className="h-[214px] relative shrink-0 w-full">
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>
      <div className="flex flex-col gap-1 px-4">
        <h3
          className="text-[18px] font-extrabold leading-6 text-black"
          style={{ fontVariationSettings: FONT_VAR }}
        >
          {title}
        </h3>
        <p className="text-sm text-[#5F646D] leading-[21px]">{university}</p>
      </div>
      <div className="flex items-center justify-between px-4">
        <span className="px-2 py-1 border border-black rounded-[2px] text-xs font-bold text-black leading-4 whitespace-nowrap">
          Remote
        </span>
        <div className="relative w-5 h-5 shrink-0">
          <img
            src={logo}
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      </div>
    </article>
  );
}


