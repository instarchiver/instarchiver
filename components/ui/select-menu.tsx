"use client";

import { useEffect, useRef, useState } from "react";
import type { Icon } from "@phosphor-icons/react";
import { CaretDown } from "@phosphor-icons/react";

interface SelectMenuOption {
  value: string;
  label: string;
}

interface SelectMenuProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectMenuOption[];
  icon?: Icon;
  "aria-label": string;
}

export function SelectMenu({
  value,
  onChange,
  options,
  icon: LeadingIcon,
  "aria-label": ariaLabel,
}: SelectMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex] ?? options[0];

  useEffect(() => {
    if (!isOpen) return;

    function onMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) listRef.current?.focus();
  }, [isOpen]);

  function open() {
    setHighlightedIndex(selectedIndex === -1 ? 0 : selectedIndex);
    setIsOpen(true);
  }

  function commit(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    setIsOpen(false);
  }

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  }

  function onListKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(highlightedIndex);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "Home") {
      e.preventDefault();
      setHighlightedIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHighlightedIndex(options.length - 1);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {LeadingIcon && <LeadingIcon size={18} className="text-muted-foreground" />}
        <span className="flex-1 whitespace-nowrap text-left">{selected?.label}</span>
        <CaretDown
          size={14}
          className={`text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          ref={listRef}
          className="absolute right-0 z-50 mt-1 max-h-64 w-full min-w-max overflow-auto rounded-lg border border-border bg-card p-1 shadow-md focus:outline-none"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => commit(index)}
                  className={`w-full cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-left text-sm ${
                    isHighlighted ? "bg-muted text-foreground" : "text-foreground"
                  } ${isSelected ? "font-medium" : ""}`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
