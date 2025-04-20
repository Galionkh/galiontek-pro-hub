
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "./types";

const defaultMenuItems: MenuItem[] = [
  { id: "dashboard", defaultTitle: "דשבורד", href: "/", customTitle: "" },
  { id: "calendar", defaultTitle: "יומן", href: "/calendar", customTitle: "" },
  { id: "clients", defaultTitle: "לקוחות", href: "/clients", customTitle: "" },
  { id: "finances", defaultTitle: "כספים", href: "/finances", customTitle: "" },
  { id: "orders", defaultTitle: "הזמנות", href: "/orders", customTitle: "" },
  { id: "tasks", defaultTitle: "משימות", href: "/tasks", customTitle: "" },
  { id: "settings", defaultTitle: "הגדרות", href: "/settings", customTitle: "" }
];

export function useMenuSettings() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenuSettings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('user_preferences')
          .select('sidebar_items')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;

        if (data?.sidebar_items) {
          // Check if sidebar_items contains menu customizations
          const sidebarItems = data.sidebar_items;
          
          if (Array.isArray(sidebarItems) && sidebarItems.length > 0) {
            // Try to find menu customizations in the sidebar_items
            const menuCustomizations = sidebarItems
              .filter(item => 
                typeof item === 'object' && 
                item !== null && 
                'id' in item && 
                'defaultTitle' in item && 
                'href' in item
              )
              .map(item => {
                // Safely cast the item to a record with string keys
                const typedItem = item as Record<string, any>;
                
                return {
                  id: String(typedItem.id || ''),
                  defaultTitle: String(typedItem.defaultTitle || ''),
                  href: String(typedItem.href || ''),
                  customTitle: typedItem.customTitle ? String(typedItem.customTitle) : ''
                } as MenuItem;
              });
            
            if (menuCustomizations.length > 0) {
              setMenuItems(menuCustomizations);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching menu settings:', error);
      }
    };

    fetchMenuSettings();
  }, []);

  const updateItem = (index: number, updatedItem: MenuItem) => {
    const newItems = [...menuItems];
    newItems[index] = updatedItem;
    setMenuItems(newItems);
  };

  const saveChanges = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Convert MenuItems to a compatible JSON object
      const jsonMenuItems = menuItems.map(item => ({
        id: item.id,
        defaultTitle: item.defaultTitle,
        href: item.href,
        customTitle: item.customTitle
      }));

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          sidebar_items: jsonMenuItems,
        });

      if (error) throw error;

      toast({
        title: "השינויים נשמרו בהצלחה",
        description: "הגדרות התפריט עודכנו",
      });
    } catch (error) {
      console.error('Error saving menu settings:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בשמירת השינויים",
        description: "אירעה שגיאה בעת שמירת הגדרות התפריט",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    menuItems,
    updateItem,
    saveChanges,
    loading
  };
}
