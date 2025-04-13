
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export default function Finances() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">כספים</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>יצוא דוח PDF</span>
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>רישום חדש</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="grid w-full md:w-auto grid-cols-4 md:grid-cols-4">
          <TabsTrigger value="all">הכל</TabsTrigger>
          <TabsTrigger value="income">הכנסות</TabsTrigger>
          <TabsTrigger value="expenses">הוצאות</TabsTrigger>
          <TabsTrigger value="invoices">חשבוניות</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <h2 className="text-xl font-semibold mb-2">כאן יוצגו הנתונים הכספיים</h2>
              <p>רשום הכנסה או הוצאה חדשה כדי להתחיל</p>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="income" className="mt-4">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <h2 className="text-xl font-semibold mb-2">הכנסות</h2>
              <p>כאן יוצגו ההכנסות שלך</p>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="expenses" className="mt-4">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <h2 className="text-xl font-semibold mb-2">הוצאות</h2>
              <p>כאן יוצגו ההוצאות שלך</p>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="invoices" className="mt-4">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <h2 className="text-xl font-semibold mb-2">חשבוניות</h2>
              <p>כאן יוצגו החשבוניות שהנפקת</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
