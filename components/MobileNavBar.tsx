import { CURRENT_USER } from "@/lib/config";

export function MobileNavBar({
  subtitle = "Overview",
  title = "Dashboard",
}: {
  subtitle?: string;
  title?: string;
}) {
  return (
    <header className="lg:hidden flex flex-col shrink-0 pt-safe">
      <div className="flex items-start justify-between px-6 pt-4 pb-6">
        <div className="flex flex-col gap-1">
          <span className="text-primary text-sm font-bold leading-snug">{subtitle}</span>
          <h1 className="text-on-surface text-[36px] font-extrabold leading-[46px]">{title}</h1>
        </div>
        <img
          src={CURRENT_USER.avatar}
          alt={CURRENT_USER.name}
          className="w-8 h-8 rounded-full object-cover mt-1"
        />
      </div>
    </header>
  );
}
