
export type TaskPriority = "high" | "medium" | "low";
export type TaskCategory = "urgent" | "later" | "completed";

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  category: TaskCategory;
  priority: TaskPriority;
  tags?: string[];
};

export type TasksGrouped = {
  urgent: Task[];
  later: Task[];
  completed: Task[];
};

export type TasksGroupedByPriority = {
  high: Task[];
  medium: Task[];
  low: Task[];
};

export type TasksQueryResult = {
  tasks: Task[];
  groupedTasks: TasksGrouped;
  groupedByPriority: TasksGroupedByPriority;
  isLoading: boolean;
};
