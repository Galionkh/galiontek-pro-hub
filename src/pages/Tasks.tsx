
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, ListIcon } from "lucide-react";
import { TaskList } from "@/components/tasks/TaskList";
import { useTasks } from "@/hooks/useTasks";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useState } from "react";
import { CreateTaskForm } from "@/components/tasks/CreateTaskForm";
import { TaskCalendarView } from "@/components/tasks/TaskCalendarView"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Tasks() {
  const { groupedTasks, tasks } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">משימות</h1>
        <div className="flex gap-2">
          <Tabs defaultValue="list" onValueChange={(value) => setViewMode(value as "list" | "calendar")}>
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
      
      {viewMode === "list" ? (
        <div className="grid gap-6 md:grid-cols-3">
          <TaskList tasks={groupedTasks.urgent} category="urgent" />
          <TaskList tasks={groupedTasks.later} category="later" />
          <TaskList tasks={groupedTasks.completed} category="completed" />
        </div>
      ) : (
        <TaskCalendarView tasks={tasks} />
      )}
    </div>
  );
}
