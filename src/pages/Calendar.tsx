
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Calendar() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">יומן</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>אירוע חדש</span>
        </Button>
      </div>
      
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
          <CalendarIcon className="h-16 w-16 mb-4" />
          <h2 className="text-xl font-semibold mb-2">יומן יוצג כאן</h2>
          <p>בקרוב - סנכרון דו-כיווני עם Google Calendar</p>
        </div>
      </Card>
    </div>
  );
}
