
import { TaskList } from "@/components/tasks/TaskList";
import { TasksGrouped } from "@/hooks/tasks/types";

interface TasksListViewProps {
  groupedTasks: TasksGrouped;
}

export function TasksListView({ groupedTasks }: TasksListViewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <TaskList tasks={groupedTasks.urgent} category="urgent" />
      <TaskList tasks={groupedTasks.later} category="later" />
      <TaskList tasks={groupedTasks.completed} category="completed" />
    </div>
  );
}
