import { memo } from "react";
import type { InstagramUser } from "@/lib/api/types";
import { HoverPrefetchLink } from "@/components/ui/intent-link";
import { formatCount } from "@/lib/format";
import { Avatar } from "./avatar";
import { PrivateBadge, VerifiedBadge } from "./verified-badge";

export const UserCard = memo(function UserCard({
  user,
}: {
  user: InstagramUser;
}) {
  return (
    <HoverPrefetchLink
      href={`/users/${user.uuid}`}
      className="group flex h-full flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 text-center transition-[translate,box-shadow] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-0 active:shadow-none motion-reduce:hover:translate-y-0"
    >
      <Avatar src={user.profile_picture} alt="" size="lg" />
      <div className="w-full min-w-0">
        <div className="flex items-center justify-center gap-1">
          <p className="min-w-0 truncate font-medium text-foreground">
            {user.username}
          </p>
          {user.is_verified && <VerifiedBadge />}
          {user.is_private && <PrivateBadge />}
        </div>
        {user.full_name && (
          <p className="truncate text-sm text-muted-foreground">
            {user.full_name}
          </p>
        )}
        <p
          className="mt-1 text-xs tabular-nums text-muted-foreground"
          title={`${user.follower_count.toLocaleString("en-US")} followers`}
        >
          {formatCount(user.follower_count)} followers
        </p>
      </div>
    </HoverPrefetchLink>
  );
});
