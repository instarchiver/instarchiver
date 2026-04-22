import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { SidebarProvider } from "@/providers/SidebarProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-full bg-surface">
        {/* Unified collapsable sidebar — hidden on mobile, shown lg+ */}
        <Sidebar />

        {/* Right content column */}
        <div className="flex flex-col flex-1 min-w-0 h-full relative overflow-hidden">
          {/* Dynamic header (title derived from pathname) */}
          <DashboardHeader />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">{children}</main>

          {/* Desktop/tablet footer */}
          <Footer />

          {/* Mobile bottom tab bar */}
          <MobileTabBar />
        </div>
      </div>
    </SidebarProvider>
  );
}
