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

  useEffect(() => {
    const loadSystemPreferences = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const { data, error } = await supabase
          .from('user_preferences')
          .select('system_name')
          .eq('user_id', session.user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        
        if (error) {
          console.error("Error loading system name:", error);
          return;
        }
          
        if (data && data.length > 0 && data[0].system_name) {
          setSystemName(data[0].system_name);
        }
      } catch (err) {
        console.error("Error in loadSystemPreferences:", err);
      }
    };
    
    loadSystemPreferences();
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

  const renderNavItems = (items: typeof visibleItems) => {
    return items.map((item) => {
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
    });
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 lg:hidden bg-primary">
        <h1 className="text-xl font-bold text-white">GalionTek</h1>
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
          <h1 className="text-2xl font-bold text-white mb-6">GalionTek</h1>
        </div>
        <nav className="px-3 flex flex-col justify-between h-[calc(100%-5rem)]">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-sidebar-foreground" />
            </div>
          ) : (
            <ul className="space-y-2">
              {renderNavItems(visibleItems)}
            </ul>
          )}
          
          <div className="px-3 pb-5 mt-auto">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
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
                <h2 className="text-xl font-bold text-white">GalionTek</h2>
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
                    {renderNavItems(visibleItems)}
                  </ul>
                )}
                <div className="mt-auto pt-4">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
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
