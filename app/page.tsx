import Link from "next/link";
import {
  ArrowRight,
  GridFour,
  CirclesFour,
  UsersThree,
} from "@phosphor-icons/react/ssr";
import { getStatistics } from "@/lib/api/stats";
import { formatCount } from "@/lib/format";

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
  const stats = await getStatistics();

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
    </div>
  );
}
