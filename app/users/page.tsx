import type { Metadata } from "next";
import { UsersPageContent } from "./users-page-content";

export const metadata: Metadata = {
  title: "Users",
  description: "Browse and search archived Instagram profiles.",
  alternates: { canonical: "/users" },
};

export default function UsersPage() {
  return <UsersPageContent />;
}
