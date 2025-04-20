
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSidebarMobile } from "@/hooks/useSidebarMobile";
import { useSidebarLogout } from "@/hooks/useSidebarLogout";
import { useSidebarPreferences } from "@/hooks/useSidebarPreferences";
import { SidebarMobileHeader } from "./SidebarMobileHeader";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { LogoutButton } from "./LogoutButton";
import { SidebarMobileOverlay } from "./SidebarMobileOverlay";

interface SidebarProps {
  systemName: string;
  systemLogo: string | null;
}

export default function Sidebar({ systemName, systemLogo }: SidebarProps) {
  const { isMobileMenuOpen, toggleMobileMenu } = useSidebarMobile();
  const { isLoggingOut, handleLogout } = useSidebarLogout();
  const { sidebarItems, loading } = useSidebarPreferences();

  return (
    <>
      <SidebarMobileHeader 
        systemName={systemName}
        logo={systemLogo}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />

      <div
        className={cn(
          "bg-sidebar fixed h-full w-64 hidden lg:block shadow-lg z-20",
          "transition-all duration-300 ease-in-out"
        )}
      >
        <SidebarHeader systemName={systemName} logo={systemLogo} />
        <nav className="px-3 flex flex-col justify-between h-[calc(100%-5rem)]">
          <SidebarNavigation items={sidebarItems} loading={loading} />
          <LogoutButton onLogout={handleLogout} isLoading={isLoggingOut} />
        </nav>
      </div>

      <SidebarMobileOverlay
        systemName={systemName}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        items={sidebarItems}
        loading={loading}
      />
    </>
  );
}
