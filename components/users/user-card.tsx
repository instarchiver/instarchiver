import Link from "next/link";
import type { InstagramUser } from "@/lib/api/types";
import { formatCount } from "@/lib/format";
import { Avatar } from "./avatar";
import { PrivateBadge, VerifiedBadge } from "./verified-badge";

export function UserCard({ user }: { user: InstagramUser }) {
  return (
    <Link
      href={`/users/${user.uuid}`}
      className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <Avatar src={user.profile_picture} alt={user.username} size="lg" />
      <div className="min-w-0">
        <div className="flex items-center justify-center gap-1">
          <p className="truncate font-medium text-foreground">
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
        <p className="mt-1 text-xs text-muted-foreground">
          {formatCount(user.follower_count)} followers
        </p>
      </div>
    </Link>
  );
}
