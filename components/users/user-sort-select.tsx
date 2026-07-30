"use client";

import { ArrowsDownUp } from "@phosphor-icons/react";
import { SelectMenu } from "@/components/ui/select-menu";

export const DEFAULT_USER_ORDERING = "-created_at";

export const USER_SORT_OPTIONS = [
  { value: "-created_at", label: "Newest archived" },
  { value: "created_at", label: "Oldest archived" },
  { value: "-updated_at", label: "Recently updated" },
  { value: "updated_at", label: "Least recently updated" },
  { value: "username", label: "Username (A–Z)" },
  { value: "-username", label: "Username (Z–A)" },
  { value: "full_name", label: "Full name (A–Z)" },
  { value: "-full_name", label: "Full name (Z–A)" },
];

interface UserSortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function UserSortSelect({ value, onChange }: UserSortSelectProps) {
  return (
    <SelectMenu
      value={value}
      onChange={onChange}
      options={USER_SORT_OPTIONS}
      icon={ArrowsDownUp}
      aria-label="Sort users"
    />
  );
}
