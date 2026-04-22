"use client";

import { useState } from "react";

const FONT_VAR =
  "'GRAD' 0, 'XOPQ' 96, 'XTRA' 468, 'YOPQ' 79, 'YTAS' 750, 'YTDE' -203, 'YTFI' 738, 'YTLC' 514, 'YTUC' 712, 'wdth' 100";

// ── Project circle background ─────────────────────────────────────────────────
const IMG_CIRCLE_BG =
  "https://www.figma.com/api/mcp/asset/c5961742-f392-40ed-b522-bffe1ff9c904";

// ── Project inner logos ───────────────────────────────────────────────────────
const LOGO_DRIBBBLE =
  "https://www.figma.com/api/mcp/asset/8f9c9716-1765-4ec3-bbbf-3611e3ff2056";
const LOGO_DROPBOX =
  "https://www.figma.com/api/mcp/asset/28e4657a-3b53-4cdf-ae53-23715f298f15";
const LOGO_SKETCH =
  "https://www.figma.com/api/mcp/asset/f04b313c-5b68-40b0-8b2d-0d6365e32a23";
const LOGO_PAYPAL =
  "https://www.figma.com/api/mcp/asset/0011c4f1-4a75-4893-80a0-97329964773f";
const LOGO_BITCOIN =
  "https://www.figma.com/api/mcp/asset/4bddfb68-7213-4879-a470-b52a08024165";
const LOGO_GOOGLE =
  "https://www.figma.com/api/mcp/asset/68b56ecc-7cda-483f-9cb7-51232c61a7b4";

// ── Avatar images ─────────────────────────────────────────────────────────────
const AV1 = "https://www.figma.com/api/mcp/asset/1023a75f-554d-44b3-8bd0-f4336da17bae";
const AV2 = "https://www.figma.com/api/mcp/asset/6dc2e694-99af-4fd2-8602-cb0ff6b9d7fe";
const AV3 = "https://www.figma.com/api/mcp/asset/e106fe2e-a41b-40a8-8f23-eb7d154aa9d3";
const AV4 = "https://www.figma.com/api/mcp/asset/d6ea06e6-51b5-4236-b985-896d5f50c17c";
const AV5 = "https://www.figma.com/api/mcp/asset/38a2db02-080b-4b2f-bb55-e3bae3fd136b";
const AV6 = "https://www.figma.com/api/mcp/asset/efffd21a-a535-40e8-ab6b-b0ab76c8ebda";
const AV7 = "https://www.figma.com/api/mcp/asset/504b3237-af04-4cde-a4af-f882d68e0401";
const AV8 = "https://www.figma.com/api/mcp/asset/6a0dba69-89b9-4481-99db-b0d9406d12f5";
const AV9 = "https://www.figma.com/api/mcp/asset/b239dc87-d47d-42d7-9195-b9c7436d6c24";

const TABS = ["All Users", "Active", "Inactive", "Archived"] as const;

const PROJECTS: {
  id: number;
  logo: string;
  title: string;
  date: string;
  comments: number;
  progress: string;
  tasks: number;
  avatars: string[];
}[] = [
  {
    id: 1,
    logo: LOGO_DRIBBBLE,
    title: "Dribbble design mockup",
    date: "04 Oct 2022",
    comments: 4,
    progress: "56%",
    tasks: 4,
    avatars: [AV1, AV2, AV3],
  },
  {
    id: 2,
    logo: LOGO_DROPBOX,
    title: "Dropbox mobile app design",
    date: "04 Oct 2022",
    comments: 9,
    progress: "51%",
    tasks: 7,
    avatars: [AV4, AV5, AV6],
  },
  {
    id: 3,
    logo: LOGO_SKETCH,
    title: "Sketch resources website",
    date: "04 Oct 2022",
    comments: 9,
    progress: "78%",
    tasks: 3,
    avatars: [AV7, AV8, AV9],
  },
  {
    id: 4,
    logo: LOGO_PAYPAL,
    title: "Create financial report",
    date: "04 Oct 2022",
    comments: 5,
    progress: "43%",
    tasks: 6,
    avatars: [AV1, AV2, AV3],
  },
  {
    id: 5,
    logo: LOGO_BITCOIN,
    title: "NFT collection development",
    date: "04 Oct 2022",
    comments: 5,
    progress: "84%",
    tasks: 6,
    avatars: [AV4, AV5, AV6],
  },
  {
    id: 6,
    logo: LOGO_GOOGLE,
    title: "Google ads campaign",
    date: "04 Oct 2022",
    comments: 5,
    progress: "35%",
    tasks: 9,
    avatars: [AV7, AV8, AV9],
  },
];

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All Users");
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggleCheck(id: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4 px-6 lg:px-[70px] pt-[72px] lg:pt-[84px] pb-8 w-full min-h-full">
      {/* ── Filter tabs + sort actions ───────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Tabs */}
        <div className="flex gap-3 items-center flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-8 px-3 py-2 rounded-sm text-xs font-bold leading-4 whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-on-surface text-surface"
                  : "text-on-surface hover:bg-on-surface/10"
              }`}
              style={{ fontVariationSettings: FONT_VAR }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sort + Bulk actions */}
        <div className="flex gap-3 items-center text-on-surface whitespace-nowrap">
          <button className="flex gap-1.5 items-center justify-center px-2 py-2 border border-outline rounded-sm bg-surface text-xs font-bold hover:opacity-80 transition-opacity">
            <span className="material-icons text-base leading-none">filter_list</span>
            Sort: A-Z
          </button>
          <button className="flex gap-1.5 items-center justify-center px-2 py-2 border border-outline rounded-sm bg-surface text-xs font-bold hover:opacity-80 transition-opacity">
            <span className="material-icons text-base leading-none">more_horiz</span>
            Bulk Actions
          </button>
        </div>
      </div>

      {/* ── Project grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {PROJECTS.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isChecked={checked.has(project.id)}
            onToggle={() => toggleCheck(project.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ── ProjectCard ───────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  isChecked,
  onToggle,
}: {
  project: (typeof PROJECTS)[number];
  isChecked: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="flex flex-col items-center justify-between gap-5 px-4 py-5 border border-outline rounded-sm bg-surface shadow-hard-sm min-h-[326px]">
      {/* Row: checkbox + more */}
      <div className="flex items-center justify-between w-full">
        <button
          onClick={onToggle}
          aria-label="Select project"
          className={`w-5 h-5 border border-outline rounded-sm flex items-center justify-center transition-colors ${
            isChecked ? "bg-primary border-primary" : ""
          }`}
        >
          {isChecked && (
            <span className="material-icons text-xs leading-none text-black">check</span>
          )}
        </button>
        <button
          aria-label="More options"
          className="text-on-surface hover:opacity-60 transition-opacity"
        >
          <span className="material-icons text-[18px] leading-none">more_horiz</span>
        </button>
      </div>

      {/* Logo + title + date */}
      <div className="flex flex-col gap-3 items-center w-full">
        {/* Circle logo */}
        <div className="relative w-[68px] h-[68px] shrink-0 overflow-hidden rounded-full">
          <img
            src={IMG_CIRCLE_BG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <img
            src={project.logo}
            alt=""
            className="absolute inset-0 m-auto w-[30px] h-[30px] object-contain"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          />
        </div>

        <div className="flex flex-col gap-1.5 items-center w-full">
          <h3
            className="text-[18px] font-extrabold leading-6 text-on-surface text-center w-full"
            style={{ fontVariationSettings: FONT_VAR }}
          >
            {project.title}
          </h3>
          <span className="bg-green-badge px-2 py-1 rounded-sm text-xs font-bold text-black leading-4 whitespace-nowrap">
            {project.date}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 items-center justify-center text-on-surface text-xs font-bold whitespace-nowrap">
        <div className="flex gap-1 items-center">
          <span className="material-icons text-base leading-none">chat_bubble_outline</span>
          {project.comments}
        </div>
        <div className="flex gap-1 items-center">
          <span className="material-icons text-base leading-none">timelapse</span>
          {project.progress}
        </div>
        <div className="flex gap-1 items-center">
          <span className="material-icons text-base leading-none">assignment</span>
          {project.tasks}
        </div>
      </div>

      {/* Stacked avatars */}
      <div className="flex items-center justify-center pr-2">
        {project.avatars.map((src, i) => (
          <div
            key={i}
            className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-surface"
            style={{ marginLeft: i === 0 ? 0 : "-8px", zIndex: i }}
          >
            <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </article>
  );
}
