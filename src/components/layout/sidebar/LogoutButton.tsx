
import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  onLogout: () => Promise<void>;
  isLoading?: boolean;
}

export function LogoutButton({ onLogout, isLoading = false }: LogoutButtonProps) {
  return (
    <div className="px-3 pb-5 mt-auto">
      <Button 
        variant="ghost" 
        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"
        onClick={onLogout}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <LogOut className="h-5 w-5 mr-2" />
        )}
        <span>התנתק</span>
      </Button>
    </div>
  );
}
