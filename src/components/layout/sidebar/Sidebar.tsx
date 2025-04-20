
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useSidebarPreferences, defaultSidebarItems } from "@/hooks/useSidebarPreferences";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarMobileHeader } from "./SidebarMobileHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { LogoutButton } from "./LogoutButton";

interface SidebarProps {
  systemName?: string;
  systemLogo?: string | null;
}

export default function Sidebar({ 
  systemName = "GalionTek", 
  systemLogo = null 
}: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const { sidebarItems, loading } = useSidebarPreferences();
  const [logo, setLogo] = useState<string | null>(systemLogo);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  console.log("Sidebar component rendering with items:", sidebarItems);

  useEffect(() => {
    const fetchUserLogo = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        console.log("Fetching logo for user:", session.user.id);

        const { data, error } = await supabase
          .from('user_preferences')
          .select('logo_url')
          .eq('user_id', session.user.id)
          .limit(1);

        if (error) {
          console.error("Error fetching logo:", error);
          throw error;
        }
        
        console.log("Logo fetch result:", data);
        setLogo(data && data.length > 0 ? data[0].logo_url : null);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchUserLogo();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast({
        title: "התנתקת בהצלחה",
        description: "מקווים לראותך בקרוב!",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "שגיאה בהתנתקות",
        description: "אירעה שגיאה בעת ההתנתקות",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Make sure we have items to display, use defaults as fallback
  const itemsToDisplay = sidebarItems && sidebarItems.length > 0 ? sidebarItems : defaultSidebarItems;
  console.log("Final items to be rendered:", itemsToDisplay);

  return (
    <>
      <SidebarMobileHeader 
        systemName={systemName}
        logo={logo}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />

      <div
        className={cn(
          "bg-sidebar fixed h-full w-64 hidden lg:block shadow-lg z-20",
          "transition-all duration-300 ease-in-out"
        )}
      >
        <SidebarHeader systemName={systemName} logo={logo} />
        <nav className="px-3 flex flex-col justify-between h-[calc(100%-5rem)]">
          <SidebarNavigation items={itemsToDisplay} loading={loading} />
          <LogoutButton onLogout={handleLogout} isLoading={isLoggingOut} />
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30">
          <div className="fixed inset-0 z-40">
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-sidebar overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{systemName}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileMenu}
                  className="text-white hover:bg-primary/90"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="flex flex-col justify-between h-[calc(100%-4rem)]">
                <SidebarNavigation 
                  items={itemsToDisplay} 
                  loading={loading} 
                  onItemClick={toggleMobileMenu}
                />
                <LogoutButton onLogout={handleLogout} isLoading={isLoggingOut} />
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
