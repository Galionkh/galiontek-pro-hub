
import { useEffect, useState } from "react";
import { SystemLogo } from "./SystemLogo";
import { toast } from "@/components/ui/use-toast";
import { AlertTriangle } from "lucide-react";

interface SidebarHeaderProps {
  systemName: string;
  logoUrl: string;
  loadingPreferences: boolean;
}

export const SidebarHeader = ({ systemName, logoUrl, loadingPreferences }: SidebarHeaderProps) => {
  const [hasError, setHasError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Reset error state when props change
  useEffect(() => {
    setHasError(false);
    
    // Check if there's a problem with system name after loading
    if (!loadingPreferences && !systemName) {
      setShowWarning(true);
      
      // Show warning toast only once
      const toastShown = sessionStorage.getItem('system-name-warning-shown');
      if (!toastShown) {
        toast({
          title: "שם המערכת לא נטען",
          description: "נמשך שימוש בשם ברירת המחדל עד להתחברות מחדש למסד הנתונים",
          variant: "warning",
          duration: 5000,
        });
        sessionStorage.setItem('system-name-warning-shown', 'true');
      }
    } else {
      setShowWarning(false);
    }
  }, [systemName, logoUrl, loadingPreferences]);

  // Fallback system name in case of errors
  const displayName = hasError || !systemName ? "GalionTek" : systemName;

  return (
    <div className="p-5">
      <div className="flex items-center gap-3">
        <SystemLogo 
          systemName={displayName}
          logoUrl={logoUrl}
          loading={loadingPreferences}
        />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white">
            {loadingPreferences ? (
              <div className="h-7 w-32 bg-sidebar-foreground/20 animate-pulse rounded" />
            ) : (
              displayName
            )}
          </h1>
          {showWarning && (
            <div className="flex items-center gap-1 text-yellow-300 text-xs mt-1">
              <AlertTriangle className="h-3 w-3" />
              <span>מצב לא מקוון</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
