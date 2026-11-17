import type { Metadata } from "next";
import Link from "next/link";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  ArrowRight,
  GridFour,
  CirclesFour,
  UsersThree,
} from "@phosphor-icons/react/ssr";
import { getPosts } from "@/lib/api/posts";
import { getStatistics } from "@/lib/api/stats";
import { getStories } from "@/lib/api/stories";
import { queryKeys } from "@/lib/query-keys";
import {
  HomeMidAdSlot,
  HomeSearchForm,
  HomeStatsErrorNotice,
  RecentPosts,
  RecentStories,
  StatCount,
} from "./home-sections";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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

export default async function Home() {
  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: queryKeys.stats,
      queryFn: async () => {
        const stats = await getStatistics();
        if (!stats) {
          throw new Error("Statistics unavailable");
        }
        return stats;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.stories.recent(),
      queryFn: () => getStories(undefined, undefined, undefined, 20),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.posts.recent(),
      queryFn: () => getPosts(undefined, undefined, undefined, 20),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Public Instagram archive, browsable.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            InstArchiver keeps a searchable record of archived Instagram users,
            their stories, and their posts. Look up a profile or explore recent
            additions below.
          </p>
          <HomeSearchForm />
        </div>

        {/* Phones >= 360px get three compact tiles so recent media starts above the fold. */}
        <div className="mt-10 grid grid-cols-1 gap-3 min-[360px]:grid-cols-3 sm:mt-12 sm:gap-4">
          {SECTIONS.map(({ href, label, description, icon: Icon, statKey }) => (
            <Link
              key={href}
              href={href}
              className="group flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-3 transition-[translate,box-shadow] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-0 active:shadow-none motion-reduce:hover:translate-y-0 sm:gap-4 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-accent sm:h-11 sm:w-11">
                  <Icon size={20} weight="bold" aria-hidden="true" />
                </span>
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="hidden text-muted-foreground transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0 sm:block"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground sm:text-lg">
                  {label}
                </p>
                <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
                  {description}
                </p>
              </div>
              <StatCount statKey={statKey} />
            </Link>
          ))}
        </div>
        <HomeStatsErrorNotice />

        <RecentStories />
        <HomeMidAdSlot />
        <RecentPosts />

        <section
          aria-label="About the archive"
          className="mt-14 border-t border-border pt-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              InstArchiver preserves public Instagram profile snapshots,
              expired stories, and posts for browsing without an account. It is
              an independent archive and is not affiliated with Instagram or
              Meta.
            </p>
            <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-1">
              <Link
                href="/about"
                className="inline-flex min-h-11 items-center gap-1 rounded-lg px-1 text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                About InstArchiver <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/dmca"
                className="inline-flex min-h-11 items-center rounded-lg px-1 text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                DMCA &amp; content removal
              </Link>
            </div>
          </div>
        </section>
      </div>
    </HydrationBoundary>
  );
}
