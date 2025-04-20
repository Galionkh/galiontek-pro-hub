
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarItem } from "@/components/settings/SidebarCustomizationTab";

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

  useEffect(() => {
    const fetchSidebarPreferences = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          console.log("No session found, using default sidebar items");
          setSidebarItems([...defaultSidebarItems]);
          setLoading(false);
          return;
        }

        console.log("Fetching sidebar preferences for user:", session.user.id);
        
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching sidebar preferences:", error);
          throw error;
        }
        
        console.log("Fetched user preferences data:", data);

        // Check if we have valid data with sidebar_items
        if (data && data.length > 0 && data[0].sidebar_items && Array.isArray(data[0].sidebar_items) && data[0].sidebar_items.length > 0) {
          const userPreferences = data[0];
          
          console.log("User preferences found:", userPreferences);
          console.log("Sidebar items from DB:", userPreferences.sidebar_items);
          
          // Map the items to ensure proper typing
          const typedItems = userPreferences.sidebar_items.map((item: any) => ({
            id: String(item.id || ''),
            title: String(item.title || ''),
            href: String(item.href || ''),
            icon: String(item.icon || ''),
            visible: Boolean(item.visible),
            customTitle: item.customTitle ? String(item.customTitle) : undefined
          })) as SidebarItem[];
              
          console.log("Processed sidebar items:", typedItems);
          setSidebarItems(typedItems);
        } else {
          // If no data, empty array, or invalid format, use default values
          console.log("No valid sidebar items found, using defaults");
          setSidebarItems([...defaultSidebarItems]);
        }
      } catch (err) {
        console.error("Error loading sidebar preferences:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        // Always fall back to default items on error
        setSidebarItems([...defaultSidebarItems]);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarPreferences();

    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchSidebarPreferences();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    sidebarItems,
    loading,
    error,
  };
}
