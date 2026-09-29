import { Avatar } from "@/components/users/avatar";
import { UserStatsRow } from "@/components/users/user-stats-row";
import type { InstagramUserHistory } from "@/lib/api/types";
import { formatDate, formatRelativeTime } from "@/lib/format";
import type { HistoryChange } from "@/lib/history-diff";
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
 * `changes` is the diff against the next-older snapshot. `isFirst` marks the
 * oldest snapshot we have, which has nothing to diff against.
 */
export function HistoryEntry({
  entry,
  changes,
  isFirst,
}: {
  entry: InstagramUserHistory;
  changes: HistoryChange[];
  isFirst: boolean;
}) {
  let title = "Profile updated";
  if (entry.history_type === "-") title = "Profile removed";
  else if (isFirst || entry.history_type === "+") title = "First recorded snapshot";

  const body = isFirst ? (
    <FirstSnapshot entry={entry} />
  ) : changes.length > 0 ? (
    <div className="flex flex-col gap-3">
      {changes.map((change) => (
        <HistoryChangeRow
          key={change.kind === "image" ? "image" : change.field}
          change={change}
          username={entry.username}
        />
      ))}
    </div>
  ) : null;

  return (
    <li className="group relative pb-6 pl-8 last:pb-0">
      <span
        aria-hidden="true"
        className="absolute left-[7px] top-2 h-full w-px bg-border group-last:hidden"
      />
      <span
        aria-hidden="true"
        className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-background bg-accent"
      />
      <div className="rounded-xl border border-border bg-card p-4">
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
