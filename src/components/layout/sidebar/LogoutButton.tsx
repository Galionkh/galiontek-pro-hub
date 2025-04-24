
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export const LogoutButton = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "התנתקת בהצלחה",
        description: "מקווים לראותך בקרוב!",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "שגיאה בהתנתקות",
        description: "אירעה שגיאה בעת ההתנתקות",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-3 pb-5 mt-auto">
      <Button 
        variant="ghost" 
        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 ml-2" />
        התנתק
      </Button>
    </div>
  );
};
