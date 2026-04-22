export const NAV_LINKS = [
  { label: "Dashboard", icon: "dashboard",    active: true,  badge: null },
  { label: "Projects",  icon: "queue",         active: false, badge: null },
  { label: "Tasks",     icon: "done_all",      active: false, badge: null },
  { label: "Kanban Desk", icon: "layers",      active: false, badge: { count: "28", color: "bg-green-badge" } },
  { label: "File Manager", icon: "folder",     active: false, badge: { count: "14", color: "bg-yellow-badge" } },
  { label: "Calendar",  icon: "today",         active: false, badge: null },
  { label: "Inbox",     icon: "inbox",         active: false, badge: null },
] as const;

export const MOBILE_TABS = [
  { icon: "dashboard", label: "Dashboard" },
  { icon: "queue",     label: "Projects" },
  { icon: "done_all",  label: "Tasks" },
  { icon: "layers",    label: "Kanban" },
  { icon: "more_horiz", label: "More" },
] as const;

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

export const COURSES = [
  {
    id: 1,
    title: "Developing Applications with Google Cloud Platform",
    university: "University of Urbana-Champaign",
    type: "Course",
    duration: "4-6 Weeks",
    iconCodepoint: "\uEA8D",
    image: "https://www.figma.com/api/mcp/asset/e8c611fc-1c2c-46c0-bb1e-c1ac86a58f87",
  },
  {
    id: 2,
    title: "Full Stack Web Development with Angular Specialization",
    university: "The Hong Kong University of Science",
    type: "Lesson",
    duration: "2 Weeks",
    iconCodepoint: "\uE9A7",
    image: "https://www.figma.com/api/mcp/asset/d85ffd47-77ff-49b9-859f-13025f591fe9",
  },
  {
    id: 3,
    title: "Web Design for Everybody: Basics of Web Development",
    university: "University of Michigan",
    type: "Course",
    duration: "6-8 Weeks",
    iconCodepoint: "\uEA6C",
    image: "https://www.figma.com/api/mcp/asset/49749b0b-82ff-4c14-a931-715bc04c26a3",
  },
  {
    id: 4,
    title: "Responsive Development and Design Specialization",
    university: "Goldsmiths, University of London",
    type: "Course",
    duration: "3-5 Weeks",
    iconCodepoint: "\uEA7E",
    image: "https://www.figma.com/api/mcp/asset/ee7d7f60-8662-456c-9ce9-487b78dc0e52",
  },
  {
    id: 5,
    title: "Web Applications for Everybody Specialization",
    university: "University of Urbana-Champaign",
    type: "Lesson",
    duration: "1 Week",
    iconCodepoint: "\uEA25",
    image: "https://www.figma.com/api/mcp/asset/0544b0a5-0937-4afa-af23-a4a48443e30a",
  },
  {
    id: 6,
    title: "Development and Design Specialization",
    university: "Goldsmiths, University of London",
    type: "Course",
    duration: "4-6 Weeks",
    iconCodepoint: "\uE508",
    image: "https://www.figma.com/api/mcp/asset/7facd395-086d-4d92-8b07-d6ffee6af957",
  },
] as const;
