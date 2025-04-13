
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Orders() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">הזמנות והרשמות</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>טופס הזמנה חדש</span>
        </Button>
      </div>
      
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
          <h2 className="text-xl font-semibold mb-2">ניהול הזמנות</h2>
          <p>כאן תוכל ליצור ולנהל טפסי הזמנה ורשימות משתתפים</p>
        </div>
      </Card>
    </div>
  );
}
