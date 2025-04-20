
import { useSidebarPreferences } from "@/hooks/useSidebarPreferences";

export function SidebarHeader() {
  const { systemName, logoUrl } = useSidebarPreferences();

  return (
    <div className="p-5">
      <div className="flex items-center gap-2">
        {logoUrl && (
          <img src={logoUrl} alt="לוגו" className="h-8 w-8 object-contain" />
        )}
        <h1 className="text-2xl font-bold text-white">{systemName || "GalionTek"}</h1>
      </div>
    </div>
  );
}
