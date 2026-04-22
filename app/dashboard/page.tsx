"use client";

import { useState } from "react";
import { COURSES, SUGGESTED_TAGS } from "@/lib/config";
import { useTheme } from "@/providers/ThemeProvider";

// Background image assets (Figma CDN — light theme)
const LIGHT_BG_GRADIENT =
  "https://www.figma.com/api/mcp/asset/c2dfa979-d7e5-45a7-923a-a1b45a25fda9";
const LIGHT_BG_PATTERN =
  "https://www.figma.com/api/mcp/asset/c694d934-a512-4b19-b2ef-7a32d01e6511";
// Background image assets (Figma CDN — dark theme)
const DARK_BG_MAIN =
  "https://www.figma.com/api/mcp/asset/956fa416-a3ba-44cd-906c-d427e99c4454";
const DARK_BG_PATTERN =
  "https://www.figma.com/api/mcp/asset/1660bb35-2a5a-4de7-ac9b-45eed5021cc6";

const COURSES_PER_ROW = 3;
const TOTAL_PAGES = 10;

export default function DashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchValue, setSearchValue] = useState("Mobile and Web Design");
  const [currentPage] = useState(1);

  return (
    <div className="relative flex flex-col gap-[84px] items-center w-full min-h-full">
      {/* Decorative background (top-right) */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[min(694px,50%)] h-[610px] pointer-events-none overflow-hidden"
      >
        {isDark ? (
          <img
            src={DARK_BG_MAIN}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
        ) : (
          <>
            <img
              src={LIGHT_BG_GRADIENT}
              alt=""
              className="absolute inset-0 w-full h-full object-cover rotate-180"
            />
            <img
              src={LIGHT_BG_PATTERN}
              alt=""
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
            />
          </>
        )}
        {/* Dark theme repeating pattern */}
        {isDark && (
          <img
            src={DARK_BG_PATTERN}
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
          />
        )}
      </div>

      {/* Hero: title + search + tags */}
      <div className="relative flex flex-col gap-6 items-center w-full max-w-[660px] pt-[84px] px-4">
        <h1
          className="text-[48px] font-extrabold leading-[56px] text-on-surface whitespace-nowrap"
          style={{
            fontVariationSettings:
              "'GRAD' 0, 'XOPQ' 96, 'XTRA' 468, 'YOPQ' 79, 'YTAS' 750, 'YTDE' -203, 'YTFI' 738, 'YTLC' 514, 'YTUC' 712, 'wdth' 100",
          }}
        >
          Software Development
        </h1>

        {/* Search bar */}
        <div className="flex items-center justify-between w-full px-5 py-4 border border-outline rounded-sm shadow-hard-sm bg-surface">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search help articles"
            className="flex-1 bg-transparent text-base font-medium text-on-surface placeholder:text-on-surface/50 outline-none"
          />
          <button
            className="flex-none flex items-center justify-center w-8 h-8 bg-primary border border-black rounded-sm"
            aria-label="Search"
          >
            <span className="material-icons text-base leading-none text-black">search</span>
          </button>
        </div>

        {/* Suggested tags */}
        <div className="flex flex-col gap-3 items-center w-full">
          <p className="text-sm font-bold text-on-surface">Suggested course searches</p>
          <div className="flex flex-wrap gap-1.5 items-center justify-center">
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
      </div>

      {/* Courses section */}
      <div className="relative flex flex-col items-start px-[70px] w-full gap-3.5 pb-8">
        <h2 className="text-sm font-bold text-on-surface">Earn Your Degree</h2>

        {/* Course grid: 3 columns */}
        <div
          className="grid gap-5 w-full"
          style={{
            gridTemplateColumns: `repeat(${COURSES_PER_ROW}, minmax(0, 1fr))`,
          }}
        >
          {COURSES.map((course) => (
            <CourseCard key={course.id} course={course} isDark={isDark} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between w-full mt-1 text-on-surface text-xs font-bold whitespace-nowrap">
          <button className="flex gap-1.5 items-center justify-center p-2 border border-outline rounded-sm bg-surface hover:bg-on-surface/5 transition-colors">
            <span className="material-icons text-base leading-none">chevron_left</span>
            Prev
          </button>
          <span>Page {currentPage} of {TOTAL_PAGES}</span>
          <button className="flex gap-1.5 items-center justify-center p-2 border border-outline rounded-sm bg-surface hover:bg-on-surface/5 transition-colors">
            Next
            <span className="material-icons text-base leading-none">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

type Course = (typeof COURSES)[number];

function CourseCard({ course, isDark }: { course: Course; isDark: boolean }) {
  return (
    <article className="flex flex-col overflow-hidden border border-outline rounded-sm bg-surface">
      {/* Cover image */}
      <div className="relative h-[120px] shrink-0 w-full">
        <img
          src={course.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* Content — overlaps image by 24px */}
      <div className="flex flex-col gap-4 items-start -mt-6 px-4 pb-11">
        {/* Icon badge */}
        <div className="flex items-center justify-center p-[17px] w-[52px] h-[52px] border border-outline rounded-sm bg-surface">
          <span className="material-icons text-[18px] leading-none text-on-surface text-center w-full">
            {course.iconCodepoint}
          </span>
        </div>

        {/* Title + university */}
        <div className="flex flex-col gap-1 w-full">
          <h3
            className="text-[18px] font-extrabold leading-6 text-on-surface"
            style={{
              fontVariationSettings:
                "'GRAD' 0, 'XOPQ' 96, 'XTRA' 468, 'YOPQ' 79, 'YTAS' 750, 'YTDE' -203, 'YTFI' 738, 'YTLC' 514, 'YTUC' 712, 'wdth' 100",
            }}
          >
            {course.title}
          </h3>
          <p
            className={`text-sm leading-[21px] ${isDark ? "text-white/75" : "text-muted"}`}
          >
            {course.university}
          </p>
        </div>

        {/* Type + duration row */}
        <div className="flex items-center gap-4">
          <span className="px-2 py-1 border border-outline rounded-[2px] text-xs font-bold text-on-surface leading-4">
            {course.type}
          </span>
          <span className="text-xs font-bold text-on-surface">{course.duration}</span>
        </div>
      </div>
    </article>
  );
}
