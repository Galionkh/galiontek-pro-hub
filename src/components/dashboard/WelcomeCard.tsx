
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WelcomeCard() {
  // Get current user's name - would come from context/state in real app
  const userName = "אלעד";
  
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
        <CardTitle className="text-2xl font-bold">ברוך הבא, {userName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-2">{hebrewDate}</p>
        <p>יש לך 3 משימות פתוחות ו-2 פגישות היום</p>
      </CardContent>
    </Card>
  );
}
