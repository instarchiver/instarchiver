export const NAV_LINKS: Array<{
  label: string;
  icon: string;
  href: string;
  badge: { color: string; count: number } | null;
}> = [
  { label: "Explore Courses", icon: "\uE80C", href: "/dashboard",                badge: null },
  { label: "Stories",         icon: "auto_stories", href: "/dashboard/stories",  badge: null },
  { label: "Users",           icon: "group",   href: "/dashboard/users",         badge: null },
  { label: "Degrees",         icon: "\uEB3F", href: "/dashboard/degrees",        badge: null },
  { label: "Students",        icon: "\uF233", href: "/dashboard/students",       badge: null },
  { label: "Universities",    icon: "\uE666", href: "/dashboard/universities",   badge: null },
  { label: "Schedule",        icon: "\uF1C3", href: "/dashboard/schedule",       badge: null },
  { label: "Knowledge Base",  icon: "\uE3A0", href: "/dashboard/knowledge-base", badge: null },
];

export const MOBILE_TABS: Array<{
  icon: string;
  label: string;
  href: string;
}> = [
  { icon: "\uE80C",     label: "Courses",      href: "/dashboard" },
  { icon: "auto_stories", label: "Stories",    href: "/dashboard/stories" },
  { icon: "\uEB3F",     label: "Degrees",      href: "/dashboard/degrees" },
  { icon: "\uF233",     label: "Students",     href: "/dashboard/students" },
  { icon: "group",      label: "Users",       href: "/dashboard/users" },
];

export const TEAM_MEMBERS = [
  {
    name: "Alexandre Paiva",
    avatar: "https://www.figma.com/api/mcp/asset/d2620396-305f-4d9e-b5a0-e0c0dc6cfe35",
  },
  {
    name: "Thanawan Chadee",
    avatar: "https://www.figma.com/api/mcp/asset/33b14c7e-0c27-47af-be32-e34993348f67",
  },
  {
    name: "Justine Robinson",
    avatar: "https://www.figma.com/api/mcp/asset/e4bff0ba-aec2-46e4-bfc0-a9a0628fdc8b",
  },
] as const;

export const CURRENT_USER = {
  name: "Henry Richardson",
  avatar: "https://www.figma.com/api/mcp/asset/2fc23fb7-f461-4803-acca-883717a5c4dc",
} as const;

export const COMPACT_TEAM_AVATARS = [
  "https://www.figma.com/api/mcp/asset/92949d8e-f1ba-4c06-a93c-cf53e2415856",
  "https://www.figma.com/api/mcp/asset/8377fd6c-e545-48c4-be13-2e2bb175c086",
  "https://www.figma.com/api/mcp/asset/86854bea-1863-4cdf-b91a-4153663240d6",
] as const;

export const COMPACT_USER_AVATAR =
  "https://www.figma.com/api/mcp/asset/b20e6511-4e21-4134-8d1c-da07c5cee938";

export const FOOTER_LINKS = [
  { label: "Privacy Policy" },
  { label: "License" },
  { label: "API" },
] as const;

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Instarchiver";

// ─── Dashboard / Courses page ────────────────────────────────────────────────

export const SUGGESTED_TAGS = [
  "Founder",
  "Co-founder",
  "Project manager",
  "Board member",
  "Developer",
  "Entrepreneur in residence",
  "Managing director",
  "Founding partner",
] as const;
