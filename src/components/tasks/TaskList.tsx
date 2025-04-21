
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Check, ArrowUp, ArrowRight, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, TaskCategory, TaskPriority } from "@/hooks/tasks";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { TaskActions } from "./TaskActions";
import { useUpdateTask } from "@/hooks/tasks";

interface TaskListProps {
  tasks: Task[];
  category: TaskCategory;
}

const getCategoryIcon = (category: TaskCategory) => {
  switch (category) {
    case "urgent":
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    case "later":
      return <Clock className="h-5 w-5 text-accent" />;
    case "completed":
      return <Check className="h-5 w-5 text-primary" />;
  }
};

const getCategoryBadge = (category: TaskCategory) => {
  switch (category) {
    case "urgent":
      return <Badge variant="destructive">דחוף</Badge>;
    case "later":
      return <Badge variant="secondary">בהמשך</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-primary/10 text-primary">הושלם</Badge>;
  }
};

const getCategoryTitle = (category: TaskCategory) => {
  switch (category) {
    case "urgent":
      return "דחוף";
    case "later":
      return "בהמשך";
    case "completed":
      return "הושלם";
  }
};

const getPriorityBadge = (priority: TaskPriority) => {
  switch (priority) {
    case "high":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-500 border-red-200 flex items-center gap-1">
          <ArrowUp className="h-3 w-3" />
          גבוה
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-500 border-amber-200 flex items-center gap-1">
          <ArrowRight className="h-3 w-3" />
          בינוני
        </Badge>
      );
    case "low":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-500 border-green-200 flex items-center gap-1">
          <ArrowDown className="h-3 w-3" />
          נמוך
        </Badge>
      );
  }
};

export function TaskList({ tasks, category }: TaskListProps) {
  const updateTask = useUpdateTask();

  const handleTaskClick = (task: Task) => {
    // Toggle the task category
    let newCategory: TaskCategory;
    if (category === "urgent") {
      newCategory = "later";
    } else if (category === "later") {
      newCategory = "completed";
    } else {
      // If it's already completed, cycle back to urgent
      newCategory = "urgent";
    }

    updateTask.mutate({
      ...task,
      category: newCategory
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(category)}
            <span>{getCategoryTitle(category)}</span>
          </div>
          {getCategoryBadge(category)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tasks.map(task => (
            <li 
              key={task.id}
              className={cn(
                "p-3 rounded-md border bg-card hover:bg-accent/5 transition-colors relative group cursor-pointer",
              )}
              onClick={() => handleTaskClick(task)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className={cn(
                  "font-medium",
                  category === "completed" && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(task.priority)}
                  <div 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()} // Prevent triggering parent onClick
                  >
                    <TaskActions task={task} />
                  </div>
                </div>
              </div>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-muted-foreground mb-2",
                  category === "completed" && "line-through"
                )}>
                  {task.description}
                </p>
              )}
              
              <p className="text-xs text-muted-foreground">
                {category === "completed" ? "הושלם ב: " : "תאריך יעד: "}
                {format(new Date(task.dueDate), "EEEE, d בMMMM yyyy", { locale: he })}
              </p>
            </li>
          ))}
          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center p-4">
              {category === "urgent" ? "אין משימות דחופות 🎉" : 
               category === "later" ? "אין משימות בהמשך" :
               "אין משימות שהושלמו"}
            </p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
