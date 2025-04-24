
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarItem } from "@/components/settings/SidebarCustomizationTab";
import { LayoutDashboard } from "lucide-react";
import { iconMap } from "./iconMap";

interface NavigationItemProps {
  item: SidebarItem;
  isActive: boolean;
  onItemClick?: () => void;
}

export const NavigationItem = ({ item, isActive, onItemClick }: NavigationItemProps) => {
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
        onClick={onItemClick}
      >
        <Icon className="h-5 w-5" />
        <span>{displayTitle}</span>
      </Link>
    </li>
  );
};
