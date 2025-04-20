
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "./sidebar/Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [systemName, setSystemName] = useState("GalionTek");
  const [systemLogo, setSystemLogo] = useState<string | null>(null);

  const fetchUserPreferences = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found, using default system name");
        return;
      }

      console.log("Fetching user preferences for layout");

      const { data, error } = await supabase
        .from('user_preferences')
        .select('system_name, logo_url')
        .eq('user_id', session.user.id)
        .limit(1);

      if (error) {
        console.error("Error fetching user preferences:", error);
        throw error;
      }
      
      console.log("Layout preferences data:", data);
      
      if (data && data.length > 0) {
        if (data[0].system_name) {
          console.log("Setting system name to:", data[0].system_name);
          setSystemName(data[0].system_name);
          
          localStorage.setItem("system_name", data[0].system_name);
          document.title = data[0].system_name + " - ניהול מרצים ומנחי סדנאות";
        }
        
        if (data[0].logo_url) {
          console.log("Setting system logo to:", data[0].logo_url);
          setSystemLogo(data[0].logo_url);
        }
      }
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
    
    const savedName = localStorage.getItem("system_name");
    if (savedName) {
      setSystemName(savedName);
      document.title = savedName + " - ניהול מרצים ומנחי סדנאות";
    }
    
    fetchUserPreferences();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "system_name" && e.newValue) {
        setSystemName(e.newValue);
        document.title = e.newValue + " - ניהול מרצים ומנחי סדנאות";
      }
    };
    
    const handleCustomEvent = (e: CustomEvent<{systemName: string}>) => {
      console.log("Received system-name-updated event:", e.detail);
      setSystemName(e.detail.systemName);
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("system-name-updated", handleCustomEvent as EventListener);
    
    const authSubscription = supabase.auth.onAuthStateChange(() => {
      fetchUserPreferences();
    });
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("system-name-updated", handleCustomEvent as EventListener);
      authSubscription.data.subscription.unsubscribe();
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar 
        systemName={systemName} 
        systemLogo={systemLogo} 
      />
      <main
        className={cn(
          "flex-1 transition-all",
          isMobile ? "pt-16" : "lg:mr-64"
        )}
      >
        <div className="container mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
