import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  GridFour,
  CirclesFour,
  UsersThree,
} from "@phosphor-icons/react/ssr";
import { RecentPosts, RecentStories, StatCount } from "./home-sections";

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

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Your Instagram archive, browsable.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
          InstArchiver keeps a searchable record of archived Instagram users,
          their stories, and their posts &mdash; explore the collection below.
        </p>
      </div>

      {/* Phones get three compact tiles so recent media starts above the fold. */}
      <div className="mt-10 grid grid-cols-3 gap-3 sm:mt-12 sm:gap-4">
        {SECTIONS.map(({ href, label, description, icon: Icon, statKey }) => (
          <Link
            key={href}
            href={href}
            className="group flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-3 transition-[translate,box-shadow] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-none motion-reduce:hover:translate-y-0 sm:gap-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-accent">
                <Icon size={22} weight="bold" />
              </span>
              <ArrowRight
                size={18}
                className="hidden text-muted-foreground transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0 sm:block"
              />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground sm:text-lg">
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

      <RecentStories />
      <RecentPosts />
    </div>
  );
}
