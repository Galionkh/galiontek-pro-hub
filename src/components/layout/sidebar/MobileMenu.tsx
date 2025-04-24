
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SystemLogo } from "./SystemLogo";
import { NavigationList } from "./NavigationList";
import { LogoutButton } from "./LogoutButton";

interface MobileMenuProps {
  systemName: string;
  logoUrl: string;
  loadingPreferences: boolean;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export const MobileMenu = ({
  systemName,
  logoUrl,
  loadingPreferences,
  isMobileMenuOpen,
  toggleMobileMenu,
}: MobileMenuProps) => {
  if (!isMobileMenuOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30">
      <div className="fixed inset-0 z-40">
        <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-sidebar overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SystemLogo
                systemName={systemName}
                logoUrl={logoUrl}
                loading={loadingPreferences}
              />
              <h2 className="text-xl font-bold text-white">
                {loadingPreferences ? (
                  <div className="h-6 w-24 bg-sidebar-foreground/20 animate-pulse rounded" />
                ) : (
                  systemName
                )}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-white hover:bg-primary/90"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex flex-col justify-between h-[calc(100%-4rem)]">
            <NavigationList onItemClick={toggleMobileMenu} />
            <LogoutButton />
          </nav>
        </div>
      </div>
    </div>
  );
};
