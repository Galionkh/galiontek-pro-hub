
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useState } from "react";
import { CreateTaskForm } from "@/components/tasks/CreateTaskForm";
import { ViewModeSwitcher } from "./ViewModeSwitcher";

interface TasksHeaderProps {
  viewMode: "list" | "calendar";
  onViewModeChange: (mode: "list" | "calendar") => void;
}

export function TasksHeader({ viewMode, onViewModeChange }: TasksHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">משימות</h1>
      <div className="flex gap-2">
        <ViewModeSwitcher 
          viewMode={viewMode} 
          onViewModeChange={onViewModeChange} 
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>משימה חדשה</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>משימה חדשה</DialogTitle>
            </DialogHeader>
            <CreateTaskForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
