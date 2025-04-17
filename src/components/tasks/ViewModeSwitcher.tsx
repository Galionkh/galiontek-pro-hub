
import { Calendar as CalendarIcon, ListIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ViewModeSwitcherProps {
  viewMode: "list" | "calendar";
  onViewModeChange: (mode: "list" | "calendar") => void;
}

export function ViewModeSwitcher({ viewMode, onViewModeChange }: ViewModeSwitcherProps) {
  return (
    <Tabs 
      defaultValue={viewMode} 
      value={viewMode}
      onValueChange={(value) => onViewModeChange(value as "list" | "calendar")}
    >
      <TabsList>
        <TabsTrigger value="list" className="flex items-center gap-2">
          <ListIcon className="h-4 w-4" />
          <span className="hidden sm:inline">רשימה</span>
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span className="hidden sm:inline">לוח שנה</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
