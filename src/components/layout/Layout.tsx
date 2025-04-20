
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [systemName, setSystemName] = useState("GalionTek");
  const [systemLogo, setSystemLogo] = useState<string | null>(null);

  // Prevent hydration mismatch and load system name
  useEffect(() => {
    setMounted(true);
    
    // עדכון שם המערכת מ-localStorage
    const savedName = localStorage.getItem("system_name");
    if (savedName) {
      setSystemName(savedName);
      document.title = savedName + " - ניהול מרצים ומנחי סדנאות";
    }
    
    const fetchUserPreferences = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Fixed: Changed .single() to .limit(1) to prevent multiple rows error
        const { data, error } = await supabase
          .from('user_preferences')
          .select('system_name, logo_url')
          .eq('user_id', session.user.id)
          .limit(1);

        if (error) throw error;
        
        if (data && data.length > 0) {
          if (data[0].system_name) setSystemName(data[0].system_name);
          if (data[0].logo_url) setSystemLogo(data[0].logo_url);
        }
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
    };

    fetchUserPreferences();
    
    // האזנה לשינויים ב-localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "system_name" && e.newValue) {
        setSystemName(e.newValue);
        document.title = e.newValue + " - ניהול מרצים ומנחי סדנאות";
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
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
