
import { LayoutDashboard } from "lucide-react";
import { SidebarNavigation } from "./SidebarNavigation";
import { LogoutButton } from "./LogoutButton";

interface SidebarStructureProps {
  systemName: string;
  logo: string | null;
  items: any[];
  loading: boolean;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

export function SidebarStructure({
  systemName,
  logo,
  items,
  loading,
  onLogout,
  isLoggingOut
}: SidebarStructureProps) {
  return (
    <div className="bg-sidebar fixed h-full w-64 hidden lg:block shadow-lg z-20">
      <div className="p-5 flex items-center gap-3">
        {logo ? (
          <img 
            src={logo} 
            alt={`${systemName} לוגו`} 
            className="h-10 w-10 rounded-md object-contain" 
          />
        ) : (
          <LayoutDashboard className="h-8 w-8 text-white" />
        )}
        <h1 className="text-2xl font-bold text-white">{systemName}</h1>
      </div>
      <nav className="px-3 flex flex-col justify-between h-[calc(100%-5rem)]">
        <SidebarNavigation items={items} loading={loading} />
        <LogoutButton onLogout={onLogout} isLoading={isLoggingOut} />
      </nav>
    </div>
  );
}
