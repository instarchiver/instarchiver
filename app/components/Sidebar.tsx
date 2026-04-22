import { NAV_LINKS, TEAM_MEMBERS, CURRENT_USER, APP_NAME } from "@/app/lib/config";

export function Sidebar() {
  return (
    <aside className="hidden xl:flex flex-col w-[300px] min-h-screen bg-sidebar shrink-0 justify-between pb-2">
      <div className="flex flex-col gap-5">
        {/* Logo */}
        <div className="flex items-center px-[34px] py-6">
          <span className="text-white text-xl font-extrabold tracking-tight">
            {APP_NAME}<span className="text-primary">+</span>
          </span>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3">
          <div className="px-[34px]">
            <span className="text-white/75 text-xs font-medium">Navigation</span>
          </div>
          <div className="flex flex-col gap-1.5 px-[17px]">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="px-[17px]">
                <div
                  className={`flex items-center justify-between px-[17px] py-2 rounded-sm ${
                    link.active ? "bg-active-item" : ""
                  }`}
                >
                  <div
                    className={`flex gap-3 items-center ${
                      link.active ? "text-primary" : "text-white"
                    }`}
                  >
                    <span className="material-icons text-base leading-none">
                      {link.icon}
                    </span>
                    <span className="text-sm font-bold leading-6">{link.label}</span>
                  </div>
                  {link.badge && (
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
          <div className="px-[34px]">
            <span className="text-white/75 text-xs font-medium">Team Members</span>
          </div>
          <div className="flex flex-col gap-1 px-[17px]">
            {TEAM_MEMBERS.map((member) => (
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
            ))}
          </div>
          <button className="flex gap-[11px] items-center px-[34px] text-white cursor-pointer">
            <span className="material-icons text-lg leading-none">expand_more</span>
            <span className="text-xs font-medium">See More</span>
          </button>
        </div>
      </div>

      {/* Current user */}
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
    </aside>
  );
}
