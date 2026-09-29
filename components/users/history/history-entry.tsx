import { Avatar } from "@/components/users/avatar";
import { UserStatsRow } from "@/components/users/user-stats-row";
import type { InstagramUserHistory } from "@/lib/api/types";
import { formatDate, formatRelativeTime } from "@/lib/format";
import { diffSnapshots } from "@/lib/history-diff";
import { HistoryChangeRow } from "./history-change-row";

function FirstSnapshot({ entry }: { entry: InstagramUserHistory }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <Avatar src={entry.profile_picture} alt={entry.username} size="md" />
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-sm font-medium text-foreground">@{entry.username}</p>
        <UserStatsRow
          posts={entry.media_count}
          followers={entry.follower_count}
          following={entry.following_count}
        />
        {entry.biography && (
          <p className="whitespace-pre-line break-words text-sm text-foreground">
            {entry.biography}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * `previous` is the next-older snapshot. When it is missing and more pages
 * exist, the diff stays hidden until that page loads.
 */
export function HistoryEntry({
  entry,
  previous,
  isOldest,
}: {
  entry: InstagramUserHistory;
  previous: InstagramUserHistory | undefined;
  isOldest: boolean;
}) {
  const changes = previous ? diffSnapshots(entry, previous) : [];

  let title = "Profile updated";
  if (entry.history_type === "+" || (isOldest && !previous)) {
    title = "First recorded snapshot";
  } else if (entry.history_type === "-") {
    title = "Profile removed";
  }

  let body: React.ReactNode = null;
  if (!previous) {
    if (isOldest) body = <FirstSnapshot entry={entry} />;
  } else if (changes.length === 0) {
    body = <p className="text-sm text-muted-foreground">No visible changes.</p>;
  } else {
    body = (
      <div className="flex flex-col gap-3">
        {changes.map((change) => (
          <HistoryChangeRow
            key={change.kind === "image" ? "image" : change.field}
            change={change}
            username={entry.username}
          />
        ))}
      </div>
    );
  }

  const muted = previous && changes.length === 0;

  return (
    <li className="group relative pb-6 pl-8 last:pb-0">
      <span
        aria-hidden="true"
        className="absolute left-[7px] top-2 h-full w-px bg-border group-last:hidden"
      />
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-background ${
          muted ? "bg-muted-foreground/40" : "bg-accent"
        }`}
      />
      <div
        className={`rounded-xl border border-border p-4 ${
          muted ? "bg-transparent" : "bg-card"
        }`}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <time
            dateTime={entry.history_date}
            title={formatDate(entry.history_date)}
            className="text-xs text-muted-foreground"
          >
            {formatDate(entry.history_date)} · {formatRelativeTime(entry.history_date)}
          </time>
        </div>
        {entry.history_change_reason && (
          <p className="mt-1 text-xs text-muted-foreground">
            {entry.history_change_reason}
          </p>
        )}
        {body && <div className="mt-4">{body}</div>}
      </div>
    </li>
  );
}
