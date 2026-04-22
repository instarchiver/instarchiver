import { NAV_LINKS, COMPACT_TEAM_AVATARS, COMPACT_USER_AVATAR } from "@/lib/config";

export function SidebarCompact() {
  return (
    <aside className="hidden lg:flex xl:hidden flex-col w-[78px] min-h-screen bg-sidebar shrink-0 items-center justify-between py-[14px] pt-[18px]">
      <div className="flex flex-col gap-12 items-center w-full">
        {/* Logo mark */}
        <div className="flex items-center justify-center w-full px-[15px]">
          <div className="flex items-center justify-center p-[11px]">
            <div className="w-4 h-4 bg-primary rounded-sm" />
          </div>
        </div>

        {/* Nav icons */}
        <div className="flex flex-col gap-1.5 items-center w-full">
          {NAV_LINKS.map((item) => (
            <div key={item.label} className="flex items-center justify-center px-[15px] w-full">
              <div
                className={`flex items-center justify-center px-[16px] py-[11px] rounded-sm ${
                  item.active ? "bg-active-item" : ""
                }`}
              >
                <span
                  className={`material-icons text-base leading-none ${
                    item.active ? "text-primary" : "text-white"
                  }`}
                >
                  {item.icon}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Team avatars */}
        <div className="flex flex-col gap-1.5 items-center w-full">
          {COMPACT_TEAM_AVATARS.map((avatar, i) => (
            <div key={i} className="flex items-center justify-center px-7 py-2 w-full">
              <img
                src={avatar}
                alt="Team member"
                className="w-[22px] h-[22px] rounded-full object-cover"
              />
            </div>
          ))}
          <button className="flex items-center justify-center px-[15px] w-full">
            <div className="flex items-center justify-center px-[16px] py-[11px]">
              <span className="material-icons text-base leading-none text-white">
                expand_more
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Current user avatar */}
      <div className="flex items-center justify-center px-7 py-2 w-full">
        <img
          src={COMPACT_USER_AVATAR}
          alt="Current user"
          className="w-[22px] h-[22px] rounded-full object-cover"
        />
      </div>
    </aside>
  );
}
