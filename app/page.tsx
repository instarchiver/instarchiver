import Link from "next/link";
import {
  ArrowRight,
  GridFour,
  CirclesFour,
  UsersThree,
} from "@phosphor-icons/react/ssr";
import { getStatistics } from "@/lib/api/stats";
import { getPosts } from "@/lib/api/posts";
import { getStories } from "@/lib/api/stories";
import { formatCount } from "@/lib/format";
import { PostCard } from "@/components/posts/post-card";
import { StoryCard } from "@/components/stories/story-card";
import { COLUMNS_2_3_4_5 } from "@/components/ui/grid-columns";

const SECTIONS = [
  {
    href: "/users",
    label: "Users",
    description: "Browse archived Instagram profiles.",
    icon: UsersThree,
    statKey: "total_users" as const,
  },
  {
    href: "/stories",
    label: "Stories",
    description: "Browse archived stories from every user.",
    icon: CirclesFour,
    statKey: "total_stories" as const,
  },
  {
    href: "/posts",
    label: "Posts",
    description: "Browse the full archived post gallery.",
    icon: GridFour,
    statKey: "total_posts" as const,
  },
];

async function safeFetch<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export default async function Home() {
  const [stats, postsPage, storiesPage] = await Promise.all([
    getStatistics(),
    safeFetch(() => getPosts()),
    safeFetch(() => getStories()),
  ]);

  const recentPosts = postsPage?.results.slice(0, 20) ?? [];
  const recentStories = storiesPage?.results.slice(0, 20) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Your Instagram archive, browsable.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          InstArchiver keeps a searchable record of archived Instagram users,
          their stories, and their posts &mdash; explore the collection below.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {SECTIONS.map(({ href, label, description, icon: Icon, statKey }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-accent">
                <Icon size={22} weight="bold" />
              </span>
              <ArrowRight
                size={18}
                className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{label}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
            <p className="text-2xl font-semibold tabular-nums text-foreground">
              {stats ? formatCount(stats[statKey]) : "—"}
            </p>
          </Link>
        ))}
      </div>

      {recentStories.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              Recently Archived Stories
            </h2>
            <Link
              href="/stories"
              className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className={`mt-6 grid gap-4 ${COLUMNS_2_3_4_5.className}`}>
            {recentStories.map((story) => (
              <StoryCard key={story.story_id} story={story} />
            ))}
          </div>
        </section>
      )}

      {recentPosts.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              Recently Archived Posts
            </h2>
            <Link
              href="/posts"
              className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className={`mt-6 grid gap-4 ${COLUMNS_2_3_4_5.className}`}>
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
