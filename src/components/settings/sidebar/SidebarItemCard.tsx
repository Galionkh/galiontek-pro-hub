import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { GripVertical } from "lucide-react";
import { SidebarItem } from "./types";

interface SidebarItemCardProps {
  item: SidebarItem;
  index: number;
  dragHandleProps: any;
  onTitleChange: (index: number, title: string) => void;
  onToggleVisibility: (index: number) => void;
}

export function SidebarItemCard({
  item,
  index,
  dragHandleProps,
  onTitleChange,
  onToggleVisibility,
}: SidebarItemCardProps) {
  return (
    <div className="flex items-center gap-2 border rounded-md p-3 bg-background">
      <div {...dragHandleProps} className="cursor-grab">
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
          onChange={(e) => onTitleChange(index, e.target.value)}
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onToggleVisibility(index)}
        title={item.visible ? "הסתר פריט" : "הצג פריט"}
      >
        {item.visible ? (
          <X className="h-4 w-4" />
        ) : (
          <div className="h-4 w-4 rounded-full border border-current" />
        )}
      </Button>
    </div>
  );
}
