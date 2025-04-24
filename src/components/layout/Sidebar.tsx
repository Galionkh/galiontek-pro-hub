import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Calendar,
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  CheckSquare,
  Settings,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { useSidebarPreferences } from "@/hooks/useSidebarPreferences";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SystemLogo } from "./sidebar/SystemLogo";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { NavigationList } from "./sidebar/NavigationList";
import { LogoutButton } from "./sidebar/LogoutButton";
import { MobileMenu } from "./sidebar/MobileMenu";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [systemName, setSystemName] = useState("GalionTek");
  const [logoUrl, setLogoUrl] = useState("");
  const [loadingPreferences, setLoadingPreferences] = useState(true);

  const updateFavicon = (url: string) => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.setAttribute('href', url);
    }
  };

  const loadSystemPreferences = async () => {
    try {
      setLoadingPreferences(true);
      
      // First check localStorage for faster initial load
      const storedName = localStorage.getItem('systemName');
      const storedLogo = localStorage.getItem('logoUrl');
      
      if (storedName) {
        setSystemName(storedName);
        document.title = storedName;
      }
      
      if (storedLogo) {
        setLogoUrl(storedLogo);
        updateFavicon(storedLogo);
      }
      
      // Then check Supabase for up-to-date data
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoadingPreferences(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('system_name, logo_url')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error loading system preferences:", error);
        setLoadingPreferences(false);
        return;
      }
        
      if (data) {
        if (data.system_name) {
          setSystemName(data.system_name);
          document.title = data.system_name;
          localStorage.setItem('systemName', data.system_name);
        }
        
        if (data.logo_url) {
          setLogoUrl(data.logo_url);
          updateFavicon(data.logo_url);
          localStorage.setItem('logoUrl', data.logo_url);
        } else if (data.logo_url === null && storedLogo) {
          // If logo was removed in database but still in localStorage
          setLogoUrl('');
          localStorage.removeItem('logoUrl');
          updateFavicon('/favicon.svg');
        }
      }
      setLoadingPreferences(false);
    } catch (err) {
      console.error("Error in loadSystemPreferences:", err);
      setLoadingPreferences(false);
    }
  };

  useEffect(() => {
    loadSystemPreferences();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      loadSystemPreferences();
    });

    // Listen for preference changes through database
    const prefsChannel = supabase
      .channel('user_preferences_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_preferences' 
        }, 
        () => {
          loadSystemPreferences();
        }
      )
      .subscribe();
      
    // Listen for broadcast updates
    const broadcastChannel = supabase.channel('system-updates')
      .on('broadcast', { event: 'system_name_update' }, (payload) => {
        const newSystemName = payload.payload.system_name;
        setSystemName(newSystemName);
        document.title = newSystemName;
        localStorage.setItem('systemName', newSystemName);
      })
      .on('broadcast', { event: 'logo_update' }, (payload) => {
        const newLogoUrl = payload.payload.logo_url;
        setLogoUrl(newLogoUrl || '');
        
        if (newLogoUrl) {
          updateFavicon(newLogoUrl);
          localStorage.setItem('logoUrl', newLogoUrl);
        } else {
          updateFavicon('/favicon.svg');
          localStorage.removeItem('logoUrl');
        }
      })
      .subscribe();

    return () => {
      authListener?.subscription.unsubscribe();
      supabase.removeChannel(prefsChannel);
      supabase.removeChannel(broadcastChannel);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 lg:hidden bg-primary">
        <div className="flex items-center gap-2">
          <SystemLogo
            systemName={systemName}
            logoUrl={logoUrl}
            loading={loadingPreferences}
          />
          <h1 className="text-xl font-bold text-white">
            {loadingPreferences ? (
              <div className="h-6 w-24 bg-primary-foreground/20 animate-pulse rounded" />
            ) : (
              systemName
            )}
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="text-white hover:bg-primary/90"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="bg-sidebar fixed h-full w-64 hidden lg:block shadow-lg z-20">
        <SidebarHeader
          systemName={systemName}
          logoUrl={logoUrl}
          loadingPreferences={loadingPreferences}
        />
        <nav className="px-3 flex flex-col justify-between h-[calc(100%-5rem)]">
          <NavigationList />
          <LogoutButton />
        </nav>
      </div>

      <MobileMenu
        systemName={systemName}
        logoUrl={logoUrl}
        loadingPreferences={loadingPreferences}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
    </>
  );
}
