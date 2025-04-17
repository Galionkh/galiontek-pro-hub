
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
          setSidebarItems([...defaultSidebarItems]);
          return;
        }

        const { data, error } = await supabase
          .from('user_preferences')
          .select('sidebar_items')
          .maybeSingle();

        if (error) throw error;

        if (data && data.sidebar_items && Array.isArray(data.sidebar_items)) {
          setSidebarItems(data.sidebar_items);
        } else {
          setSidebarItems([...defaultSidebarItems]);
        }
      } catch (err) {
        console.error("Error loading sidebar preferences:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setSidebarItems([...defaultSidebarItems]);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarPreferences();

    // Set up auth state change listener
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
