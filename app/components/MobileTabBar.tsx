"use client";

import { useState } from "react";
import { MOBILE_TABS } from "@/app/lib/config";

export function MobileTabBar() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <nav className="lg:hidden flex flex-col items-center shrink-0 bg-surface border-t border-outline pb-safe">
      <div className="flex items-start justify-between w-full px-3">
        {MOBILE_TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className="flex items-center justify-center h-[76px] w-14"
            aria-label={tab.label}
          >
            <span
              className={`material-icons text-[22px] leading-none transition-colors ${
                i === activeTab ? "text-primary" : "text-on-surface"
              }`}
            >
              {tab.icon}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
