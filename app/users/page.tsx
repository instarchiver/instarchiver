import type { Metadata } from "next";
import { UsersPageContent } from "./users-page-content";

export const metadata: Metadata = {
  title: "Users",
};

export default function UsersPage() {
  return <UsersPageContent />;
}
