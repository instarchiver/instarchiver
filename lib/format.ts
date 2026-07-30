import type { InstagramUser, Post, Story } from "@/lib/api/types";

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) return "0";
  return compactNumber.format(value);
}

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const seconds = (date.getTime() - Date.now()) / 1000;
  for (const [unit, secondsInUnit] of UNITS) {
    if (Math.abs(seconds) >= secondsInUnit) {
      return relativeTime.format(Math.round(seconds / secondsInUnit), unit);
    }
  }
  return relativeTime.format(Math.round(seconds), "second");
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(url);
}

export function toBlurDataUrl(
  blurDataUrl: string | null | undefined
): string | undefined {
  if (!blurDataUrl) return undefined;
  if (blurDataUrl.startsWith("data:")) return blurDataUrl;
  return `data:image/jpeg;base64,${blurDataUrl}`;
}

export function formatPostTitle(post: Post): string {
  const caption = post.caption?.trim();
  if (!caption) return `Post by @${post.user.username}`;
  const truncated =
    caption.length > 60 ? `${caption.slice(0, 60).trimEnd()}…` : caption;
  return `${truncated} — @${post.user.username}`;
}

export function formatUserTitle(user: InstagramUser): string {
  const name = user.full_name?.trim();
  return name ? `${name} (@${user.username})` : `@${user.username}`;
}

export function formatStoryTitle(story: Story): string {
  return `Story by @${story.user.username} — ${formatDate(story.story_created_at)}`;
}
