
import { X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarPreferences } from "@/hooks/useSidebarPreferences";

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export function MobileMenu({ isMobileMenuOpen, toggleMobileMenu }: MobileMenuProps) {
  const { systemName, logoUrl } = useSidebarPreferences();

  return (
    <div className="flex items-center justify-between p-4 lg:hidden bg-primary">
      <div className="flex items-center gap-2">
        {logoUrl && (
          <img src={logoUrl} alt="לוגו" className="h-8 w-8 object-contain" />
        )}
        <h1 className="text-xl font-bold text-white">{systemName || "GalionTek"}</h1>
      </div>
      <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-white hover:bg-primary/90">
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
