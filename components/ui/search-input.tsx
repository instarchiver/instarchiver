"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  "aria-label"?: string;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder,
  "aria-label": ariaLabel = "Search",
}: SearchInputProps) {
  return (
    <div className="relative flex min-h-11 items-center rounded-lg border border-input bg-card focus-within:ring-2 focus-within:ring-ring">
      <MagnifyingGlass
        size={18}
        className="pointer-events-none absolute left-3 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="min-h-11 w-full rounded-lg bg-transparent py-2 pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="group absolute right-0 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md transition-colors group-hover:bg-muted">
            <X size={16} aria-hidden="true" />
          </span>
        </button>
      )}
    </div>
  );
}
