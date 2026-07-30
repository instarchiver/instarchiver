import type { Metadata } from "next";
import { PostsPageContent } from "./posts-page-content";

export const metadata: Metadata = {
  title: "Posts",
};

export default function PostsPage() {
  return <PostsPageContent />;
}
