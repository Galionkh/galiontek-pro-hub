
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/hooks/tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUp, 
  ArrowRight, 
  ArrowDown, 
  CalendarIcon 
} from "lucide-react";
import { TaskActions } from "./TaskActions";

interface TaskCalendarViewProps {
  tasks: Task[];
}

export function TaskCalendarView({ tasks }: TaskCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // הכנת מערך תאריכים עם משימות
  const datesWithTasks = tasks.reduce((acc, task) => {
    const date = new Date(task.dueDate);
    const dateString = date.toISOString().split('T')[0];
    
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    
    acc[dateString].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
  
  // משימות של היום שנבחר
  const selectedDateStr = selectedDate?.toISOString().split('T')[0];
  const tasksOnSelectedDate = selectedDateStr ? datesWithTasks[selectedDateStr] || [] : [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <Card className="md:col-span-5">
        <CardHeader>
          <CardTitle>לוח שנה משימות</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="p-3 pointer-events-auto"
            locale={he}
            modifiers={{
              withTasks: (date) => {
                const dateStr = date.toISOString().split('T')[0];
                return !!datesWithTasks[dateStr];
              },
              urgent: (date) => {
                const dateStr = date.toISOString().split('T')[0];
                return datesWithTasks[dateStr]?.some(task => task.priority === "high") || false;
              }
            }}
            modifiersClassNames={{
              withTasks: "border-primary border-2",
              urgent: "!bg-red-100"
            }}
          />
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-sm border-primary border-2"></div>
              <span>משימות</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-sm bg-red-100"></div>
              <span>דחוף</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-7">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {selectedDate ? (
              format(selectedDate, "EEEE, d בMMMM yyyy", { locale: he })
            ) : (
              "אין תאריך נבחר"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasksOnSelectedDate.length > 0 ? (
            <ul className="space-y-3">
              {tasksOnSelectedDate.map(task => (
                <li 
                  key={task.id}
                  className="p-3 rounded-md border hover:bg-muted/50 transition-colors relative group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{task.title}</span>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={task.priority} />
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <TaskActions task={task} />
                      </div>
                    </div>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-1">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <CategoryBadge category={task.category} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>אין משימות בתאריך זה</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
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
}

function CategoryBadge({ category }: { category: Task["category"] }) {
  switch (category) {
    case "urgent":
      return <Badge variant="destructive">דחוף</Badge>;
    case "later":
      return <Badge variant="secondary">בהמשך</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-primary/10 text-primary">הושלם</Badge>;
  }
}
