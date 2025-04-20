
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNavigation } from "./SidebarNavigation";
import { LogoutButton } from "./LogoutButton";

interface MobileMenuProps {
  systemName: string;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
  items: any[];
  loading: boolean;
}

export function MobileMenu({
  systemName,
  isOpen,
  onClose,
  onLogout,
  isLoggingOut,
  items,
  loading
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30">
      <div className="fixed inset-0 z-40">
        <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-sidebar overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">{systemName}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-primary/90"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex flex-col justify-between h-[calc(100%-4rem)]">
            <SidebarNavigation 
              items={items} 
              loading={loading} 
              onItemClick={onClose}
            />
            <LogoutButton onLogout={onLogout} isLoading={isLoggingOut} />
          </nav>
        </div>
      </div>
    </div>
  );
}
