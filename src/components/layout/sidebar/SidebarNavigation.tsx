
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { iconMap } from "./iconMap";
import { SidebarItem } from "@/components/settings/SidebarCustomizationTab";
import { Loader2 } from "lucide-react";
import { defaultSidebarItems } from "@/hooks/useSidebarPreferences";

interface SidebarNavigationProps {
  items: SidebarItem[];
  loading: boolean;
  onItemClick?: () => void;
}

export function SidebarNavigation({ items, loading, onItemClick }: SidebarNavigationProps) {
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-sidebar-foreground" />
      </div>
    );
  }

  // Use the provided items, but fall back to default items if they're empty
  const itemsToRender = items && items.length > 0 ? items : defaultSidebarItems;
  
  // Filter for visible items
  const visibleItems = itemsToRender.filter(item => item.visible);

  // Debug the items to see what's happening
  console.log("Sidebar navigation items:", items);
  console.log("Items to render:", itemsToRender);
  console.log("Visible items:", visibleItems);

  return (
    <ul className="space-y-2">
      {visibleItems.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = iconMap[item.icon] || iconMap.LayoutDashboard;
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
              onClick={onItemClick}
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
