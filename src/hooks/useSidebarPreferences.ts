
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

        // בקשה מעודכנת שלוקחת את כל הפריטים ובודקת עבור היוזר הנוכחי
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        // בדיקה אם יש נתונים ואם הם תקינים
        if (data && data.length > 0 && data[0].sidebar_items) {
          const userPreferences = data[0];
          
          if (Array.isArray(userPreferences.sidebar_items)) {
            // מטיפוס הנתונים לפורמט המתאים של SidebarItem
            const typedItems = userPreferences.sidebar_items.map((item: any) => ({
              id: String(item.id || ''),
              title: String(item.title || ''),
              href: String(item.href || ''),
              icon: String(item.icon || ''),
              visible: Boolean(item.visible),
              customTitle: item.customTitle ? String(item.customTitle) : undefined
            })) as SidebarItem[];
              
            setSidebarItems(typedItems);
          } else {
            // במקרה שה-sidebar_items אינו מערך חוקי
            setSidebarItems([...defaultSidebarItems]);
          }
        } else {
          // אם אין נתונים או שהפורמט לא נכון, נשתמש בערכי ברירת המחדל
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

    // הגדרת מאזין לשינויים במצב האימות
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
