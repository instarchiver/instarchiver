"use client";

import { NAV_LINKS, TEAM_MEMBERS, CURRENT_USER, APP_NAME } from "@/lib/config";
import { useSidebar } from "@/providers/SidebarProvider";

export function Sidebar() {
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    <aside
      className={`hidden lg:flex flex-col min-h-screen bg-sidebar shrink-0 justify-between pb-2 overflow-hidden transition-[width] duration-200 ease-in-out ${
        collapsed ? "w-[78px]" : "w-[300px]"
      }`}
    >
      <div className="flex flex-col gap-5">
        {/* Logo */}
        <div
          className={`flex items-center py-6 ${
            collapsed ? "justify-center px-[15px]" : "px-[34px]"
          }`}
        >
          {collapsed ? (
            <div className="flex items-center justify-center p-[11px]">
              <div className="w-4 h-4 bg-primary rounded-sm" />
            </div>
          ) : (
            <span className="text-white text-xl font-extrabold tracking-tight whitespace-nowrap">
              {APP_NAME}
              <span className="text-primary">+</span>
            </span>
          )}
        </div>

        {/* Collapse toggle */}
        <div
          className={`flex ${collapsed ? "justify-center px-[15px]" : "px-[34px]"}`}
        >
          <button
            onClick={toggleCollapsed}
            className="flex items-center justify-center w-8 h-8 text-white/60 hover:text-white transition-colors rounded-sm hover:bg-white/10"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="material-icons text-base leading-none">
              {collapsed ? "chevron_right" : "chevron_left"}
            </span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3">
          {!collapsed && (
            <div className="px-[34px]">
              <span className="text-white/75 text-xs font-medium whitespace-nowrap">
                Navigation
              </span>
            </div>
          )}
          <div className={`flex flex-col gap-1.5 px-[17px] ${collapsed ? "items-center" : ""}`}>
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className={collapsed ? "flex w-full items-center justify-center" : "px-[17px]"}
              >
                <div
                  className={`flex items-center rounded-sm ${
                    collapsed
                      ? `justify-center px-[16px] py-[11px] ${link.active ? "bg-active-item" : ""}`
                      : `justify-between px-[17px] py-2 w-full ${link.active ? "bg-active-item" : ""}`
                  }`}
                >
                  <div
                    className={`flex items-center ${collapsed ? "" : "gap-3"} ${
                      link.active ? "text-primary" : "text-white"
                    }`}
                  >
                    <span className="material-icons text-base leading-none">
                      {link.icon}
                    </span>
                    {!collapsed && (
                      <span className="text-sm font-bold leading-6 whitespace-nowrap">
                        {link.label}
                      </span>
                    )}
                  </div>
                  {!collapsed && link.badge && (
                    <span
                      className={`${link.badge.color} text-black text-xs font-bold px-2 py-px`}
                    >
                      {link.badge.count}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="flex flex-col gap-3">
          {!collapsed && (
            <div className="px-[34px]">
              <span className="text-white/75 text-xs font-medium whitespace-nowrap">
                Team Members
              </span>
            </div>
          )}
          <div
            className={`flex flex-col px-[17px] ${
              collapsed ? "items-center gap-1.5" : "gap-1"
            }`}
          >
            {TEAM_MEMBERS.map((member) =>
              collapsed ? (
                <div
                  key={member.name}
                  className="flex items-center justify-center px-7 py-2 w-full"
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-[22px] h-[22px] rounded-full object-cover"
                  />
                </div>
              ) : (
                <div key={member.name} className="px-[17px]">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex gap-3 items-center">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-[22px] h-[22px] rounded-full object-cover"
                      />
                      <span className="text-white text-sm font-bold leading-6 whitespace-nowrap">
                        {member.name}
                      </span>
                    </div>
                    <span className="material-icons text-base text-white leading-none">
                      more_horiz
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
          {collapsed ? (
            <div className="flex items-center justify-center px-[15px] w-full">
              <div className="flex items-center justify-center px-[16px] py-[11px]">
                <span className="material-icons text-base leading-none text-white">
                  expand_more
                </span>
              </div>
            </div>
          ) : (
            <button className="flex gap-[11px] items-center px-[34px] text-white cursor-pointer">
              <span className="material-icons text-lg leading-none">expand_more</span>
              <span className="text-xs font-medium whitespace-nowrap">See More</span>
            </button>
          )}
        </div>
      </div>

      {/* Current user */}
      {collapsed ? (
        <div className="flex items-center justify-center px-7 py-2 w-full">
          <img
            src={CURRENT_USER.avatar}
            alt={CURRENT_USER.name}
            className="w-[22px] h-[22px] rounded-full object-cover"
          />
        </div>
      ) : (
        <div className="px-[17px]">
          <div className="px-[17px] py-2 flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <img
                src={CURRENT_USER.avatar}
                alt={CURRENT_USER.name}
                className="w-[22px] h-[22px] rounded-full object-cover"
              />
              <span className="text-white text-sm font-bold leading-6 whitespace-nowrap">
                {CURRENT_USER.name}
              </span>
            </div>
            <span className="material-icons text-base text-white leading-none">
              more_horiz
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
