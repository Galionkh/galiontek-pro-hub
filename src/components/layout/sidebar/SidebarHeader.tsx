
import { SystemLogo } from "./SystemLogo";

interface SidebarHeaderProps {
  systemName: string;
  logoUrl: string;
  loadingPreferences: boolean;
}

export const SidebarHeader = ({ systemName, logoUrl, loadingPreferences }: SidebarHeaderProps) => {
  return (
    <div className="p-5">
      <div className="flex items-center gap-3">
        <SystemLogo 
          systemName={systemName}
          logoUrl={logoUrl}
          loading={loadingPreferences}
        />
        <h1 className="text-2xl font-bold text-white">
          {loadingPreferences ? (
            <div className="h-7 w-32 bg-sidebar-foreground/20 animate-pulse rounded" />
          ) : (
            systemName || "GalionTek"
          )}
        </h1>
      </div>
    </div>
  );
};
