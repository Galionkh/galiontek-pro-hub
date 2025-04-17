
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Clock, 
  Check, 
  ArrowUp, 
  ArrowRight, 
  ArrowDown,
  CheckCircle2,
  ArrowRightCircle,
  AlertCircle as AlertCircleIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, TaskCategory, TaskPriority } from "@/hooks/tasks";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useUpdateTask } from "@/hooks/useTasks";
import { useToast } from "@/components/ui/use-toast";

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
  const { mutateAsync: updateTask } = useUpdateTask();
  const { toast } = useToast();
  
  const handleChangeStatus = async (task: Task, newCategory: TaskCategory) => {
    try {
      await updateTask({
        ...task,
        category: newCategory
      });
      
      toast({
        title: "סטטוס המשימה עודכן",
        description: `המשימה "${task.title}" הועברה ל${getCategoryTitle(newCategory)}`,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "שגיאה בעדכון סטטוס המשימה",
        description: "אירעה שגיאה בעת עדכון סטטוס המשימה. נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    }
  };
  
  const renderActionButtons = (task: Task) => {
    switch (category) {
      case "urgent":
        return (
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-primary" 
              onClick={() => handleChangeStatus(task, "completed")}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" /> סיים
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-muted-foreground" 
              onClick={() => handleChangeStatus(task, "later")}
            >
              <Clock className="h-4 w-4 mr-1" /> לדחות
            </Button>
          </div>
        );
      case "later":
        return (
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-primary" 
              onClick={() => handleChangeStatus(task, "completed")}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" /> סיים
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-destructive" 
              onClick={() => handleChangeStatus(task, "urgent")}
            >
              <AlertCircleIcon className="h-4 w-4 mr-1" /> דחוף
            </Button>
          </div>
        );
      case "completed":
        return (
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-destructive" 
              onClick={() => handleChangeStatus(task, "urgent")}
            >
              <AlertCircleIcon className="h-4 w-4 mr-1" /> דחוף
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-muted-foreground" 
              onClick={() => handleChangeStatus(task, "later")}
            >
              <ArrowRightCircle className="h-4 w-4 mr-1" /> לבצע בהמשך
            </Button>
          </div>
        );
    }
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
                "p-3 rounded-md border bg-card hover:bg-accent/5 transition-colors",
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <div className={cn(
                  "font-medium",
                  category === "completed" && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </div>
                {getPriorityBadge(task.priority)}
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
              
              {renderActionButtons(task)}
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
