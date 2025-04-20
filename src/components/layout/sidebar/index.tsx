
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSidebarPreferences } from "@/hooks/useSidebarPreferences";
import { Header } from "./Header";
import { MobileMenu } from "./MobileMenu";
import { SidebarStructure } from "./SidebarStructure";

interface SidebarProps {
  systemName: string;
  systemLogo: string | null;
}

export default function Sidebar({ systemName, systemLogo }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sidebarItems, loading } = useSidebarPreferences();
  const [logo, setLogo] = useState<string | null>(systemLogo);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUserLogo = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('user_preferences')
          .select('logo_url')
          .eq('user_id', session.user.id)
          .limit(1);

        if (error) throw error;
        setLogo(data && data.length > 0 ? data[0].logo_url : null);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchUserLogo();
  }, []);

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
      toast({
        title: "שגיאה בהתנתקות",
        description: "אירעה שגיאה בעת ההתנתקות",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <Header 
        systemName={systemName} 
        logo={logo} 
        onToggleMobileMenu={toggleMobileMenu} 
      />
      
      <SidebarStructure 
        systemName={systemName}
        logo={logo}
        items={sidebarItems}
        loading={loading}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
      
      <MobileMenu 
        systemName={systemName}
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        items={sidebarItems}
        loading={loading}
      />
    </>
  );
}
