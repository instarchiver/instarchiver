const FONT_VAR =
  "'GRAD' 0, 'XOPQ' 96, 'XTRA' 468, 'YOPQ' 79, 'YTAS' 750, 'YTDE' -203, 'YTFI' 738, 'YTLC' 514, 'YTUC' 712, 'wdth' 100";

export function MobileNavBar({
  subtitle = "Overview",
  title = "Dashboard",
}: {
  subtitle?: string;
  title?: string;
}) {
  return (
    <header className="lg:hidden flex items-center justify-between px-6 py-4 shrink-0 pt-safe">
      <h1
        className="text-[24px] font-extrabold leading-8 text-on-surface"
        style={{ fontVariationSettings: FONT_VAR }}
      >
        {title}
      </h1>
      <button
        className="flex items-center justify-center p-2 bg-surface border border-outline rounded-sm"
        aria-label="More options"
      >
        <span className="material-icons text-base leading-none text-on-surface">more_vert</span>
      </button>
    </header>
  );
}
