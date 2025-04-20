
import { LogoutButton } from "@/components/auth/LogoutButton";

export function LogoutSection() {
  return (
    <div className="px-3 pb-5 mt-auto">
      <LogoutButton 
        variant="ghost" 
        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"
      />
    </div>
  );
}
