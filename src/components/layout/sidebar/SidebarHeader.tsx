
import { LayoutDashboard } from "lucide-react";

interface SidebarHeaderProps {
  systemName: string;
  logo: string | null;
}

export function SidebarHeader({ systemName, logo }: SidebarHeaderProps) {
  return (
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
  );
}
