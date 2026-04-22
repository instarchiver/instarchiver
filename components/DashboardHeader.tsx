"use client";

import { usePathname } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { MobileNavBar } from "@/components/MobileNavBar";

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard":            "Courses",
  "/dashboard/stories":    "Stories",
  "/dashboard/degrees":    "Degrees",
  "/dashboard/students":   "Students",
  "/dashboard/universities": "Universities",
  "/dashboard/schedule":   "Schedule",
  "/dashboard/knowledge-base": "Knowledge Base",
  "/dashboard/users":          "Users",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const title = ROUTE_TITLES[pathname] ?? "Dashboard";

  return (
    <>
      <TopBar title={title} />
      <MobileNavBar title={title} />
    </>
  );
}
