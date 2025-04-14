
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

export default function WelcomeCard() {
  const { profile } = useProfile();
  
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
        <p>יש לך 3 משימות פתוחות ו-2 פגישות היום</p>
      </CardContent>
    </Card>
  );
}
