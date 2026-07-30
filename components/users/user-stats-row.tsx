import { formatCount } from "@/lib/format";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 sm:items-start">
      <span className="text-lg font-semibold tabular-nums text-foreground">
        {formatCount(value)}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function UserStatsRow({
  posts,
  followers,
  following,
}: {
  posts: number;
  followers: number;
  following: number;
}) {
  return (
    <div className="flex items-center gap-6">
      <Stat label="Posts" value={posts} />
      <Stat label="Followers" value={followers} />
      <Stat label="Following" value={following} />
    </div>
  );
}
