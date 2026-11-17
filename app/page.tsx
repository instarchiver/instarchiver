import type { Metadata } from "next";
import Link from "next/link";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  ArrowRight,
  ClockCounterClockwise,
  GridFour,
  CirclesFour,
  MagnifyingGlass,
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

const HOW_IT_WORKS = [
  {
    title: "Profile history diffs",
    description:
      "Every recorded sync is compared against earlier snapshots so changes to username, full name, bio, avatar, verification, privacy status, and follower counts appear as exact before-and-after diffs.",
    icon: ClockCounterClockwise,
  },
  {
    title: "Expired stories and deleted posts",
    description:
      "Public Instagram stories and posts captured by the archive remain browsable after Instagram's 24-hour story window closes or after an item is removed from Instagram.",
    icon: CirclesFour,
  },
  {
    title: "Public search without login",
    description:
      "Anyone can search archived usernames, captions, stories, and profile timelines without an Instagram account. Google sign-in is only required when submitting a new username to archive.",
    icon: MagnifyingGlass,
  },
];

const HOME_FAQS = [
  {
    question: "Do I need an account to browse InstArchiver?",
    answer:
      "No. All archived profiles, stories, posts, and profile history timelines are publicly browsable without logging in. A Google account is only required when adding a new Instagram username to the archive.",
  },
  {
    question: "Can I view stories after 24 hours or posts that were deleted?",
    answer:
      "Yes, when they were archived while the profile was public. Each story page displays whether its original 24-hour Instagram window is still active or has expired.",
  },
  {
    question: "How do I request copyright removal or opt out a profile?",
    answer:
      "Send a request through the DMCA and content removal page or email arter@instarchiver.net with the specific InstArchiver URLs and proof of ownership or authorization.",
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
          aria-labelledby="how-instarchiver-works"
          className="mt-16 border-t border-border pt-12"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2
              id="how-instarchiver-works"
              className="text-2xl font-semibold text-foreground"
            >
              How InstArchiver works
            </h2>
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center gap-1 rounded-lg px-1 text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              About the archive <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-accent">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="home-faq-heading" className="mt-12">
          <h2
            id="home-faq-heading"
            className="text-xl font-semibold text-foreground"
          >
            Frequently asked questions
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            {HOME_FAQS.map(({ question, answer }) => (
              <div
                key={question}
                className="rounded-xl border border-border bg-card p-5"
              >
                <dt className="text-sm font-semibold text-foreground">
                  {question}
                </dt>
                <dd className="mt-2 text-sm leading-6 text-muted-foreground">
                  {answer}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            InstArchiver is an independent public archive and is not affiliated
            with Instagram or Meta. For takedown or opt-out requests, visit{" "}
            <Link
              href="/dmca"
              className="rounded-sm text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              DMCA &amp; content removal
            </Link>
            .
          </p>
        </section>
      </div>
    </HydrationBoundary>
  );
}
