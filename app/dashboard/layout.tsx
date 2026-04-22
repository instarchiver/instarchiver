import { Sidebar } from "@/components/Sidebar";
import { SidebarCompact } from "@/components/SidebarCompact";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { MobileNavBar } from "@/components/MobileNavBar";
import { MobileTabBar } from "@/components/MobileTabBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full bg-surface">
      {/* Tablet: icon-only sidebar 78px (lg–xl) */}
      <SidebarCompact />

      {/* Desktop: full sidebar 300px (xl+) */}
      <Sidebar />

      {/* Right content column */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Desktop/tablet top bar */}
        <TopBar title="Dashboard" />

        {/* Mobile top nav */}
        <MobileNavBar subtitle="Overview" title="Dashboard" />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Desktop/tablet footer */}
        <Footer />

        {/* Mobile bottom tab bar */}
        <MobileTabBar />
      </div>
    </div>
  );
}
