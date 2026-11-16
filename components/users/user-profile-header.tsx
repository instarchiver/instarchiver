import Link from "next/link";
import { ClockCounterClockwise } from "@phosphor-icons/react";
import type { InstagramUser } from "@/lib/api/types";
import { Avatar } from "./avatar";
import { PrivateBadge, VerifiedBadge } from "./verified-badge";
import { UserStatsRow } from "./user-stats-row";
import { formatDate, formatDay } from "@/lib/format";

export function UserProfileHeader({ user }: { user: InstagramUser }) {
  const syncedAt = user.api_updated_at ?? user.updated_at;

  return (
    <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
      <Avatar src={user.profile_picture} alt="" size="lg" />
      <div className="flex min-w-0 flex-1 flex-col items-center gap-3 sm:items-start">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <h1 className="break-words text-xl font-semibold text-foreground">
            {user.username}
          </h1>
          {user.is_verified && <VerifiedBadge />}
          {user.is_private && <PrivateBadge />}
        </div>
        {user.full_name && (
          <p className="text-sm font-medium text-muted-foreground">
            {user.full_name}
          </p>
        )}
        <UserStatsRow
          posts={user.media_count}
          followers={user.follower_count}
          following={user.following_count}
        />
        {user.biography && (
          <p className="max-w-lg whitespace-pre-line break-words text-sm text-foreground">
            {user.biography}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          In the archive since {formatDay(user.created_at)}
          {syncedAt && (
            <>
              {" · "}
              <span title={formatDate(syncedAt)}>
                Last synced {formatDay(syncedAt)}
              </span>
            </>
          )}
        </p>
        {user.has_history && (
          <Link
            href={`/users/${user.uuid}/history`}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ClockCounterClockwise size={16} aria-hidden="true" />
            View profile history
          </Link>
        )}
      </div>
    </div>
  );
}
