
import { useSidebarPreferences } from "@/hooks/useSidebarPreferences";
import { useLocation } from "react-router-dom";
import { NavigationItem } from "./NavigationItem";
import { Loader2 } from "lucide-react";

interface NavigationListProps {
  onItemClick?: () => void;
}

export const NavigationList = ({ onItemClick }: NavigationListProps) => {
  const { sidebarItems, loading } = useSidebarPreferences();
  const location = useLocation();
  const visibleItems = sidebarItems.filter(item => item.visible);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-sidebar-foreground" />
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {visibleItems.map((item) => (
        <NavigationItem
          key={item.href}
          item={item}
          isActive={location.pathname === item.href}
          onItemClick={onItemClick}
        />
      ))}
    </ul>
  );
};
