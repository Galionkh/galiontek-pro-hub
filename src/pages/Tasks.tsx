
import { useState } from "react";
import { useQueryTasks } from "@/hooks/tasks";
import { TasksHeader } from "@/components/tasks/TasksHeader";
import { TasksListView } from "@/components/tasks/TasksListView";
import { TaskCalendarView } from "@/components/tasks/TaskCalendarView"; 

export default function Tasks() {
  const { groupedTasks, tasks } = useQueryTasks();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  return (
    <div className="space-y-6 animate-fade-in">
      <TasksHeader 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />
      
      {viewMode === "list" ? (
        <TasksListView groupedTasks={groupedTasks} />
      ) : (
        <TaskCalendarView tasks={tasks} />
      )}
    </div>
  );
}
