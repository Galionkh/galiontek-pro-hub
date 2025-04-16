
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskList } from "@/components/tasks/TaskList";
import { useTasks } from "@/hooks/useTasks";

export default function Tasks() {
  const { groupedTasks } = useTasks();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">משימות</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>משימה חדשה</span>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <TaskList tasks={groupedTasks.urgent} category="urgent" />
        <TaskList tasks={groupedTasks.later} category="later" />
        <TaskList tasks={groupedTasks.completed} category="completed" />
      </div>
    </div>
  );
}
