import type { InstagramUser } from "@/lib/api/types";
import { Avatar } from "./avatar";
import { PrivateBadge, VerifiedBadge } from "./verified-badge";
import { UserStatsRow } from "./user-stats-row";

export function UserProfileHeader({ user }: { user: InstagramUser }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
      <Avatar src={user.profile_picture} alt={user.username} size="lg" />
      <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <h1 className="text-xl font-semibold text-foreground">
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
          <p className="max-w-lg whitespace-pre-line text-sm text-foreground">
            {user.biography}
          </p>
        )}
      </div>
    </div>
  );
}
