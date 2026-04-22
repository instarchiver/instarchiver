export function TopBar({ title = "Dashboard" }: { title?: string }) {
  return (
    <header className="hidden lg:flex items-center justify-between px-10 xl:px-[70px] py-4 border-b border-outline shrink-0">
      <h1 className="text-[30px] font-extrabold leading-[38px] text-on-surface whitespace-nowrap">
        {title}
      </h1>
      <div className="flex gap-6 items-center">
        <div className="flex gap-1 items-center">
          {/* Search */}
          <button className="p-2 text-on-surface">
            <span className="material-icons text-base leading-none">search</span>
          </button>
          {/* Bell */}
          <div className="relative p-2">
            <span className="material-icons text-base leading-none text-on-surface">
              notifications
            </span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </div>
          {/* Apps */}
          <button className="flex gap-1.5 items-center p-2 text-on-surface text-xs font-bold">
            <span className="material-icons text-base leading-none">apps</span>
            Apps
          </button>
        </div>
        {/* Create new */}
        <button className="flex gap-1.5 items-center bg-primary border border-black px-2 py-2 text-black text-xs font-bold rounded-sm">
          <span className="material-icons text-base leading-none">add</span>
          Create new
        </button>
      </div>
    </header>
  );
}
