
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { useTasks } from "@/hooks/useTasks";

export default function WelcomeCard() {
  const { profile } = useProfile();
  const { tasks, groupedTasks } = useTasks();
  
  // Calculate open tasks (urgent + later)
  const openTasksCount = groupedTasks.urgent.length + groupedTasks.later.length;
  
  // Get current date in Hebrew
  const currentDate = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const hebrewDate = currentDate.toLocaleDateString('he-IL', dateOptions);

  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">
          ברוך הבא, {profile?.name || 'משתמש'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-2">{hebrewDate}</p>
        <p>יש לך {openTasksCount} משימות פתוחות</p>
      </CardContent>
    </Card>
  );
}
