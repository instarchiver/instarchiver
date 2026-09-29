import type { InstagramUserHistory } from "@/lib/api/types";

type CountField = "media_count" | "follower_count" | "following_count";
type TextField = "username" | "full_name" | "biography";
type FlagField = "is_private" | "is_verified";

export type HistoryChange =
  | {
      kind: "count";
      field: CountField;
      label: string;
      from: number;
      to: number;
      delta: number;
    }
  | { kind: "text"; field: TextField; label: string; from: string; to: string }
  | { kind: "flag"; field: FlagField; label: string; from: boolean; to: boolean }
  | { kind: "image"; from: string | null; to: string | null };

const TEXT_FIELDS: [TextField, string][] = [
  ["username", "Username"],
  ["full_name", "Full name"],
  ["biography", "Bio"],
];

const FLAG_FIELDS: [FlagField, string][] = [
  ["is_private", "Visibility"],
  ["is_verified", "Verified"],
];

const COUNT_FIELDS: [CountField, string][] = [
  ["follower_count", "Followers"],
  ["following_count", "Following"],
  ["media_count", "Posts"],
];

export function diffSnapshots(
  current: InstagramUserHistory,
  previous: InstagramUserHistory
): HistoryChange[] {
  const changes: HistoryChange[] = [];

  if (current.profile_picture !== previous.profile_picture) {
    changes.push({
      kind: "image",
      from: previous.profile_picture,
      to: current.profile_picture,
    });
  }

  for (const [field, label] of TEXT_FIELDS) {
    const from = previous[field] ?? "";
    const to = current[field] ?? "";
    if (from !== to) changes.push({ kind: "text", field, label, from, to });
  }

  for (const [field, label] of FLAG_FIELDS) {
    if (previous[field] !== current[field]) {
      changes.push({
        kind: "flag",
        field,
        label,
        from: previous[field],
        to: current[field],
      });
    }
  }

  for (const [field, label] of COUNT_FIELDS) {
    const from = previous[field];
    const to = current[field];
    if (from !== to) {
      changes.push({ kind: "count", field, label, from, to, delta: to - from });
    }
  }

  return changes;
}
