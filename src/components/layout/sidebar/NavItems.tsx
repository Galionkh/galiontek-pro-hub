
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Calendar,
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  CheckSquare,
  Settings,
} from "lucide-react";
import { useSidebarPreferences } from "@/hooks/useSidebarPreferences";
import { Loader2 } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  ClipboardList,
  CheckSquare,
  Settings,
};

interface NavItemsProps {
  isMobileMenuOpen?: boolean;
  toggleMobileMenu?: () => void;
}

export function NavItems({ isMobileMenuOpen, toggleMobileMenu }: NavItemsProps) {
  const location = useLocation();
  const { sidebarItems, loading } = useSidebarPreferences();
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-sidebar-foreground" />
      </div>
    );
  }

  const visibleItems = sidebarItems.filter(item => item.visible);

  return (
    <ul className="space-y-2">
      {visibleItems.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = iconMap[item.icon] || LayoutDashboard;
        const displayTitle = item.customTitle || item.title;
        
        return (
          <li key={item.href}>
            <Link
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                isActive
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
              onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}
            >
              <Icon className="h-5 w-5" />
              <span>{displayTitle}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
