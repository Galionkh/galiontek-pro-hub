
import { useEffect, useState } from "react";
import { SystemLogo } from "./SystemLogo";

interface SidebarHeaderProps {
  systemName: string;
  logoUrl: string;
  loadingPreferences: boolean;
}

export const SidebarHeader = ({ systemName, logoUrl, loadingPreferences }: SidebarHeaderProps) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state when props change
  useEffect(() => {
    setHasError(false);
  }, [systemName, logoUrl]);

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
        <h1 className="text-2xl font-bold text-white">
          {loadingPreferences ? (
            <div className="h-7 w-32 bg-sidebar-foreground/20 animate-pulse rounded" />
          ) : (
            displayName
          )}
        </h1>
      </div>
    </div>
  );
};
