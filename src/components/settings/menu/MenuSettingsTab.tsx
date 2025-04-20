
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GripVertical, Save } from "lucide-react";
import { useMenuSettings } from "./useMenuSettings";
import { MenuItem } from "./types";

export function MenuSettingsTab() {
  const { menuItems, updateItem, saveChanges, loading } = useMenuSettings();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update all items with new order
    items.forEach((item, index) => {
      updateItem(index, { ...item });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ניהול תפריט</CardTitle>
        <CardDescription>התאמה אישית של שמות ומיקום פריטי התפריט</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="menu-items">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {menuItems.map((item, index) => (
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
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-1">{item.defaultTitle}</div>
                          <Input
                            value={item.customTitle || ""}
                            onChange={(e) => updateItem(index, { 
                              ...item, 
                              customTitle: e.target.value 
                            })}
                            placeholder={`שם מותאם אישית ל${item.defaultTitle}`}
                            className="h-8"
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex justify-end">
          <Button onClick={saveChanges} disabled={loading} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            <span>{loading ? "שומר..." : "שמור שינויים"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
