import type { Metadata } from "next";
import { StoriesPageContent } from "./stories-page-content";

export const metadata: Metadata = {
  title: "Stories",
};

export default function StoriesPage() {
  return <StoriesPageContent />;
}
