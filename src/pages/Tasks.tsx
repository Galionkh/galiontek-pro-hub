
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  category: "urgent" | "later" | "completed";
};

// Sample data for tasks
const tasks: Task[] = [
  { 
    id: "1", 
    title: "להכין מצגת לסדנת ניהול זמן", 
    description: "להוסיף דוגמאות חדשות ולעדכן את הנתונים",
    dueDate: "2025-04-15", 
    category: "urgent" 
  },
  { 
    id: "2", 
    title: "לסגור פגישה עם אוניברסיטת תל אביב", 
    dueDate: "2025-04-17", 
    category: "later" 
  },
  { 
    id: "3", 
    title: "להגיש דוח הוצאות חודשי", 
    description: "לא לשכוח את הקבלות מהכנס האחרון",
    dueDate: "2025-04-20", 
    category: "later" 
  },
  { 
    id: "4", 
    title: "להסתכל על החומר של הרצאת האורח", 
    dueDate: "2025-04-13", 
    category: "completed" 
  },
  {
    id: "5",
    title: "להשיב למיילים דחופים",
    description: "לענות למייל מהמכללה בנוגע לסמסטר הבא",
    dueDate: "2025-04-14",
    category: "urgent"
  },
  {
    id: "6",
    title: "לעדכן את חומרי הקורס",
    dueDate: "2025-04-29",
    category: "later"
  },
  {
    id: "7",
    title: "לשלם חשבון חשמל",
    dueDate: "2025-04-10",
    category: "completed"
  }
];

const getCategoryIcon = (category: Task["category"]) => {
  switch (category) {
    case "urgent":
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    case "later":
      return <Clock className="h-5 w-5 text-accent" />;
    case "completed":
      return <Check className="h-5 w-5 text-primary" />;
    default:
      return null;
  }
};

const getCategoryBadge = (category: Task["category"]) => {
  switch (category) {
    case "urgent":
      return <Badge variant="destructive">דחוף</Badge>;
    case "later":
      return <Badge variant="secondary">בהמשך</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-primary/10 text-primary">הושלם</Badge>;
    default:
      return null;
  }
};

// Group tasks by category
const groupedTasks = {
  urgent: tasks.filter(task => task.category === "urgent"),
  later: tasks.filter(task => task.category === "later"),
  completed: tasks.filter(task => task.category === "completed")
};

export default function Tasks() {
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
        {/* Urgent Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <span>דחוף</span>
              </div>
              <Badge variant="destructive">{groupedTasks.urgent.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {groupedTasks.urgent.map(task => (
                <li 
                  key={task.id}
                  className="p-3 rounded-md border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="font-medium mb-1">{task.title}</div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    תאריך יעד: {new Date(task.dueDate).toLocaleDateString('he-IL')}
                  </p>
                </li>
              ))}
              {groupedTasks.urgent.length === 0 && (
                <p className="text-sm text-muted-foreground text-center p-4">
                  אין משימות דחופות 🎉
                </p>
              )}
            </ul>
          </CardContent>
        </Card>
        
        {/* Later Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                <span>בהמשך</span>
              </div>
              <Badge variant="secondary">{groupedTasks.later.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {groupedTasks.later.map(task => (
                <li 
                  key={task.id}
                  className="p-3 rounded-md border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="font-medium mb-1">{task.title}</div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    תאריך יעד: {new Date(task.dueDate).toLocaleDateString('he-IL')}
                  </p>
                </li>
              ))}
              {groupedTasks.later.length === 0 && (
                <p className="text-sm text-muted-foreground text-center p-4">
                  אין משימות בהמשך
                </p>
              )}
            </ul>
          </CardContent>
        </Card>
        
        {/* Completed Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>הושלם</span>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {groupedTasks.completed.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {groupedTasks.completed.map(task => (
                <li 
                  key={task.id}
                  className="p-3 rounded-md border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="font-medium line-through text-muted-foreground mb-1">
                    {task.title}
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-through">{task.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    הושלם ב: {new Date(task.dueDate).toLocaleDateString('he-IL')}
                  </p>
                </li>
              ))}
              {groupedTasks.completed.length === 0 && (
                <p className="text-sm text-muted-foreground text-center p-4">
                  אין משימות שהושלמו
                </p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
