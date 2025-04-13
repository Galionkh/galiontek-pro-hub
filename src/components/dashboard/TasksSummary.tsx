
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Task = {
  id: string;
  title: string;
  dueDate: string;
  priority: "urgent" | "later" | "completed";
};

// Sample data for tasks
const tasks: Task[] = [
  { 
    id: "1", 
    title: "להכין מצגת לסדנת ניהול זמן", 
    dueDate: "2025-04-15", 
    priority: "urgent" 
  },
  { 
    id: "2", 
    title: "לסגור פגישה עם אוניברסיטת תל אביב", 
    dueDate: "2025-04-17", 
    priority: "later" 
  },
  { 
    id: "3", 
    title: "להגיש דוח הוצאות חודשי", 
    dueDate: "2025-04-20", 
    priority: "later" 
  },
  { 
    id: "4", 
    title: "להסתכל על החומר של הרצאת האורח", 
    dueDate: "2025-04-13", 
    priority: "completed" 
  },
];

export default function TasksSummary() {
  // Filter tasks to only include non-completed ones
  const activeTasks = tasks.filter(task => task.priority !== "completed");

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
        <ul className="space-y-3">
          {activeTasks.map(task => (
            <li 
              key={task.id}
              className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              {task.priority === "urgent" ? (
                <AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
              ) : (
                <Clock className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={cn(
                  "font-medium",
                  task.priority === "urgent" && "text-destructive"
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
      </CardContent>
    </Card>
  );
}
