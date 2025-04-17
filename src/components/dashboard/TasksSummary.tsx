
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryTasks } from "@/hooks/tasks";

export default function TasksSummary() {
  const { tasks, groupedTasks } = useQueryTasks();
  
  // Filter tasks to only include non-completed ones (urgent and later)
  const activeTasks = [...groupedTasks.urgent, ...groupedTasks.later];

  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>משימות פתוחות</span>
          <span className="text-sm bg-primary/10 text-primary rounded-full px-2 py-1">
            {activeTasks.length} משימות
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeTasks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>אין משימות פתוחות</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {activeTasks.map(task => (
              <li 
                key={task.id}
                className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                {task.category === "urgent" ? (
                  <AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                ) : (
                  <Clock className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={cn(
                    "font-medium",
                    task.category === "urgent" && "text-destructive"
                  )}>
                    {task.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    תאריך יעד: {new Date(task.dueDate).toLocaleDateString('he-IL')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
