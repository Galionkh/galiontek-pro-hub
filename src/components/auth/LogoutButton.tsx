
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthProvider";
import { LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function LogoutButton({ 
  variant = "ghost", 
  size = "default",
  className = ""
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      toast({
        title: "התנתקת בהצלחה",
        description: "להתראות בפעם הבאה!",
      });
      navigate("/login");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "שגיאה בהתנתקות",
        description: error.message || "אירעה שגיאה בעת ההתנתקות",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          <span>התנתק</span>
        </>
      )}
    </Button>
  );
}
