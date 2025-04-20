
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
          .select('menu_items')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;

        if (data?.menu_items) {
          setMenuItems(data.menu_items);
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

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          menu_items: menuItems,
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
