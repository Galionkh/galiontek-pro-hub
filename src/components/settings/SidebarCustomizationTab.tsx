import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Save, Loader2, Undo, GripVertical, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

const defaultItems: SidebarItem[] = [
  { id: "dashboard", title: "דשבורד", href: "/", icon: "LayoutDashboard", visible: true },
  { id: "calendar", title: "יומן", href: "/calendar", icon: "Calendar", visible: true },
  { id: "clients", title: "לקוחות", href: "/clients", icon: "Users", visible: true },
  { id: "finances", title: "כספים", href: "/finances", icon: "FileText", visible: true },
  { id: "orders", title: "הזמנות", href: "/orders", icon: "ClipboardList", visible: true },
  { id: "tasks", title: "משימות", href: "/tasks", icon: "CheckSquare", visible: true },
  { id: "settings", title: "הגדרות", href: "/settings", icon: "Settings", visible: true },
];

export function SidebarCustomizationTab() {
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([...defaultItems]);
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
          return;
        }
        
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', session.user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setPreferenceId(data[0].id);
          
          // Ensure proper typing of the data from the database
          const typedItems = Array.isArray(data[0].sidebar_items) 
            ? data[0].sidebar_items.map((item: any) => ({
                id: String(item.id || ''),
                title: String(item.title || ''),
                href: String(item.href || ''),
                icon: String(item.icon || ''),
                visible: Boolean(item.visible),
                customTitle: item.customTitle ? String(item.customTitle) : undefined
              })) as SidebarItem[]
            : [...defaultItems];
            
          setSidebarItems(typedItems);
        }
      } catch (error) {
        console.error('Error fetching sidebar preferences:', error);
        toast({
          variant: "destructive",
          title: "שגיאה בטעינת העדפות",
          description: "אירעה שגיאה בטעינת העדפות תפריט הניווט שלך",
        });
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
      
      if (preferenceId) {
        // Update existing preferences
        const { error } = await supabase
          .from('user_preferences')
          .update({
            sidebar_items: sidebarItems,
            updated_at: new Date().toISOString(),
          })
          .eq('id', preferenceId);
          
        if (error) throw error;
      } else {
        // Create new preferences
        const { data, error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            sidebar_items: sidebarItems,
          })
          .select()
          .single();
          
        if (error) throw error;
        if (data) setPreferenceId(data.id);
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
    setSidebarItems([...defaultItems]);
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
          גרור פריטים כדי לשנות את סדר הפריטים בתפריט הניווט, שנה את השמות או הסתר פריטים
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
                        className="flex items-center gap-2 p-2 bg-background rounded-md border"
                      >
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          value={item.customTitle || item.title}
                          onChange={(e) => updateItemTitle(index, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleItemVisibility(index)}
                        >
                          {item.visible ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4 opacity-50" />
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
