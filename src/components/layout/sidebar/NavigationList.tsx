
import { useSidebarPreferences } from "@/hooks/useSidebarPreferences";
import { useLocation } from "react-router-dom";
import { NavigationItem } from "./NavigationItem";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationListProps {
  onItemClick?: () => void;
}

export const NavigationList = ({ onItemClick }: NavigationListProps) => {
  const { sidebarItems, loading, error } = useSidebarPreferences();
  const location = useLocation();
  const visibleItems = sidebarItems.filter(item => item.visible);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-sidebar-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 px-2">
        <AlertTriangle className="h-6 w-6 text-red-400" />
        <p className="text-sm text-sidebar-foreground/80 text-center">
          אירעה שגיאה בטעינת תפריט הניווט
        </p>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => window.location.reload()}
          className="mt-2 text-xs"
        >
          טען מחדש
        </Button>
      </div>
    );
  }

  if (visibleItems.length === 0) {
    return (
      <div className="py-6 px-2">
        <p className="text-sm text-sidebar-foreground/80 text-center">
          לא נמצאו פריטי ניווט
        </p>
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
