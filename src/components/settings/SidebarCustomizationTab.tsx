import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Save, Loader2, Undo, GripVertical, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { defaultSidebarItems } from "@/hooks/useSidebarPreferences";

export type SidebarItem = {
  id: string;
  title: string;
  href: string;
  icon: string;
  visible: boolean;
  customTitle?: string;
};

export type SidebarPreferences = {
  id?: string;
  user_id?: string;
  sidebar_items: SidebarItem[];
  created_at?: string;
  updated_at?: string;
};

export function SidebarCustomizationTab() {
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([...defaultSidebarItems]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  // Fetch user's sidebar preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found, using default sidebar items");
          return;
        }
        
        console.log("Fetching sidebar preferences for customization tab");
        
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', session.user.id)
          .limit(1);
        
        if (error) {
          console.error("Error fetching sidebar preferences:", error);
          throw error;
        }
        
        console.log("Fetched user_preferences data:", data);
        
        if (data && data.length > 0) {
          setPreferenceId(data[0].id);
          
          // Ensure proper typing of the data from the database
          if (Array.isArray(data[0].sidebar_items)) {
            console.log("Found sidebar_items:", data[0].sidebar_items);
            
            const typedItems = data[0].sidebar_items.map((item: any) => ({
              id: String(item.id || ''),
              title: String(item.title || ''),
              href: String(item.href || ''),
              icon: String(item.icon || ''),
              visible: Boolean(item.visible),
              customTitle: item.customTitle ? String(item.customTitle) : undefined
            })) as SidebarItem[];
              
            console.log("Processed items for customization:", typedItems);
            setSidebarItems(typedItems);
          } else {
            console.warn("sidebar_items is not an array, using defaults");
            setSidebarItems([...defaultSidebarItems]);
          }
        } else {
          console.log("No preferences found, using defaults");
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

  // Handle saving preferences
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
      console.log("Saving sidebar preferences for user:", userId);
      console.log("Items to save:", sidebarItems);
      
      if (preferenceId) {
        // Update existing preferences
        console.log("Updating existing preferences with ID:", preferenceId);
        const { error } = await supabase
          .from('user_preferences')
          .update({
            sidebar_items: sidebarItems,
            updated_at: new Date().toISOString(),
          })
          .eq('id', preferenceId);
          
        if (error) {
          console.error("Error updating preferences:", error);
          throw error;
        }
      } else {
        // Create new preferences
        console.log("Creating new preferences for user:", userId);
        const { data, error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            sidebar_items: sidebarItems,
          })
          .select()
          .limit(1);
          
        if (error) {
          console.error("Error creating preferences:", error);
          throw error;
        }
        if (data && data.length > 0) {
          console.log("New preferences created with ID:", data[0].id);
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

  // Reset to default sidebar items
  const resetToDefault = () => {
    setSidebarItems([...defaultSidebarItems]);
    toast({
      title: "אופס לברירת מחדל",
        description: "תפריט הניווט אופס להגדרות ברירת המחדל. לחץ על שמור כדי לשמור את השינויים.",
    });
  };

  // Handle drag and drop
  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    
    if (!destination) return;
    if (destination.index === source.index) return;
    
    const items = Array.from(sidebarItems);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    
    setSidebarItems(items);
  };

  // Update item title
  const updateItemTitle = (index: number, customTitle: string) => {
    const newItems = [...sidebarItems];
    newItems[index] = { ...newItems[index], customTitle };
    setSidebarItems(newItems);
  };

  // Toggle item visibility
  const toggleItemVisibility = (index: number) => {
    const newItems = [...sidebarItems];
    newItems[index] = { ...newItems[index], visible: !newItems[index].visible };
    setSidebarItems(newItems);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>התאמה אישית של תפריט הניווט</CardTitle>
          <CardDescription>טוען...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>התאמה אישית של תפריט הניווט</CardTitle>
        <CardDescription>
          ניתן לשנות את סדר הפריטים ואת השמות שלהם בתפריט הניווט הצדדי
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sidebar-items">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {sidebarItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center gap-2 border rounded-md p-3 bg-background"
                      >
                        <div {...provided.dragHandleProps} className="cursor-grab">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">{item.title}</div>
                            {!item.visible && (
                              <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                מוסתר
                              </span>
                            )}
                          </div>
                          <Input
                            className="h-8"
                            placeholder={`שם מותאם אישית ל${item.title}`}
                            value={item.customTitle || ""}
                            onChange={(e) => updateItemTitle(index, e.target.value)}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleItemVisibility(index)}
                          title={item.visible ? "הסתר פריט" : "הצג פריט"}
                        >
                          {item.visible ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-current" />
                          )}
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={resetToDefault}
            className="flex items-center gap-2"
          >
            <Undo className="h-4 w-4" />
            <span>אפס לברירת מחדל</span>
          </Button>
          <Button 
            onClick={savePreferences} 
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>שמור שינויים</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
