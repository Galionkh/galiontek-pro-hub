
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarItem } from "@/components/settings/SidebarCustomizationTab";
import { toast } from "@/components/ui/use-toast";

export const defaultSidebarItems: SidebarItem[] = [
  { id: "dashboard", title: "דשבורד", href: "/", icon: "LayoutDashboard", visible: true },
  { id: "calendar", title: "יומן", href: "/calendar", icon: "Calendar", visible: true },
  { id: "clients", title: "לקוחות", href: "/clients", icon: "Users", visible: true },
  { id: "finances", title: "כספים", href: "/finances", icon: "FileText", visible: true },
  { id: "orders", title: "הזמנות", href: "/orders", icon: "ClipboardList", visible: true },
  { id: "tasks", title: "משימות", href: "/tasks", icon: "CheckSquare", visible: true },
  { id: "settings", title: "הגדרות", href: "/settings", icon: "Settings", visible: true },
];

export function useSidebarPreferences() {
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([...defaultSidebarItems]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchSidebarPreferences = async () => {
      try {
        setLoading(true);
        
        // Get session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Auth error:", sessionError);
          throw sessionError;
        }

        if (!sessionData?.session) {
          console.log("No active session, using default sidebar items");
          setSidebarItems([...defaultSidebarItems]);
          setLoading(false);
          return;
        }

        // Get the most recent preference record for this user
        const { data, error: prefsError } = await supabase
          .from('user_preferences')
          .select('sidebar_items')
          .eq('user_id', sessionData.session.user.id)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (prefsError) {
          console.error("Database error:", prefsError);
          throw prefsError;
        }

        // If no data found or empty sidebar_items, use defaults
        if (!data || data.length === 0 || !data[0].sidebar_items || data[0].sidebar_items.length === 0) {
          console.log('No sidebar preferences found or empty, using defaults');
          setSidebarItems([...defaultSidebarItems]);
        } else {
          // Use the first (most recent) record
          const preferences = data[0];

          // Type assertion to ensure we have a SidebarItem array
          const typedItems = Array.isArray(preferences.sidebar_items) 
            ? preferences.sidebar_items.map((item: any) => ({
                id: String(item.id || ''),
                title: String(item.title || ''),
                href: String(item.href || ''),
                icon: String(item.icon || ''),
                visible: Boolean(item.visible),
                customTitle: item.customTitle ? String(item.customTitle) : undefined
              })) as SidebarItem[]
            : [...defaultSidebarItems];
            
          setSidebarItems(typedItems);
        }
      } catch (err) {
        console.error("Error loading sidebar preferences:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setSidebarItems([...defaultSidebarItems]);
        
        // Retry up to 3 times with increasing delays
        if (retryCount < 3) {
          const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`Retrying in ${retryDelay}ms...`);
          
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, retryDelay);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarPreferences();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setRetryCount(0); // Reset retry count on auth change
      fetchSidebarPreferences();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [retryCount]);

  return {
    sidebarItems,
    loading,
    error,
  };
}
