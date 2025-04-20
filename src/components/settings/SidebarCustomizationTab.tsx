
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Undo } from "lucide-react";
import { SidebarItemCard } from "./sidebar/SidebarItemCard";
import { useSidebarCustomization } from "./sidebar/useSidebarCustomization";

export function SidebarCustomizationTab() {
  const {
    sidebarItems,
    setSidebarItems,
    loading,
    saving,
    savePreferences,
    resetToDefault,
    updateItemTitle,
    toggleItemVisibility
  } = useSidebarCustomization();

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    
    if (!destination) return;
    if (destination.index === source.index) return;
    
    const items = Array.from(sidebarItems);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    
    setSidebarItems(items);
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
                      >
                        <SidebarItemCard
                          item={item}
                          index={index}
                          dragHandleProps={provided.dragHandleProps}
                          onTitleChange={updateItemTitle}
                          onToggleVisibility={toggleItemVisibility}
                        />
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
