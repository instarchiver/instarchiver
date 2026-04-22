// TODO: Replace Figma MCP asset URLs with permanent /public assets before production.
// Current URLs expire approximately 7 days from 2026-04-22.

const LIGHT = {
  crm: "https://www.figma.com/api/mcp/asset/45a15344-8eed-47ad-87d1-189637ac3af0",
  countersV5: "https://www.figma.com/api/mcp/asset/26d8e570-f12a-48d5-9daf-7f5516f71d13",
  countersV4: "https://www.figma.com/api/mcp/asset/7cf4dfd1-4d62-4075-9a0a-ea5b4572193b",
  projects: "https://www.figma.com/api/mcp/asset/030b0981-2471-4fbd-9e72-8e534414795c",
};

const DARK = {
  crm: "https://www.figma.com/api/mcp/asset/f4c99960-99bf-4296-9c7f-5a882a3f38e6",
  countersV5: "https://www.figma.com/api/mcp/asset/8692aef3-85ea-415f-af90-28e27a0682e3",
  countersV4: "https://www.figma.com/api/mcp/asset/7577de7a-0d67-404a-8e09-bb909783a350",
  projects: "https://www.figma.com/api/mcp/asset/3637ddc9-54d7-416a-a16f-b66952e03985",
};

function MockupCard({
  light,
  dark,
  alt,
  width,
  style,
}: {
  light: string;
  dark: string;
  alt: string;
  width: number;
  style: React.CSSProperties;
}) {
  return (
    <div className="absolute shadow-hard-sm" style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={light} alt={alt} width={width} className="block dark:hidden" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dark} alt={alt} width={width} className="hidden dark:block" />
    </div>
  );
}

function EventChip({
  label,
  style,
}: {
  label: string;
  style: React.CSSProperties;
}) {
  return (
    <div
      className="absolute flex items-center gap-2 bg-white dark:bg-[#1e1e1e] border border-outline px-3 shadow-hard-sm h-8"
      style={style}
    >
      <div className="w-2 h-2 shrink-0 bg-primary" />
      <span className="text-xs font-bold text-on-surface whitespace-nowrap">{label}</span>
    </div>
  );
}

export function DecorativePanel() {
  return (
    <div className="hidden md:block relative flex-1 overflow-hidden bg-auth-panel">
      {/* Decorative ring 1 — large, centered right, partially off-screen */}
      <div
        className="absolute pointer-events-none"
        style={{ right: "-8%", top: "2%", width: "78%", aspectRatio: "1" }}
      >
        <svg viewBox="0 0 820 820" fill="none" className="w-full h-full text-on-surface opacity-60">
          <ellipse
            cx="410" cy="410" rx="408" ry="408"
            stroke="currentColor" strokeWidth="2"
            transform="rotate(-3 410 410)"
          />
        </svg>
      </div>

      {/* Decorative ring 2 — smaller, offset */}
      <div
        className="absolute pointer-events-none"
        style={{ right: "-1%", top: "13%", width: "64%", aspectRatio: "1" }}
      >
        <svg viewBox="0 0 610 610" fill="none" className="w-full h-full text-on-surface opacity-40">
          <ellipse
            cx="305" cy="305" rx="303" ry="303"
            stroke="currentColor" strokeWidth="1.5"
            transform="rotate(75 305 305)"
          />
        </svg>
      </div>

      {/* Mockup cards — positioned proportionally from Figma (panel-relative %) */}
      <MockupCard
        light={LIGHT.countersV5}
        dark={DARK.countersV5}
        alt="Analytics bars"
        width={200}
        style={{ left: "30%", top: "7%" }}
      />
      <MockupCard
        light={LIGHT.crm}
        dark={DARK.crm}
        alt="Customer record"
        width={203}
        style={{ left: "38%", top: "20%" }}
      />
      <MockupCard
        light={LIGHT.countersV4}
        dark={DARK.countersV4}
        alt="Progress counter"
        width={226}
        style={{ left: "24%", top: "57%" }}
      />
      <MockupCard
        light={LIGHT.projects}
        dark={DARK.projects}
        alt="Project card"
        width={254}
        style={{ left: "72%", top: "45%" }}
      />

      {/* Event chips */}
      <EventChip label="Assign tasks" style={{ left: "36%", top: "77%" }} />
      <EventChip label="Update design system" style={{ left: "69%", top: "29%" }} />
      <EventChip label="Mockup for web app" style={{ left: "42%", top: "83%" }} />

      {/* Dot accents */}
      <div
        className="absolute w-[27px] h-[27px] rounded-full bg-black/60 dark:bg-white/60"
        style={{ left: "63%", top: "9%" }}
      />
      <div
        className="absolute w-[27px] h-[27px] rounded-full bg-black/60 dark:bg-white/60"
        style={{ left: "86%", top: "19%" }}
      />
      <div
        className="absolute w-[27px] h-[27px] rounded-full bg-black/60 dark:bg-white/60"
        style={{ left: "76%", top: "84%" }}
      />
    </div>
  );
}
