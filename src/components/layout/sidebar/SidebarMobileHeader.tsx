
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarMobileHeaderProps {
  systemName: string;
  logo: string | null;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export function SidebarMobileHeader({ 
  systemName, 
  logo, 
  isMobileMenuOpen, 
  toggleMobileMenu 
}: SidebarMobileHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 lg:hidden bg-primary">
      <div className="flex items-center gap-2">
        {logo ? (
          <img 
            src={logo} 
            alt={`${systemName} לוגו`} 
            className="h-8 w-8 rounded-md object-contain" 
          />
        ) : null}
        <h1 className="text-xl font-bold text-white">{systemName}</h1>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMobileMenu} 
        className="text-white hover:bg-primary/90"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
