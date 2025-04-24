
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

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  ClipboardList,
  CheckSquare,
  Settings,
};

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const { sidebarItems, loading } = useSidebarPreferences();
  const [systemName, setSystemName] = useState("GalionTek");
  const [logoUrl, setLogoUrl] = useState("");
  const [loadingPreferences, setLoadingPreferences] = useState(true);

  useEffect(() => {
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
    
    const updateFavicon = (url: string) => {
      const link = document.querySelector("link[rel~='icon']");
      if (link) {
        link.setAttribute('href', url);
      }
    };
    
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

  const visibleItems = sidebarItems.filter(item => item.visible);

  return (
    <>
      <div className="flex items-center justify-between p-4 lg:hidden bg-primary">
        <div className="flex items-center gap-2">
          {loadingPreferences ? (
            <div className="h-8 w-8 rounded-full bg-primary-foreground/20 animate-pulse"></div>
          ) : (
            <Avatar className="h-8 w-8">
              <AvatarImage src={logoUrl} alt="System Logo" />
              <AvatarFallback>{systemName.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <h1 className="text-xl font-bold text-white">
            {loadingPreferences ? 
              <div className="h-6 w-24 bg-primary-foreground/20 animate-pulse rounded"></div> : 
              systemName
            }
          </h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-white hover:bg-primary/90">
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      <div
        className={cn(
          "bg-sidebar fixed h-full w-64 hidden lg:block shadow-lg z-20",
          "transition-all duration-300 ease-in-out"
        )}
      >
        <div className="p-5">
          <div className="flex items-center gap-3">
            {loadingPreferences ? (
              <div className="h-10 w-10 rounded-full bg-sidebar-foreground/20 animate-pulse"></div>
            ) : (
              <Avatar className="h-10 w-10">
                <AvatarImage src={logoUrl} alt="System Logo" />
                <AvatarFallback>{systemName.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <h1 className="text-2xl font-bold text-white">
              {loadingPreferences ? 
                <div className="h-7 w-32 bg-sidebar-foreground/20 animate-pulse rounded"></div> : 
                systemName
              }
            </h1>
          </div>
        </div>
        <nav className="px-3 flex flex-col justify-between h-[calc(100%-5rem)]">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-sidebar-foreground" />
            </div>
          ) : (
            <ul className="space-y-2">
              {visibleItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const displayTitle = item.customTitle || item.title;
                
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-white"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                      onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{displayTitle}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          
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
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30">
          <div className="fixed inset-0 z-40">
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-sidebar overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {loadingPreferences ? (
                    <div className="h-8 w-8 rounded-full bg-sidebar-foreground/20 animate-pulse"></div>
                  ) : (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={logoUrl} alt="System Logo" />
                      <AvatarFallback>{systemName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <h2 className="text-xl font-bold text-white">
                    {loadingPreferences ? 
                      <div className="h-6 w-24 bg-sidebar-foreground/20 animate-pulse rounded"></div> : 
                      systemName
                    }
                  </h2>
                </div>
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
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-sidebar-foreground" />
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {visibleItems.map((item) => {
                      const isActive = location.pathname === item.href;
                      const Icon = iconMap[item.icon] || LayoutDashboard;
                      const displayTitle = item.customTitle || item.title;
                      
                      return (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                              isActive
                                ? "bg-sidebar-accent text-white"
                                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                            )}
                            onClick={toggleMobileMenu}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{displayTitle}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="mt-auto pt-4">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 ml-2" />
                    התנתק
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
