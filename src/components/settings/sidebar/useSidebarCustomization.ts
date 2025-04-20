
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarItem } from "./types";
import { defaultSidebarItems } from "@/hooks/useSidebarPreferences";

export function useSidebarCustomization() {
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([...defaultSidebarItems]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found, using default sidebar items");
          return;
        }
        
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', session.user.id)
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setPreferenceId(data[0].id);
          
          if (Array.isArray(data[0].sidebar_items)) {
            const typedItems = data[0].sidebar_items.map((item: any) => ({
              id: String(item.id || ''),
              title: String(item.title || ''),
              href: String(item.href || ''),
              icon: String(item.icon || ''),
              visible: Boolean(item.visible),
              customTitle: item.customTitle ? String(item.customTitle) : undefined
            })) as SidebarItem[];
              
            setSidebarItems(typedItems);
          } else {
            setSidebarItems([...defaultSidebarItems]);
          }
        } else {
          setSidebarItems([...defaultSidebarItems]);
        }
      } catch (error) {
        console.error('Error fetching sidebar preferences:', error);
        toast({
          variant: "destructive",
          title: "שגיאה בטעינת העדפות",
          description: "אירעה שגיאה בטעינת העדפות תפריט הניווט שלך",
        });
        setSidebarItems([...defaultSidebarItems]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPreferences();
  }, []);

  const savePreferences = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "לא מחובר",
          description: "אנא התחבר כדי לשמור את ההעדפות שלך",
        });
        return;
      }
      
      const userId = session.user.id;
      
      if (preferenceId) {
        const { error } = await supabase
          .from('user_preferences')
          .update({
            sidebar_items: sidebarItems,
            updated_at: new Date().toISOString(),
          })
          .eq('id', preferenceId);
          
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            sidebar_items: sidebarItems,
          })
          .select()
          .limit(1);
          
        if (error) throw error;
        if (data && data.length > 0) {
          setPreferenceId(data[0].id);
        }
      }
      
      toast({
        title: "נשמר בהצלחה",
        description: "העדפות תפריט הניווט נשמרו בהצלחה",
      });
    } catch (error) {
      console.error('Error saving sidebar preferences:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בשמירה",
        description: "אירעה שגיאה בשמירת העדפות תפריט הניווט",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    const defaultItems = JSON.parse(JSON.stringify(defaultSidebarItems));
    setSidebarItems(defaultItems);
    toast({
      title: "אופס לברירת מחדל",
      description: "תפריט הניווט אופס להגדרות ברירת המחדל. לחץ על שמור כדי לשמור את השינויים.",
    });
  };

  const updateItemTitle = (index: number, customTitle: string) => {
    const newItems = [...sidebarItems];
    newItems[index] = { ...newItems[index], customTitle };
    setSidebarItems(newItems);
  };

  const toggleItemVisibility = (index: number) => {
    const newItems = [...sidebarItems];
    newItems[index] = { ...newItems[index], visible: !newItems[index].visible };
    setSidebarItems(newItems);
  };

  return {
    sidebarItems,
    setSidebarItems,
    loading,
    saving,
    savePreferences,
    resetToDefault,
    updateItemTitle,
    toggleItemVisibility
  };
}
